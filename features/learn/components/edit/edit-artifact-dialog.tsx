"use client";

import { useMemo, useState } from "react";
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
import { toast } from "@/components/ui/toast";
import { Callout } from "@/shared/components/callout";
import { ApiError } from "@/shared/lib/api";
import { getErrorMessage } from "@/shared/lib/errors";
import { artifactKeys, useUpdateArtifact } from "../../hooks/use-artifacts";
import { ARTIFACT_TYPE_LABELS } from "../../lib/constants";
import { parseArtifactContent } from "../../lib/content";
import {
    isSameContent,
    TITLE_MAX_LENGTH,
    validateContent,
} from "../../lib/edit";
import type { ArtifactContent, LearningArtifact } from "../../lib/types";
import {
    FlashcardsEditor,
    QuizEditor,
    ReportEditor,
    SummaryEditor,
    TakeawaysEditor,
    WikiEditor,
} from "./content-editors";
import { MindMapEditor } from "./mindmap-editor";

type EditArtifactDialogProps = {
    workspaceId: string;
    artifact: LearningArtifact;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditArtifactDialog({
    workspaceId,
    artifact,
    open,
    onOpenChange,
}: EditArtifactDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-3xl">
                {/* Mounted only while open, so the draft always starts from the saved artifact. */}
                {open ? (
                    <EditArtifactForm
                        workspaceId={workspaceId}
                        artifact={artifact}
                        onDone={() => onOpenChange(false)}
                    />
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

function ContentEditor({
    draft,
    onChange,
}: {
    draft: ArtifactContent;
    onChange: (next: ArtifactContent) => void;
}) {
    switch (draft.type) {
        case "SUMMARY":
            return (
                <SummaryEditor
                    value={draft.content}
                    onChange={(content) => onChange({ type: "SUMMARY", content })}
                />
            );
        case "TAKEAWAYS":
            return (
                <TakeawaysEditor
                    value={draft.content}
                    onChange={(content) => onChange({ type: "TAKEAWAYS", content })}
                />
            );
        case "FLASHCARDS":
            return (
                <FlashcardsEditor
                    value={draft.content}
                    onChange={(content) => onChange({ type: "FLASHCARDS", content })}
                />
            );
        case "QUIZ":
            return (
                <QuizEditor
                    value={draft.content}
                    onChange={(content) => onChange({ type: "QUIZ", content })}
                />
            );
        case "MINDMAP":
            return (
                <MindMapEditor
                    value={draft.content}
                    onChange={(content) => onChange({ type: "MINDMAP", content })}
                />
            );
        case "REPORT":
            return (
                <ReportEditor
                    value={draft.content}
                    onChange={(content) => onChange({ type: "REPORT", content })}
                />
            );
        case "WIKI":
            return (
                <WikiEditor
                    value={draft.content}
                    onChange={(content) => onChange({ type: "WIKI", content })}
                />
            );
    }
}

function EditArtifactForm({
    workspaceId,
    artifact,
    onDone,
}: {
    workspaceId: string;
    artifact: LearningArtifact;
    onDone: () => void;
}) {
    const queryClient = useQueryClient();
    const updateArtifact = useUpdateArtifact(workspaceId, {
        suppressErrorToast: true,
    });
    const original = useMemo(() => parseArtifactContent(artifact), [artifact]);
    const [title, setTitle] = useState(artifact.title);
    const [draft, setDraft] = useState<ArtifactContent | null>(original);
    const [error, setError] = useState<unknown>(null);

    const trimmedTitle = title.trim();
    const titleChanged = trimmedTitle !== artifact.title;
    const contentChanged =
        draft !== null &&
        original !== null &&
        !isSameContent(draft.content, original.content);
    const problems = draft ? validateContent(draft) : [];
    const titleValid =
        trimmedTitle.length > 0 && trimmedTitle.length <= TITLE_MAX_LENGTH;
    const canSave =
        titleValid &&
        (titleChanged || contentChanged) &&
        (!contentChanged || problems.length === 0);

    const isConflict = error instanceof ApiError && error.isConflict;
    const fieldErrors = error instanceof ApiError ? error.fieldErrors : {};
    const fieldErrorLines = Object.entries(fieldErrors).flatMap(
        ([path, messages]) => messages.map((message) => `${path}: ${message}`),
    );

    async function handleSave(event: React.FormEvent) {
        event.preventDefault();
        if (!canSave) {
            return;
        }
        setError(null);

        try {
            await updateArtifact.mutateAsync({
                artifactId: artifact.id,
                input: {
                    ...(titleChanged ? { title: trimmedTitle } : {}),
                    ...(contentChanged && draft ? { content: draft.content } : {}),
                    expectedUpdatedAt: artifact.updatedAt,
                },
            });
        } catch (caught) {
            setError(caught);
            return;
        }

        toast.add({ type: "success", title: "Changes saved" });
        onDone();
    }

    async function handleReload() {
        await queryClient.invalidateQueries({
            queryKey: artifactKeys(workspaceId).detail(artifact.id),
        });
        onDone();
    }

    return (
        <form
            onSubmit={(event) => void handleSave(event)}
            className="flex min-h-0 flex-1 flex-col"
        >
            <DialogHeader className="border-b border-border p-6">
                <DialogTitle>
                    Edit {ARTIFACT_TYPE_LABELS[artifact.type].toLowerCase()}
                </DialogTitle>
                <DialogDescription>
                    Your changes replace the generated version. Regenerating
                    later will discard them.
                </DialogDescription>
            </DialogHeader>

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
                <div className="space-y-2">
                    <Label htmlFor="edit-artifact-title">Title</Label>
                    <Input
                        id="edit-artifact-title"
                        value={title}
                        maxLength={TITLE_MAX_LENGTH}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                    />
                </div>

                {draft ? (
                    <ContentEditor draft={draft} onChange={setDraft} />
                ) : (
                    <Callout tone="amber" title="Content not editable">
                        This content couldn&apos;t be read, so only the title
                        can be changed. Regenerating it will produce a fresh
                        version.
                    </Callout>
                )}
            </div>

            <div className="space-y-3 border-t border-border p-6">
                {contentChanged && problems.length > 0 ? (
                    <Callout tone="amber" title="Fix before saving">
                        <ul className="list-disc space-y-0.5 pl-4">
                            {problems.map((problem) => (
                                <li key={problem}>{problem}</li>
                            ))}
                        </ul>
                    </Callout>
                ) : null}

                {error ? (
                    <Callout
                        tone="rose"
                        title={isConflict ? "Changed elsewhere" : "Could not save"}
                    >
                        {fieldErrorLines.length > 0 ? (
                            <ul className="list-disc space-y-0.5 pl-4">
                                {fieldErrorLines.map((line) => (
                                    <li key={line}>{line}</li>
                                ))}
                            </ul>
                        ) : (
                            getErrorMessage(error)
                        )}
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
                        disabled={updateArtifact.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!canSave || updateArtifact.isPending}
                    >
                        {updateArtifact.isPending ? (
                            <Spinner />
                        ) : (
                            <CheckIcon aria-hidden="true" />
                        )}
                        Save changes
                    </Button>
                </DialogFooter>
            </div>
        </form>
    );
}
