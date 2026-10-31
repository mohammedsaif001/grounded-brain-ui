import type { z } from "zod";
import type {
    chatCitationSchema,
    chatMessageSchema,
    conversationSchema,
} from "./schemas";

export type ChatCitation = z.infer<typeof chatCitationSchema>;
export type Conversation = z.infer<typeof conversationSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
