"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Widget, WidgetType } from "@/types/widget";
import { BarChart3, FileText, Hash, Table } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

interface AddWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const widgetTypes = [
  { value: "chart", label: "Chart", icon: BarChart3 },
  { value: "table", label: "Table", icon: Table },
  { value: "text", label: "Text", icon: FileText },
  { value: "metric", label: "Metric", icon: Hash },
];

export function AddWidgetDialog({ open, onOpenChange }: AddWidgetDialogProps) {
  const { addWidget } = useDashboard();
  const [selectedType, setSelectedType] = useState<WidgetType>("chart");
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;

    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: selectedType,
      title: title.trim(),
      config: getDefaultConfig(selectedType),
      position: { x: 0, y: 0 },
      size: getDefaultSize(selectedType),
    };

    addWidget(newWidget);
    setTitle("");
    setSelectedType("chart");
    onOpenChange(false);
  };

  const getDefaultConfig = (type: WidgetType) => {
    switch (type) {
      case "chart":
        return {
          chartType: "line",
          data: [
            { name: "A", value: 100 },
            { name: "B", value: 200 },
            { name: "C", value: 150 },
          ],
        };
      case "table":
        return {
          columns: ["Column 1", "Column 2", "Column 3"],
          data: [
            ["Row 1", "Data 1", "Value 1"],
            ["Row 2", "Data 2", "Value 2"],
          ],
          sortable: true,
          filterable: true,
        };
      case "text":
        return {
          content: "Enter your text content here...",
          fontSize: "14px",
          textAlign: "left",
        };
      case "metric":
        return {
          value: 0,
          label: "Metric Label",
          format: "number",
        };
      default:
        return {};
    }
  };

  const getDefaultSize = (type: WidgetType) => {
    switch (type) {
      case "chart":
        return { width: 6, height: 4 };
      case "table":
        return { width: 8, height: 4 };
      case "text":
        return { width: 6, height: 2 };
      case "metric":
        return { width: 3, height: 2 };
      default:
        return { width: 4, height: 3 };
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Add New Widget</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="widget-title" className="text-sm">
              Widget Title
            </Label>
            <Input
              id="widget-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter widget title..."
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Widget Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {widgetTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.value}
                    variant={
                      selectedType === type.value ? "default" : "outline"
                    }
                    className="h-12 md:h-16 flex flex-col gap-1 md:gap-2 text-xs"
                    onClick={() => setSelectedType(type.value as WidgetType)}
                  >
                    <Icon className="w-4 h-4 md:w-6 md:h-6" />
                    <span>{type.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!title.trim()}
              className="order-1 sm:order-2"
            >
              Add Widget
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
