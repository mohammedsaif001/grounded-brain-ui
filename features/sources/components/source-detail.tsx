"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeftIcon, ExternalLinkIcon, LibraryBigIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Callout } from "@/shared/components/callout";
import { EmptyState } from "@/shared/components/empty-state";
import { ApiError } from "@/shared/lib/api";
import { routes } from "@/shared/config/routes";
import { useSource } from "../hooks/use-sources";
import { SOURCE_TYPE_LABELS } from "../lib/constants";
import { describeSourceFacts } from "../lib/source-metadata";
import { GithubSourcePanel } from "./github-source-panel";
import { MarkdownPreview } from "./markdown-preview";
import { SourceStatusBadge } from "./source-status-badge";
import { SourceTypeTile } from "./source-type-icon";
import { LoadError } from "@/shared/components/load-error";

type SourceDetailProps = {
    workspaceId: string;
    sourceId: string;
};

export function SourceDetail({ workspaceId, sourceId }: SourceDetailProps) {
    const { data: source, isLoading, error } = useSource(workspaceId, sourceId);
    const backToLibrary = (
        <Button
            nativeButton={false}
            variant="outline"
            render={<Link href={routes.workspace.sources(workspaceId)} />}
        >
            <ArrowLeftIcon aria-hidden="true" />
            Back to library
        </Button>
    );

    if (isLoading) {
        return (
            <div
                aria-busy="true"
                className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-6 md:p-8"
            >
                <Skeleton className="h-10 w-72" />
                <Skeleton className="h-4 w-96" />
                <Skeleton className="h-72 w-full rounded-2xl" />
            </div>
        );
    }

    if (error instanceof ApiError && error.status === 404) {
        return (
            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-6 md:p-8">
                <EmptyState icon={LibraryBigIcon} title="Source not found">
                    {backToLibrary}
                </EmptyState>
            </div>
        );
    }

    if (error || !source) {
        return (
            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-6 md:p-8">
                <LoadError
                    error={error}
                    icon={LibraryBigIcon}
                    title="Could not load source"
                >
                    {backToLibrary}
                </LoadError>
            </div>
        );
    }

    const metadata = source.metadata ?? {};
    const factsLine = describeSourceFacts(source);
    const fileUrl =
        typeof metadata.fileUrl === "string" ? metadata.fileUrl : null;
    const fileName =
        typeof metadata.fileName === "string" ? metadata.fileName : null;
    const chunkCount =
        typeof metadata.chunkCount === "number" ? metadata.chunkCount : null;
    const processingError =
        typeof metadata.processingError === "string"
            ? metadata.processingError
            : null;
    const isProcessing =
        source.status === "PENDING" || source.status === "PROCESSING";

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-6 md:p-8">
            <header className="flex flex-wrap items-start gap-4">
                <Button
                    nativeButton={false}
                    variant="outline"
                    size="icon"
                    render={
                        <Link href={routes.workspace.sources(workspaceId)} />
                    }
                >
                    <ArrowLeftIcon aria-hidden="true" />
                    <span className="sr-only">Back to library</span>
                </Button>
                <SourceTypeTile type={source.type} size="lg" />
                <div className="min-w-0 flex-1 space-y-1.5">
                    <p className="text-eyebrow">
                        {SOURCE_TYPE_LABELS[source.type]}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-title break-words">
                            {source.title}
                        </h1>
                        <SourceStatusBadge status={source.status} />
                    </div>
                    <p className="text-caption">
                        Added{" "}
                        {formatDistanceToNow(new Date(source.createdAt), {
                            addSuffix: true,
                        })}
                        {chunkCount != null
                            ? ` · ${chunkCount} chunks indexed`
                            : null}
                        {factsLine ? ` · ${factsLine}` : null}
                    </p>
                </div>
            </header>

            {source.url ? (
                <p className="flex min-w-0 items-center gap-2 text-sm">
                    <ExternalLinkIcon
                        aria-hidden="true"
                        className="size-4 shrink-0 text-muted-foreground"
                    />
                    <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate underline decoration-border underline-offset-4 hover:decoration-foreground"
                    >
                        {source.url}
                    </a>
                </p>
            ) : null}

            {source.type === "PDF" && fileUrl ? (
                <Callout tone="blue" title="PDF uploaded">
                    {fileName ? <p>{fileName}</p> : null}
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex font-semibold underline underline-offset-4"
                    >
                        Open PDF
                    </a>
                </Callout>
            ) : null}

            {isProcessing ? (
                <div
                    role="status"
                    className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center"
                >
                    <Spinner className="size-5" />
                    <p className="text-body text-muted-foreground">
                        Processing source: extracting text, chunking and
                        indexing for search&hellip;
                    </p>
                </div>
            ) : source.status === "FAILED" ? (
                <Callout tone="rose" title="Processing failed">
                    {processingError ??
                        "Something went wrong while processing this source. Try reprocessing it from the library."}
                </Callout>
            ) : source.type === "GITHUB" ? (
                <GithubSourcePanel workspaceId={workspaceId} source={source} />
            ) : source.content ? (
                <MarkdownPreview content={source.content} />
            ) : (
                <EmptyState
                    icon={LibraryBigIcon}
                    title="No extracted content"
                    description="There's no extracted content available for this source."
                />
            )}
        </div>
    );
}
