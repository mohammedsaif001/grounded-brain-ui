import { SourceLibrary } from "@/features/sources";
import { requireWorkspace } from "@/features/workspaces/server";

export default async function WorkspaceSourcesPage({
    params,
}: PageProps<"/workspace/[id]/sources">) {
    const { id } = await params;
    // Request-cached, so this reuses the layout's fetch.
    const workspace = await requireWorkspace(id);

    return (
        <SourceLibrary
            workspaceId={workspace.id}
            workspaceTitle={workspace.title}
        />
    );
}
