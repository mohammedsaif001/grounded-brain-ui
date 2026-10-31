import { z } from "zod";

export const artifactTypeSchema = z.enum([
    "SUMMARY",
    "TAKEAWAYS",
    "FLASHCARDS",
    "QUIZ",
    "MINDMAP",
    "REPORT",
    "WIKI",
]);

export const artifactStatusSchema = z.enum([
    "PENDING",
    "PROCESSING",
    "READY",
    "FAILED",
]);

export const learningArtifactSchema = z.object({
    id: z.string(),
    workspaceId: z.string(),
    type: artifactTypeSchema,
    title: z.string(),
    // Shape depends on `type`; each viewer narrows it.
    content: z.record(z.string(), z.unknown()).nullable(),
    sourceIds: z.array(z.string()),
    status: artifactStatusSchema,
    metadata: z.record(z.string(), z.unknown()).nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const learningArtifactListSchema = z.array(learningArtifactSchema);
