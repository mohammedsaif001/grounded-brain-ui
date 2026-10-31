import { notFound } from "next/navigation";
import { requireSession } from "@/features/auth/server";
import { SourceLibrary } from "@/features/sources";
import { getWorkspace } from "@/features/workspaces/server";
import { WorkspaceShell } from "@/features/workspaces";

type WorkspaceSourcesPageProps = {
    params: Promise<{ id: string }>;
};

export default async function WorkspaceSourcesPage({
    params,
}: WorkspaceSourcesPageProps) {
    await requireSession();
    const { id } = await params;
    const workspace = await getWorkspace(id);

    if (!workspace) {
        notFound();
    }

    return (
        <WorkspaceShell workspace={workspace}>
            <SourceLibrary workspaceId={workspace.id} />
        </WorkspaceShell>
    );
}
