"use client";

import { useMemo, useState } from "react";
import { LightbulbIcon, SparklesIcon, GraduationCapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSources } from "@/features/sources/hooks/use-sources";
import { Callout } from "@/shared/components/callout";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { EmptyState } from "@/shared/components/empty-state";
import { PageHeader } from "@/shared/components/page-header";
import { useArtifacts, useDeleteArtifact } from "../hooks/use-artifacts";
import { filterArtifacts, type ArtifactFilter } from "../lib/filter-artifacts";
import type { ArtifactType, LearningArtifact } from "../lib/types";
import { ArtifactCard } from "./artifact-card";
import { ArtifactMaker } from "./artifact-maker";
import { EditArtifactByIdDialog } from "./edit/edit-artifact-dialog";
import { GenerateArtifactDialog } from "./generate-artifact-dialog";
import { LoadError } from "@/shared/components/load-error";

type LearnHubProps = {
    workspaceId: string;
};

const FILTERS: readonly { value: ArtifactFilter; label: string }[] = [
    { value: "all", label: "All material" },
    { value: "recent", label: "Recent" },
];

export function LearnHub({ workspaceId }: LearnHubProps) {
    const [dialog, setDialog] = useState<{ type: ArtifactType } | null>(null);
    const [filter, setFilter] = useState<ArtifactFilter>("all");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [pendingDelete, setPendingDelete] =
        useState<LearningArtifact | null>(null);

    const { data: artifacts = [], isLoading, error } = useArtifacts(workspaceId);
    const { data: sources } = useSources(workspaceId);
    const deleteArtifact = useDeleteArtifact(workspaceId);

    const readySourceCount =
        sources?.filter((source) => source.status === "READY").length ?? 0;

    // Captured once per mount so the "recent" window is stable across re-renders.
    const [now] = useState(() => Date.now());
    const visible = useMemo(
        () => filterArtifacts(artifacts, filter, now),
        [artifacts, filter, now],
    );

    function openDialog(type: ArtifactType = "SUMMARY") {
        setDialog({ type });
    }

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 md:p-8">
            <PageHeader
                eyebrow="Knowledge, made yours"
                title="Learn something that lasts."
                description="Go beyond the answer. Shape your sources into tools for understanding."
                actions={
                    <Button size="lg" onClick={() => openDialog()}>
                        <SparklesIcon aria-hidden="true" />
                        Generate
                    </Button>
                }
            />

            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
                <div className="space-y-5">
                    <Tabs
                        value={filter}
                        onValueChange={(value) =>
                            setFilter(value as ArtifactFilter)
                        }
                    >
                        <TabsList aria-label="Filter learning material">
                            {FILTERS.map(({ value, label }) => (
                                <TabsTrigger
                                    key={value}
                                    value={value}
                                    className="px-4"
                                >
                                    {label}
                                    {value === "all" ? (
                                        <span className="tabular-nums text-muted-foreground">
                                            {artifacts.length}
                                        </span>
                                    ) : null}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    {isLoading ? (
                        <div
                            aria-busy="true"
                            className="grid grid-cols-1 gap-4 md:grid-cols-2"
                        >
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="h-44 rounded-2xl"
                                />
                            ))}
                        </div>
                    ) : error ? (
                        <LoadError
                            error={error}
                            icon={GraduationCapIcon}
                            title="Could not load learning tools"
                        />
                    ) : visible.length === 0 ? (
                        <EmptyState
                            icon={GraduationCapIcon}
                            title={
                                artifacts.length === 0
                                    ? "No learning tools yet"
                                    : "Nothing generated recently"
                            }
                            description="Generate your first summary, quiz or flashcard deck from your ready sources."
                        >
                            <Button onClick={() => openDialog()}>
                                <SparklesIcon aria-hidden="true" />
                                Generate
                            </Button>
                        </EmptyState>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {visible.map((artifact) => (
                                <ArtifactCard
                                    key={artifact.id}
                                    artifact={artifact}
                                    workspaceId={workspaceId}
                                    onEdit={(target) => setEditingId(target.id)}
                                    onDelete={setPendingDelete}
                                />
                            ))}
                        </div>
                    )}

                    <Callout tone="green">
                        <div className="flex items-center gap-3">
                            <LightbulbIcon
                                aria-hidden="true"
                                className="size-5 shrink-0"
                            />
                            <span>
                                A little effort goes a long way. Try a quiz
                                before rereading your summary.
                            </span>
                        </div>
                    </Callout>
                </div>

                <ArtifactMaker
                    readySourceCount={readySourceCount}
                    onPick={openDialog}
                />
            </div>

            <EditArtifactByIdDialog
                workspaceId={workspaceId}
                artifactId={editingId}
                onClose={() => setEditingId(null)}
            />

            <GenerateArtifactDialog
                workspaceId={workspaceId}
                open={dialog !== null}
                initialType={dialog?.type}
                onOpenChange={(open) => {
                    if (!open) setDialog(null);
                }}
            />

            <ConfirmDialog
                open={pendingDelete !== null}
                title="Delete learning tool?"
                description={
                    <>
                        This permanently deletes{" "}
                        <span className="font-medium text-foreground">
                            {pendingDelete?.title}
                        </span>
                        .
                    </>
                }
                isPending={deleteArtifact.isPending}
                onConfirm={() => {
                    if (!pendingDelete) return;
                    deleteArtifact.mutate(pendingDelete.id, {
                        onSuccess: () => setPendingDelete(null),
                    });
                }}
                onCancel={() => setPendingDelete(null)}
            />
        </div>
    );
}
