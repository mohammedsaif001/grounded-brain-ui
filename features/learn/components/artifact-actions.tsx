"use client";

import { useRouter } from "next/navigation";
import { DownloadIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { downloadMarkdown } from "@/shared/lib/download";
import { routes } from "@/shared/config/routes";
import { useCreateArtifact } from "../hooks/use-artifacts";
import { artifactFileName, artifactToMarkdown } from "../lib/artifact-markdown";
import { parseArtifactContent } from "../lib/content";
import type { LearningArtifact } from "../lib/types";

type ArtifactActionsProps = {
    artifact: LearningArtifact;
    workspaceId: string;
};

/** Export the content as Markdown, or generate a fresh artifact of the same type. */
export function ArtifactActions({ artifact, workspaceId }: ArtifactActionsProps) {
    const router = useRouter();
    const createArtifact = useCreateArtifact(workspaceId);
    const parsed =
        artifact.status === "READY" ? parseArtifactContent(artifact) : null;
    const isBusy =
        artifact.status === "PENDING" || artifact.status === "PROCESSING";

    function handleExport() {
        if (!parsed) return;
        downloadMarkdown(
            artifactToMarkdown(artifact.title, parsed),
            artifactFileName(artifact.title),
        );
    }

    function handleRegenerate() {
        createArtifact.mutate(
            { type: artifact.type, title: artifact.title },
            {
                onSuccess: () => {
                    toast.add({
                        type: "success",
                        title: "Generating a new version",
                    });
                    router.push(routes.workspace.learn(workspaceId));
                },
            },
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" disabled={!parsed} onClick={handleExport}>
                <DownloadIcon aria-hidden="true" />
                Export
            </Button>
            <Button
                variant="outline"
                disabled={isBusy || createArtifact.isPending}
                onClick={handleRegenerate}
            >
                {createArtifact.isPending ? (
                    <Spinner />
                ) : (
                    <RefreshCwIcon aria-hidden="true" />
                )}
                Regenerate
            </Button>
        </div>
    );
}
