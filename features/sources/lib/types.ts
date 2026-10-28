export type SourceType = "PDF" | "WEBSITE" | "YOUTUBE" | "TEXT" | "MARKDOWN" | "GITHUB";

export type SourceStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

export type Source = {
    id: string;
    workspaceId: string;
    type: SourceType;
    title: string;
    content: string | null;
    url: string | null;
    status: SourceStatus;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
};

export type SourceFilters = {
    q?: string;
    type?: SourceType;
    status?: SourceStatus;
};

export type CreateTextSourceInput = {
    type: "TEXT";
    title: string;
    content: string;
};

export type CreateMarkdownSourceInput = {
    type: "MARKDOWN";
    title: string;
    content: string;
};

export type CreateSourceInput =
    | CreateTextSourceInput
    | CreateMarkdownSourceInput;

export type ImportWebsiteInput = {
    url: string;
    title?: string;
};

export type ImportYoutubeInput = {
    url: string;
    title?: string;
};

export type SourceChunk = {
    id: string;
    sourceId: string;
    index: number;
    content: string;
    tokenCount: number | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
};

export type SourceChunksResponse = {
    chunks: SourceChunk[];
    count: number;
};

export type ImportGithubInput = {
    url: string;
    branch?: string;
    title?: string;
};

export type GithubFile = {
    path: string;
    size: number;
    chunkCount: number;
};

export type GithubFilesResponse = {
    repo: string | null;
    branch: string | null;
    commitSha: string | null;
    totalFiles: number | null;
    truncated: boolean;
    files: GithubFile[];
};

export type GithubSyncResult = {
    source: Source;
    changed: boolean;
};
