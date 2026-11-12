"use client";

import { useState } from "react";
import {
    DownloadIcon,
    MessageSquarePlusIcon,
    PencilIcon,
    Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/shared/components/filter-select";
import type { Conversation } from "../lib/types";
import { RenameConversationDialog } from "./rename-conversation-dialog";

type ChatToolbarProps = {
    conversations: readonly Conversation[];
    conversationId: string | null;
    onSelectConversation: (id: string | null) => void;
    onNewChat: () => void;
    onExport: () => void;
    onDelete: () => void;
    onRename: (title: string) => Promise<void>;
    canExport: boolean;
    isDeleting: boolean;
    isRenaming: boolean;
};

export function ChatToolbar({
    conversations,
    conversationId,
    onSelectConversation,
    onNewChat,
    onExport,
    onDelete,
    onRename,
    canExport,
    isDeleting,
    isRenaming,
}: ChatToolbarProps) {
    const [renameOpen, setRenameOpen] = useState(false);
    const activeConversation = conversations.find(
        (conversation) => conversation.id === conversationId,
    );
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
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        title="Rename conversation"
                        onClick={() => setRenameOpen(true)}
                    >
                        <PencilIcon aria-hidden="true" />
                        <span className="sr-only">Rename conversation</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        title="Delete conversation"
                        className="hover:bg-destructive/10 hover:text-destructive"
                        disabled={isDeleting}
                        onClick={onDelete}
                    >
                        <Trash2Icon aria-hidden="true" />
                        <span className="sr-only">Delete conversation</span>
                    </Button>
                    <RenameConversationDialog
                        open={renameOpen}
                        onOpenChange={setRenameOpen}
                        currentTitle={activeConversation?.title ?? ""}
                        isPending={isRenaming}
                        onRename={onRename}
                    />
                </>
            ) : null}
        </div>
    );
}
