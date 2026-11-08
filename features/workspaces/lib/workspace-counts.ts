import type { Workspace } from "./types";

function plural(count: number, singular: string, pluralForm = `${singular}s`) {
    return `${count} ${count === 1 ? singular : pluralForm}`;
}

/** "8 sources · 6 study guides", the one-line summary on a notebook card. */
export function formatWorkspaceCounts({
    sourceCount,
    artifactCount,
}: Pick<Workspace, "sourceCount" | "artifactCount">): string {
    return [
        plural(sourceCount, "source"),
        plural(artifactCount, "study guide"),
    ].join(" · ");
}
