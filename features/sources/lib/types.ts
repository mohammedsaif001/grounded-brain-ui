import type { z } from "zod";
import type {
    githubFilesResponseSchema,
    githubSyncResultSchema,
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
