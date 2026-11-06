import { describe, expect, it } from "vitest";

import { estimateReadingMinutes, extractOutline } from "./markdown-outline";

describe("extractOutline", () => {
    it("returns h2 and h3 headings in order and skips h1", () => {
        const md = "# Title\n\n## The big idea\ntext\n### Detail\n## Feedback";
        expect(extractOutline(md)).toEqual([
            { level: 2, title: "The big idea" },
            { level: 3, title: "Detail" },
            { level: 2, title: "Feedback" },
        ]);
    });

    it("ignores headings inside code fences", () => {
        const md = "## Real\n```sh\n## not a heading\n```\n## Also real";
        expect(extractOutline(md).map((item) => item.title)).toEqual([
            "Real",
            "Also real",
        ]);
    });

    it("strips inline emphasis and trailing hashes", () => {
        expect(extractOutline("## **Bold** idea ##")).toEqual([
            { level: 2, title: "Bold idea" },
        ]);
    });
});

describe("estimateReadingMinutes", () => {
    it("never returns less than one minute", () => {
        expect(estimateReadingMinutes("")).toBe(1);
        expect(estimateReadingMinutes("a few words")).toBe(1);
    });

    it("rounds up by words per minute", () => {
        const words = Array.from({ length: 441 }, () => "word").join(" ");
        expect(estimateReadingMinutes(words)).toBe(3);
    });
});
