"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeftIcon, GraduationCapIcon } from "lucide-react";
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
import { useArtifact } from "../hooks/use-artifacts";
import { ArtifactActions } from "./artifact-actions";
import { ArtifactContentViewer } from "./artifact-content-viewer";

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
                className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-6 md:p-8"
            >
                <Skeleton className="h-10 w-72" />
                <Skeleton className="h-72 w-full rounded-2xl" />
            </div>
        );
    }

    if (error instanceof ApiError && error.status === 404) {
        return (
            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-6 md:p-8">
                <EmptyState icon={GraduationCapIcon} title="Learning tool not found">
                    {backToLearn}
                </EmptyState>
            </div>
        );
    }

    if (error || !artifact) {
        return (
            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-6 md:p-8">
                <EmptyState
                    icon={GraduationCapIcon}
                    title="Could not load learning tool"
                    description="Please try again in a moment."
                >
                    {backToLearn}
                </EmptyState>
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
                    : "max-w-5xl p-6 md:p-8",
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
                <div className="min-w-0 flex-1 space-y-1.5">
                    <p className="text-eyebrow">
                        {ARTIFACT_TYPE_LABELS[artifact.type]}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-title">{artifact.title}</h1>
                        <StatusBadge status={artifact.status} />
                    </div>
                    <p className="text-caption">
                        Generated{" "}
                        {formatDistanceToNow(new Date(artifact.createdAt), {
                            addSuffix: true,
                        })}
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
                <div className="rounded-2xl border border-border bg-card p-5 shadow-surface md:p-8">
                    <ArtifactContentViewer
                        artifact={artifact}
                        workspaceId={workspaceId}
                    />
                </div>
            )}
        </div>
    );
}
