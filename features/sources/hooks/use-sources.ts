"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import {
    useInvalidatingMutation,
    type MutationHookOptions,
} from "@/shared/hooks/use-invalidating-mutation";
import {
    bulkDeleteSources,
    createSource,
    deleteSource,
    getGithubFiles,
    getSource,
    importGithubSource,
    importWebSearchSource,
    importWebsiteSource,
    importYoutubeSource,
    listSources,
    reprocessSource,
    reprocessSources,
    syncGithubSource,
    uploadPdfSource,
} from "../lib/api";
import type {
    CreateSourceInput,
    ImportGithubInput,
    ImportWebSearchInput,
    ImportWebsiteInput,
    ImportYoutubeInput,
    Source,
    SourceFilters,
} from "../lib/types";

const POLL_INTERVAL_MS = 3_000;

export function sourceKeys(workspaceId: string) {
    const all = ["sources", workspaceId] as const;
    return {
        all,
        list: (filters: SourceFilters = {}) => [...all, "list", filters] as const,
        detail: (sourceId: string) => [...all, "detail", sourceId] as const,
        githubFiles: (sourceId: string) =>
            [...all, "detail", sourceId, "github-files"] as const,
    };
}

function isIngesting(source: Pick<Source, "status"> | undefined) {
    return source?.status === "PENDING" || source?.status === "PROCESSING";
}

export function useSources(workspaceId: string, filters: SourceFilters = {}) {
    const debouncedQuery = useDebouncedValue(filters.q ?? "", 300);
    const queryFilters: SourceFilters = {
        ...filters,
        q: debouncedQuery || undefined,
    };

    return useQuery({
        queryKey: sourceKeys(workspaceId).list(queryFilters),
        queryFn: () => listSources(workspaceId, queryFilters),
        // Poll only while something is being ingested.
        refetchInterval: (query) =>
            query.state.data?.some(isIngesting) ? POLL_INTERVAL_MS : false,
    });
}

export function useSource(workspaceId: string, sourceId: string) {
    return useQuery({
        queryKey: sourceKeys(workspaceId).detail(sourceId),
        queryFn: () => getSource(workspaceId, sourceId),
        refetchInterval: (query) =>
            isIngesting(query.state.data) ? POLL_INTERVAL_MS : false,
    });
}

export function useGithubFiles(
    workspaceId: string,
    sourceId: string,
    enabled: boolean,
) {
    return useQuery({
        queryKey: sourceKeys(workspaceId).githubFiles(sourceId),
        queryFn: () => getGithubFiles(workspaceId, sourceId),
        enabled,
    });
}

/** Mutations that add a source only need the workspace's source lists refreshed. */
function useAddSourceMutation<TInput>(
    workspaceId: string,
    mutationFn: (input: TInput) => Promise<Source>,
    options?: MutationHookOptions,
) {
    return useInvalidatingMutation({
        mutationFn,
        invalidates: () => [sourceKeys(workspaceId).all],
        ...options,
    });
}

export function useCreateSource(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useAddSourceMutation(
        workspaceId,
        (input: CreateSourceInput) => createSource(workspaceId, input),
        options,
    );
}

export function useUploadPdfSource(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useAddSourceMutation(
        workspaceId,
        ({ file, title }: { file: File; title?: string }) =>
            uploadPdfSource(workspaceId, file, title),
        options,
    );
}

export function useImportWebsiteSource(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useAddSourceMutation(
        workspaceId,
        (input: ImportWebsiteInput) => importWebsiteSource(workspaceId, input),
        options,
    );
}

export function useImportYoutubeSource(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useAddSourceMutation(
        workspaceId,
        (input: ImportYoutubeInput) => importYoutubeSource(workspaceId, input),
        options,
    );
}

export function useImportGithubSource(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useAddSourceMutation(
        workspaceId,
        (input: ImportGithubInput) => importGithubSource(workspaceId, input),
        options,
    );
}

export function useImportWebSearchSource(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useAddSourceMutation(
        workspaceId,
        (input: ImportWebSearchInput) =>
            importWebSearchSource(workspaceId, input),
        options,
    );
}

export function useDeleteSource(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useInvalidatingMutation({
        mutationFn: (sourceId: string) => deleteSource(workspaceId, sourceId),
        updateCache: (queryClient, _data, sourceId) =>
            queryClient.removeQueries({
                queryKey: sourceKeys(workspaceId).detail(sourceId),
            }),
        invalidates: () => [sourceKeys(workspaceId).all],
        ...options,
    });
}

export function useBulkDeleteSources(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useInvalidatingMutation({
        mutationFn: (sourceIds: string[]) =>
            bulkDeleteSources(workspaceId, sourceIds),
        invalidates: () => [sourceKeys(workspaceId).all],
        ...options,
    });
}

export function useReprocessSources(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useInvalidatingMutation({
        mutationFn: (sourceIds?: string[]) =>
            reprocessSources(workspaceId, sourceIds),
        invalidates: () => [sourceKeys(workspaceId).all],
        ...options,
    });
}

export function useReprocessSource(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useInvalidatingMutation({
        mutationFn: (sourceId: string) => reprocessSource(workspaceId, sourceId),
        invalidates: () => [sourceKeys(workspaceId).all],
        ...options,
    });
}

export function useSyncGithubSource(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useInvalidatingMutation({
        mutationFn: (sourceId: string) =>
            syncGithubSource(workspaceId, sourceId),
        invalidates: () => [sourceKeys(workspaceId).all],
        ...options,
    });
}
