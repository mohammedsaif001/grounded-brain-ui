import { z } from "zod";

export const sourceTypeSchema = z.enum([
    "PDF",
    "WEBSITE",
    "YOUTUBE",
    "TEXT",
    "MARKDOWN",
    "GITHUB",
]);

export const sourceStatusSchema = z.enum([
    "PENDING",
    "PROCESSING",
    "READY",
    "FAILED",
]);

const jsonObject = z.record(z.string(), z.unknown());

export const sourceSchema = z.object({
    id: z.string(),
    workspaceId: z.string(),
    type: sourceTypeSchema,
    title: z.string(),
    /** Omitted from list responses (paged or not); only the single-source GET carries it. */
    content: z.string().nullish(),
    url: z.string().nullable(),
    status: sourceStatusSchema,
    metadata: jsonObject.nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const sourceListSchema = z.array(sourceSchema);

export const sourceChunkSchema = z.object({
    id: z.string(),
    sourceId: z.string(),
    index: z.number(),
    content: z.string(),
    tokenCount: z.number().nullable(),
    metadata: jsonObject.nullable(),
    createdAt: z.string(),
});

export const sourceChunksResponseSchema = z.object({
    chunks: z.array(sourceChunkSchema),
    count: z.number(),
});

export const githubFilesResponseSchema = z.object({
    repo: z.string().nullable(),
    branch: z.string().nullable(),
    commitSha: z.string().nullable(),
    totalFiles: z.number().nullable(),
    truncated: z.boolean(),
    files: z.array(
        z.object({
            path: z.string(),
            size: z.number(),
            chunkCount: z.number(),
        }),
    ),
});

export const githubSyncResultSchema = z.object({
    source: sourceSchema,
    changed: z.boolean(),
});

/** Neither bulk endpoint is atomic: each id gets its own outcome. */
export const bulkDeleteResultSchema = z.object({
    deleted: z.number(),
    results: z.array(
        z.object({
            sourceId: z.string(),
            status: z.enum(["deleted", "not_found", "failed"]),
        }),
    ),
});

export const reprocessManyResultSchema = z.object({
    reprocessed: z.number(),
    results: z.array(
        z.object({
            sourceId: z.string(),
            // "skipped" means it is still PENDING or PROCESSING: already running, not an error.
            status: z.enum(["queued", "skipped", "not_found", "failed"]),
            reason: z.string().optional(),
        }),
    ),
});

export const reprocessOneResultSchema = z.object({
    reprocessed: z.boolean(),
});
