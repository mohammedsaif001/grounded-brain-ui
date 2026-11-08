"use client";

import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CreateWorkspaceCardProps = {
    onClick: () => void;
    className?: string;
};

export function CreateWorkspaceCard({
    onClick,
    className,
}: CreateWorkspaceCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "group flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center outline-none transition-colors hover:bg-card/80 focus-visible:ring-3 focus-visible:ring-ring/40",
                className,
            )}
        >
            <PlusIcon
                aria-hidden="true"
                className="size-6 text-muted-foreground transition-colors group-hover:text-foreground"
            />
            <span className="space-y-1">
                <span className="text-heading block">Make room for an idea</span>
                <span className="text-body block text-muted-foreground">
                    A new notebook is a fresh space to explore.
                </span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                Create notebook
                <ArrowRightIcon aria-hidden="true" className="size-4" />
            </span>
        </button>
    );
}
