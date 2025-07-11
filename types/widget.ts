export type WidgetType = "chart" | "table" | "text" | "metric";

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface DashboardLayout {
  columns: number;
  rowHeight: number;
  margin: [number, number];
}

export interface WidgetComponentProps {
  widget: Widget;
  isSelected?: boolean;
  isEditing?: boolean;
  onSelect?: () => void;
  onUpdate?: (updates: Partial<Widget>) => void;
  onRemove?: () => void;
}

export interface ChartConfig {
  chartType: "line" | "bar" | "pie" | "area";
  data: Array<{ name: string; value: number }>;
  xAxis?: string;
  yAxis?: string;
  color?: string;
}

export interface TableConfig {
  columns: string[];
  data: string[][];
  sortable?: boolean;
  filterable?: boolean;
}

export interface TextConfig {
  content: string;
  fontSize?: string;
  textAlign?: "left" | "center" | "right";
  color?: string;
}

export interface MetricConfig {
  value: number | string;
  label: string;
  trend?: number;
  format?: "number" | "currency" | "percentage";
}
