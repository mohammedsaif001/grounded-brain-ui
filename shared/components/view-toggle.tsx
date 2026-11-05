"use client";

import { LayoutGridIcon, ListIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

type ViewToggleProps = {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
  className?: string;
};

const OPTIONS = [
  { value: "grid", label: "Grid view", icon: LayoutGridIcon },
  { value: "list", label: "List view", icon: ListIcon },
] as const;

/** Segmented grid/list switch. Exposes pressed state to assistive tech. */
export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="View mode"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-xl border border-border bg-card p-0.5 shadow-surface",
        className,
      )}
    >
      {OPTIONS.map(({ value: option, label, icon: Icon }) => (
        <Button
          key={option}
          type="button"
          variant={value === option ? "soft" : "ghost"}
          size="icon-sm"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          <Icon aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </Button>
      ))}
    </div>
  );
}
