export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  config: Record<string, any>;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  data?: any;
  lastUpdated?: Date;
}

export interface WidgetConfig {
  type: WidgetType;
  title: string;
  config: Record<string, any>;
  position?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export type WidgetType =
  | "chart"
  | "table"
  | "metric"
  | "text"
  | "image"
  | "calendar"
  | "todo"
  | "weather";

export interface DashboardState {
  widgets: Widget[];
  layout: any[];
  isEditMode: boolean;
  selectedWidget: string | null;
  error: string | null;
  loading: boolean;
}

export type DashboardAction =
  | { type: "ADD_WIDGET"; payload: WidgetConfig }
  | { type: "REMOVE_WIDGET"; payload: string }
  | { type: "UPDATE_WIDGET"; payload: { id: string; updates: Partial<Widget> } }
  | {
      type: "REORDER_WIDGETS";
      payload: { sourceIndex: number; destinationIndex: number };
    }
  | { type: "UPDATE_LAYOUT"; payload: any[] }
  | { type: "TOGGLE_EDIT_MODE" }
  | { type: "SET_SELECTED_WIDGET"; payload: string | null }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_LOADING"; payload: boolean };

export interface WidgetProps {
  widget: Widget;
  isEditMode: boolean;
  onUpdate: (updates: Partial<Widget>) => void;
  onRemove: () => void;
}
