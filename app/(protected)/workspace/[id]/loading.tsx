import { CardGridPageSkeleton } from "@/shared/components/page-skeletons";

/** Fallback for any workspace page; the shell (sidebar, header) stays mounted around it. */
export default function WorkspacePageLoading() {
    return <CardGridPageSkeleton />;
}
