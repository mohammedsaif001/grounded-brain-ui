import { notFound } from "next/navigation";
import { requireSession } from "@/features/auth/server";
import { getWorkspace } from "@/features/workspaces/server";
import { WorkspaceShell } from "@/features/workspaces";
import { WorkspaceSettingsForm } from "@/features/workspaces/components/workspace-settings-form";

type WorkspaceSettingsPageProps = {
    params: Promise<{ id: string }>;
};

export default async function WorkspaceSettingsPage({
    params,
}: WorkspaceSettingsPageProps) {
    await requireSession();
    const { id } = await params;
    const workspace = await getWorkspace(id);

    if (!workspace) {
        notFound();
    }

    return (
        <WorkspaceShell workspace={workspace}>
            <WorkspaceSettingsForm workspace={workspace} />
        </WorkspaceShell>
    );
}
