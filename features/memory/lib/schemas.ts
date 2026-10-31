import { z } from "zod";

export const userMemorySchema = z.object({
    id: z.string(),
    memory: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    metadata: z.record(z.string(), z.unknown()).nullish(),
    categories: z.array(z.string()).optional(),
    source: z.enum(["manual", "learned"]),
});

export const userMemoryListSchema = z.array(userMemorySchema);
