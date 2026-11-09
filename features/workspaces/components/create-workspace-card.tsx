"use client";

import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TypeTile } from "@/shared/components/type-tile";

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
                "group flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center outline-none transition-colors hover:border-ring/50 hover:bg-card/80 focus-visible:ring-3 focus-visible:ring-ring/40 sm:min-h-52",
                className,
            )}
        >
            <TypeTile
                icon={PlusIcon}
                tone="green"
                className="transition-transform group-hover:scale-110 motion-reduce:transform-none"
            />
            <span className="space-y-1">
                <span className="text-heading block">Make room for an idea</span>
                <span className="text-body block text-muted-foreground">
                    A new notebook is a fresh space to explore.
                </span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                Create notebook
                <ArrowRightIcon
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                />
            </span>
        </button>
    );
}
