"use client";

import { Widget } from "@/types/types";

interface TableWidgetProps {
  widget: Widget;
  onUpdate: (updates: Partial<Widget>) => void;
}

export default function TableWidget({ widget }: TableWidgetProps) {
  const { config } = widget;
  const { columns = [], data = [] } = config;

  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((column: string, index: number) => (
              <th
                key={index}
                className="text-left py-2 px-3 font-medium text-gray-700"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any[], rowIndex: number) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-2 px-3 text-gray-600">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
