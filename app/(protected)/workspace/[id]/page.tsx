import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireSession } from "@/features/auth/server";
import { WorkspaceChat } from "@/features/chat";
import { getWorkspace } from "@/features/workspaces/server";
import { WorkspaceShell } from "@/features/workspaces";

type WorkspacePageProps = {
    params: Promise<{ id: string }>;
};

export default async function WorkspacePage({ params }: WorkspacePageProps) {
    await requireSession();
    const { id } = await params;
    const workspace = await getWorkspace(id);

    if (!workspace) {
        notFound();
    }

    return (
        <WorkspaceShell workspace={workspace}>
            <Suspense fallback={null}>
                <WorkspaceChat
                    workspaceId={workspace.id}
                    defaultModel={workspace.defaultModel}
                />
            </Suspense>
        </WorkspaceShell>
    );
}
