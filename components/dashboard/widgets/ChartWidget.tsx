"use client";

import { ChartConfig, Widget } from "@/types/widget";
import { memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

interface ChartWidgetProps {
  widget: Widget;
  onUpdate?: (updates: Partial<Widget>) => void;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export const ChartWidget = memo(function ChartWidget({
  widget,
}: ChartWidgetProps) {
  const config = widget.config as ChartConfig;

  const renderChart = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    switch (config.chartType) {
      case "line":
        return (
          <LineChart
            data={config.data}
            margin={{
              top: 5,
              right: isMobile ? 5 : 30,
              left: isMobile ? 5 : 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              fontSize={isMobile ? 10 : 12}
              interval={isMobile ? "preserveStartEnd" : 0}
            />
            <YAxis fontSize={isMobile ? 10 : 12} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={isMobile ? 1 : 2}
            />
          </LineChart>
        );

      case "bar":
        return (
          <BarChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={config.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent ?? 0 * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {config.data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      case "area":
        return (
          <AreaChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="h-full w-full min-h-[200px] md:min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
});
