import { apiFetch, apiPath } from "@/shared/lib/api";
import {
    workspaceListSchema,
    workspaceSchema,
    workspaceSummarySchema,
} from "./schemas";
import type {
    CreateWorkspaceInput,
    UpdateWorkspaceInput,
    WorkspaceListParams,
} from "./types";

export function listWorkspaces({ q, sort, order }: WorkspaceListParams = {}) {
    const params = new URLSearchParams();
    if (q?.trim()) params.set("q", q.trim());
    if (sort) params.set("sort", sort);
    if (order) params.set("order", order);
    const query = params.toString();

    return apiFetch(`/api/workspaces${query ? `?${query}` : ""}`, {
        schema: workspaceListSchema,
    });
}

export function getWorkspaceSummary(workspaceId: string) {
    return apiFetch(apiPath`/api/workspaces/${workspaceId}/summary`, {
        schema: workspaceSummarySchema,
    });
}

export function getWorkspace(workspaceId: string) {
    return apiFetch(apiPath`/api/workspaces/${workspaceId}`, {
        schema: workspaceSchema,
    });
}

export function createWorkspace(input: CreateWorkspaceInput) {
    return apiFetch("/api/workspaces", {
        method: "POST",
        body: input,
        schema: workspaceSchema,
    });
}

export function updateWorkspace(
    workspaceId: string,
    input: UpdateWorkspaceInput,
) {
    return apiFetch(apiPath`/api/workspaces/${workspaceId}`, {
        method: "PATCH",
        body: input,
        schema: workspaceSchema,
    });
}

export function deleteWorkspace(workspaceId: string) {
    return apiFetch(apiPath`/api/workspaces/${workspaceId}`, {
        method: "DELETE",
    });
}
