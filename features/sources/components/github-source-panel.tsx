"use client";

import { useState } from "react";
import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGithubFiles, useSyncGithubSource } from "../hooks/use-sources";
import type { Source } from "../lib/types";

type GithubSourcePanelProps = {
    workspaceId: string;
    source: Source;
};

export function GithubSourcePanel({
    workspaceId,
    source,
}: GithubSourcePanelProps) {
    const isReady = source.status === "READY";
    const { data, isLoading } = useGithubFiles(workspaceId, source.id, isReady);
    const sync = useSyncGithubSource(workspaceId);
    const [message, setMessage] = useState<string | null>(null);
    const [filter, setFilter] = useState("");

    const canSync = source.status === "READY" || source.status === "FAILED";
    const files = (data?.files ?? []).filter((file) =>
        file.path.toLowerCase().includes(filter.trim().toLowerCase()),
    );

    async function handleSync() {
        setMessage(null);
        try {
            const result = await sync.mutateAsync(source.id);
            setMessage(
                result.changed
                    ? "New commits found. Re-indexing…"
                    : "Already up to date.",
            );
        } catch (error) {
            setMessage(
                error instanceof Error ? error.message : "Sync failed",
            );
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-muted/30 p-4 text-sm">
                <div className="space-y-1">
                    <p className="font-medium">{data?.repo ?? source.title}</p>
                    <p className="text-muted-foreground">
                        {data?.branch ? `Branch ${data.branch}` : null}
                        {data?.commitSha
                            ? ` · ${data.commitSha.slice(0, 7)}`
                            : null}
                        {data?.totalFiles != null
                            ? ` · ${data.totalFiles} files`
                            : null}
                        {data?.truncated ? " (truncated)" : null}
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!canSync || sync.isPending}
                    onClick={() => void handleSync()}
                >
                    {sync.isPending ? <Spinner /> : <RefreshCwIcon />}
                    Sync with GitHub
                </Button>
            </div>

            {message ? (
                <p className="text-sm text-muted-foreground">{message}</p>
            ) : null}

            {isReady ? (
                isLoading ? (
                    <Skeleton className="h-48 w-full rounded-2xl" />
                ) : (
                    <div className="space-y-2">
                        <input
                            value={filter}
                            onChange={(event) => setFilter(event.target.value)}
                            placeholder="Filter files…"
                            className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                        />
                        <ul className="max-h-96 divide-y overflow-y-auto rounded-2xl border text-sm">
                            {files.map((file) => (
                                <li
                                    key={file.path}
                                    className="flex items-center justify-between gap-3 px-3 py-2"
                                >
                                    <span className="truncate font-mono text-xs">
                                        {file.path}
                                    </span>
                                    <span className="shrink-0 text-xs text-muted-foreground">
                                        {file.chunkCount} chunks
                                    </span>
                                </li>
                            ))}
                            {files.length === 0 ? (
                                <li className="px-3 py-6 text-center text-muted-foreground">
                                    No files match.
                                </li>
                            ) : null}
                        </ul>
                    </div>
                )
            ) : null}
        </div>
    );
}
