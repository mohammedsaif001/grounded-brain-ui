"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useSources } from "@/features/sources/hooks/use-sources";
import { cn } from "@/lib/utils";
import { TypeTile } from "@/shared/components/type-tile";
import { getErrorMessage } from "@/shared/lib/errors";
import { useCreateArtifact } from "../hooks/use-artifacts";
import { ARTIFACT_META } from "../lib/artifact-meta";
import {
    ARTIFACT_TYPE_DESCRIPTIONS,
    ARTIFACT_TYPE_LABELS,
    ARTIFACT_TYPES,
} from "../lib/constants";
import type { ArtifactType } from "../lib/types";

type GenerateArtifactDialogProps = {
    workspaceId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Type preselected when the dialog opens. */
    initialType?: ArtifactType;
};

export function GenerateArtifactDialog({
    workspaceId,
    open,
    onOpenChange,
    initialType = "SUMMARY",
}: GenerateArtifactDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Generate learning tool</DialogTitle>
                    <DialogDescription>
                        Uses all ready sources in this workspace. Generation
                        runs in the background, so you can keep working.
                    </DialogDescription>
                </DialogHeader>

                {/* Mounted only while open, so each opening starts from fresh state. */}
                <GenerateForm
                    workspaceId={workspaceId}
                    initialType={initialType}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

type GenerateFormProps = {
    workspaceId: string;
    initialType: ArtifactType;
    onClose: () => void;
};

function GenerateForm({ workspaceId, initialType, onClose }: GenerateFormProps) {
    const [type, setType] = useState<ArtifactType>(initialType);
    const [title, setTitle] = useState("");
    const [error, setError] = useState<string | null>(null);
    const createArtifact = useCreateArtifact(workspaceId, {
        suppressErrorToast: true,
    });
    const { data: sources } = useSources(workspaceId);
    const hasGithubSource =
        sources?.some(
            (source) => source.type === "GITHUB" && source.status === "READY",
        ) ?? false;
    const wikiBlocked = type === "WIKI" && !hasGithubSource;

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        setError(null);
        try {
            await createArtifact.mutateAsync({
                type,
                title: title.trim() || undefined,
            });
        } catch (submitError) {
            setError(getErrorMessage(submitError, "Failed to start generation"));
            return;
        }

        onClose();
    }

    return (
        <form onSubmit={(event) => void handleSubmit(event)} className="grid gap-5">
            <div className="grid gap-2">
                <p id="artifact-type-label" className="text-sm font-medium">
                    Type
                </p>
                <div
                    role="radiogroup"
                    aria-labelledby="artifact-type-label"
                    className="grid gap-2 sm:grid-cols-2"
                >
                    {ARTIFACT_TYPES.map((artifactType) => {
                        const meta = ARTIFACT_META[artifactType];
                        const isSelected = type === artifactType;
                        return (
                            <button
                                key={artifactType}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                onClick={() => setType(artifactType)}
                                className={cn(
                                    "flex items-start gap-3 rounded-xl border p-3 text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30",
                                    isSelected
                                        ? "border-ring bg-accent/60"
                                        : "border-border bg-card hover:bg-muted/60",
                                )}
                            >
                                <TypeTile
                                    icon={meta.icon}
                                    tone={meta.tone}
                                    size="sm"
                                />
                                <span className="min-w-0">
                                    <span className="block text-sm font-semibold">
                                        {ARTIFACT_TYPE_LABELS[artifactType]}
                                    </span>
                                    <span className="text-caption block">
                                        {ARTIFACT_TYPE_DESCRIPTIONS[artifactType]}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="artifact-title">Title (optional)</Label>
                <Input
                    id="artifact-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Custom title"
                    maxLength={120}
                />
            </div>

            {error ? (
                <p role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            ) : null}
            {wikiBlocked ? (
                <p role="alert" className="text-sm text-destructive">
                    Repo Wiki needs a ready GitHub source. Add one from the
                    Sources tab first.
                </p>
            ) : null}

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={createArtifact.isPending || wikiBlocked}
                >
                    {createArtifact.isPending ? <Spinner /> : null}
                    Generate
                </Button>
            </DialogFooter>
        </form>
    );
}
