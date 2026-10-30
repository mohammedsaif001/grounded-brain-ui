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
import {
    ARTIFACT_TYPE_DESCRIPTIONS,
    ARTIFACT_TYPE_LABELS,
    ARTIFACT_TYPES,
} from "../lib/constants";
import { useSources } from "@/features/sources/hooks/use-sources";
import { useCreateArtifact } from "../hooks/use-artifacts";
import type { ArtifactType } from "../lib/types";

type GenerateArtifactDialogProps = {
    workspaceId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function GenerateArtifactDialog({
    workspaceId,
    open,
    onOpenChange,
}: GenerateArtifactDialogProps) {
    const [type, setType] = useState<ArtifactType>("SUMMARY");
    const [title, setTitle] = useState("");
    const [error, setError] = useState<string | null>(null);
    const createArtifact = useCreateArtifact(workspaceId);
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
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Failed to start generation",
            );
            return;
        }

        setTitle("");
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <form onSubmit={(event) => void handleSubmit(event)}>
                    <DialogHeader>
                        <DialogTitle>Generate learning tool</DialogTitle>
                        <DialogDescription>
                            Uses all ready sources in this workspace. Generation
                            runs in the background via Inngest.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="artifact-type">Type</Label>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {ARTIFACT_TYPES.map((artifactType) => (
                                    <button
                                        key={artifactType}
                                        type="button"
                                        onClick={() => setType(artifactType)}
                                        className={`rounded-2xl border px-3 py-3 text-left transition-colors ${
                                            type === artifactType
                                                ? "border-primary bg-primary/10"
                                                : "hover:bg-muted/50"
                                        }`}
                                    >
                                        <p className="text-sm font-medium">
                                            {
                                                ARTIFACT_TYPE_LABELS[
                                                    artifactType
                                                ]
                                            }
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {
                                                ARTIFACT_TYPE_DESCRIPTIONS[
                                                    artifactType
                                                ]
                                            }
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="artifact-title">
                                Title (optional)
                            </Label>
                            <Input
                                id="artifact-title"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                placeholder="Custom title"
                            />
                        </div>
                    </div>

                    {error ? (
                        <p className="text-sm text-destructive">{error}</p>
                    ) : null}
                    {wikiBlocked ? (
                        <p className="text-sm text-destructive">
                            Repo Wiki needs a ready GitHub source. Add one from
                            the Sources tab first.
                        </p>
                    ) : null}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createArtifact.isPending || wikiBlocked}
                        >
                            Generate
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
