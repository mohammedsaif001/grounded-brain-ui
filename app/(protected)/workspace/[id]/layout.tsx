import { WorkspaceShell } from "@/features/workspaces";
import { requireWorkspace } from "@/features/workspaces/server";

/**
 * Renders the workspace chrome once for every workspace route, so the sidebar keeps
 * its state across navigation instead of remounting on each page.
 */
export default async function WorkspaceLayout({
    children,
    params,
}: LayoutProps<"/workspace/[id]">) {
    const { id } = await params;
    const workspace = await requireWorkspace(id);

    return <WorkspaceShell workspace={workspace}>{children}</WorkspaceShell>;
}
