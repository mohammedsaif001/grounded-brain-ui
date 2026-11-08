"use client";

import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { routes } from "@/shared/config/routes";
import { SOURCE_TYPE_LABELS } from "../lib/constants";
import { describeSource } from "../lib/source-metadata";
import type { Source } from "../lib/types";
import { SourceRowActions } from "./source-row-actions";
import { SourceStatusBadge } from "./source-status-badge";
import { SourceTypeTile } from "./source-type-icon";

type SourceCardProps = {
    source: Source;
    onDelete?: (source: Source) => void;
    onReprocess?: (source: Source) => void;
    /** When provided, a selection checkbox is rendered. */
    selected?: boolean;
    onSelectedChange?: (selected: boolean) => void;
    className?: string;
};

export function SourceCard({
    source,
    onDelete,
    onReprocess,
    selected,
    onSelectedChange,
    className,
}: SourceCardProps) {
    const href = routes.workspace.source(source.workspaceId, source.id);

    return (
        <article
            data-selected={selected || undefined}
            className={cn(
                "group/card relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-surface transition-shadow hover:shadow-raised",
                selected && "border-ring bg-accent/30",
                className,
            )}
        >
            <Link
                href={href}
                className="absolute inset-0 z-0 rounded-[inherit] outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                aria-label={`Open ${source.title}`}
            />

            <div className="pointer-events-none relative flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <SourceTypeTile type={source.type} />
                    <div className="min-w-0">
                        <h3 className="text-heading truncate">
                            {source.title}
                        </h3>
                        <p className="text-caption truncate">
                            {SOURCE_TYPE_LABELS[source.type]} ·{" "}
                            {describeSource(source)}
                        </p>
                    </div>
                </div>

                <div className="pointer-events-auto relative z-10 flex shrink-0 items-center gap-1">
                    {onSelectedChange ? (
                        <Checkbox
                            aria-label={`Select ${source.title}`}
                            checked={Boolean(selected)}
                            onCheckedChange={(checked) =>
                                onSelectedChange(checked)
                            }
                        />
                    ) : null}
                    <SourceRowActions
                        source={source}
                        onDelete={onDelete}
                        onReprocess={onReprocess}
                    />
                </div>
            </div>

            <div className="pointer-events-none relative flex items-center justify-between gap-3">
                <SourceStatusBadge status={source.status} />
                {source.content ? (
                    <p className="text-caption line-clamp-1 min-w-0 flex-1 text-right">
                        {source.content.slice(0, 120)}
                    </p>
                ) : null}
            </div>
        </article>
    );
}
