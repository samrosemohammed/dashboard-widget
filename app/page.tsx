"use client";

import { Dashboard } from "@/components/dashboard/Dashboard";
import { DashboardProvider } from "@/context/DashboardContext";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardProvider>
        <Dashboard />
      </DashboardProvider>
    </div>
  );
}
