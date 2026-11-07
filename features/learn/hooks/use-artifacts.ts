"use client";

import { useQuery } from "@tanstack/react-query";
import { workspaceKeys } from "@/features/workspaces/hooks/use-workspaces";
import {
    useInvalidatingMutation,
    type MutationHookOptions,
} from "@/shared/hooks/use-invalidating-mutation";
import {
    createArtifact,
    deleteArtifact,
    getArtifact,
    listArtifacts,
} from "../lib/api";
import type { CreateArtifactInput, LearningArtifact } from "../lib/types";

const POLL_INTERVAL_MS = 3_000;

export function artifactKeys(workspaceId: string) {
    const all = ["artifacts", workspaceId] as const;
    return {
        all,
        list: () => [...all, "list"] as const,
        detail: (artifactId: string) => [...all, "detail", artifactId] as const,
    };
}

function isGenerating(artifact: Pick<LearningArtifact, "status"> | undefined) {
    return artifact?.status === "PENDING" || artifact?.status === "PROCESSING";
}

export function useArtifacts(workspaceId: string) {
    return useQuery({
        queryKey: artifactKeys(workspaceId).list(),
        queryFn: () => listArtifacts(workspaceId),
        refetchInterval: (query) =>
            query.state.data?.some(isGenerating) ? POLL_INTERVAL_MS : false,
    });
}

export function useArtifact(workspaceId: string, artifactId: string) {
    return useQuery({
        queryKey: artifactKeys(workspaceId).detail(artifactId),
        queryFn: () => getArtifact(workspaceId, artifactId),
        refetchInterval: (query) =>
            isGenerating(query.state.data) ? POLL_INTERVAL_MS : false,
    });
}

export function useCreateArtifact(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useInvalidatingMutation({
        mutationFn: (input: CreateArtifactInput) =>
            createArtifact(workspaceId, input),
        invalidates: () => [
            artifactKeys(workspaceId).all,
            workspaceKeys.summary(workspaceId),
            // Notebook cards show these counts.
            workspaceKeys.lists(),
        ],
        ...options,
    });
}

export function useDeleteArtifact(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useInvalidatingMutation({
        mutationFn: (artifactId: string) =>
            deleteArtifact(workspaceId, artifactId),
        updateCache: (queryClient, _data, artifactId) =>
            queryClient.removeQueries({
                queryKey: artifactKeys(workspaceId).detail(artifactId),
            }),
        invalidates: () => [
            artifactKeys(workspaceId).all,
            workspaceKeys.summary(workspaceId),
            // Notebook cards show these counts.
            workspaceKeys.lists(),
        ],
        ...options,
    });
}
