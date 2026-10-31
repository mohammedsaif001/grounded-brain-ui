"use client";

import { useQuery } from "@tanstack/react-query";
import {
    useInvalidatingMutation,
    type MutationHookOptions,
} from "@/shared/hooks/use-invalidating-mutation";
import {
    createWorkspace,
    deleteWorkspace,
    getWorkspace,
    listWorkspaces,
    updateWorkspace,
} from "../lib/api";
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from "../lib/types";

export const workspaceKeys = {
    all: ["workspaces"] as const,
    list: () => [...workspaceKeys.all, "list"] as const,
    detail: (workspaceId: string) =>
        [...workspaceKeys.all, "detail", workspaceId] as const,
};

export function useWorkspaces() {
    return useQuery({
        queryKey: workspaceKeys.list(),
        queryFn: listWorkspaces,
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
        invalidates: () => [workspaceKeys.list()],
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
        invalidates: () => [workspaceKeys.list()],
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
        invalidates: () => [workspaceKeys.list()],
        ...options,
    });
}
