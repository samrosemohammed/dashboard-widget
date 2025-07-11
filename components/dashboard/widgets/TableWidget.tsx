"use client";

import { memo, useState } from "react";
import type { Widget, TableConfig } from "@/types/widget";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableWidgetProps {
  widget: Widget;
  onUpdate?: (updates: Partial<Widget>) => void;
}

export const TableWidget = memo(function TableWidget({
  widget,
}: TableWidgetProps) {
  const config = widget.config as TableConfig;
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState("");

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnIndex);
      setSortDirection("asc");
    }
  };

  const filteredData = config.data.filter((row) =>
    row.some((cell) => cell.toLowerCase().includes(filter.toLowerCase()))
  );

  const sortedData =
    sortColumn !== null
      ? [...filteredData].sort((a, b) => {
          const aVal = a[sortColumn];
          const bVal = b[sortColumn];
          const comparison = aVal.localeCompare(bVal);
          return sortDirection === "asc" ? comparison : -comparison;
        })
      : filteredData;

  return (
    <div className="h-full flex flex-col">
      {config.filterable && (
        <div className="mb-2">
          <Input
            placeholder="Filter table..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <div className="min-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {config.columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className="text-xs whitespace-nowrap px-2 md:px-4"
                  >
                    {config.sortable ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-medium text-xs"
                        onClick={() => handleSort(index)}
                      >
                        {column}
                        <ArrowUpDown className="ml-1 h-2 w-2 md:h-3 md:w-3" />
                      </Button>
                    ) : (
                      column
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className="text-xs px-2 md:px-4 whitespace-nowrap"
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
});
