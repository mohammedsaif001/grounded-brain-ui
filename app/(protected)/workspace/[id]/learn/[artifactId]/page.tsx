import { notFound } from "next/navigation";
import { requireSession } from "@/features/auth/server";
import { ArtifactDetail } from "@/features/learn";
import { getWorkspace } from "@/features/workspaces/server";
import { WorkspaceShell } from "@/features/workspaces";

type ArtifactPageProps = {
    params: Promise<{ id: string; artifactId: string }>;
};

export default async function ArtifactPage({ params }: ArtifactPageProps) {
    await requireSession();
    const { id, artifactId } = await params;
    const workspace = await getWorkspace(id);

    if (!workspace) {
        notFound();
    }

    return (
        <WorkspaceShell workspace={workspace}>
            <ArtifactDetail
                workspaceId={workspace.id}
                artifactId={artifactId}
            />
        </WorkspaceShell>
    );
}
