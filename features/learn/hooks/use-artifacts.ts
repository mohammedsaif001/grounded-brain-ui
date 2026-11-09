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
    markArtifactViewed,
    regenerateArtifact,
    updateArtifact,
} from "../lib/api";
import type {
    CreateArtifactInput,
    LearningArtifact,
    UpdateArtifactInput,
} from "../lib/types";

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

/** Clears the "new" state. Failing is harmless, so it never raises a toast. */
export function useMarkArtifactViewed(workspaceId: string) {
    return useInvalidatingMutation({
        mutationFn: (artifactId: string) =>
            markArtifactViewed(workspaceId, artifactId),
        invalidates: () => [
            artifactKeys(workspaceId).all,
            workspaceKeys.summary(workspaceId),
        ],
        suppressErrorToast: true,
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

/** Saves a rename and/or content edit; the detail cache is replaced with the saved artifact. */
export function useUpdateArtifact(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useInvalidatingMutation({
        mutationFn: ({
            artifactId,
            input,
        }: {
            artifactId: string;
            input: UpdateArtifactInput;
        }) => updateArtifact(workspaceId, artifactId, input),
        updateCache: (queryClient, artifact) =>
            queryClient.setQueryData(
                artifactKeys(workspaceId).detail(artifact.id),
                artifact,
            ),
        invalidates: () => [artifactKeys(workspaceId).list()],
        ...options,
    });
}

/** Re-runs generation in place; the artifact comes back `PENDING` and `useArtifact` polls it. */
export function useRegenerateArtifact(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useInvalidatingMutation({
        mutationFn: ({
            artifactId,
            force,
        }: {
            artifactId: string;
            force?: boolean;
        }) => regenerateArtifact(workspaceId, artifactId, force),
        updateCache: (queryClient, artifact) =>
            queryClient.setQueryData(
                artifactKeys(workspaceId).detail(artifact.id),
                artifact,
            ),
        invalidates: () => [artifactKeys(workspaceId).list()],
        ...options,
    });
}
