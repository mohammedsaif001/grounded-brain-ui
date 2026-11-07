"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
    CHAT_MODEL_ITEMS,
    CHAT_MODEL_LABELS,
    CHAT_MODELS,
    resolveChatModel,
    type ChatModelId,
} from "@/shared/config/models";
import {
    useDeleteWorkspace,
    useUpdateWorkspace,
} from "../hooks/use-workspaces";
import type { Workspace } from "../lib/types";
import { resolveWorkspaceIcon } from "../lib/workspace-icons";
import { DeleteWorkspaceDialog } from "./delete-workspace-dialog";
import { WorkspaceIconPicker } from "./workspace-icon-picker";
import { PageHeader } from "@/shared/components/page-header";
import { routes } from "@/shared/config/routes";
import { CheckIcon, Trash2Icon } from "lucide-react";

type WorkspaceSettingsFormProps = {
    workspace: Workspace;
};

export function WorkspaceSettingsForm({ workspace }: WorkspaceSettingsFormProps) {
    const router = useRouter();
    const updateWorkspace = useUpdateWorkspace();
    const deleteWorkspace = useDeleteWorkspace();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [title, setTitle] = useState(workspace.title);
    const [description, setDescription] = useState(workspace.description ?? "");
    const [icon, setIcon] = useState(resolveWorkspaceIcon(workspace.icon));
    const [defaultModel, setDefaultModel] = useState<ChatModelId>(() =>
        resolveChatModel(workspace.defaultModel),
    );

    async function handleSave(event: React.FormEvent) {
        event.preventDefault();

        try {
            await updateWorkspace.mutateAsync({
                workspaceId: workspace.id,
                input: {
                    title: title.trim(),
                    // Send "" (not undefined) so an emptied description is actually cleared.
                    description: description.trim(),
                    icon,
                    defaultModel,
                },
            });
        } catch {
            return; // Reported by the global mutation error toast.
        }

        toast.add({ type: "success", title: "Workspace updated" });
        // The workspace shell is rendered by a server layout; refresh it with the new values.
        router.refresh();
    }

    async function handleDelete() {
        await deleteWorkspace.mutateAsync(workspace.id);
        router.replace(routes.dashboard);
    }

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-6">
            <PageHeader
                eyebrow="Workspace"
                title="Workspace settings"
                description="Manage this workspace's details and defaults."
            />

            <form onSubmit={(event) => void handleSave(event)} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <p id="workspace-icon-label" className="text-sm font-medium">
                        Icon
                    </p>
                    <WorkspaceIconPicker
                        value={icon}
                        onChange={setIcon}
                        labelledBy="workspace-icon-label"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="defaultModel">Default chat model</Label>
                    <Select
                        items={CHAT_MODEL_ITEMS}
                        value={defaultModel}
                        onValueChange={(value) =>
                            setDefaultModel(value as ChatModelId)
                        }
                    >
                        <SelectTrigger id="defaultModel">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {CHAT_MODELS.map((model) => (
                                <SelectItem key={model} value={model}>
                                    {CHAT_MODEL_LABELS[model]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button type="submit" size="lg" disabled={updateWorkspace.isPending}>
                    {updateWorkspace.isPending ? (
                        <Spinner />
                    ) : (
                        <CheckIcon aria-hidden="true" />
                    )}
                    Save changes
                </Button>
            </form>

            <section
                aria-labelledby="danger-zone-title"
                className="rounded-2xl border border-destructive/30 bg-tint-rose/50 p-5"
            >
                <h2
                    id="danger-zone-title"
                    className="text-heading text-destructive"
                >
                    Danger zone
                </h2>
                <p className="text-body mt-1 text-muted-foreground">
                    Deleting this workspace removes all sources, conversations,
                    and indexed vectors permanently.
                </p>
                <Button
                    type="button"
                    variant="destructive"
                    className="mt-4"
                    onClick={() => setDeleteOpen(true)}
                >
                    <Trash2Icon aria-hidden="true" />
                    Delete workspace
                </Button>
            </section>

            <DeleteWorkspaceDialog
                workspace={workspace}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDelete}
                isPending={deleteWorkspace.isPending}
            />
        </div>
    );
}
