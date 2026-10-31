import { apiFetch, apiPath } from "@/shared/lib/api";
import { workspaceListSchema, workspaceSchema } from "./schemas";
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from "./types";

export function listWorkspaces() {
    return apiFetch("/api/workspaces", { schema: workspaceListSchema });
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
