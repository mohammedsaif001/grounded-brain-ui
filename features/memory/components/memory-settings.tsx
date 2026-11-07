"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
    ArrowLeftIcon,
    BrainIcon,
    PencilIcon,
    PlusIcon,
    Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { EmptyState } from "@/shared/components/empty-state";
import { PageHeader } from "@/shared/components/page-header";
import { routes } from "@/shared/config/routes";
import {
    useCreateMemory,
    useDeleteMemory,
    useMemories,
    useUpdateMemory,
} from "../hooks/use-memories";
import type { UserMemory } from "../lib/types";
import { MemoryFormDialog } from "./memory-form-dialog";

export function MemorySettings() {
    const { data: memories = [], isLoading, error } = useMemories();
    // MemoryFormDialog renders create/update errors inline.
    const createMemory = useCreateMemory({ suppressErrorToast: true });
    const updateMemory = useUpdateMemory({ suppressErrorToast: true });
    const deleteMemory = useDeleteMemory();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingMemory, setEditingMemory] = useState<UserMemory | null>(
        null,
    );
    const [pendingDelete, setPendingDelete] = useState<UserMemory | null>(null);

    function openCreateDialog() {
        setEditingMemory(null);
        setDialogOpen(true);
    }

    function openEditDialog(memory: UserMemory) {
        setEditingMemory(memory);
        setDialogOpen(true);
    }

    async function handleSubmit(values: { memory: string }) {
        if (editingMemory) {
            await updateMemory.mutateAsync({
                memoryId: editingMemory.id,
                input: values,
            });
            return;
        }

        await createMemory.mutateAsync(values);
    }

    return (
        <div className="bg-page min-h-svh">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-6 md:p-10">
                <div className="space-y-4">
                    <Button
                        nativeButton={false}
                        variant="ghost"
                        size="sm"
                        className="-ml-2"
                        render={<Link href={routes.dashboard} />}
                    >
                        <ArrowLeftIcon aria-hidden="true" />
                        Dashboard
                    </Button>
                    <PageHeader
                        eyebrow="Settings"
                        title="Memory"
                        description="Grounded Brain learns stable facts from your chats and uses semantic search to recall them in future conversations. Powered by Mem0."
                        actions={
                            <Button size="lg" onClick={openCreateDialog}>
                                <PlusIcon aria-hidden="true" />
                                Add memory
                            </Button>
                        }
                    />
                </div>

                {isLoading ? (
                    <div aria-busy="true" className="space-y-3">
                        <Skeleton className="h-24 rounded-2xl" />
                        <Skeleton className="h-24 rounded-2xl" />
                    </div>
                ) : error ? (
                    <EmptyState
                        icon={BrainIcon}
                        title="Could not load memories"
                        description="We couldn't reach the memory service. Please try again."
                    />
                ) : memories.length === 0 ? (
                    <EmptyState
                        icon={BrainIcon}
                        title="No memories yet"
                        description="Chat for a while and memories will be extracted from your conversations, or add one manually."
                    >
                        <Button onClick={openCreateDialog}>
                            <PlusIcon aria-hidden="true" />
                            Add memory
                        </Button>
                    </EmptyState>
                ) : (
                    <ul className="space-y-3">
                        {memories.map((memory) => (
                            <li
                                key={memory.id}
                                className="rounded-2xl border border-border bg-card p-5 shadow-surface"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1 space-y-2.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge
                                                variant={
                                                    memory.source === "manual"
                                                        ? "blue"
                                                        : "violet"
                                                }
                                            >
                                                {memory.source === "manual"
                                                    ? "Manual"
                                                    : "Learned"}
                                            </Badge>
                                            {memory.categories?.map(
                                                (category) => (
                                                    <Badge
                                                        key={category}
                                                        variant="outline"
                                                    >
                                                        {category}
                                                    </Badge>
                                                ),
                                            )}
                                        </div>
                                        <p className="text-body">
                                            {memory.memory}
                                        </p>
                                        <p className="text-caption">
                                            Updated{" "}
                                            {formatDistanceToNow(
                                                new Date(memory.updatedAt),
                                                { addSuffix: true },
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() =>
                                                openEditDialog(memory)
                                            }
                                        >
                                            <PencilIcon aria-hidden="true" />
                                            <span className="sr-only">
                                                Edit memory
                                            </span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() =>
                                                setPendingDelete(memory)
                                            }
                                        >
                                            <Trash2Icon aria-hidden="true" />
                                            <span className="sr-only">
                                                Delete memory
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <MemoryFormDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    memory={editingMemory}
                    onSubmit={handleSubmit}
                    isPending={
                        createMemory.isPending || updateMemory.isPending
                    }
                />

                <ConfirmDialog
                    open={pendingDelete !== null}
                    title="Delete this memory?"
                    description="Grounded Brain will no longer recall this in future conversations."
                    isPending={deleteMemory.isPending}
                    onConfirm={() => {
                        if (!pendingDelete) return;
                        deleteMemory.mutate(pendingDelete.id, {
                            onSuccess: () => setPendingDelete(null),
                        });
                    }}
                    onCancel={() => setPendingDelete(null)}
                />
            </div>
        </div>
    );
}
