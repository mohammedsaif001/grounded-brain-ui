import { notFound } from "next/navigation";
import { requireSession } from "@/features/auth/server";
import { LearnHub } from "@/features/learn";
import { getWorkspace } from "@/features/workspaces/server";
import { WorkspaceShell } from "@/features/workspaces";

type LearnPageProps = {
    params: Promise<{ id: string }>;
};

export default async function LearnPage({ params }: LearnPageProps) {
    await requireSession();
    const { id } = await params;
    const workspace = await getWorkspace(id);

    if (!workspace) {
        notFound();
    }

    return (
        <WorkspaceShell workspace={workspace}>
            <LearnHub workspaceId={workspace.id} />
        </WorkspaceShell>
    );
}
