import { describe, expect, it } from "vitest";
import { describeCitationLocation } from "./citations";
import { chatCitationSchema } from "./schemas";

const base = { sourceTitle: "Make It Stick", sourceType: "PDF", excerpt: "…" };

describe("describeCitationLocation", () => {
    it("lists chapter, page and chunk position for a PDF", () => {
        expect(
            describeCitationLocation({
                ...base,
                chapter: "Chapter 2",
                page: 28,
                chunkIndex: 11,
                chunkTotal: 48,
            }),
        ).toEqual(["Chapter 2", "Page 28", "Chunk 12 of 48"]);
    });

    it("shows a section for websites and markdown", () => {
        expect(
            describeCitationLocation({
                ...base,
                sourceType: "WEBSITE",
                section: "Spaced practice",
                chunkIndex: 0,
                chunkTotal: 3,
            }),
        ).toEqual(["Spaced practice", "Chunk 1 of 3"]);
    });

    it("falls back to the bare chunk number when the total is unknown", () => {
        expect(describeCitationLocation({ ...base, chunkIndex: 4 })).toEqual([
            "Chunk 5",
        ]);
    });

    it("returns nothing for citations without a location, such as web results", () => {
        expect(describeCitationLocation({ ...base, sourceType: "WEB" })).toEqual(
            [],
        );
    });

    it("keeps a GitHub path", () => {
        expect(
            describeCitationLocation({ ...base, path: "src/index.ts" }),
        ).toEqual(["src/index.ts"]);
    });
});

describe("chatCitationSchema", () => {
    it("accepts the new optional fields", () => {
        expect(
            chatCitationSchema.safeParse({
                ...base,
                chunkTotal: 48,
                chapter: "Ch 2",
                section: "Intro",
            }).success,
        ).toBe(true);
    });
});
