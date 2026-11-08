"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
    ArrowLeftIcon,
    GraduationCapIcon,
    PencilIcon,
    ShieldCheckIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Callout } from "@/shared/components/callout";
import { EmptyState } from "@/shared/components/empty-state";
import { StatusBadge } from "@/shared/components/status-badge";
import { TypeTile } from "@/shared/components/type-tile";
import { ApiError } from "@/shared/lib/api";
import { routes } from "@/shared/config/routes";
import { cn } from "@/lib/utils";
import { ARTIFACT_META } from "../lib/artifact-meta";
import { ARTIFACT_TYPE_LABELS } from "../lib/constants";
import { useArtifact, useMarkArtifactViewed } from "../hooks/use-artifacts";
import { isUnseenArtifact, isUserEdited } from "../lib/types";
import { ArtifactActions } from "./artifact-actions";
import { ArtifactContentViewer } from "./artifact-content-viewer";
import { LoadError } from "@/shared/components/load-error";

type ArtifactDetailProps = {
    workspaceId: string;
    artifactId: string;
};

export function ArtifactDetail({
    workspaceId,
    artifactId,
}: ArtifactDetailProps) {
    const { data: artifact, isLoading, error } = useArtifact(
        workspaceId,
        artifactId,
    );
    const { mutate: markViewed } = useMarkArtifactViewed(workspaceId);
    const markedViewed = useRef(false);

    // Opening a finished artifact is what clears its "new" state; fetching it is not.
    const shouldMarkViewed = artifact ? isUnseenArtifact(artifact) : false;
    useEffect(() => {
        if (shouldMarkViewed && !markedViewed.current) {
            markedViewed.current = true;
            markViewed(artifactId);
        }
    }, [shouldMarkViewed, markViewed, artifactId]);

    const backToLearn = (
        <Button
            nativeButton={false}
            variant="outline"
            render={<Link href={routes.workspace.learn(workspaceId)} />}
        >
            <ArrowLeftIcon aria-hidden="true" />
            Back to Learn
        </Button>
    );

    if (isLoading) {
        return (
            <div
                aria-busy="true"
                className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6 md:p-8"
            >
                <Skeleton className="h-10 w-72 max-w-full" />
                <Skeleton className="h-72 w-full rounded-2xl" />
            </div>
        );
    }

    if (error instanceof ApiError && error.status === 404) {
        return (
            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-4 sm:p-6 md:p-8">
                <EmptyState icon={GraduationCapIcon} title="Learning tool not found">
                    {backToLearn}
                </EmptyState>
            </div>
        );
    }

    if (error || !artifact) {
        return (
            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-4 sm:p-6 md:p-8">
                <LoadError
                    error={error}
                    icon={GraduationCapIcon}
                    title="Could not load learning tool"
                >
                    {backToLearn}
                </LoadError>
            </div>
        );
    }

    const meta = ARTIFACT_META[artifact.type];
    const processingError =
        typeof artifact.metadata?.processingError === "string"
            ? artifact.metadata.processingError
            : null;
    const isMindMap = artifact.type === "MINDMAP";
    const isProcessing =
        artifact.status === "PENDING" || artifact.status === "PROCESSING";

    return (
        <div
            className={cn(
                "mx-auto flex w-full flex-1 flex-col gap-6",
                isMindMap
                    ? "min-h-0 max-w-none p-4 md:p-5"
                    : "max-w-5xl p-4 sm:p-6 md:p-8 short:gap-4 short:p-4 short:md:p-4",
            )}
        >
            <header className="flex flex-wrap items-start gap-4">
                <Button
                    nativeButton={false}
                    variant="outline"
                    size="icon"
                    render={<Link href={routes.workspace.learn(workspaceId)} />}
                >
                    <ArrowLeftIcon aria-hidden="true" />
                    <span className="sr-only">Back to Learn</span>
                </Button>
                <TypeTile icon={meta.icon} tone={meta.tone} size="lg" />
                <div className="order-3 w-full min-w-0 space-y-1.5 sm:order-none sm:w-auto sm:flex-1">
                    <p className="text-eyebrow">
                        {ARTIFACT_TYPE_LABELS[artifact.type]}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-title">{artifact.title}</h1>
                        <StatusBadge status={artifact.status} />
                        {isUserEdited(artifact) ? (
                            <Badge variant="violet">
                                <PencilIcon aria-hidden="true" />
                                Edited
                            </Badge>
                        ) : null}
                    </div>
                    <p className="text-caption flex flex-wrap items-center gap-x-2">
                        {artifact.sourceIds.length > 0 ? (
                            <span className="inline-flex items-center gap-1.5">
                                <ShieldCheckIcon
                                    aria-hidden="true"
                                    className="size-3.5"
                                />
                                Grounded in {artifact.sourceIds.length} source
                                {artifact.sourceIds.length === 1 ? "" : "s"}
                                <span aria-hidden="true">·</span>
                            </span>
                        ) : null}
                        <span>
                            Generated{" "}
                            {formatDistanceToNow(new Date(artifact.createdAt), {
                                addSuffix: true,
                            })}
                        </span>
                    </p>
                </div>
                <ArtifactActions
                    artifact={artifact}
                    workspaceId={workspaceId}
                />
            </header>

            {isProcessing ? (
                <div
                    role="status"
                    className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center"
                >
                    <Spinner className="size-5" />
                    <p className="text-body text-muted-foreground">
                        Generating{" "}
                        {ARTIFACT_TYPE_LABELS[artifact.type].toLowerCase()}
                        &hellip; This page updates when it&apos;s ready.
                    </p>
                </div>
            ) : artifact.status === "FAILED" ? (
                <Callout tone="rose" title="Generation failed">
                    {processingError ??
                        "Something went wrong while generating this. Try generating it again."}
                </Callout>
            ) : isMindMap ? (
                <div className="min-h-0 flex-1">
                    <ArtifactContentViewer
                        artifact={artifact}
                        workspaceId={workspaceId}
                    />
                </div>
            ) : (
                <div className="rounded-2xl border border-border bg-card p-5 shadow-surface md:p-8 short:p-4 short:md:p-4">
                    <ArtifactContentViewer
                        artifact={artifact}
                        workspaceId={workspaceId}
                    />
                </div>
            )}
        </div>
    );
}
