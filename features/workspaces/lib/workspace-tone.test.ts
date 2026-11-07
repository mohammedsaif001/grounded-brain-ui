import { describe, expect, it } from "vitest";

import { getWorkspaceTone } from "./workspace-tone";

describe("getWorkspaceTone", () => {
    it("is stable for the same id", () => {
        expect(getWorkspaceTone("ws_abc")).toBe(getWorkspaceTone("ws_abc"));
    });

    it("always returns a themed tone", () => {
        const tones = new Set(
            Array.from({ length: 50 }, (_, index) =>
                getWorkspaceTone(`ws_${index}`),
            ),
        );
        for (const tone of tones) {
            expect(["green", "blue", "violet", "amber", "rose"]).toContain(tone);
        }
        expect(tones.size).toBeGreaterThan(1);
    });
});
