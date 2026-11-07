import { describe, expect, it } from "vitest";
import {
    describeSource,
    formatDuration,
    readSourceFacts,
    repoFullName,
} from "./source-metadata";

const base = { url: null, metadata: null, createdAt: "2026-11-01T10:00:00Z" };

describe("formatDuration", () => {
    it("formats minutes and seconds", () => {
        expect(formatDuration(1122)).toBe("18:42");
        expect(formatDuration(5)).toBe("0:05");
    });

    it("adds hours past an hour", () => {
        expect(formatDuration(3725)).toBe("1:02:05");
    });

    it("drops fractions", () => {
        expect(formatDuration(59.9)).toBe("0:59");
    });
});

describe("readSourceFacts", () => {
    it("ignores keys with the wrong type", () => {
        expect(
            readSourceFacts({ author: 4, pageCount: "24", wordCount: -3 }),
        ).toEqual({
            author: undefined,
            pageCount: undefined,
            wordCount: undefined,
            durationSeconds: undefined,
            fileCount: undefined,
            repo: undefined,
            owner: undefined,
        });
    });

    it("tolerates missing metadata", () => {
        expect(readSourceFacts(null).author).toBeUndefined();
    });
});

describe("repoFullName", () => {
    it("joins owner and repo, since repo is only the name", () => {
        expect(repoFullName({ owner: "vercel", repo: "next.js" })).toBe(
            "vercel/next.js",
        );
    });

    it("falls back to whichever half is known", () => {
        expect(repoFullName({ repo: "next.js" })).toBe("next.js");
        expect(repoFullName({})).toBeUndefined();
    });
});

describe("describeSource", () => {
    it("shows PDF author and pages", () => {
        expect(
            describeSource({
                ...base,
                type: "PDF",
                metadata: { author: "Brown, Roediger & McDaniel", pageCount: 24 },
            }),
        ).toBe("Brown, Roediger & McDaniel · 24 pages");
    });

    it("omits the author when the PDF names none", () => {
        expect(
            describeSource({ ...base, type: "PDF", metadata: { pageCount: 1 } }),
        ).toBe("1 page");
    });

    it("shows YouTube channel and duration", () => {
        expect(
            describeSource({
                ...base,
                type: "YOUTUBE",
                metadata: { author: "Barbara Oakley", durationSeconds: 1122 },
            }),
        ).toBe("Barbara Oakley · 18:42");
    });

    it("shows GitHub as owner/repo with its file count", () => {
        expect(
            describeSource({
                ...base,
                type: "GITHUB",
                metadata: { owner: "vercel", repo: "next.js", fileCount: 46 },
            }),
        ).toBe("vercel/next.js · 46 files");
    });

    it("shows word counts for text sources", () => {
        expect(
            describeSource({
                ...base,
                type: "TEXT",
                metadata: { wordCount: 1204 },
            }),
        ).toBe("1,204 words");
    });

    it("keeps the host for websites and adds the word count", () => {
        expect(
            describeSource({
                ...base,
                type: "WEBSITE",
                url: "https://www.example.com/post",
                metadata: { wordCount: 800 },
            }),
        ).toBe("example.com · 800 words");
    });

    it("falls back to the host, then to when it was added, for older sources", () => {
        expect(
            describeSource({
                ...base,
                type: "WEBSITE",
                url: "https://www.example.com/post",
            }),
        ).toBe("example.com");
        expect(describeSource({ ...base, type: "PDF" })).toMatch(/^Added .* ago$/);
    });
});
