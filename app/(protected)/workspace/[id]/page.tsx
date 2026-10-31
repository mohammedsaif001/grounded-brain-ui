import { Suspense } from "react";
import { WorkspaceChat } from "@/features/chat";
import { requireWorkspace } from "@/features/workspaces/server";

export default async function WorkspaceChatPage({
    params,
}: PageProps<"/workspace/[id]">) {
    const { id } = await params;
    const workspace = await requireWorkspace(id);

    return (
        <Suspense fallback={null}>
            <WorkspaceChat
                workspaceId={workspace.id}
                defaultModel={workspace.defaultModel}
            />
        </Suspense>
    );
}
