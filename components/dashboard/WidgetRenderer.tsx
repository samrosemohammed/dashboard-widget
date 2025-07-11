"use client";

import type React from "react";
import { memo, Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/context/DashboardContext";
import { Widget } from "@/types/widget";
import { ChartWidget } from "./widgets/ChartWidget";
import { TableWidget } from "./widgets/TableWidget";
import { TextWidget } from "./widgets/TextWidget";
import { MetricWidget } from "./widgets/MetricWidget";

interface WidgetRendererProps {
  widget: Widget;
  isSelected?: boolean;
  isEditing?: boolean;
}

const WidgetSkeleton = () => (
  <Card className="h-full">
    <CardHeader>
      <Skeleton className="h-4 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-32 w-full" />
    </CardContent>
  </Card>
);

export const WidgetRenderer = memo(function WidgetRenderer({
  widget,
  isSelected = false,
  isEditing = false,
}: WidgetRendererProps) {
  const { removeWidget, updateWidget } = useDashboard();

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeWidget(widget.id);
  };

  const handleUpdate = (updates: Partial<Widget>) => {
    updateWidget(widget.id, updates);
  };

  const renderWidget = () => {
    try {
      switch (widget.type) {
        case "chart":
          return <ChartWidget widget={widget} onUpdate={handleUpdate} />;
        case "table":
          return <TableWidget widget={widget} onUpdate={handleUpdate} />;
        case "text":
          return <TextWidget widget={widget} onUpdate={handleUpdate} />;
        case "metric":
          return <MetricWidget widget={widget} onUpdate={handleUpdate} />;
        default:
          return (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Unknown widget type: {widget.type}
            </div>
          );
      }
    } catch (error) {
      console.error(`Error rendering widget ${widget.id}:`, error);
      return (
        <div className="flex items-center justify-center h-32 text-destructive">
          Error loading widget
        </div>
      );
    }
  };

  return (
    <Card
      className={`h-full transition-all duration-200 ${
        isSelected ? "ring-2 ring-primary shadow-lg" : ""
      } ${isEditing ? "cursor-pointer hover:shadow-md" : ""} 
  ${
    isEditing && typeof window !== "undefined" && window.innerWidth < 768
      ? "touch-manipulation"
      : ""
  }`}
    >
      <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs md:text-sm font-medium truncate pr-2">
            {widget.title}
          </CardTitle>

          {isEditing && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <GripVertical className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 md:h-6 md:w-6 p-0"
                onClick={handleRemove}
              >
                <X className="w-2 h-2 md:w-3 md:h-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-3 md:px-6 pb-3 md:pb-6 h-[calc(100%-3rem)] md:h-[calc(100%-4rem)]">
        <Suspense fallback={<WidgetSkeleton />}>{renderWidget()}</Suspense>
      </CardContent>
    </Card>
  );
});
