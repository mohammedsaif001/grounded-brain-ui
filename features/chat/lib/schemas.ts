import { z } from "zod";

export const chatCitationSchema = z.object({
    sourceId: z.string().optional(),
    sourceTitle: z.string(),
    sourceType: z.string(),
    chunkId: z.string().optional(),
    chunkIndex: z.number().optional(),
    page: z.number().optional(),
    excerpt: z.string(),
    score: z.number().optional(),
    url: z.string().optional(),
    path: z.string().optional(),
});

/**
 * Citations are stored as free-form JSON next to each message. Keep the valid entries
 * and drop malformed ones, rather than failing the whole conversation over one bad item.
 */
const citationListSchema = z
    .array(z.unknown())
    .nullish()
    .transform((items) => {
        if (!items) {
            return null;
        }
        return items.flatMap((item) => {
            const parsed = chatCitationSchema.safeParse(item);
            return parsed.success ? [parsed.data] : [];
        });
    });

export const conversationSchema = z.object({
    id: z.string(),
    workspaceId: z.string(),
    title: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const chatMessageSchema = z.object({
    id: z.string(),
    conversationId: z.string(),
    role: z.enum(["USER", "ASSISTANT"]),
    content: z.string(),
    citations: citationListSchema,
    createdAt: z.string(),
});

export const conversationListSchema = z.array(conversationSchema);
export const chatMessageListSchema = z.array(chatMessageSchema);
