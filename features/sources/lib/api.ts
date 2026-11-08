import { apiFetch, apiFetchPage, apiPath } from "@/shared/lib/api";
import {
    bulkDeleteResultSchema,
    githubFilesResponseSchema,
    githubSyncResultSchema,
    reprocessManyResultSchema,
    reprocessOneResultSchema,
    sourceChunksResponseSchema,
    sourceListSchema,
    sourceSchema,
} from "./schemas";
import type {
    CreateSourceInput,
    ImportGithubInput,
    ImportWebSearchInput,
    ImportWebsiteInput,
    ImportYoutubeInput,
    SourceFilters,
    SourcePageParams,
} from "./types";

const sourcesPath = (workspaceId: string) =>
    apiPath`/api/workspaces/${workspaceId}/sources`;

const sourcePath = (workspaceId: string, sourceId: string) =>
    apiPath`/api/workspaces/${workspaceId}/sources/${sourceId}`;

function sourcesUrl(
    workspaceId: string,
    filters: SourceFilters,
    page?: SourcePageParams,
) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
        if (value) {
            params.set(key, value);
        }
    }
    if (page) {
        params.set("limit", String(page.limit));
        if (page.cursor) {
            params.set("cursor", page.cursor);
        }
    }
    const query = params.toString();

    return `${sourcesPath(workspaceId)}${query ? `?${query}` : ""}`;
}

/** Every matching source, unpaginated. For small previews such as the sidebar. */
export function listSources(workspaceId: string, filters: SourceFilters = {}) {
    return apiFetch(sourcesUrl(workspaceId, filters), {
        schema: sourceListSchema,
    });
}

/** One page of sources plus `meta.total` across all pages. */
export function listSourcesPage(
    workspaceId: string,
    filters: SourceFilters,
    page: SourcePageParams,
) {
    return apiFetchPage(sourcesUrl(workspaceId, filters, page), sourceSchema);
}

export function getSource(workspaceId: string, sourceId: string) {
    return apiFetch(sourcePath(workspaceId, sourceId), {
        schema: sourceSchema,
    });
}

export function getSourceChunks(workspaceId: string, sourceId: string) {
    return apiFetch(`${sourcePath(workspaceId, sourceId)}/chunks`, {
        schema: sourceChunksResponseSchema,
    });
}

export function createSource(workspaceId: string, input: CreateSourceInput) {
    return apiFetch(sourcesPath(workspaceId), {
        method: "POST",
        body: input,
        schema: sourceSchema,
    });
}

export function importWebsiteSource(
    workspaceId: string,
    input: ImportWebsiteInput,
) {
    return apiFetch(`${sourcesPath(workspaceId)}/import/website`, {
        method: "POST",
        body: input,
        schema: sourceSchema,
    });
}

export function importYoutubeSource(
    workspaceId: string,
    input: ImportYoutubeInput,
) {
    return apiFetch(`${sourcesPath(workspaceId)}/import/youtube`, {
        method: "POST",
        body: input,
        schema: sourceSchema,
    });
}

export function importGithubSource(
    workspaceId: string,
    input: ImportGithubInput,
) {
    return apiFetch(`${sourcesPath(workspaceId)}/import/github`, {
        method: "POST",
        body: input,
        schema: sourceSchema,
    });
}

export function importWebSearchSource(
    workspaceId: string,
    input: ImportWebSearchInput,
) {
    return apiFetch(`${sourcesPath(workspaceId)}/import/web-search`, {
        method: "POST",
        body: input,
        schema: sourceSchema,
    });
}

export function uploadPdfSource(
    workspaceId: string,
    file: File,
    title?: string,
) {
    const formData = new FormData();
    formData.append("file", file);
    if (title?.trim()) {
        formData.append("title", title.trim());
    }

    return apiFetch(`${sourcesPath(workspaceId)}/upload`, {
        method: "POST",
        body: formData,
        schema: sourceSchema,
    });
}

export function syncGithubSource(workspaceId: string, sourceId: string) {
    return apiFetch(`${sourcePath(workspaceId, sourceId)}/sync`, {
        method: "POST",
        schema: githubSyncResultSchema,
    });
}

export function getGithubFiles(workspaceId: string, sourceId: string) {
    return apiFetch(`${sourcePath(workspaceId, sourceId)}/files`, {
        schema: githubFilesResponseSchema,
    });
}

export function deleteSource(workspaceId: string, sourceId: string) {
    return apiFetch(sourcePath(workspaceId, sourceId), { method: "DELETE" });
}

export function bulkDeleteSources(workspaceId: string, sourceIds: string[]) {
    return apiFetch(`${sourcesPath(workspaceId)}/bulk-delete`, {
        method: "POST",
        body: { sourceIds },
        schema: bulkDeleteResultSchema,
    });
}

export function reprocessSources(workspaceId: string, sourceIds?: string[]) {
    return apiFetch(`${sourcesPath(workspaceId)}/reprocess`, {
        method: "POST",
        body: sourceIds?.length ? { sourceIds } : {},
        schema: reprocessManyResultSchema,
    });
}

export function reprocessSource(workspaceId: string, sourceId: string) {
    return apiFetch(`${sourcePath(workspaceId, sourceId)}/reprocess`, {
        method: "POST",
        schema: reprocessOneResultSchema,
    });
}
