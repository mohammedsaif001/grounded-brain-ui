import { describe, expect, it } from "vitest";
import {
    getDashboardTotals,
    getGreeting,
    getMostRecentWorkspace,
} from "./dashboard";

describe("getGreeting", () => {
    it.each([
        [5, "Good morning"],
        [11, "Good morning"],
        [12, "Good afternoon"],
        [17, "Good afternoon"],
        [18, "Good evening"],
        [23, "Good evening"],
        [2, "Good evening"],
    ])("hour %i is %s", (hour, expected) => {
        expect(getGreeting(hour)).toBe(expected);
    });
});

describe("getDashboardTotals", () => {
    it("sums every notebook", () => {
        expect(
            getDashboardTotals([
                { sourceCount: 2, artifactCount: 3 },
                { sourceCount: 5, artifactCount: 0 },
            ]),
        ).toEqual({ notebooks: 2, sources: 7, studyGuides: 3 });
    });

    it("is all zeros for no notebooks", () => {
        expect(getDashboardTotals([])).toEqual({
            notebooks: 0,
            sources: 0,
            studyGuides: 0,
        });
    });
});

describe("getMostRecentWorkspace", () => {
    it("picks the latest updatedAt regardless of order", () => {
        const result = getMostRecentWorkspace([
            { id: "a", updatedAt: "2026-11-01T10:00:00Z" },
            { id: "b", updatedAt: "2026-11-08T10:00:00Z" },
            { id: "c", updatedAt: "2026-11-05T10:00:00Z" },
        ]);

        expect(result?.id).toBe("b");
    });

    it("returns undefined for an empty list", () => {
        expect(getMostRecentWorkspace([])).toBeUndefined();
    });
});
