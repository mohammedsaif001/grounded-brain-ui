"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/shared/lib/errors";
import type { Workspace } from "../lib/types";

const ICON_OPTIONS = ["📚", "📖", "📝", "🎓", "💡", "🔬", "🧠", "✨"];
const DEFAULT_ICON = ICON_OPTIONS[0];

export type WorkspaceFormValues = {
    title: string;
    description?: string;
    icon?: string;
};

type WorkspaceFormDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workspace?: Workspace | null;
    onSubmit: (values: WorkspaceFormValues) => Promise<void>;
    isPending?: boolean;
};

export function WorkspaceFormDialog({
    open,
    onOpenChange,
    workspace,
    onSubmit,
    isPending = false,
}: WorkspaceFormDialogProps) {
    const isEditing = Boolean(workspace);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit notebook" : "Create notebook"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update your notebook details."
                            : "Start a new notebook to organize your sources and chats."}
                    </DialogDescription>
                </DialogHeader>

                {/* Mounted only while open, so each opening starts from fresh state. */}
                <WorkspaceForm
                    workspace={workspace}
                    onSubmit={onSubmit}
                    onClose={() => onOpenChange(false)}
                    isPending={isPending}
                />
            </DialogContent>
        </Dialog>
    );
}

type WorkspaceFormProps = {
    workspace?: Workspace | null;
    onSubmit: (values: WorkspaceFormValues) => Promise<void>;
    onClose: () => void;
    isPending: boolean;
};

function WorkspaceForm({
    workspace,
    onSubmit,
    onClose,
    isPending,
}: WorkspaceFormProps) {
    const isEditing = Boolean(workspace);
    const [title, setTitle] = useState(workspace?.title ?? "");
    const [description, setDescription] = useState(
        workspace?.description ?? "",
    );
    const [icon, setIcon] = useState(workspace?.icon || DEFAULT_ICON);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            setError("Title is required.");
            return;
        }

        try {
            await onSubmit({
                title: trimmedTitle,
                // When editing, "" clears the description; on create, omit it.
                description: isEditing
                    ? description.trim()
                    : description.trim() || undefined,
                icon,
            });
            onClose();
        } catch (submitError) {
            setError(getErrorMessage(submitError));
        }
    }

    return (
        <form className="grid gap-4" onSubmit={(event) => void handleSubmit(event)}>
            <div className="grid gap-2">
                <p id="workspace-icon-label" className="text-sm font-medium">
                    Icon
                </p>
                <div
                    role="radiogroup"
                    aria-labelledby="workspace-icon-label"
                    className="flex flex-wrap gap-2"
                >
                    {ICON_OPTIONS.map((option) => (
                        <button
                            key={option}
                            type="button"
                            role="radio"
                            aria-checked={icon === option}
                            onClick={() => setIcon(option)}
                            className={cn(
                                "flex size-10 items-center justify-center rounded-lg border text-lg transition-colors",
                                icon === option
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:bg-muted",
                            )}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="workspace-title">Title</Label>
                <Input
                    id="workspace-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="My research notebook"
                    maxLength={120}
                    disabled={isPending}
                    autoFocus
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="workspace-description">Description</Label>
                <Textarea
                    id="workspace-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="What is this workspace about?"
                    maxLength={500}
                    rows={3}
                    disabled={isPending}
                />
            </div>

            {error ? (
                <p role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            ) : null}

            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isPending}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? <Spinner /> : null}
                    {isEditing ? "Save changes" : "Create workspace"}
                </Button>
            </DialogFooter>
        </form>
    );
}
