import type { Metadata } from "next";
import { ArtifactDetail } from "@/features/learn";

export const metadata: Metadata = {
    title: "Study material",
    description:
        "Study with flashcards, quizzes, summaries and mind maps built from your sources.",
};

export default async function ArtifactPage({
    params,
}: PageProps<"/workspace/[id]/learn/[artifactId]">) {
    const { id, artifactId } = await params;

    return <ArtifactDetail workspaceId={id} artifactId={artifactId} />;
}
