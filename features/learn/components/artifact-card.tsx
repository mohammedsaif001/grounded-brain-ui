"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRightIcon, Trash2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/shared/components/status-badge";
import { TypeTile } from "@/shared/components/type-tile";
import { routes } from "@/shared/config/routes";
import { ARTIFACT_META } from "../lib/artifact-meta";
import { ARTIFACT_TYPE_LABELS } from "../lib/constants";
import { isUnseenArtifact, type LearningArtifact } from "../lib/types";

type ArtifactCardProps = {
    artifact: LearningArtifact;
    workspaceId: string;
    onDelete: (artifact: LearningArtifact) => void;
};

export function ArtifactCard({
    artifact,
    workspaceId,
    onDelete,
}: ArtifactCardProps) {
    const meta = ARTIFACT_META[artifact.type];
    const href = routes.workspace.artifact(workspaceId, artifact.id);

    return (
        <article className="group/card relative flex min-h-44 flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-5 shadow-surface transition-shadow hover:shadow-raised">
            <Link
                href={href}
                aria-label={`Open ${artifact.title}`}
                className="absolute inset-0 z-0 rounded-[inherit] outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            />

            <div className="relative space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <TypeTile icon={meta.icon} tone={meta.tone} size="sm" />
                        <span className="text-caption">
                            {ARTIFACT_TYPE_LABELS[artifact.type]}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {isUnseenArtifact(artifact) ? (
                            <Badge variant="green">New</Badge>
                        ) : null}
                        <StatusBadge status={artifact.status} />
                    </div>
                </div>
                <h3 className="text-heading line-clamp-2">{artifact.title}</h3>
            </div>

            <div className="relative flex items-center justify-between gap-3">
                <p className="text-caption">
                    Generated{" "}
                    {formatDistanceToNow(new Date(artifact.createdAt), {
                        addSuffix: true,
                    })}
                </p>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="relative z-10 opacity-100 transition-opacity focus-visible:opacity-100 md:opacity-0 md:group-hover/card:opacity-100"
                        onClick={() => onDelete(artifact)}
                    >
                        <Trash2Icon aria-hidden="true" />
                        <span className="sr-only">
                            Delete {artifact.title}
                        </span>
                    </Button>
                    <ArrowUpRightIcon
                        aria-hidden="true"
                        className="size-4 text-muted-foreground"
                    />
                </div>
            </div>
        </article>
    );
}
