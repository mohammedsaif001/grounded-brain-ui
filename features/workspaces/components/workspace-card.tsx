"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
    ArrowUpRightIcon,
    LibraryBigIcon,
    PencilIcon,
    SparklesIcon,
    Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toneClasses } from "@/shared/components/tint";
import { routes } from "@/shared/config/routes";
import type { Workspace } from "../lib/types";
import { getWorkspaceTone } from "../lib/workspace-tone";
import { WorkspaceIcon } from "./workspace-icon";

type WorkspaceCardProps = {
    workspace: Workspace;
    onEdit: (workspace: Workspace) => void;
    onDelete: (workspace: Workspace) => void;
    className?: string;
};

function plural(count: number, singular: string) {
    return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

export function WorkspaceCard({
    workspace,
    onEdit,
    onDelete,
    className,
}: WorkspaceCardProps) {
    const href = routes.workspace.chat(workspace.id);
    const tone = getWorkspaceTone(workspace.id);
    // Hover-only controls need a touch fallback, so they show at all times below md.
    const revealOnHover =
        "transition-opacity focus-visible:opacity-100 md:opacity-0 md:group-hover/card:opacity-100";

    return (
        <article
            className={cn(
                "group/card relative flex min-h-48 flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-surface transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-raised motion-reduce:transform-none sm:min-h-52 sm:p-6",
                className,
            )}
        >
            {/* Colour accent keyed to the notebook, so each one is recognisable at a glance. */}
            <span
                aria-hidden="true"
                className={cn("absolute inset-x-0 top-0 h-1", toneClasses[tone])}
            />
            <Link
                href={href}
                className="absolute inset-0 z-0 rounded-[inherit] outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                aria-label={`Open ${workspace.title}`}
            />

            <div className="pointer-events-none relative flex items-start justify-between gap-2">
                <span
                    aria-hidden="true"
                    className={cn(
                        "flex size-12 items-center justify-center rounded-xl",
                        toneClasses[tone],
                    )}
                >
                    <WorkspaceIcon value={workspace.icon} className="size-6" />
                </span>

                <div className="pointer-events-auto relative z-10 flex items-center gap-0.5">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className={revealOnHover}
                        onClick={() => onEdit(workspace)}
                    >
                        <PencilIcon aria-hidden="true" />
                        <span className="sr-only">Edit {workspace.title}</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className={cn(
                            "hover:bg-destructive/10 hover:text-destructive",
                            revealOnHover,
                        )}
                        onClick={() => onDelete(workspace)}
                    >
                        <Trash2Icon aria-hidden="true" />
                        <span className="sr-only">
                            Delete {workspace.title}
                        </span>
                    </Button>
                </div>
            </div>

            <div className="pointer-events-none relative min-w-0 space-y-1.5">
                <h3 className="text-heading line-clamp-2 wrap-break-word">
                    {workspace.title}
                </h3>
                {workspace.description ? (
                    <p className="text-body line-clamp-2 text-muted-foreground">
                        {workspace.description}
                    </p>
                ) : null}
            </div>

            <div className="pointer-events-none relative mt-auto flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums">
                    <LibraryBigIcon aria-hidden="true" className="size-3.5" />
                    {plural(workspace.sourceCount, "source")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums">
                    <SparklesIcon aria-hidden="true" className="size-3.5" />
                    {plural(workspace.artifactCount, "study guide")}
                </span>
                <span className="text-caption ml-auto inline-flex items-center gap-1">
                    {formatDistanceToNow(new Date(workspace.updatedAt), {
                        addSuffix: true,
                    })}
                    <ArrowUpRightIcon
                        aria-hidden="true"
                        className="size-3.5 transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
                    />
                </span>
            </div>
        </article>
    );
}
