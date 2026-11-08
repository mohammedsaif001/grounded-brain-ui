import type { Metadata } from "next";
import { SourceDetail } from "@/features/sources";

export const metadata: Metadata = {
    title: "Source",
    description:
        "Read a source in full and see how it is used in your answers.",
};

export default async function SourceDetailPage({
    params,
}: PageProps<"/workspace/[id]/sources/[sourceId]">) {
    const { id, sourceId } = await params;

    return <SourceDetail workspaceId={id} sourceId={sourceId} />;
}
