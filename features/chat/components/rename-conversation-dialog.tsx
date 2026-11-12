"use client";

import { useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

export const CONVERSATION_TITLE_MAX = 120;

type RenameConversationDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentTitle: string;
    isPending: boolean;
    onRename: (title: string) => Promise<void>;
};

export function RenameConversationDialog({
    open,
    onOpenChange,
    currentTitle,
    isPending,
    onRename,
}: RenameConversationDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {/* Mounted only while open so the field starts from the current title. */}
                {open ? (
                    <RenameForm
                        currentTitle={currentTitle}
                        isPending={isPending}
                        onRename={onRename}
                        onClose={() => onOpenChange(false)}
                    />
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

function RenameForm({
    currentTitle,
    isPending,
    onRename,
    onClose,
}: {
    currentTitle: string;
    isPending: boolean;
    onRename: (title: string) => Promise<void>;
    onClose: () => void;
}) {
    const [title, setTitle] = useState(currentTitle);
    const trimmed = title.trim();
    const canSave = trimmed.length > 0 && trimmed !== currentTitle;

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!canSave) {
            return;
        }
        try {
            await onRename(trimmed);
        } catch {
            return; // Reported by the global mutation error toast.
        }
        onClose();
    }

    return (
        <form onSubmit={(event) => void handleSubmit(event)} className="grid grid-cols-1 gap-5">
            <DialogHeader>
                <DialogTitle>Rename conversation</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
                <Label htmlFor="rename-conversation">Title</Label>
                <Input
                    id="rename-conversation"
                    value={title}
                    maxLength={CONVERSATION_TITLE_MAX}
                    onChange={(event) => setTitle(event.target.value)}
                    autoFocus
                    required
                />
            </div>
            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isPending}
                >
                    <XIcon aria-hidden="true" />
                    Cancel
                </Button>
                <Button type="submit" disabled={!canSave || isPending}>
                    {isPending ? <Spinner /> : <CheckIcon aria-hidden="true" />}
                    Rename
                </Button>
            </DialogFooter>
        </form>
    );
}
