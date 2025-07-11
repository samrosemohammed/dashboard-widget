"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import type { Widget, DashboardLayout, WidgetType } from "@/types/widget";

interface DashboardState {
  widgets: Widget[];
  layout: DashboardLayout;
  selectedWidget: string | null;
  isEditing: boolean;
}

type DashboardAction =
  | {
      type: "ADD_WIDGET";
      payload: { widget: Widget; position?: { x: number; y: number } };
    }
  | { type: "REMOVE_WIDGET"; payload: { id: string } }
  | { type: "UPDATE_WIDGET"; payload: { id: string; updates: Partial<Widget> } }
  | {
      type: "REORDER_WIDGETS";
      payload: { sourceIndex: number; destinationIndex: number };
    }
  | { type: "UPDATE_LAYOUT"; payload: { layout: Partial<DashboardLayout> } }
  | { type: "SELECT_WIDGET"; payload: { id: string | null } }
  | { type: "SET_EDITING"; payload: { isEditing: boolean } }
  | { type: "LOAD_DASHBOARD"; payload: { state: Partial<DashboardState> } };

const initialState: DashboardState = {
  widgets: [
    {
      id: "widget-1",
      type: "chart" as WidgetType,
      title: "Sales Overview",
      config: {
        chartType: "line",
        data: [
          { name: "Jan", value: 400 },
          { name: "Feb", value: 300 },
          { name: "Mar", value: 600 },
          { name: "Apr", value: 800 },
          { name: "May", value: 500 },
        ],
      },
      position: { x: 0, y: 0 },
      size: { width: 6, height: 4 },
    },
    {
      id: "widget-2",
      type: "table" as WidgetType,
      title: "Recent Orders",
      config: {
        columns: ["Order ID", "Customer", "Amount", "Status"],
        data: [
          ["#001", "John Doe", "$299", "Completed"],
          ["#002", "Jane Smith", "$199", "Pending"],
          ["#003", "Bob Johnson", "$399", "Shipped"],
        ],
      },
      position: { x: 6, y: 0 },
      size: { width: 6, height: 4 },
    },
    {
      id: "widget-3",
      type: "text" as WidgetType,
      title: "Welcome Message",
      config: {
        content:
          "Welcome to your dashboard! This is a customizable text widget.",
        fontSize: "16px",
        textAlign: "left",
      },
      position: { x: 0, y: 4 },
      size: { width: 12, height: 2 },
    },
  ],
  layout: {
    columns: 12,
    rowHeight: 60,
    margin: [10, 10],
  },
  selectedWidget: null,
  isEditing: false,
};

function dashboardReducer(
  state: DashboardState,
  action: DashboardAction
): DashboardState {
  switch (action.type) {
    case "ADD_WIDGET": {
      const { widget, position } = action.payload;
      const newWidget = {
        ...widget,
        position: position || { x: 0, y: 0 },
      };
      return {
        ...state,
        widgets: [...state.widgets, newWidget],
      };
    }

    case "REMOVE_WIDGET": {
      return {
        ...state,
        widgets: state.widgets.filter((w) => w.id !== action.payload.id),
        selectedWidget:
          state.selectedWidget === action.payload.id
            ? null
            : state.selectedWidget,
      };
    }

    case "UPDATE_WIDGET": {
      return {
        ...state,
        widgets: state.widgets.map((w) =>
          w.id === action.payload.id ? { ...w, ...action.payload.updates } : w
        ),
      };
    }

    case "REORDER_WIDGETS": {
      const { sourceIndex, destinationIndex } = action.payload;
      const newWidgets = [...state.widgets];
      const [removed] = newWidgets.splice(sourceIndex, 1);
      newWidgets.splice(destinationIndex, 0, removed);
      return {
        ...state,
        widgets: newWidgets,
      };
    }

    case "UPDATE_LAYOUT": {
      return {
        ...state,
        layout: { ...state.layout, ...action.payload.layout },
      };
    }

    case "SELECT_WIDGET": {
      return {
        ...state,
        selectedWidget: action.payload.id,
      };
    }

    case "SET_EDITING": {
      return {
        ...state,
        isEditing: action.payload.isEditing,
      };
    }

    case "LOAD_DASHBOARD": {
      return {
        ...state,
        ...action.payload.state,
      };
    }

    default:
      return state;
  }
}

interface DashboardContextType {
  state: DashboardState;
  addWidget: (widget: Widget, position?: { x: number; y: number }) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  reorderWidgets: (sourceIndex: number, destinationIndex: number) => void;
  updateLayout: (layout: Partial<DashboardLayout>) => void;
  selectWidget: (id: string | null) => void;
  setEditing: (isEditing: boolean) => void;
  loadDashboard: (state: Partial<DashboardState>) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const addWidget = useCallback(
    (widget: Widget, position?: { x: number; y: number }) => {
      dispatch({ type: "ADD_WIDGET", payload: { widget, position } });
    },
    []
  );

  const removeWidget = useCallback((id: string) => {
    dispatch({ type: "REMOVE_WIDGET", payload: { id } });
  }, []);

  const updateWidget = useCallback((id: string, updates: Partial<Widget>) => {
    dispatch({ type: "UPDATE_WIDGET", payload: { id, updates } });
  }, []);

  const reorderWidgets = useCallback(
    (sourceIndex: number, destinationIndex: number) => {
      dispatch({
        type: "REORDER_WIDGETS",
        payload: { sourceIndex, destinationIndex },
      });
    },
    []
  );

  const updateLayout = useCallback((layout: Partial<DashboardLayout>) => {
    dispatch({ type: "UPDATE_LAYOUT", payload: { layout } });
  }, []);

  const selectWidget = useCallback((id: string | null) => {
    dispatch({ type: "SELECT_WIDGET", payload: { id } });
  }, []);

  const setEditing = useCallback((isEditing: boolean) => {
    dispatch({ type: "SET_EDITING", payload: { isEditing } });
  }, []);

  const loadDashboard = useCallback(
    (dashboardState: Partial<DashboardState>) => {
      dispatch({ type: "LOAD_DASHBOARD", payload: { state: dashboardState } });
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      state,
      addWidget,
      removeWidget,
      updateWidget,
      reorderWidgets,
      updateLayout,
      selectWidget,
      setEditing,
      loadDashboard,
    }),
    [
      state,
      addWidget,
      removeWidget,
      updateWidget,
      reorderWidgets,
      updateLayout,
      selectWidget,
      setEditing,
      loadDashboard,
    ]
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
