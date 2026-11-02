import { WorkspaceShellSkeleton } from "@/features/workspaces";
import { CardGridPageSkeleton } from "@/shared/components/page-skeletons";

/**
 * Shown while `[id]/layout.tsx` fetches the workspace. It has to live one segment up:
 * a `loading.tsx` wraps the page and nested layouts, never the layout beside it.
 */
export default function WorkspaceLoading() {
    return (
        <WorkspaceShellSkeleton>
            <CardGridPageSkeleton />
        </WorkspaceShellSkeleton>
    );
}
