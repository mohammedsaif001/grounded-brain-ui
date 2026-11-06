"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheckIcon } from "lucide-react";
import {
    MessageScroller,
    MessageScrollerButton,
    MessageScrollerContent,
    MessageScrollerItem,
    MessageScrollerProvider,
    MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { MessageGroup } from "@/components/ui/message";
import { Skeleton } from "@/components/ui/skeleton";
import { useSources } from "@/features/sources/hooks/use-sources";
import { PageHeader } from "@/shared/components/page-header";
import {
    buildCitationMap,
    chatKeys,
    useConversationMessages,
    useConversations,
    useDeleteConversation,
} from "../hooks/use-conversations";
import { ChatComposer } from "./chat-composer";
import { ChatEmptyState } from "./chat-empty-state";
import { ChatToolbar } from "./chat-toolbar";
import { AssistantTurn, UserTurn } from "./chat-turns";
import { CitationPanel } from "./citation-panel";
import {
    CitationSelectionProvider,
    useCitationSelection,
} from "./citation-selection";
import { LearnPromptCard } from "./learn-prompt-card";
import { useWorkspaceChatPrefs } from "../stores/chat-preferences";
import { chatStreamPath } from "../lib/api";
import { exportConversationMarkdown } from "../lib/export-chat";
import { downloadMarkdown } from "@/shared/lib/download";
import { routes } from "@/shared/config/routes";

type WorkspaceChatProps = {
    workspaceId: string;
    defaultModel?: string;
};

function getMessageText(message: UIMessage) {
    return message.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("");
}

export function WorkspaceChat({
    workspaceId,
    defaultModel,
}: WorkspaceChatProps) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const askPrompt = searchParams.get("ask");
    const handledAskPrompt = useRef<string | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);

    const chatPrefs = useWorkspaceChatPrefs(workspaceId, defaultModel);

    const { data: conversations = [], isLoading: conversationsLoading } =
        useConversations(workspaceId);
    const { data: storedMessages, isLoading: messagesLoading } =
        useConversationMessages(workspaceId, conversationId);
    const deleteConversation = useDeleteConversation(workspaceId);
    const { data: sources } = useSources(workspaceId);

    // Citations come from the persisted messages; derived, never copied into state.
    const citationsByMessageId = useMemo(
        () => (storedMessages ? buildCitationMap(storedMessages) : {}),
        [storedMessages],
    );

    const activeConversation = conversations.find(
        (conversation) => conversation.id === conversationId,
    );

    const handleConversationId = useCallback(
        (id: string) => {
            setConversationId(id);
            void queryClient.invalidateQueries({
                queryKey: chatKeys(workspaceId).conversations(),
            });
        },
        [queryClient, workspaceId],
    );

    const transport = useMemo(
        () =>
            new DefaultChatTransport({
                api: chatStreamPath(workspaceId),
                credentials: "include",
                // The API loads history from the database and reads only the newest
                // message, so do not upload the whole transcript on every turn.
                prepareSendMessagesRequest: ({ messages }) => ({
                    body: {
                        messages: messages.slice(-1),
                        ...(conversationId ? { conversationId } : {}),
                        model: chatPrefs.model,
                        webSearch: chatPrefs.webSearch,
                    },
                }),
                fetch: async (url, init) => {
                    const response = await fetch(url, {
                        ...init,
                        credentials: "include",
                    });

                    const newConversationId =
                        response.headers.get("X-Conversation-Id");
                    if (newConversationId) {
                        handleConversationId(newConversationId);
                    }

                    return response;
                },
            }),
        [
            workspaceId,
            conversationId,
            handleConversationId,
            chatPrefs.model,
            chatPrefs.webSearch,
        ],
    );

    const { messages, sendMessage, setMessages, status, error } = useChat({
        transport,
    });

    const isStreaming = status === "streaming" || status === "submitted";

    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            return;
        }

        if (!storedMessages || isStreaming) {
            return;
        }

        setMessages(
            storedMessages.map((message) => ({
                id: message.id,
                role: message.role === "USER" ? "user" : "assistant",
                parts: [{ type: "text" as const, text: message.content }],
            })),
        );
    }, [conversationId, storedMessages, setMessages, isStreaming]);

    useEffect(() => {
        if (status !== "ready" || !conversationId) {
            return;
        }

        void queryClient.invalidateQueries({
            queryKey: chatKeys(workspaceId).messages(conversationId),
        });
    }, [status, conversationId, queryClient, workspaceId]);

    useEffect(() => {
        if (
            !askPrompt ||
            status !== "ready" ||
            conversationId ||
            messages.length > 0 ||
            handledAskPrompt.current === askPrompt
        ) {
            return;
        }

        handledAskPrompt.current = askPrompt;
        void sendMessage({ text: askPrompt });
        router.replace(routes.workspace.chat(workspaceId));
    }, [
        askPrompt,
        status,
        conversationId,
        messages.length,
        sendMessage,
        router,
        workspaceId,
    ]);

    function handleNewChat() {
        setConversationId(null);
        setMessages([]);
    }

    function handleDeleteConversation() {
        if (!conversationId) {
            return;
        }

        deleteConversation.mutate(conversationId, {
            onSuccess: handleNewChat,
        });
    }

    function handleExportChat() {
        if (messages.length === 0) {
            return;
        }

        const markdown = exportConversationMarkdown({
            conversation: activeConversation ?? null,
            messages,
            citationsByMessageId,
        });
        const slug =
            activeConversation?.title?.replace(/[^\w-]+/g, "-").toLowerCase() ??
            "chat";
        downloadMarkdown(markdown, `${slug}-${Date.now()}.md`);
    }

    const readySourceCount =
        sources?.filter((source) => source.status === "READY").length ?? 0;
    const isLoadingHistory = conversationsLoading || messagesLoading;

    return (
        <CitationSelectionProvider>
            <div className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 gap-6 p-6 md:p-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
                <div className="flex min-h-0 flex-col gap-5">
                    <PageHeader
                        title={activeConversation?.title ?? "Chat"}
                        description="Chat with your sources. Follow every thought back to its roots."
                        actions={
                            <ChatToolbar
                                conversations={conversations}
                                conversationId={conversationId}
                                onSelectConversation={(id) =>
                                    id ? setConversationId(id) : handleNewChat()
                                }
                                onNewChat={handleNewChat}
                                onExport={handleExportChat}
                                onDelete={handleDeleteConversation}
                                canExport={messages.length > 0}
                                isDeleting={deleteConversation.isPending}
                            />
                        }
                    />

                    <p className="text-caption flex items-center gap-2">
                        <ShieldCheckIcon
                            aria-hidden="true"
                            className="size-4"
                        />
                        {readySourceCount} ready source
                        {readySourceCount === 1 ? "" : "s"} selected ·
                        Source-grounded answers
                    </p>

                    <MessageScrollerProvider>
                        <MessageScroller className="min-h-0 flex-1">
                            <MessageScrollerViewport>
                                <MessageScrollerContent className="w-full pb-2">
                                    {isLoadingHistory ? (
                                        <div
                                            aria-busy="true"
                                            className="space-y-4"
                                        >
                                            <Skeleton className="h-14 rounded-2xl" />
                                            <Skeleton className="h-56 rounded-2xl" />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <ChatEmptyState
                                            disabled={isStreaming}
                                            onPick={(prompt) =>
                                                void sendMessage({
                                                    text: prompt,
                                                })
                                            }
                                        />
                                    ) : (
                                        <MessageGroup className="gap-5">
                                            {messages.map(
                                                (message, messageIndex) => {
                                                    const isUser =
                                                        message.role === "user";
                                                    const text =
                                                        getMessageText(message);
                                                    const isAnimating =
                                                        !isUser &&
                                                        isStreaming &&
                                                        messageIndex ===
                                                            messages.length - 1;

                                                    return (
                                                        <MessageScrollerItem
                                                            key={message.id}
                                                            scrollAnchor
                                                        >
                                                            {isUser ? (
                                                                <UserTurn
                                                                    text={text}
                                                                />
                                                            ) : (
                                                                <AssistantTurn
                                                                    text={text}
                                                                    workspaceId={
                                                                        workspaceId
                                                                    }
                                                                    citations={
                                                                        citationsByMessageId[
                                                                            message
                                                                                .id
                                                                        ]
                                                                    }
                                                                    isAnimating={
                                                                        isAnimating
                                                                    }
                                                                />
                                                            )}
                                                        </MessageScrollerItem>
                                                    );
                                                },
                                            )}
                                        </MessageGroup>
                                    )}
                                </MessageScrollerContent>
                            </MessageScrollerViewport>
                            <MessageScrollerButton direction="end" />
                        </MessageScroller>
                    </MessageScrollerProvider>

                    {error ? (
                        <p
                            role="alert"
                            className="rounded-xl bg-tint-rose px-4 py-2.5 text-sm text-tint-rose-foreground"
                        >
                            {error.message}
                        </p>
                    ) : null}

                    <ChatComposer
                        isStreaming={isStreaming}
                        webSearchEnabled={chatPrefs.webSearch}
                        onWebSearchChange={chatPrefs.setWebSearch}
                        sourceCount={readySourceCount}
                        onSubmit={(text) => {
                            void sendMessage({ text });
                        }}
                    />
                </div>

                <ChatSidePanel workspaceId={workspaceId} />
            </div>
        </CitationSelectionProvider>
    );
}

/** Right column: the opened citation passage (when any) and the Learn prompt. */
function ChatSidePanel({ workspaceId }: { workspaceId: string }) {
    const selection = useCitationSelection();

    return (
        <aside className="hidden min-h-0 flex-col gap-4 overflow-y-auto xl:flex">
            {selection?.selected ? (
                <CitationPanel
                    workspaceId={workspaceId}
                    selection={selection.selected}
                    onClose={selection.clear}
                />
            ) : null}
            <LearnPromptCard workspaceId={workspaceId} />
        </aside>
    );
}
