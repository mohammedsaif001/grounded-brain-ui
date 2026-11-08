"use client";

import { useState } from "react";
import { DownloadIcon, PencilIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { ApiError } from "@/shared/lib/api";
import { downloadMarkdown } from "@/shared/lib/download";
import { useRegenerateArtifact } from "../hooks/use-artifacts";
import { artifactFileName, artifactToMarkdown } from "../lib/artifact-markdown";
import { parseArtifactContent } from "../lib/content";
import { isUserEdited, type LearningArtifact } from "../lib/types";
import { EditArtifactDialog } from "./edit/edit-artifact-dialog";

type ArtifactActionsProps = {
    artifact: LearningArtifact;
    workspaceId: string;
};

/** Edit, export as Markdown, or regenerate in place (which discards hand edits). */
export function ArtifactActions({ artifact, workspaceId }: ArtifactActionsProps) {
    const regenerate = useRegenerateArtifact(workspaceId, {
        suppressErrorToast: true,
    });
    const [editOpen, setEditOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const parsed =
        artifact.status === "READY" ? parseArtifactContent(artifact) : null;
    const isBusy =
        artifact.status === "PENDING" || artifact.status === "PROCESSING";
    const isReady = artifact.status === "READY";

    function handleExport() {
        if (!parsed) return;
        downloadMarkdown(
            artifactToMarkdown(artifact.title, parsed),
            artifactFileName(artifact.title),
        );
    }

    function runRegenerate(force: boolean) {
        regenerate.mutate(
            { artifactId: artifact.id, force },
            {
                onSuccess: () => {
                    setConfirmOpen(false);
                    toast.add({
                        type: "info",
                        title: "Regenerating",
                        description: "This page updates when it's ready.",
                    });
                },
                onError: (error) => {
                    if (error instanceof ApiError && error.code === "ARTIFACT_EDITED") {
                        // Edited since this page loaded; ask before throwing the edits away.
                        setConfirmOpen(true);
                        return;
                    }
                    setConfirmOpen(false);
                    toast.add({
                        type: error instanceof ApiError && error.isConflict ? "warning" : "error",
                        title: "Could not regenerate",
                        description: error.message,
                    });
                },
            },
        );
    }

    function handleRegenerate() {
        if (isUserEdited(artifact)) {
            setConfirmOpen(true);
            return;
        }
        runRegenerate(false);
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                disabled={!isReady}
                onClick={() => setEditOpen(true)}
            >
                <PencilIcon aria-hidden="true" />
                Edit
            </Button>
            <Button variant="outline" disabled={!parsed} onClick={handleExport}>
                <DownloadIcon aria-hidden="true" />
                Export
            </Button>
            <Button
                variant="outline"
                disabled={isBusy || regenerate.isPending}
                onClick={handleRegenerate}
            >
                {regenerate.isPending && !confirmOpen ? (
                    <Spinner />
                ) : (
                    <RefreshCwIcon aria-hidden="true" />
                )}
                Regenerate
            </Button>

            <EditArtifactDialog
                workspaceId={workspaceId}
                artifact={artifact}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
            <ConfirmDialog
                open={confirmOpen}
                title="Discard your edits?"
                description="Regenerating builds a fresh version from your sources and replaces the changes you made. This can't be undone."
                confirmLabel="Regenerate"
                isPending={regenerate.isPending}
                onConfirm={() => runRegenerate(true)}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}
