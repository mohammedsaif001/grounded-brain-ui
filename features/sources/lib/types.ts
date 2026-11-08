import type { z } from "zod";
import type {
    bulkDeleteResultSchema,
    githubFilesResponseSchema,
    githubSyncResultSchema,
    reprocessManyResultSchema,
    sourceChunkSchema,
    sourceChunksResponseSchema,
    sourceSchema,
    sourceStatusSchema,
    sourceTypeSchema,
} from "./schemas";

export type SourceType = z.infer<typeof sourceTypeSchema>;
export type SourceStatus = z.infer<typeof sourceStatusSchema>;
export type Source = z.infer<typeof sourceSchema>;
export type SourceChunk = z.infer<typeof sourceChunkSchema>;
export type SourceChunksResponse = z.infer<typeof sourceChunksResponseSchema>;
export type GithubFilesResponse = z.infer<typeof githubFilesResponseSchema>;
export type GithubFile = GithubFilesResponse["files"][number];
export type GithubSyncResult = z.infer<typeof githubSyncResultSchema>;

export type BulkDeleteResult = z.infer<typeof bulkDeleteResultSchema>;
export type ReprocessManyResult = z.infer<typeof reprocessManyResultSchema>;

export type SourcePageParams = {
    /** 1-100. */
    limit: number;
    /** The previous page's `meta.nextCursor`. */
    cursor?: string;
};

export type SourceFilters = {
    q?: string;
    type?: SourceType;
    status?: SourceStatus;
};

export type CreateSourceInput = {
    type: "TEXT" | "MARKDOWN";
    title: string;
    content: string;
};

export type ImportWebsiteInput = {
    url: string;
    title?: string;
};

export type ImportYoutubeInput = {
    url: string;
    title?: string;
};

export type ImportGithubInput = {
    url: string;
    branch?: string;
    title?: string;
};

export type ImportWebSearchInput = {
    title: string;
    content: string;
    url: string;
};

export type UpdateSourceInput = {
    /** 1-200 characters. Allowed for every source type; no re-index. */
    title?: string;
    /** TEXT and MARKDOWN only. Replaces the text and re-indexes the source. */
    content?: string;
    /** The `updatedAt` last read; a mismatch fails with 409 `CONFLICT`. */
    expectedUpdatedAt?: string;
};

/** Only these types accept a content edit; the API answers 400 for the rest. */
export function isContentEditable(type: SourceType) {
    return type === "TEXT" || type === "MARKDOWN";
}
