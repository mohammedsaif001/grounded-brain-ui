import { SourceDetail } from "@/features/sources";

export default async function SourceDetailPage({
    params,
}: PageProps<"/workspace/[id]/sources/[sourceId]">) {
    const { id, sourceId } = await params;

    return <SourceDetail workspaceId={id} sourceId={sourceId} />;
}
