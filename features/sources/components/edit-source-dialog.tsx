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
import { sourceKeys, useUpdateSource } from "../hooks/use-sources";
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
            className="grid gap-5"
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
                        className="max-h-[50vh] text-sm"
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
