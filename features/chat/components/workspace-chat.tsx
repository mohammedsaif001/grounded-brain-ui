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
import { Skeleton } from "@/components/ui/skeleton";
import { useSources } from "@/features/sources/hooks/use-sources";
import { PageHeader } from "@/shared/components/page-header";
import {
    buildCitationMap,
    chatKeys,
    useConversationMessages,
    useConversations,
    useDeleteConversation,
    useRenameConversation,
} from "../hooks/use-conversations";
import { ChatComposer } from "./chat-composer";
import { ChatEmptyState } from "./chat-empty-state";
import { ChatToolbar } from "./chat-toolbar";
import {
    AssistantErrorTurn,
    AssistantPendingTurn,
    AssistantTurn,
    UserTurn,
} from "./chat-turns";
import { CitationPanel } from "./citation-panel";
import {
    CitationSelectionProvider,
    useCitationSelection,
} from "./citation-selection";
import { LearnPromptCard } from "./learn-prompt-card";
import { useWorkspaceChatPrefs } from "../stores/chat-preferences";
import { chatStreamPath } from "../lib/api";
import { describeChatError } from "../lib/chat-error";
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
    const renameConversation = useRenameConversation(workspaceId);
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

    const {
        messages,
        sendMessage,
        regenerate,
        stop,
        clearError,
        setMessages,
        status,
        error,
    } = useChat({
        transport,
    });

    const isStreaming = status === "streaming" || status === "submitted";
    const hasError = status === "error";
    const lastMessage = messages.at(-1);
    // Between sending and the first streamed token there is no assistant message yet.
    const isAwaitingFirstToken =
        status === "submitted" && lastMessage?.role === "user";
    // The question most recently asked, so a failed turn can be retried even if the
    // thread was reloaded from history in the meantime.
    const lastPromptRef = useRef<string | null>(null);

    const ask = useCallback(
        (text: string) => {
            lastPromptRef.current = text;
            void sendMessage({ text });
        },
        [sendMessage],
    );

    function handleRetry() {
        if (lastMessage?.role === "user") {
            void regenerate();
        } else if (lastPromptRef.current) {
            ask(lastPromptRef.current);
        }
    }

    const localMessageCount = messages.length;

    // Replace the live thread with the persisted one (server ids carry the citations).
    // Clearing is done by handleNewChat/handleSelectConversation, never here: this effect
    // reruns when streaming starts, and in a new chat conversationId is still null at that
    // moment, so clearing here would wipe the question that was just sent.
    useEffect(() => {
        // While failed, keep the unanswered question on screen next to its error.
        if (!conversationId || !storedMessages || isStreaming || hasError) {
            return;
        }

        // History fetched mid-stream predates the answer. Applying it when the stream
        // ends would drop the answer until the refetch brings it back (a visible flicker).
        if (storedMessages.length < localMessageCount) {
            return;
        }

        setMessages(
            storedMessages.map((message) => ({
                id: message.id,
                role: message.role === "USER" ? "user" : "assistant",
                parts: [{ type: "text" as const, text: message.content }],
            })),
        );
    }, [
        conversationId,
        storedMessages,
        setMessages,
        isStreaming,
        hasError,
        localMessageCount,
    ]);

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
        ask(askPrompt);
        router.replace(routes.workspace.chat(workspaceId));
    }, [
        askPrompt,
        status,
        conversationId,
        messages.length,
        ask,
        router,
        workspaceId,
    ]);

    function handleSelectConversation(id: string) {
        // A failure belongs to the thread it happened in; don't carry it over.
        clearError();
        if (id !== conversationId) {
            // Clear the old thread so the skeleton shows while the new one loads.
            setMessages([]);
        }
        setConversationId(id);
    }

    function handleNewChat() {
        clearError();
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

    async function handleRenameConversation(title: string) {
        if (!conversationId) {
            return;
        }
        await renameConversation.mutateAsync({ conversationId, title });
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
    // Only show the skeleton when there is nothing on screen. A new chat gets its
    // conversation id mid-request, which starts a history fetch; the live thread (question
    // plus the thinking wave) must stay visible while that loads.
    const isLoadingHistory =
        messages.length === 0 &&
        !isStreaming &&
        (conversationsLoading || messagesLoading);

    const hasThread = messages.length > 0 || hasError;
    const lastUserIndex = messages.findLastIndex(
        (message) => message.role === "user",
    );

    return (
        <CitationSelectionProvider>
            {/* Fill exactly the space under the sticky top bar so the page itself never scrolls:
                only the message list scrolls and the composer stays pinned to the bottom. */}
            <div className="mx-auto grid h-[calc(100dvh-3.5rem)] min-h-0 w-full max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 overflow-hidden px-4 pt-4 sm:px-6 sm:pt-6 md:h-[calc(100dvh-68px)] md:px-8 md:pt-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
                <div className="flex min-h-0 min-w-0 flex-col gap-4">
                    <PageHeader
                        className="shrink-0"
                        title={activeConversation?.title ?? "Chat"}
                        description="Chat with your sources. Follow every thought back to its roots."
                        actions={
                            <ChatToolbar
                                conversations={conversations}
                                conversationId={conversationId}
                                onSelectConversation={(id) =>
                                    id
                                        ? handleSelectConversation(id)
                                        : handleNewChat()
                                }
                                onNewChat={handleNewChat}
                                onExport={handleExportChat}
                                onDelete={handleDeleteConversation}
                                onRename={handleRenameConversation}
                                canExport={messages.length > 0}
                                isDeleting={deleteConversation.isPending}
                                isRenaming={renameConversation.isPending}
                            />
                        }
                    />

                    <p className="text-caption flex shrink-0 items-center gap-2">
                        <ShieldCheckIcon
                            aria-hidden="true"
                            className="size-4"
                        />
                        {readySourceCount} ready source
                        {readySourceCount === 1 ? "" : "s"} selected ·
                        Source-grounded answers
                    </p>

                    {isLoadingHistory ? (
                        <div
                            aria-busy="true"
                            className="min-h-0 flex-1 space-y-4 overflow-hidden"
                        >
                            <Skeleton className="h-14 rounded-2xl" />
                            <Skeleton className="h-56 rounded-2xl" />
                        </div>
                    ) : !hasThread ? (
                        <div className="min-h-0 flex-1 overflow-y-auto">
                            <ChatEmptyState
                                disabled={isStreaming}
                                onPick={ask}
                            />
                        </div>
                    ) : (
                        // Mounted only once there are real turns: the scroller applies its
                        // initial "scroll to end" to the first content it sees, so a skeleton
                        // or empty state in here would make an opened thread land mid-way.
                        <MessageScrollerProvider autoScroll>
                            <MessageScroller className="min-h-0 flex-1">
                                <MessageScrollerViewport>
                                    {/* Items must be direct children of the content and carry a
                                        messageId, or the scroller can't anchor new turns into view. */}
                                    <MessageScrollerContent className="w-full gap-5 pb-4">
                                        {messages.map((message, messageIndex) => {
                                            const isUser = message.role === "user";
                                            const text = getMessageText(message);
                                            const isAnimating =
                                                !isUser &&
                                                isStreaming &&
                                                messageIndex === messages.length - 1;

                                            return (
                                                <MessageScrollerItem
                                                    // Keyed by position, not id: once a reply
                                                    // finishes, the thread reloads from the
                                                    // server with new ids. Id keys would
                                                    // remount every turn and make the scroller
                                                    // re-anchor (the up-and-down jump).
                                                    key={messageIndex}
                                                    messageId={message.id}
                                                    // Only the newest question is an anchor. The
                                                    // scroller jumps to any anchor it hasn't
                                                    // scrolled to yet, so marking older questions
                                                    // sends the view back up when an answer lands.
                                                    scrollAnchor={
                                                        messageIndex === lastUserIndex
                                                    }
                                                >
                                                    {isUser ? (
                                                        <UserTurn text={text} />
                                                    ) : (
                                                        <AssistantTurn
                                                            text={text}
                                                            workspaceId={workspaceId}
                                                            citations={
                                                                citationsByMessageId[
                                                                    message.id
                                                                ]
                                                            }
                                                            isAnimating={isAnimating}
                                                        />
                                                    )}
                                                </MessageScrollerItem>
                                            );
                                        })}

                                        {isAwaitingFirstToken ? (
                                            <MessageScrollerItem messageId="pending-answer">
                                                <AssistantPendingTurn />
                                            </MessageScrollerItem>
                                        ) : null}

                                        {hasError ? (
                                            <MessageScrollerItem messageId="failed-answer">
                                                <AssistantErrorTurn
                                                    message={describeChatError(error)}
                                                    onRetry={handleRetry}
                                                />
                                            </MessageScrollerItem>
                                        ) : null}
                                    </MessageScrollerContent>
                                </MessageScrollerViewport>
                                <MessageScrollerButton direction="end" />
                            </MessageScroller>
                        </MessageScrollerProvider>
                    )}

                    <div className="shrink-0 bg-linear-to-t from-background via-background to-transparent pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-6">
                        <ChatComposer
                            isStreaming={isStreaming}
                            onStop={() => void stop()}
                            webSearchEnabled={chatPrefs.webSearch}
                            onWebSearchChange={chatPrefs.setWebSearch}
                            sourceCount={readySourceCount}
                            onSubmit={ask}
                        />
                    </div>
                </div>

                <ChatSidePanel
                    workspaceId={workspaceId}
                    conversationId={conversationId}
                    hasMessages={messages.length > 0}
                    isStreaming={isStreaming}
                />
            </div>
        </CitationSelectionProvider>
    );
}

/** Right column: the opened citation passage (when any) and the Learn prompt. */
function ChatSidePanel({
    workspaceId,
    conversationId,
    hasMessages,
    isStreaming,
}: {
    workspaceId: string;
    conversationId: string | null;
    hasMessages: boolean;
    isStreaming: boolean;
}) {
    const selection = useCitationSelection();

    return (
        <aside className="hidden min-h-0 flex-col gap-4 overflow-y-auto pb-8 xl:flex">
            {selection?.selected ? (
                <CitationPanel
                    workspaceId={workspaceId}
                    selection={selection.selected}
                    onClose={selection.clear}
                />
            ) : null}
            <LearnPromptCard
                workspaceId={workspaceId}
                conversationId={conversationId}
                hasMessages={hasMessages}
                isStreaming={isStreaming}
            />
        </aside>
    );
}
