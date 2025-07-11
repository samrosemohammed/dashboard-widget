"use client";

import { memo } from "react";
import type { Widget, MetricConfig } from "@/types/widget";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricWidgetProps {
  widget: Widget;
  onUpdate?: (updates: Partial<Widget>) => void;
}

export const MetricWidget = memo(function MetricWidget({
  widget,
}: MetricWidgetProps) {
  const config = widget.config as MetricConfig;

  const formatValue = (value: number | string) => {
    if (typeof value === "string") return value;

    switch (config.format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
      case "percentage":
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  const getTrendIcon = () => {
    if (!config.trend) return <Minus className="w-4 h-4" />;
    if (config.trend > 0)
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (config.trend < 0)
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!config.trend) return "text-muted-foreground";
    return config.trend > 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="h-full flex flex-col justify-center items-center text-center p-2 md:p-4">
      <div className="text-xl md:text-3xl font-bold mb-1 md:mb-2 break-all">
        {formatValue(config.value)}
      </div>

      <div className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 text-center">
        {config.label}
      </div>

      {config.trend !== undefined && (
        <div
          className={`flex items-center gap-1 text-xs md:text-sm ${getTrendColor()}`}
        >
          {getTrendIcon()}
          <span>{Math.abs(config.trend)}%</span>
        </div>
      )}
    </div>
  );
});
