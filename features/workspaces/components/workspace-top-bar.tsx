"use client";

import Link from "next/link";
import { PlusIcon, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/features/profile";
import { routes } from "@/shared/config/routes";
import type { Workspace } from "../lib/types";
import {
    WORKSPACE_SECTION_LABELS,
    type WorkspaceSection,
} from "../lib/workspace-sections";
import { WorkspaceHeaderActions } from "./workspace-header-actions";

type WorkspaceTopBarProps = {
    workspace: Workspace;
    activeSection: WorkspaceSection;
    onAddSource: () => void;
};

export function WorkspaceTopBar({
    workspace,
    activeSection,
    onAddSource,
}: WorkspaceTopBarProps) {
    return (
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur-md sm:gap-3 sm:px-4 md:h-[68px] md:px-6">
            <SidebarTrigger />

            <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
                <ol className="flex items-center gap-2 text-sm">
                    <li className="hidden min-w-0 truncate text-muted-foreground sm:block">
                        {workspace.title}
                    </li>
                    <li
                        aria-hidden="true"
                        className="hidden text-muted-foreground sm:block"
                    >
                        /
                    </li>
                    <li
                        aria-current="page"
                        className="truncate font-medium text-foreground"
                    >
                        {WORKSPACE_SECTION_LABELS[activeSection]}
                    </li>
                </ol>
            </nav>

            <Button
                variant="outline"
                onClick={onAddSource}
                className="max-sm:size-9 max-sm:px-0"
            >
                <PlusIcon aria-hidden="true" />
                <span className="hidden sm:inline">Add source</span>
                <span className="sr-only sm:hidden">Add source</span>
            </Button>
            <WorkspaceHeaderActions workspace={workspace} />
            <UserMenu>
                {/* The gear is in the bar from md up; on a phone it lives here. */}
                <DropdownMenuItem
                    className="md:hidden"
                    render={
                        <Link href={routes.workspace.settings(workspace.id)} />
                    }
                >
                    <SettingsIcon />
                    Notebook settings
                </DropdownMenuItem>
            </UserMenu>
        </header>
    );
}
