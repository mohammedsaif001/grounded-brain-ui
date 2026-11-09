"use client";

import { useState } from "react";
import {
    ChevronsDownUpIcon,
    ChevronsUpDownIcon,
    EyeOffIcon,
    LayersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LoadError } from "@/shared/components/load-error";
import { useSetChunkExcluded, useSourceChunks } from "../hooks/use-sources";

/** Chunks shorter than this fit in the collapsed preview, so they get no toggle. */
const PREVIEW_CHARS = 240;
const PREVIEW_LINES = 4;

function isLongChunk(content: string) {
    return (
        content.length > PREVIEW_CHARS ||
        content.split("\n").length > PREVIEW_LINES
    );
}

type SourceChunksProps = {
    workspaceId: string;
    sourceId: string;
};

/**
 * The indexed pieces of a source. Excluding a chunk keeps it indexed but hides it from
 * chat answers and from artifact generation, which is the quick way to drop noise
 * (page headers, cookie banners, boilerplate) without re-indexing.
 */
export function SourceChunks({ workspaceId, sourceId }: SourceChunksProps) {
    const { data, isLoading, error, refetch } = useSourceChunks(
        workspaceId,
        sourceId,
        true,
    );
    const setExcluded = useSetChunkExcluded(workspaceId, sourceId);
    const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(
        () => new Set(),
    );

    function toggleExpanded(chunkId: string) {
        setExpandedIds((current) => {
            const next = new Set(current);
            if (!next.delete(chunkId)) {
                next.add(chunkId);
            }
            return next;
        });
    }

    if (isLoading) {
        return (
            <div aria-busy="true" className="space-y-3">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <LoadError
                error={error}
                icon={LayersIcon}
                title="Could not load chunks"
            >
                <Button variant="outline" onClick={() => void refetch()}>
                    Try again
                </Button>
            </LoadError>
        );
    }

    const excludedCount = data.chunks.filter((chunk) => chunk.excluded).length;
    const allExcluded =
        data.chunks.length > 0 && excludedCount === data.chunks.length;
    const longChunks = data.chunks.filter((chunk) => isLongChunk(chunk.content));
    const allExpanded =
        longChunks.length > 0 &&
        longChunks.every((chunk) => expandedIds.has(chunk.id));

    return (
        <section aria-labelledby="chunks-title" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 id="chunks-title" className="text-heading">
                    Indexed chunks
                    <span className="text-caption ml-2">
                        {data.count}
                        {excludedCount > 0 ? ` · ${excludedCount} excluded` : ""}
                    </span>
                </h2>
                <div className="flex items-center gap-3">
                    <p className="text-caption">
                        Excluded chunks are ignored by chat and by learning
                        tools.
                    </p>
                    {longChunks.length > 0 ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setExpandedIds(
                                    allExpanded
                                        ? new Set()
                                        : new Set(
                                              longChunks.map((chunk) => chunk.id),
                                          ),
                                )
                            }
                        >
                            {allExpanded ? (
                                <ChevronsDownUpIcon aria-hidden="true" />
                            ) : (
                                <ChevronsUpDownIcon aria-hidden="true" />
                            )}
                            {allExpanded ? "Collapse all" : "Expand all"}
                        </Button>
                    ) : null}
                </div>
            </div>

            {allExcluded ? (
                <p
                    role="alert"
                    className="rounded-xl bg-tint-amber px-4 py-3 text-sm text-tint-amber-foreground"
                >
                    Every chunk is excluded, so this source has no usable text.
                    Learning tools built only from it will fail.
                </p>
            ) : null}

            <ol className="space-y-2">
                {data.chunks.map((chunk) => {
                    const isPending =
                        setExcluded.isPending &&
                        setExcluded.variables?.chunkId === chunk.id;
                    const isLong = isLongChunk(chunk.content);
                    const isExpanded = expandedIds.has(chunk.id);

                    return (
                        <li
                            key={chunk.id}
                            className={cn(
                                "flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors",
                                chunk.excluded && "border-dashed bg-muted/50",
                            )}
                        >
                            <span className="text-caption mt-0.5 w-8 shrink-0 tabular-nums">
                                #{chunk.index + 1}
                            </span>
                            <div className="min-w-0 flex-1 space-y-2">
                                <p
                                    className={cn(
                                        "text-body wrap-break-word whitespace-pre-wrap",
                                        !isExpanded && "line-clamp-4",
                                        chunk.excluded &&
                                            "text-muted-foreground line-through decoration-muted-foreground/40",
                                    )}
                                >
                                    {chunk.content}
                                </p>
                                {isLong ? (
                                    <button
                                        type="button"
                                        aria-expanded={isExpanded}
                                        className="text-caption font-medium underline underline-offset-4 hover:text-foreground"
                                        onClick={() => toggleExpanded(chunk.id)}
                                    >
                                        {isExpanded
                                            ? "Show less"
                                            : "Show full chunk"}
                                        <span className="sr-only">
                                            {" "}
                                            for chunk {chunk.index + 1}
                                        </span>
                                    </button>
                                ) : null}
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-2">
                                {chunk.excluded ? (
                                    <Badge variant="amber">Excluded</Badge>
                                ) : null}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={isPending}
                                    aria-pressed={chunk.excluded}
                                    onClick={() =>
                                        setExcluded.mutate({
                                            chunkId: chunk.id,
                                            excluded: !chunk.excluded,
                                        })
                                    }
                                >
                                    <EyeOffIcon aria-hidden="true" />
                                    {chunk.excluded ? "Include" : "Exclude"}
                                    <span className="sr-only">
                                        {" "}
                                        chunk {chunk.index + 1}
                                    </span>
                                </Button>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}
