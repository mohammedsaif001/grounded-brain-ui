import { routes } from "@/shared/config/routes";

export type WorkspaceSection = "chat" | "learn" | "sources" | "settings";

export const WORKSPACE_SECTION_LABELS: Record<WorkspaceSection, string> = {
    chat: "Chat",
    learn: "Learn",
    sources: "Sources",
    settings: "Settings",
};

function isWithin(pathname: string, base: string) {
    return pathname === base || pathname.startsWith(`${base}/`);
}

/**
 * Maps a pathname to the workspace section it belongs to. Chat is the workspace
 * index, so it is the fallback for anything that is not another section.
 */
export function getWorkspaceSection(
    pathname: string,
    workspaceId: string,
): WorkspaceSection {
    if (isWithin(pathname, routes.workspace.sources(workspaceId))) return "sources";
    if (isWithin(pathname, routes.workspace.learn(workspaceId))) return "learn";
    if (isWithin(pathname, routes.workspace.settings(workspaceId))) return "settings";
    return "chat";
}
