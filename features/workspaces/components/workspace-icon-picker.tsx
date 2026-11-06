"use client";

import { cn } from "@/lib/utils";
import {
    WORKSPACE_ICONS,
    WORKSPACE_ICON_KEYS,
    resolveWorkspaceIcon,
    type WorkspaceIconKey,
} from "../lib/workspace-icons";

type WorkspaceIconPickerProps = {
    value: string | null | undefined;
    onChange: (key: WorkspaceIconKey) => void;
    labelledBy: string;
    className?: string;
};

/** Accessible single-choice icon grid (radiogroup semantics, roving focus via native buttons). */
export function WorkspaceIconPicker({
    value,
    onChange,
    labelledBy,
    className,
}: WorkspaceIconPickerProps) {
    const selected = resolveWorkspaceIcon(value);

    return (
        <div
            role="radiogroup"
            aria-labelledby={labelledBy}
            className={cn("flex flex-wrap gap-2", className)}
        >
            {WORKSPACE_ICON_KEYS.map((key) => {
                const { icon: Icon, label } = WORKSPACE_ICONS[key];
                const isSelected = key === selected;
                return (
                    <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={label}
                        title={label}
                        onClick={() => onChange(key)}
                        className={cn(
                            "flex size-10 items-center justify-center rounded-xl border text-muted-foreground transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
                            isSelected
                                ? "border-ring bg-accent text-accent-foreground"
                                : "border-border bg-card hover:bg-muted hover:text-foreground",
                        )}
                    >
                        <Icon aria-hidden="true" className="size-5" />
                    </button>
                );
            })}
        </div>
    );
}
