import { ArtifactDetail } from "@/features/learn";

export default async function ArtifactPage({
    params,
}: PageProps<"/workspace/[id]/learn/[artifactId]">) {
    const { id, artifactId } = await params;

    return <ArtifactDetail workspaceId={id} artifactId={artifactId} />;
}
