"use client";

import { DownloadIcon, MessageSquarePlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/shared/components/filter-select";
import type { Conversation } from "../lib/types";

type ChatToolbarProps = {
    conversations: readonly Conversation[];
    conversationId: string | null;
    onSelectConversation: (id: string | null) => void;
    onNewChat: () => void;
    onExport: () => void;
    onDelete: () => void;
    canExport: boolean;
    isDeleting: boolean;
};

export function ChatToolbar({
    conversations,
    conversationId,
    onSelectConversation,
    onNewChat,
    onExport,
    onDelete,
    canExport,
    isDeleting,
}: ChatToolbarProps) {
    const options = conversations.map((conversation) => ({
        value: conversation.id,
        label: conversation.title ?? "Untitled chat",
    }));

    return (
        <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
                label="Conversation"
                allLabel="New conversation"
                options={options}
                value={conversationId ?? undefined}
                onChange={(id) => onSelectConversation(id ?? null)}
                className="max-w-56"
            />
            <Button variant="ghost" onClick={onNewChat}>
                <MessageSquarePlusIcon aria-hidden="true" />
                New chat
            </Button>
            <Button variant="ghost" disabled={!canExport} onClick={onExport}>
                <DownloadIcon aria-hidden="true" />
                Export Markdown
            </Button>
            {conversationId ? (
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={isDeleting}
                    onClick={onDelete}
                >
                    <Trash2Icon aria-hidden="true" />
                    <span className="sr-only">Delete conversation</span>
                </Button>
            ) : null}
        </div>
    );
}
