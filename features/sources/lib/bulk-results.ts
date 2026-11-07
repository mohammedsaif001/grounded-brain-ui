import type { BulkDeleteResult, ReprocessManyResult } from "./types";

export type BulkOutcome = {
    tone: "success" | "warning";
    title: string;
    description?: string;
};

const sources = (count: number) => `${count} source${count === 1 ? "" : "s"}`;

/** Joins non-empty parts: "2 already running, 1 failed". */
function list(parts: Array<string | false>) {
    return parts.filter(Boolean).join(", ");
}

export function summarizeBulkDelete({
    deleted,
    results,
}: BulkDeleteResult): BulkOutcome {
    const missing = results.filter((r) => r.status === "not_found").length;
    const failed = results.filter((r) => r.status === "failed").length;
    const problems = list([
        missing > 0 && `${missing} not found`,
        failed > 0 && `${failed} could not be deleted`,
    ]);

    return {
        tone: problems ? "warning" : "success",
        title: `Deleted ${sources(deleted)}`,
        description: problems || undefined,
    };
}

/**
 * "Skipped" means the source is still being processed, so it is reported as
 * "already running" and does not make the outcome a warning.
 */
export function summarizeReprocess({
    reprocessed,
    results,
}: ReprocessManyResult): BulkOutcome {
    const running = results.filter((r) => r.status === "skipped").length;
    const missing = results.filter((r) => r.status === "not_found").length;
    const failed = results.filter((r) => r.status === "failed").length;
    const notes = list([
        running > 0 && `${running} already running`,
        missing > 0 && `${missing} not found`,
        failed > 0 && `${failed} could not be queued`,
    ]);

    return {
        tone: missing > 0 || failed > 0 ? "warning" : "success",
        title:
            reprocessed > 0
                ? `Reprocessing ${sources(reprocessed)}`
                : "Nothing to reprocess",
        description: notes || undefined,
    };
}
