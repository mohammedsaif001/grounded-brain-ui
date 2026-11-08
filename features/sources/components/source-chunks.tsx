"use client";

import { EyeOffIcon, LayersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LoadError } from "@/shared/components/load-error";
import { useSetChunkExcluded, useSourceChunks } from "../hooks/use-sources";

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
                <p className="text-caption">
                    Excluded chunks are ignored by chat and by learning tools.
                </p>
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
                            <p
                                className={cn(
                                    "text-body line-clamp-4 min-w-0 flex-1 whitespace-pre-wrap break-words",
                                    chunk.excluded &&
                                        "text-muted-foreground line-through decoration-muted-foreground/40",
                                )}
                            >
                                {chunk.content}
                            </p>
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
