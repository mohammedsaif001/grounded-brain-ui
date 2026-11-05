"use client";

import { useMemo, useState } from "react";
import {
    LibraryBigIcon,
    MoreHorizontalIcon,
    PlusIcon,
    RefreshCwIcon,
    SearchIcon,
    Trash2Icon,
    XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { BulkActionBar } from "@/shared/components/bulk-action-bar";
import { EmptyState } from "@/shared/components/empty-state";
import { FilterSelect } from "@/shared/components/filter-select";
import { PageHeader } from "@/shared/components/page-header";
import { ViewToggle, type ViewMode } from "@/shared/components/view-toggle";
import { ApiError } from "@/shared/lib/api";
import {
    useBulkDeleteSources,
    useDeleteSource,
    useReprocessSources,
    useSources,
} from "../hooks/use-sources";
import {
    SOURCE_STATUS_LABELS,
    SOURCE_STATUSES,
    SOURCE_TYPE_LABELS,
    SOURCE_TYPES,
} from "../lib/constants";
import type { Source, SourceFilters } from "../lib/types";
import { AddSourceDialog } from "./add-source-dialog";
import { DeleteSourcesDialog } from "./delete-sources-dialog";
import { SourceCard } from "./source-card";
import { SourceTable } from "./source-table";

type SourceLibraryProps = {
    workspaceId: string;
};

const TYPE_OPTIONS = SOURCE_TYPES.map((value) => ({
    value,
    label: SOURCE_TYPE_LABELS[value],
}));

const STATUS_OPTIONS = SOURCE_STATUSES.map((value) => ({
    value,
    label: SOURCE_STATUS_LABELS[value],
}));

/** What the delete confirmation is currently about. */
type PendingDelete =
    | { kind: "one"; source: Source }
    | { kind: "many"; ids: string[] };

function summarize(sources: readonly Source[]): string {
    const count = (status: Source["status"]) =>
        sources.filter((source) => source.status === status).length;
    const parts = [
        `${sources.length} source${sources.length === 1 ? "" : "s"}`,
        `${count("READY")} ready`,
    ];
    if (count("PROCESSING")) parts.push(`${count("PROCESSING")} processing`);
    if (count("PENDING")) parts.push(`${count("PENDING")} pending`);
    if (count("FAILED")) parts.push(`${count("FAILED")} needs attention`);
    return parts.join(" · ");
}

export function SourceLibrary({ workspaceId }: SourceLibraryProps) {
    const [view, setView] = useState<ViewMode>("list");
    const [addOpen, setAddOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(
        null,
    );
    const [filters, setFilters] = useState<SourceFilters>({});
    const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(
        () => new Set(),
    );

    const { data: sources, isLoading, error } = useSources(workspaceId, filters);
    const deleteSource = useDeleteSource(workspaceId);
    const bulkDelete = useBulkDeleteSources(workspaceId);
    const reprocess = useReprocessSources(workspaceId);

    // Selection can reference rows that a filter or deletion has since removed.
    const visibleSelected = useMemo(
        () =>
            new Set(
                (sources ?? [])
                    .filter((source) => selectedIds.has(source.id))
                    .map((source) => source.id),
            ),
        [sources, selectedIds],
    );

    const failedCount =
        sources?.filter((source) => source.status === "FAILED").length ?? 0;
    const hasActiveFilters = Boolean(
        filters.q?.trim() || filters.type || filters.status,
    );

    function toggleOne(id: string, selected: boolean) {
        setSelectedIds((current) => {
            const next = new Set(current);
            if (selected) next.add(id);
            else next.delete(id);
            return next;
        });
    }

    function toggleAll(selected: boolean) {
        setSelectedIds(
            selected ? new Set((sources ?? []).map((s) => s.id)) : new Set(),
        );
    }

    function clearSelection() {
        setSelectedIds(new Set());
    }

    function confirmDelete() {
        if (!pendingDelete) return;
        if (pendingDelete.kind === "one") {
            deleteSource.mutate(pendingDelete.source.id, {
                onSuccess: () => setPendingDelete(null),
            });
            return;
        }
        bulkDelete.mutate(pendingDelete.ids, {
            onSuccess: () => {
                setPendingDelete(null);
                clearSelection();
            },
        });
    }

    const deleteSubject =
        pendingDelete?.kind === "one"
            ? pendingDelete.source.title
            : `${pendingDelete?.kind === "many" ? pendingDelete.ids.length : 0} sources`;

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6 md:p-8">
            <PageHeader
                eyebrow="The roots of your notebook"
                title="Your source library"
                description={
                    sources
                        ? `${sources.length} source${sources.length === 1 ? "" : "s"} in this workspace`
                        : "All knowledge sources in this workspace"
                }
                actions={
                    <Button size="lg" onClick={() => setAddOpen(true)}>
                        <PlusIcon aria-hidden="true" />
                        Add source
                    </Button>
                }
            />

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative min-w-0 flex-1">
                    <SearchIcon
                        aria-hidden="true"
                        className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        type="search"
                        aria-label="Search sources"
                        className="h-11 pl-10"
                        placeholder="Search by title or content…"
                        value={filters.q ?? ""}
                        onChange={(event) =>
                            setFilters((current) => ({
                                ...current,
                                q: event.target.value,
                            }))
                        }
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <FilterSelect
                        label="Filter by type"
                        allLabel="All types"
                        options={TYPE_OPTIONS}
                        value={filters.type}
                        onChange={(type) =>
                            setFilters((current) => ({ ...current, type }))
                        }
                        className="h-11"
                    />
                    <FilterSelect
                        label="Filter by status"
                        allLabel="All statuses"
                        options={STATUS_OPTIONS}
                        value={filters.status}
                        onChange={(status) =>
                            setFilters((current) => ({ ...current, status }))
                        }
                        className="h-11"
                    />
                    <ViewToggle value={view} onChange={setView} />

                    {failedCount > 0 ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button variant="outline" size="icon" />
                                }
                            >
                                <MoreHorizontalIcon aria-hidden="true" />
                                <span className="sr-only">More actions</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    disabled={reprocess.isPending}
                                    onClick={() => reprocess.mutate(undefined)}
                                >
                                    <RefreshCwIcon />
                                    Reprocess failed ({failedCount})
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : null}
                </div>
            </div>

            {hasActiveFilters ? (
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Filters applied</span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => setFilters({})}
                    >
                        <XIcon aria-hidden="true" />
                        Clear
                    </Button>
                </div>
            ) : null}

            {visibleSelected.size > 0 ? (
                <BulkActionBar
                    count={visibleSelected.size}
                    noun="source"
                    onClear={clearSelection}
                >
                    <Button
                        variant="ghost"
                        disabled={reprocess.isPending}
                        onClick={() =>
                            reprocess.mutate([...visibleSelected], {
                                onSuccess: clearSelection,
                            })
                        }
                    >
                        {reprocess.isPending ? (
                            <Spinner />
                        ) : (
                            <RefreshCwIcon aria-hidden="true" />
                        )}
                        Reprocess
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            setPendingDelete({
                                kind: "many",
                                ids: [...visibleSelected],
                            })
                        }
                    >
                        <Trash2Icon aria-hidden="true" />
                        Delete selected
                    </Button>
                </BulkActionBar>
            ) : null}

            {isLoading ? (
                <div
                    aria-busy="true"
                    className={
                        view === "grid"
                            ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                            : "grid gap-2"
                    }
                >
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className={
                                view === "grid"
                                    ? "h-36 rounded-2xl"
                                    : "h-16 rounded-xl"
                            }
                        />
                    ))}
                </div>
            ) : error ? (
                <EmptyState
                    icon={LibraryBigIcon}
                    title="Could not load sources"
                    description={
                        error instanceof ApiError
                            ? error.message
                            : "Please try again."
                    }
                />
            ) : sources && sources.length > 0 ? (
                view === "list" ? (
                    <SourceTable
                        sources={sources}
                        selectedIds={visibleSelected}
                        onToggleOne={toggleOne}
                        onToggleAll={toggleAll}
                        onDelete={(source) =>
                            setPendingDelete({ kind: "one", source })
                        }
                        onReprocess={(source) => reprocess.mutate([source.id])}
                    />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {sources.map((source) => (
                            <SourceCard
                                key={source.id}
                                source={source}
                                selected={visibleSelected.has(source.id)}
                                onSelectedChange={(selected) =>
                                    toggleOne(source.id, selected)
                                }
                                onDelete={(target) =>
                                    setPendingDelete({
                                        kind: "one",
                                        source: target,
                                    })
                                }
                                onReprocess={
                                    source.status === "FAILED"
                                        ? (target) =>
                                              reprocess.mutate([target.id])
                                        : undefined
                                }
                            />
                        ))}
                    </div>
                )
            ) : (
                <EmptyState
                    icon={LibraryBigIcon}
                    title="No sources found"
                    description={
                        hasActiveFilters
                            ? "Try adjusting your search or filters."
                            : "Add your first source to start building this notebook."
                    }
                >
                    {hasActiveFilters ? (
                        <Button variant="outline" onClick={() => setFilters({})}>
                            Clear filters
                        </Button>
                    ) : null}
                    <Button onClick={() => setAddOpen(true)}>
                        <PlusIcon aria-hidden="true" />
                        Add source
                    </Button>
                </EmptyState>
            )}

            {sources && sources.length > 0 ? (
                <footer className="text-caption flex flex-wrap items-center justify-between gap-2">
                    <span>{summarize(sources)}</span>
                    <span>Ready sources are available in Chat &amp; Learn</span>
                </footer>
            ) : null}

            <AddSourceDialog
                workspaceId={workspaceId}
                open={addOpen}
                onOpenChange={setAddOpen}
            />

            <DeleteSourcesDialog
                open={pendingDelete !== null}
                subject={deleteSubject}
                isPending={deleteSource.isPending || bulkDelete.isPending}
                onConfirm={confirmDelete}
                onCancel={() => setPendingDelete(null)}
            />
        </div>
    );
}
