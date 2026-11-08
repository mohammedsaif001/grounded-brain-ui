"use client";

import {
    CircleHelpIcon,
    PlusIcon,
} from "lucide-react";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { Workspace } from "../lib/types";
import {
    WORKSPACE_SECTION_LABELS,
    type WorkspaceSection,
} from "../lib/workspace-sections";
import { WorkspaceHeaderActions } from "./workspace-header-actions";
import Link from "next/link";
import { routes } from "@/shared/config/routes";

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
        <header className="sticky top-0 z-20 flex h-[68px] shrink-0 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-md md:px-6">
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

            <Button variant="outline" onClick={onAddSource}>
                <PlusIcon aria-hidden="true" />
                <span className="hidden sm:inline">Add source</span>
                <span className="sr-only sm:hidden">Add source</span>
            </Button>
            <Button
                nativeButton={false}
                variant="ghost"
                size="icon"
                render={<Link href={routes.docs} target="_blank" />}
            >
                <CircleHelpIcon aria-hidden="true" />
                <span className="sr-only">Open the guide in a new tab</span>
            </Button>
            <WorkspaceHeaderActions workspace={workspace} />
            <SignOutButton />
        </header>
    );
}
