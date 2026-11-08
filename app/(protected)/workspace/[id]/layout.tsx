import type { Metadata } from "next";
import { WorkspaceShell } from "@/features/workspaces";
import { getWorkspace, requireWorkspace } from "@/features/workspaces/server";

/** Dynamic titles use the notebook's own name; the fetch is request-cached, so it costs nothing extra. */
export async function generateMetadata({
    params,
}: LayoutProps<"/workspace/[id]">): Promise<Metadata> {
    const { id } = await params;
    const workspace = await getWorkspace(id);

    if (!workspace) {
        return { title: "Notebook not found" };
    }

    return {
        title: {
            default: workspace.title,
            template: `%s · ${workspace.title} · Grounded Brain`,
        },
        description:
            workspace.description?.trim() ||
            `Chat with the sources in ${workspace.title}, with cited answers and study material.`,
    };
}

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
