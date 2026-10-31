import { apiFetch, apiPath } from "@/shared/lib/api";
import {
    chatMessageListSchema,
    conversationListSchema,
    conversationSchema,
} from "./schemas";

const conversationsPath = (workspaceId: string) =>
    apiPath`/api/workspaces/${workspaceId}/conversations`;

/** Streaming endpoint consumed by the AI SDK transport. */
export const chatStreamPath = (workspaceId: string) =>
    apiPath`/api/workspaces/${workspaceId}/chat`;

export function listConversations(workspaceId: string) {
    return apiFetch(conversationsPath(workspaceId), {
        schema: conversationListSchema,
    });
}

export function createConversation(workspaceId: string, title?: string) {
    return apiFetch(conversationsPath(workspaceId), {
        method: "POST",
        body: title ? { title } : {},
        schema: conversationSchema,
    });
}

export function listConversationMessages(
    workspaceId: string,
    conversationId: string,
) {
    return apiFetch(
        `${conversationsPath(workspaceId)}/${encodeURIComponent(conversationId)}/messages`,
        { schema: chatMessageListSchema },
    );
}

export function deleteConversation(
    workspaceId: string,
    conversationId: string,
) {
    return apiFetch(
        `${conversationsPath(workspaceId)}/${encodeURIComponent(conversationId)}`,
        { method: "DELETE" },
    );
}
