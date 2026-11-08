import type { z } from "zod";
import type { workspaceSchema, workspaceSummarySchema } from "./schemas";

export type Workspace = z.infer<typeof workspaceSchema>;
export type WorkspaceSummary = z.infer<typeof workspaceSummarySchema>;

export const WORKSPACE_SORTS = ["updatedAt", "createdAt", "title"] as const;
export type WorkspaceSort = (typeof WORKSPACE_SORTS)[number];
export type SortOrder = "asc" | "desc";

export type WorkspaceListParams = {
    /** Matches title or description, case-insensitive. */
    q?: string;
    sort?: WorkspaceSort;
    order?: SortOrder;
};

export type CreateWorkspaceInput = {
    title: string;
    description?: string;
    icon?: string;
    defaultModel?: string;
};

export type UpdateWorkspaceInput = Partial<CreateWorkspaceInput>;
