"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Plus, Settings, Save, Edit } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { AddWidgetDialog } from "./AddWidgetDialog";

export function MobileWidgetMenu() {
  const { state, setEditing } = useDashboard();
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="md:hidden bg-transparent"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px] sm:w-[350px]">
          <SheetHeader>
            <SheetTitle>Dashboard Menu</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-3 mt-6">
            <Button
              onClick={() => {
                setEditing(!state.isEditing);
                setIsOpen(false);
              }}
              variant={state.isEditing ? "default" : "outline"}
              className="justify-start"
            >
              <Edit className="w-4 h-4 mr-2" />
              {state.isEditing ? "Exit Edit Mode" : "Enter Edit Mode"}
            </Button>

            <Button
              onClick={() => {
                setShowAddWidget(true);
                setIsOpen(false);
              }}
              className="justify-start"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Widget
            </Button>

            <Button variant="outline" className="justify-start bg-transparent">
              <Save className="w-4 h-4 mr-2" />
              Save Layout
            </Button>

            <Button variant="outline" className="justify-start bg-transparent">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              <div>Widgets: {state.widgets.length}</div>
              <div>Mode: {state.isEditing ? "Edit" : "View"}</div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AddWidgetDialog open={showAddWidget} onOpenChange={setShowAddWidget} />
    </>
  );
}
