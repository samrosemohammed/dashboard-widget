"use client";

import { useDashboard } from "@/context/DashboardContext";

export function DashboardHeader() {
  const { state } = useDashboard();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="container flex h-12 md:h-14 items-center px-4">
        <div className="mr-4 flex">
          <h1 className="text-base md:text-lg font-semibold">Dashboard</h1>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="text-xs md:text-sm text-muted-foreground">
            <span className="hidden sm:inline">
              {state.widgets.length} widgets •{" "}
            </span>
            <span className="sm:hidden">{state.widgets.length} • </span>
            {state.isEditing ? "Edit Mode" : "View Mode"}
          </div>
        </div>
      </div>
    </header>
  );
}
