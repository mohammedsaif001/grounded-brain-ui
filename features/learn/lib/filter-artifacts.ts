import type { LearningArtifact } from "./types";

export type ArtifactFilter = "all" | "recent";

export const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Newest first. "recent" keeps artifacts generated within the last week of `now`.
 * `now` is injected so the function stays pure and testable.
 */
export function filterArtifacts<
    T extends Pick<LearningArtifact, "createdAt">,
>(artifacts: readonly T[], filter: ArtifactFilter, now: number): T[] {
    const sorted = [...artifacts].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (filter === "all") return sorted;

    const cutoff = now - RECENT_WINDOW_MS;
    return sorted.filter(
        (artifact) => new Date(artifact.createdAt).getTime() >= cutoff,
    );
}
