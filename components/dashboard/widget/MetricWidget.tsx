"use client";

import { Widget } from "@/types/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricWidgetProps {
  widget: Widget;
  onUpdate: (updates: Partial<Widget>) => void;
}

export default function MetricWidget({ widget }: MetricWidgetProps) {
  const { config } = widget;
  const {
    value = 0,
    prefix = "",
    suffix = "",
    color = "blue",
    trend,
    trendValue,
  } = config;

  const colorClasses = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
    yellow: "text-yellow-600 bg-yellow-50",
  };

  const formatValue = (val: number) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + "M";
    if (val >= 1000) return (val / 1000).toFixed(1) + "K";
    return val.toLocaleString();
  };

  return (
    <div className="h-full flex flex-col justify-center">
      <div
        className={`text-center p-6 rounded-lg ${
          colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
        }`}
      >
        <div className="text-3xl font-bold mb-2">
          {prefix}
          {formatValue(value)}
          {suffix}
        </div>

        {trend && (
          <div className="flex items-center justify-center gap-1 text-sm">
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trendValue}% from last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
