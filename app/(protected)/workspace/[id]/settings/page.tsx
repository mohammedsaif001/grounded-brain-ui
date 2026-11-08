import type { Metadata } from "next";
import { WorkspaceSettingsForm } from "@/features/workspaces";
import { requireWorkspace } from "@/features/workspaces/server";

export const metadata: Metadata = {
    title: "Settings",
    description:
        "Rename this notebook, change its default model or delete it.",
};

export default async function WorkspaceSettingsPage({
    params,
}: PageProps<"/workspace/[id]/settings">) {
    const { id } = await params;
    const workspace = await requireWorkspace(id);

    return <WorkspaceSettingsForm workspace={workspace} />;
}
