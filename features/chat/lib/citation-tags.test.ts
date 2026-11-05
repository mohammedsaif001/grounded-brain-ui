import { describe, expect, it } from "vitest";

import { injectCitationTags } from "./citation-tags";

describe("injectCitationTags", () => {
    it("rewrites numeric markers into index cite tags", () => {
        expect(injectCitationTags("Recall helps [1].")).toBe(
            'Recall helps <cite index="1">1</cite>.',
        );
    });

    it("rewrites web markers into web cite tags", () => {
        expect(injectCitationTags("See [W2]")).toBe(
            'See <cite web="2">W2</cite>',
        );
    });

    it("handles adjacent and repeated markers", () => {
        expect(injectCitationTags("[1][2] and [W1]")).toBe(
            '<cite index="1">1</cite><cite index="2">2</cite> and <cite web="1">W1</cite>',
        );
    });

    it("leaves other bracketed text untouched", () => {
        expect(injectCitationTags("[link](x) and [note]")).toBe(
            "[link](x) and [note]",
        );
    });
});
