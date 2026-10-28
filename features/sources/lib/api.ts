import { apiFetch, parseApiResponse } from "@/shared/lib/api";
import type {
    CreateSourceInput,
    GithubFilesResponse,
    GithubSyncResult,
    ImportGithubInput,
    ImportWebsiteInput,
    ImportYoutubeInput,
    Source,
    SourceChunksResponse,
    SourceFilters,
} from "./types";

function buildSourcesPath(workspaceId: string, filters?: SourceFilters) {
    const params = new URLSearchParams();

    if (filters?.q) {
        params.set("q", filters.q);
    }

    if (filters?.type) {
        params.set("type", filters.type);
    }

    if (filters?.status) {
        params.set("status", filters.status);
    }

    const query = params.toString();
    return `/api/workspaces/${workspaceId}/sources${query ? `?${query}` : ""}`;
}

export function listSources(workspaceId: string, filters?: SourceFilters) {
    return apiFetch<Source[]>(buildSourcesPath(workspaceId, filters));
}

export function getSource(workspaceId: string, sourceId: string) {
    return apiFetch<Source>(
        `/api/workspaces/${workspaceId}/sources/${sourceId}`,
    );
}

export function getSourceChunks(workspaceId: string, sourceId: string) {
    return apiFetch<SourceChunksResponse>(
        `/api/workspaces/${workspaceId}/sources/${sourceId}/chunks`,
    );
}

export function createSource(workspaceId: string, input: CreateSourceInput) {
    return apiFetch<Source>(`/api/workspaces/${workspaceId}/sources`, {
        method: "POST",
        body: JSON.stringify(input),
    });
}

export function importWebsiteSource(
    workspaceId: string,
    input: ImportWebsiteInput,
) {
    return apiFetch<Source>(
        `/api/workspaces/${workspaceId}/sources/import/website`,
        {
            method: "POST",
            body: JSON.stringify(input),
        },
    );
}

export function importYoutubeSource(
    workspaceId: string,
    input: ImportYoutubeInput,
) {
    return apiFetch<Source>(
        `/api/workspaces/${workspaceId}/sources/import/youtube`,
        {
            method: "POST",
            body: JSON.stringify(input),
        },
    );
}

export async function uploadPdfSource(
    workspaceId: string,
    file: File,
    title?: string,
) {
    const formData = new FormData();
    formData.append("file", file);

    if (title?.trim()) {
        formData.append("title", title.trim());
    }

    const response = await fetch(
        `/api/workspaces/${workspaceId}/sources/upload`,
        {
            method: "POST",
            credentials: "include",
            body: formData,
        },
    );

    return parseApiResponse<Source>(response, "Upload failed");
}

export function importGithubSource(
    workspaceId: string,
    input: ImportGithubInput,
) {
    return apiFetch<Source>(
        `/api/workspaces/${workspaceId}/sources/import/github`,
        {
            method: "POST",
            body: JSON.stringify(input),
        },
    );
}

export function syncGithubSource(workspaceId: string, sourceId: string) {
    return apiFetch<GithubSyncResult>(
        `/api/workspaces/${workspaceId}/sources/${sourceId}/sync`,
        { method: "POST" },
    );
}

export function getGithubFiles(workspaceId: string, sourceId: string) {
    return apiFetch<GithubFilesResponse>(
        `/api/workspaces/${workspaceId}/sources/${sourceId}/files`,
    );
}

export function deleteSource(workspaceId: string, sourceId: string) {
    return apiFetch<void>(
        `/api/workspaces/${workspaceId}/sources/${sourceId}`,
        { method: "DELETE" },
    );
}

export function bulkDeleteSources(workspaceId: string, sourceIds: string[]) {
    return apiFetch<void>(
        `/api/workspaces/${workspaceId}/sources/bulk-delete`,
        {
            method: "POST",
            body: JSON.stringify({ sourceIds }),
        },
    );
}

export function reprocessSources(
    workspaceId: string,
    sourceIds?: string[],
) {
    return apiFetch<{ reprocessed: number }>(
        `/api/workspaces/${workspaceId}/sources/reprocess`,
        {
            method: "POST",
            body: JSON.stringify(
                sourceIds?.length ? { sourceIds } : {},
            ),
        },
    );
}

export function reprocessSource(workspaceId: string, sourceId: string) {
    return apiFetch<{ reprocessed: boolean }>(
        `/api/workspaces/${workspaceId}/sources/${sourceId}/reprocess`,
        { method: "POST" },
    );
}

export function importWebSearchSource(
    workspaceId: string,
    input: { title: string; content: string; url: string },
) {
    return apiFetch<Source>(
        `/api/workspaces/${workspaceId}/sources/import/web-search`,
        {
            method: "POST",
            body: JSON.stringify(input),
        },
    );
}
