"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
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
import { toast } from "@/components/ui/toast";
import { Callout } from "@/shared/components/callout";
import { ApiError } from "@/shared/lib/api";
import { getErrorMessage } from "@/shared/lib/errors";
import { Skeleton } from "@/components/ui/skeleton";
import { sourceKeys, useSource, useUpdateSource } from "../hooks/use-sources";
import { isContentEditable, type Source } from "../lib/types";

const TITLE_MAX = 200;

type EditSourceDialogProps = {
    workspaceId: string;
    source: Source;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditSourceDialog({
    workspaceId,
    source,
    open,
    onOpenChange,
}: EditSourceDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                {/* Mounted only while open, so the fields always start from the latest source. */}
                {open ? (
                    <EditSourceForm
                        workspaceId={workspaceId}
                        source={source}
                        onDone={() => onOpenChange(false)}
                    />
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

/**
 * For callers that only have a list row. List responses leave out `content`, so this
 * fetches the full source before showing the editor; opening it empty would look like
 * the text had been lost.
 */
export function EditSourceByIdDialog({
    workspaceId,
    sourceId,
    onClose,
}: {
    workspaceId: string;
    sourceId: string | null;
    onClose: () => void;
}) {
    return (
        <Dialog
            open={sourceId !== null}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="sm:max-w-2xl">
                {sourceId ? (
                    <LoadedEditSourceForm
                        workspaceId={workspaceId}
                        sourceId={sourceId}
                        onDone={onClose}
                    />
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

function LoadedEditSourceForm({
    workspaceId,
    sourceId,
    onDone,
}: {
    workspaceId: string;
    sourceId: string;
    onDone: () => void;
}) {
    const { data: source, error } = useSource(workspaceId, sourceId);

    if (source) {
        return (
            <EditSourceForm
                workspaceId={workspaceId}
                source={source}
                onDone={onDone}
            />
        );
    }

    return (
        <div className="grid gap-4">
            <DialogHeader>
                <DialogTitle>Edit source</DialogTitle>
                <DialogDescription>
                    {error ? getErrorMessage(error) : "Loading the source…"}
                </DialogDescription>
            </DialogHeader>
            {error ? (
                <DialogFooter>
                    <Button variant="outline" onClick={onDone}>
                        Close
                    </Button>
                </DialogFooter>
            ) : (
                <div aria-busy="true" className="space-y-3">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            )}
        </div>
    );
}

function EditSourceForm({
    workspaceId,
    source,
    onDone,
}: {
    workspaceId: string;
    source: Source;
    onDone: () => void;
}) {
    const queryClient = useQueryClient();
    const updateSource = useUpdateSource(workspaceId, {
        suppressErrorToast: true,
    });
    const canEditContent = isContentEditable(source.type);
    const originalContent = source.content ?? "";
    const [title, setTitle] = useState(source.title);
    const [content, setContent] = useState(originalContent);
    const [error, setError] = useState<unknown>(null);

    const trimmedTitle = title.trim();
    const titleChanged = trimmedTitle !== source.title;
    const contentChanged = canEditContent && content !== originalContent;
    const isValid =
        trimmedTitle.length > 0 &&
        trimmedTitle.length <= TITLE_MAX &&
        (!canEditContent || content.trim().length > 0);
    const canSave = isValid && (titleChanged || contentChanged);
    const isConflict = error instanceof ApiError && error.isConflict;

    async function handleSave(event: React.FormEvent) {
        event.preventDefault();
        if (!canSave) {
            return;
        }
        setError(null);

        try {
            await updateSource.mutateAsync({
                sourceId: source.id,
                input: {
                    ...(titleChanged ? { title: trimmedTitle } : {}),
                    ...(contentChanged ? { content } : {}),
                    expectedUpdatedAt: source.updatedAt,
                },
            });
        } catch (caught) {
            setError(caught);
            return;
        }

        toast.add({
            type: contentChanged ? "info" : "success",
            title: contentChanged ? "Re-indexing source" : "Source updated",
            description: contentChanged
                ? "Chat can use the new text once indexing finishes."
                : undefined,
        });
        onDone();
    }

    async function handleReload() {
        await queryClient.invalidateQueries({
            queryKey: sourceKeys(workspaceId).detail(source.id),
        });
        onDone();
    }

    return (
        <form
            onSubmit={(event) => void handleSave(event)}
            className="grid min-w-0 grid-cols-1 gap-5"
        >
            <DialogHeader>
                <DialogTitle>Edit source</DialogTitle>
                <DialogDescription>
                    {canEditContent
                        ? "Rename it or rewrite its text."
                        : "You can rename this source. Its content comes from the original file or page, so it can't be edited here."}
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
                <Label htmlFor="edit-source-title">Title</Label>
                <Input
                    id="edit-source-title"
                    value={title}
                    maxLength={TITLE_MAX}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                />
            </div>

            {canEditContent ? (
                <div className="space-y-2">
                    <Label htmlFor="edit-source-content">Content</Label>
                    <Textarea
                        id="edit-source-content"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        rows={14}
                        className="max-h-[50vh] field-sizing-fixed overflow-y-auto text-sm"
                        required
                    />
                </div>
            ) : null}

            {contentChanged ? (
                <Callout tone="amber" title="Re-indexing">
                    Saving new text replaces the old text and re-indexes this
                    source. Chat can&apos;t use it until indexing finishes, and
                    artifacts already generated keep what they were built from.
                </Callout>
            ) : null}

            {error ? (
                <Callout
                    tone="rose"
                    title={isConflict ? "Changed elsewhere" : "Could not save"}
                >
                    {getErrorMessage(error)}
                    {isConflict ? (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => void handleReload()}
                        >
                            Reload latest version
                        </Button>
                    ) : null}
                </Callout>
            ) : null}

            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onDone}
                    disabled={updateSource.isPending}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={!canSave || updateSource.isPending}
                >
                    {updateSource.isPending ? (
                        <Spinner />
                    ) : (
                        <CheckIcon aria-hidden="true" />
                    )}
                    Save changes
                </Button>
            </DialogFooter>
        </form>
    );
}
