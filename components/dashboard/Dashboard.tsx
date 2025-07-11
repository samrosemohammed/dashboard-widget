"use client";

import { useState, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import { Button } from "@/components/ui/button";
import { Plus, Settings, Save, Edit } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { DashboardHeader } from "./DashboardHeader";
import { WidgetRenderer } from "./WidgetRenderer";
import { AddWidgetDialog } from "./AddWidgetDialog";
import { WidgetToolbar } from "./WidgetToolbar";
import { MobileWidgetMenu } from "./MobileWidgetMenu";
import { useResponsive } from "@/hooks/use-responsive";

export function Dashboard() {
  const { state, reorderWidgets, selectWidget, setEditing } = useDashboard();
  const { isMobile, getGridColumns, getWidgetSpan } = useResponsive();
  const [showAddWidget, setShowAddWidget] = useState(false);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      reorderWidgets(result.source.index, result.destination.index);
    },
    [reorderWidgets]
  );

  const handleWidgetClick = useCallback(
    (widgetId: string) => {
      if (state.isEditing) {
        selectWidget(state.selectedWidget === widgetId ? null : widgetId);
      }
    },
    [state.isEditing, state.selectedWidget, selectWidget]
  );

  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 p-2 md:p-4 overflow-auto">
          {/* Replace the existing button container with responsive layout */}
          <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
            <div className="hidden md:flex flex-wrap gap-2">
              <Button
                onClick={() => setEditing(!state.isEditing)}
                variant={state.isEditing ? "default" : "outline"}
                size="sm"
                className="flex-shrink-0"
              >
                <Edit className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">
                  {state.isEditing ? "Exit Edit" : "Edit Mode"}
                </span>
                <span className="sm:hidden">
                  {state.isEditing ? "Exit" : "Edit"}
                </span>
              </Button>

              <Button
                onClick={() => setShowAddWidget(true)}
                size="sm"
                className="flex-shrink-0"
              >
                <Plus className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Add Widget</span>
                <span className="sm:hidden">Add</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0 bg-transparent"
              >
                <Save className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Save Layout</span>
                <span className="md:hidden">Save</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0 bg-transparent"
              >
                <Settings className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Settings</span>
                <span className="md:hidden sr-only">Settings</span>
              </Button>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden">
              <MobileWidgetMenu />
            </div>

            {/* Quick edit toggle for mobile */}
            <Button
              onClick={() => setEditing(!state.isEditing)}
              variant={state.isEditing ? "default" : "outline"}
              size="sm"
              className="md:hidden"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId="dashboard"
              isDropDisabled={!state.isEditing}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`grid gap-2 md:gap-4 transition-colors ${
                    snapshot.isDraggingOver ? "bg-muted/50" : ""
                  }`}
                  style={{
                    gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
                    minHeight: "calc(100vh - 200px)",
                  }}
                >
                  {state.widgets.map((widget, index) => (
                    <Draggable
                      key={widget.id}
                      draggableId={widget.id}
                      index={index}
                      isDragDisabled={!state.isEditing}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`transition-transform ${
                            snapshot.isDragging ? "rotate-2 scale-105" : ""
                          }`}
                          style={{
                            gridColumn: `span ${getWidgetSpan(
                              widget.size.width
                            )}`,
                            gridRow: `span ${Math.max(
                              1,
                              Math.ceil(widget.size.height / 2)
                            )}`,
                            ...provided.draggableProps.style,
                          }}
                          onClick={() => handleWidgetClick(widget.id)}
                        >
                          <WidgetRenderer
                            widget={widget}
                            isSelected={state.selectedWidget === widget.id}
                            isEditing={state.isEditing}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {state.isEditing && state.selectedWidget && (
          <>
            {/* Mobile overlay */}
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => selectWidget(null)}
            />

            {/* Responsive sidebar */}
            <div
              className={`
              fixed lg:relative
              top-0 right-0 lg:right-auto
              w-full sm:w-80 lg:w-80
              h-full lg:h-auto
              bg-background lg:bg-muted/30
              border-l
              z-50 lg:z-auto
              transform lg:transform-none
              transition-transform duration-300 ease-in-out
              ${
                state.selectedWidget
                  ? "translate-x-0"
                  : "translate-x-full lg:translate-x-0"
              }
            `}
            >
              <WidgetToolbar widgetId={state.selectedWidget} />
            </div>
          </>
        )}
      </div>

      <AddWidgetDialog open={showAddWidget} onOpenChange={setShowAddWidget} />
    </div>
  );
}
