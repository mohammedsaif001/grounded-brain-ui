"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toneClasses } from "@/shared/components/tint";
import { routes } from "@/shared/config/routes";
import type { Workspace } from "../lib/types";
import { formatWorkspaceCounts } from "../lib/workspace-counts";
import { getWorkspaceTone } from "../lib/workspace-tone";
import { WorkspaceIcon } from "./workspace-icon";

type WorkspaceCardProps = {
    workspace: Workspace;
    onEdit: (workspace: Workspace) => void;
    onDelete: (workspace: Workspace) => void;
    className?: string;
};

export function WorkspaceCard({
    workspace,
    onEdit,
    onDelete,
    className,
}: WorkspaceCardProps) {
    const href = routes.workspace.chat(workspace.id);

    return (
        <article
            className={cn(
                "group/card relative flex min-h-56 flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-surface transition-shadow hover:shadow-raised",
                className,
            )}
        >
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
                        toneClasses[getWorkspaceTone(workspace.id)],
                    )}
                >
                    <WorkspaceIcon value={workspace.icon} className="size-6" />
                </span>

                <div className="pointer-events-auto relative z-10 flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(workspace)}
                    >
                        <PencilIcon aria-hidden="true" />
                        <span className="sr-only">Edit {workspace.title}</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDelete(workspace)}
                    >
                        <Trash2Icon aria-hidden="true" />
                        <span className="sr-only">
                            Delete {workspace.title}
                        </span>
                    </Button>
                </div>
            </div>

            <div className="pointer-events-none relative space-y-1.5">
                <h3 className="text-heading line-clamp-2">{workspace.title}</h3>
                {workspace.description ? (
                    <p className="text-body line-clamp-2 text-muted-foreground">
                        {workspace.description}
                    </p>
                ) : null}
            </div>

            <div className="pointer-events-none relative mt-auto space-y-1">
                <p className="text-sm font-medium tabular-nums">
                    {formatWorkspaceCounts(workspace)}
                </p>
                <p className="text-caption">
                    Updated{" "}
                    {formatDistanceToNow(new Date(workspace.updatedAt), {
                        addSuffix: true,
                    })}
                </p>
            </div>
        </article>
    );
}
