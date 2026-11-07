"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AddSourceDialog } from "@/features/sources";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Workspace } from "../lib/types";
import { getWorkspaceSection } from "../lib/workspace-sections";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { WorkspaceTopBar } from "./workspace-top-bar";

type WorkspaceShellProps = {
    workspace: Workspace;
    children: React.ReactNode;
};

export function WorkspaceShell({ workspace, children }: WorkspaceShellProps) {
    const pathname = usePathname();
    const [addSourceOpen, setAddSourceOpen] = useState(false);
    const activeSection = getWorkspaceSection(pathname, workspace.id);
    const openAddSource = () => setAddSourceOpen(true);

    return (
        <SidebarProvider className="bg-page">
            <WorkspaceSidebar
                workspace={workspace}
                activeSection={activeSection}
                onAddSource={openAddSource}
            />

            <SidebarInset>
                <WorkspaceTopBar
                    workspace={workspace}
                    activeSection={activeSection}
                    onAddSource={openAddSource}
                />
                <div className="flex min-h-0 flex-1 flex-col">{children}</div>
            </SidebarInset>

            <AddSourceDialog
                workspaceId={workspace.id}
                workspaceTitle={workspace.title}
                open={addSourceOpen}
                onOpenChange={setAddSourceOpen}
            />
        </SidebarProvider>
    );
}
