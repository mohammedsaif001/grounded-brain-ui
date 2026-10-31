import { z } from "zod";

export const workspaceSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    icon: z.string().nullable(),
    defaultModel: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const workspaceListSchema = z.array(workspaceSchema);
