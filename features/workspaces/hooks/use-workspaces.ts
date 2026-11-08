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

const SUMMARY_POLL_INTERVAL_MS = 5_000;

/**
 * Sidebar counts and the Learn activity dot. Four cheap COUNT queries server-side.
 * It polls only while an artifact is generating, so the dot appears on its own.
 * Source and artifact mutations invalidate it. It does not poll for unfinished
 * sources: a FAILED source never becomes READY and would poll forever.
 */
export function useWorkspaceSummary(workspaceId: string) {
    return useQuery({
        queryKey: workspaceKeys.summary(workspaceId),
        queryFn: () => getWorkspaceSummary(workspaceId),
        refetchInterval: (query) =>
            (query.state.data?.processingArtifactCount ?? 0) > 0
                ? SUMMARY_POLL_INTERVAL_MS
                : false,
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
