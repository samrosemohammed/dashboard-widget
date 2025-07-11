"use client";

import { memo } from "react";
import type { Widget, TextConfig } from "@/types/widget";

interface TextWidgetProps {
  widget: Widget;
  onUpdate?: (updates: Partial<Widget>) => void;
}

export const TextWidget = memo(function TextWidget({
  widget,
}: TextWidgetProps) {
  const config = widget.config as TextConfig;

  return (
    <div className="h-full w-full overflow-auto">
      <div
        style={{
          fontSize: config.fontSize || "14px",
          textAlign: config.textAlign || "left",
          color: config.color || "inherit",
          lineHeight: 1.5,
        }}
        className="prose prose-sm max-w-none"
      >
        {config.content}
      </div>
    </div>
  );
});
