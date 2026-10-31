import { WorkspaceSettingsForm } from "@/features/workspaces";
import { requireWorkspace } from "@/features/workspaces/server";

export default async function WorkspaceSettingsPage({
    params,
}: PageProps<"/workspace/[id]/settings">) {
    const { id } = await params;
    const workspace = await requireWorkspace(id);

    return <WorkspaceSettingsForm workspace={workspace} />;
}
