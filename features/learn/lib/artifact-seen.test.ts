import { describe, expect, it } from "vitest";
import { isUnseenArtifact } from "./types";

describe("isUnseenArtifact", () => {
    it("is true for a READY artifact nobody opened", () => {
        expect(isUnseenArtifact({ status: "READY", viewedAt: null })).toBe(true);
    });

    it("is false once it has been viewed", () => {
        expect(
            isUnseenArtifact({ status: "READY", viewedAt: "2026-11-07T10:00:00Z" }),
        ).toBe(false);
    });

    it.each(["PENDING", "PROCESSING", "FAILED"] as const)(
        "is false while %s, since there is nothing to open yet",
        (status) => {
            expect(isUnseenArtifact({ status, viewedAt: null })).toBe(false);
        },
    );
});
