import { SourceLibrary } from "@/features/sources";

export default async function WorkspaceSourcesPage({
    params,
}: PageProps<"/workspace/[id]/sources">) {
    const { id } = await params;

    return <SourceLibrary workspaceId={id} />;
}
