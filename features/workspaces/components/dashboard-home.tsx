"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    BookOpenIcon,
    BookOpenTextIcon,
    SearchIcon,
    XIcon,
} from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/shared/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { UserMenu } from "@/features/profile";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import {
    useCreateWorkspace,
    useDeleteWorkspace,
    useUpdateWorkspace,
    useWorkspaces,
} from "../hooks/use-workspaces";
import type { Workspace } from "../lib/types";
import { ContinueCard } from "./continue-card";
import { CreateWorkspaceCard } from "./create-workspace-card";
import { DashboardHero } from "./dashboard-hero";
import { DeleteWorkspaceDialog } from "./delete-workspace-dialog";
import { FirstRunSteps } from "./first-run-steps";
import { WorkspaceCard } from "./workspace-card";
import { WorkspaceFormDialog } from "./workspace-form-dialog";
import { WorkspaceSortSelect } from "./workspace-sort-select";
import {
    getDashboardTotals,
    getMostRecentWorkspace,
} from "../lib/dashboard";
import {
    DEFAULT_WORKSPACE_SORT,
    getWorkspaceSortOption,
    type WorkspaceSortKey,
} from "../lib/workspace-sort";
import { AppLogo } from "@/shared/components/brand/app-logo";
import { routes } from "@/shared/config/routes";
import { LoadError } from "@/shared/components/load-error";

type DashboardHomeProps = {
    userName?: string | null;
};

export function DashboardHome({ userName }: DashboardHomeProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] =
        useState<WorkspaceSortKey>(DEFAULT_WORKSPACE_SORT);
    const debouncedSearch = useDebouncedValue(search, 250).trim();
    const { sort, order } = getWorkspaceSortOption(sortKey);
    const {
        data: workspaces,
        isLoading,
        isPlaceholderData,
        error,
    } = useWorkspaces({ q: debouncedSearch || undefined, sort, order });
    // Form dialogs render their own errors inline.
    const createWorkspace = useCreateWorkspace({ suppressErrorToast: true });

    const [createOpen, setCreateOpen] = useState(false);
    const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(
        null,
    );
    const [deletingWorkspace, setDeletingWorkspace] =
        useState<Workspace | null>(null);

    const updateWorkspace = useUpdateWorkspace({ suppressErrorToast: true });
    const deleteWorkspace = useDeleteWorkspace();

    const firstName = userName?.trim().split(/\s+/)[0] || "there";
    // Unfiltered list for the totals and the "continue" shortcut. It shares its cache
    // entry with the grid whenever no search is active, so it costs no extra request.
    const { data: allWorkspaces } = useWorkspaces({
        sort: "updatedAt",
        order: "desc",
    });
    const totals = allWorkspaces ? getDashboardTotals(allWorkspaces) : undefined;
    const mostRecent = allWorkspaces
        ? getMostRecentWorkspace(allWorkspaces)
        : undefined;
    const hasNoNotebooks = allWorkspaces?.length === 0;

    return (
        <div className="bg-page min-h-svh">
            <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 md:px-8">
                    <AppLogo />

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            nativeButton={false}
                            variant="ghost"
                            size="sm"
                            className="hidden lg:inline-flex"
                            render={<Link href={routes.docs} />}
                        >
                            <BookOpenTextIcon aria-hidden="true" />
                            Guide
                        </Button>
                        <ModeToggle className="hidden sm:inline-flex" />
                        <UserMenu />
                    </div>
                </div>
            </header>

            <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 md:gap-10 md:px-8 md:py-10">
                <DashboardHero
                    firstName={firstName}
                    totals={totals}
                    onCreate={() => setCreateOpen(true)}
                />

                {mostRecent && !debouncedSearch ? (
                    <ContinueCard workspace={mostRecent} />
                ) : null}
                {hasNoNotebooks ? <FirstRunSteps /> : null}

                <section aria-labelledby="notebooks-title" className="space-y-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 id="notebooks-title" className="text-heading">
                                {debouncedSearch
                                    ? "Search results"
                                    : "Your notebooks"}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {workspaces?.length
                                    ? `${workspaces.length} notebook${workspaces.length === 1 ? "" : "s"}${debouncedSearch ? " found" : ""}`
                                    : debouncedSearch
                                      ? "No matches"
                                      : "Start with your first notebook"}
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
                            <div className="relative w-full sm:flex-1 lg:w-72 lg:flex-none">
                                <SearchIcon
                                    aria-hidden="true"
                                    className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                />
                                <Input
                                    type="search"
                                    aria-label="Search notebooks"
                                    value={search}
                                    maxLength={120}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search notebooks..."
                                    className="pl-9"
                                />
                            </div>
                            <WorkspaceSortSelect
                                value={sortKey}
                                onChange={setSortKey}
                                className="w-full sm:w-auto"
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="min-h-48 rounded-2xl sm:min-h-52"
                                />
                            ))}
                        </div>
                    ) : error ? (
                        <LoadError
                            error={error}
                            icon={BookOpenIcon}
                            title="Could not load notebooks"
                        />
                    ) : (
                        <div
                            aria-busy={isPlaceholderData}
                            className={cn(
                                "grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3",
                                isPlaceholderData && "opacity-60",
                            )}
                        >
                            <CreateWorkspaceCard
                                onClick={() => setCreateOpen(true)}
                            />

                            {workspaces?.map((workspace) => (
                                <WorkspaceCard
                                    key={workspace.id}
                                    workspace={workspace}
                                    onEdit={setEditingWorkspace}
                                    onDelete={setDeletingWorkspace}
                                />
                            ))}
                        </div>
                    )}

                    {!isLoading &&
                    !error &&
                    !isPlaceholderData &&
                    debouncedSearch &&
                    workspaces?.length === 0 ? (
                        <EmptyState
                            icon={SearchIcon}
                            title="No notebooks found"
                            description="Try a different search term or create a new notebook."
                        >
                            <Button onClick={() => setSearch("")}>
                                <XIcon aria-hidden="true" />
                                Clear search
                            </Button>
                        </EmptyState>
                    ) : null}
                </section>
            </main>

            <WorkspaceFormDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                isPending={createWorkspace.isPending}
                onSubmit={async (values) => {
                    const workspace = await createWorkspace.mutateAsync(values);
                    router.push(routes.workspace.chat(workspace.id));
                }}
            />

            <WorkspaceFormDialog
                open={Boolean(editingWorkspace)}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingWorkspace(null);
                    }
                }}
                workspace={editingWorkspace}
                isPending={updateWorkspace.isPending}
                onSubmit={async (values) => {
                    if (!editingWorkspace) {
                        return;
                    }
                    await updateWorkspace.mutateAsync({
                        workspaceId: editingWorkspace.id,
                        input: values,
                    });
                    setEditingWorkspace(null);
                }}
            />

            <DeleteWorkspaceDialog
                workspace={deletingWorkspace}
                open={Boolean(deletingWorkspace)}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingWorkspace(null);
                    }
                }}
                isPending={deleteWorkspace.isPending}
                onConfirm={async () => {
                    if (!deletingWorkspace) {
                        return;
                    }

                    await deleteWorkspace.mutateAsync(deletingWorkspace.id);
                    setDeletingWorkspace(null);
                }}
            />
        </div>
    );
}
