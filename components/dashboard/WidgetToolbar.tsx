"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, X } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

interface WidgetToolbarProps {
  widgetId: string;
}

export function WidgetToolbar({ widgetId }: WidgetToolbarProps) {
  const { state, updateWidget, removeWidget, selectWidget } = useDashboard();
  const widget = state.widgets.find((w) => w.id === widgetId);

  if (!widget) return null;

  const handleTitleChange = (title: string) => {
    updateWidget(widgetId, { title });
  };

  const handleConfigChange = (key: string, value: any) => {
    updateWidget(widgetId, {
      config: { ...widget.config, [key]: value },
    });
  };

  const handleSizeChange = (dimension: "width" | "height", value: number) => {
    updateWidget(widgetId, {
      size: { ...widget.size, [dimension]: value },
    });
  };

  const renderConfigFields = () => {
    switch (widget.type) {
      case "text":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={widget.config.content || ""}
                onChange={(e) => handleConfigChange("content", e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size</Label>
              <Input
                id="fontSize"
                value={widget.config.fontSize || "14px"}
                onChange={(e) => handleConfigChange("fontSize", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="textAlign">Text Align</Label>
              <Select
                value={widget.config.textAlign || "left"}
                onValueChange={(value) =>
                  handleConfigChange("textAlign", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "chart":
        return (
          <div className="space-y-2">
            <Label htmlFor="chartType">Chart Type</Label>
            <Select
              value={widget.config.chartType || "line"}
              onValueChange={(value) => handleConfigChange("chartType", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="pie">Pie</SelectItem>
                <SelectItem value="area">Area</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case "metric":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={widget.config.value || ""}
                onChange={(e) => handleConfigChange("value", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={widget.config.label || ""}
                onChange={(e) => handleConfigChange("label", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select
                value={widget.config.format || "number"}
                onValueChange={(value) => handleConfigChange("format", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="currency">Currency</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      default:
        return <div>No configuration options available</div>;
    }
  };

  return (
    <div className="p-3 md:p-4 space-y-4 h-full overflow-y-auto">
      {/* Add close button for mobile */}
      <div className="flex items-center justify-between lg:hidden mb-4">
        <h3 className="text-lg font-semibold">Widget Settings</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => selectWidget(null)}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Widget Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Make form fields more mobile-friendly */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm">
              Title
            </Label>
            <Input
              id="title"
              value={widget.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="width" className="text-sm">
                Width
              </Label>
              <Input
                id="width"
                type="number"
                min="1"
                max="12"
                value={widget.size.width}
                onChange={(e) =>
                  handleSizeChange("width", Number.parseInt(e.target.value))
                }
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm">
                Height
              </Label>
              <Input
                id="height"
                type="number"
                min="1"
                max="10"
                value={widget.size.height}
                onChange={(e) =>
                  handleSizeChange("height", Number.parseInt(e.target.value))
                }
                className="text-sm"
              />
            </div>
          </div>

          {renderConfigFields()}

          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeWidget(widgetId)}
            className="w-full mt-6"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove Widget
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
