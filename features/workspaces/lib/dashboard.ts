import type { Workspace } from "./types";

/** "Good morning" by local hour. Kept pure so it can be tested without a clock. */
export function getGreeting(hour: number): string {
    if (hour >= 5 && hour < 12) {
        return "Good morning";
    }
    if (hour >= 12 && hour < 18) {
        return "Good afternoon";
    }
    return "Good evening";
}

export type DashboardTotals = {
    notebooks: number;
    sources: number;
    studyGuides: number;
};

export function getDashboardTotals(
    workspaces: readonly Pick<Workspace, "sourceCount" | "artifactCount">[],
): DashboardTotals {
    return workspaces.reduce<DashboardTotals>(
        (totals, workspace) => ({
            notebooks: totals.notebooks + 1,
            sources: totals.sources + workspace.sourceCount,
            studyGuides: totals.studyGuides + workspace.artifactCount,
        }),
        { notebooks: 0, sources: 0, studyGuides: 0 },
    );
}

/** The notebook worked on most recently, or `undefined` when there are none. */
export function getMostRecentWorkspace<
    T extends Pick<Workspace, "updatedAt">,
>(workspaces: readonly T[]): T | undefined {
    return workspaces.reduce<T | undefined>(
        (latest, workspace) =>
            !latest ||
            new Date(workspace.updatedAt).getTime() >
                new Date(latest.updatedAt).getTime()
                ? workspace
                : latest,
        undefined,
    );
}
