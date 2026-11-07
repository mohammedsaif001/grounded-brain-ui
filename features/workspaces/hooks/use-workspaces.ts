"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    useInvalidatingMutation,
    type MutationHookOptions,
} from "@/shared/hooks/use-invalidating-mutation";
import {
    createWorkspace,
    deleteWorkspace,
    getWorkspace,
    getWorkspaceSummary,
    listWorkspaces,
    updateWorkspace,
} from "../lib/api";
import type {
    CreateWorkspaceInput,
    UpdateWorkspaceInput,
    WorkspaceListParams,
} from "../lib/types";

export const workspaceKeys = {
    all: ["workspaces"] as const,
    /** Prefix shared by every list query, whatever its search and sort. */
    lists: () => [...workspaceKeys.all, "list"] as const,
    list: (params: WorkspaceListParams = {}) =>
        [...workspaceKeys.lists(), params] as const,
    summary: (workspaceId: string) =>
        [...workspaceKeys.all, "summary", workspaceId] as const,
    detail: (workspaceId: string) =>
        [...workspaceKeys.all, "detail", workspaceId] as const,
};

export function useWorkspaces(params: WorkspaceListParams = {}) {
    return useQuery({
        queryKey: workspaceKeys.list(params),
        queryFn: () => listWorkspaces(params),
        // Keep the grid on screen while a new search or sort loads.
        placeholderData: keepPreviousData,
    });
}

export function useWorkspace(workspaceId: string) {
    return useQuery({
        queryKey: workspaceKeys.detail(workspaceId),
        queryFn: () => getWorkspace(workspaceId),
    });
}

export function useCreateWorkspace(options?: MutationHookOptions) {
    return useInvalidatingMutation({
        mutationFn: (input: CreateWorkspaceInput) => createWorkspace(input),
        invalidates: () => [workspaceKeys.lists()],
        ...options,
    });
}

/** `workspaceId` is passed per call so one hook instance can edit any workspace. */
export function useUpdateWorkspace(options?: MutationHookOptions) {
    return useInvalidatingMutation({
        mutationFn: ({
            workspaceId,
            input,
        }: {
            workspaceId: string;
            input: UpdateWorkspaceInput;
        }) => updateWorkspace(workspaceId, input),
        updateCache: (queryClient, workspace) =>
            queryClient.setQueryData(
                workspaceKeys.detail(workspace.id),
                workspace,
            ),
        invalidates: () => [workspaceKeys.lists()],
        ...options,
    });
}

export function useDeleteWorkspace(options?: MutationHookOptions) {
    return useInvalidatingMutation({
        mutationFn: (workspaceId: string) => deleteWorkspace(workspaceId),
        updateCache: (queryClient, _data, workspaceId) =>
            queryClient.removeQueries({
                queryKey: workspaceKeys.detail(workspaceId),
            }),
        invalidates: () => [workspaceKeys.lists()],
        ...options,
    });
}
