import type { SortOrder, WorkspaceSort } from "./types";

export type WorkspaceSortKey = "updated" | "created" | "title";

type WorkspaceSortOption = {
    key: WorkspaceSortKey;
    label: string;
    sort: WorkspaceSort;
    order: SortOrder;
};

/** What the dashboard's sort menu offers, in display order. */
export const WORKSPACE_SORT_OPTIONS: readonly WorkspaceSortOption[] = [
    { key: "updated", label: "Last updated", sort: "updatedAt", order: "desc" },
    { key: "created", label: "Newest first", sort: "createdAt", order: "desc" },
    { key: "title", label: "Title A to Z", sort: "title", order: "asc" },
];

export const DEFAULT_WORKSPACE_SORT: WorkspaceSortKey = "updated";

export function getWorkspaceSortOption(key: WorkspaceSortKey) {
    return (
        WORKSPACE_SORT_OPTIONS.find((option) => option.key === key) ??
        WORKSPACE_SORT_OPTIONS[0]
    );
}
