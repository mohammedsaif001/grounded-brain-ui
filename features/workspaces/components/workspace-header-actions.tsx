"use client";

import Link from "next/link";
import { SettingsIcon } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useWorkspaceChatPrefs } from "@/features/chat/stores/chat-preferences";
import {
    CHAT_MODEL_LABELS,
    CHAT_MODELS,
    isChatModel,
} from "@/shared/config/models";
import { workspaceRoutes } from "../lib/routes";
import type { Workspace } from "../lib/types";

type WorkspaceHeaderActionsProps = {
    workspace: Workspace;
};

export function WorkspaceHeaderActions({
    workspace,
}: WorkspaceHeaderActionsProps) {
    const { model, setModel } = useWorkspaceChatPrefs(
        workspace.id,
        workspace.defaultModel,
    );

    return (
        <div className="flex items-center gap-2">
            <Select
                value={model}
                onValueChange={(value) => {
                    if (isChatModel(value)) {
                        setModel(value);
                    }
                }}
            >
                <SelectTrigger className="hidden h-8 w-[140px] sm:flex">
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

            <ModeToggle />

            <Button
                nativeButton={false}
                variant="ghost"
                size="icon-sm"
                render={
                    <Link href={workspaceRoutes.settings(workspace.id)} />
                }
            >
                <SettingsIcon />
                <span className="sr-only">Workspace settings</span>
            </Button>
        </div>
    );
}
