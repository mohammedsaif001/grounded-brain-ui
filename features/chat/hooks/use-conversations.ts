"use client";

import { useQuery } from "@tanstack/react-query";
import {
    useInvalidatingMutation,
    type MutationHookOptions,
} from "@/shared/hooks/use-invalidating-mutation";
import {
    createConversation,
    deleteConversation,
    listConversationMessages,
    listConversations,
    renameConversation,
} from "../lib/api";
import type { ChatCitation, ChatMessage } from "../lib/types";

export function chatKeys(workspaceId: string) {
    const all = ["chat", workspaceId] as const;
    return {
        all,
        conversations: () => [...all, "conversations"] as const,
        messages: (conversationId: string) =>
            [...all, "messages", conversationId] as const,
    };
}

export function useConversations(workspaceId: string) {
    return useQuery({
        queryKey: chatKeys(workspaceId).conversations(),
        queryFn: () => listConversations(workspaceId),
    });
}

export function useConversationMessages(
    workspaceId: string,
    conversationId: string | null,
) {
    return useQuery({
        queryKey: chatKeys(workspaceId).messages(conversationId ?? ""),
        queryFn: () =>
            listConversationMessages(workspaceId, conversationId as string),
        enabled: conversationId !== null,
    });
}

export function useCreateConversation(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useInvalidatingMutation({
        mutationFn: (title?: string) => createConversation(workspaceId, title),
        invalidates: () => [chatKeys(workspaceId).conversations()],
        ...options,
    });
}

export function useRenameConversation(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useInvalidatingMutation({
        mutationFn: ({
            conversationId,
            title,
        }: {
            conversationId: string;
            title: string;
        }) => renameConversation(workspaceId, conversationId, title),
        invalidates: () => [chatKeys(workspaceId).conversations()],
        ...options,
    });
}

export function useDeleteConversation(
    workspaceId: string,
    options?: MutationHookOptions,
) {
    return useInvalidatingMutation({
        mutationFn: (conversationId: string) =>
            deleteConversation(workspaceId, conversationId),
        updateCache: (queryClient, _data, conversationId) =>
            queryClient.removeQueries({
                queryKey: chatKeys(workspaceId).messages(conversationId),
            }),
        invalidates: () => [chatKeys(workspaceId).conversations()],
        ...options,
    });
}

/** Indexes assistant-message citations by message id. */
export function buildCitationMap(messages: ChatMessage[]) {
    const map: Record<string, ChatCitation[]> = {};

    for (const message of messages) {
        if (message.role === "ASSISTANT" && message.citations?.length) {
            map[message.id] = message.citations;
        }
    }

    return map;
}
