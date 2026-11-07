import { describe, expect, it } from "vitest";
import { summarizeBulkDelete, summarizeReprocess } from "./bulk-results";

describe("summarizeBulkDelete", () => {
    it("reports a clean delete as success", () => {
        expect(
            summarizeBulkDelete({
                deleted: 2,
                results: [
                    { sourceId: "a", status: "deleted" },
                    { sourceId: "b", status: "deleted" },
                ],
            }),
        ).toEqual({ tone: "success", title: "Deleted 2 sources" });
    });

    it("warns about ids that were not found or failed, without hiding the rest", () => {
        expect(
            summarizeBulkDelete({
                deleted: 1,
                results: [
                    { sourceId: "a", status: "deleted" },
                    { sourceId: "b", status: "not_found" },
                    { sourceId: "c", status: "failed" },
                ],
            }),
        ).toEqual({
            tone: "warning",
            title: "Deleted 1 source",
            description: "1 not found, 1 could not be deleted",
        });
    });
});

describe("summarizeReprocess", () => {
    it("treats skipped sources as already running, not as an error", () => {
        expect(
            summarizeReprocess({
                reprocessed: 1,
                results: [
                    { sourceId: "a", status: "queued" },
                    { sourceId: "b", status: "skipped", reason: "Already being processed" },
                ],
            }),
        ).toEqual({
            tone: "success",
            title: "Reprocessing 1 source",
            description: "1 already running",
        });
    });

    it("warns when an id is missing or failed", () => {
        const outcome = summarizeReprocess({
            reprocessed: 0,
            results: [
                { sourceId: "a", status: "not_found" },
                { sourceId: "b", status: "failed" },
            ],
        });
        expect(outcome.tone).toBe("warning");
        expect(outcome.title).toBe("Nothing to reprocess");
        expect(outcome.description).toBe("1 not found, 1 could not be queued");
    });
});
