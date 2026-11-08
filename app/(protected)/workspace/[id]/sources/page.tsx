import type { Metadata } from "next";
import { SourceLibrary } from "@/features/sources";
import { requireWorkspace } from "@/features/workspaces/server";

export const metadata: Metadata = {
    title: "Sources",
    description:
        "Add, search and manage the PDFs, websites, videos and repositories behind your answers.",
};

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
