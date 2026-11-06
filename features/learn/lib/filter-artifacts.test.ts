import { describe, expect, it } from "vitest";

import { RECENT_WINDOW_MS, filterArtifacts } from "./filter-artifacts";

const NOW = Date.parse("2026-11-07T12:00:00Z");
const at = (msAgo: number) => ({
    id: String(msAgo),
    createdAt: new Date(NOW - msAgo).toISOString(),
});

describe("filterArtifacts", () => {
    const items = [at(RECENT_WINDOW_MS + 1000), at(1000), at(60_000)];

    it("sorts newest first for 'all'", () => {
        const result = filterArtifacts(items, "all", NOW);
        expect(result.map((item) => item.id)).toEqual([
            "1000",
            "60000",
            String(RECENT_WINDOW_MS + 1000),
        ]);
    });

    it("drops artifacts older than a week for 'recent'", () => {
        const result = filterArtifacts(items, "recent", NOW);
        expect(result.map((item) => item.id)).toEqual(["1000", "60000"]);
    });

    it("does not mutate the input", () => {
        const copy = [...items];
        filterArtifacts(items, "all", NOW);
        expect(items).toEqual(copy);
    });
});
