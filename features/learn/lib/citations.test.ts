import { describe, expect, it } from "vitest";
import {
    findCitationByMarker,
    formatSourceLabels,
    injectSummaryMarkers,
    uniqueCitations,
} from "./citations";
import { parseArtifactContent } from "./content";

const stick = { marker: 1, sourceId: "a", label: "Make It Stick" };
const learn = { marker: 2, sourceId: "b", label: "Learning How to Learn" };

describe("uniqueCitations", () => {
    it("keeps one entry per source, in first-seen order", () => {
        expect(uniqueCitations([stick, learn, { ...stick, marker: 3 }])).toEqual([
            stick,
            learn,
        ]);
    });
});

describe("formatSourceLabels", () => {
    it("joins distinct source titles", () => {
        expect(formatSourceLabels([stick, learn, stick])).toBe(
            "Make It Stick, Learning How to Learn",
        );
    });

    it("returns null when there are no citations", () => {
        expect(formatSourceLabels([])).toBeNull();
    });
});

describe("injectSummaryMarkers", () => {
    it("wraps markers that have a citation", () => {
        expect(injectSummaryMarkers("Retrieval helps [1] and spacing [2].", [stick, learn])).toBe(
            'Retrieval helps <cite index="1">1</cite> and spacing <cite index="2">2</cite>.',
        );
    });

    it("leaves markers without a citation as written", () => {
        expect(injectSummaryMarkers("See [1] and [7].", [stick])).toBe(
            'See <cite index="1">1</cite> and [7].',
        );
    });

    it("does not touch markdown links or other brackets", () => {
        expect(injectSummaryMarkers("[1](https://x.dev) and [note]", [stick])).toBe(
            "[1](https://x.dev) and [note]",
        );
    });

    it("returns the markdown unchanged when there are no citations", () => {
        expect(injectSummaryMarkers("Plain [1] text", [])).toBe("Plain [1] text");
    });
});

describe("findCitationByMarker", () => {
    it("resolves by marker number, not by position", () => {
        expect(findCitationByMarker([learn, stick], 1)).toBe(stick);
        expect(findCitationByMarker([stick], 9)).toBeUndefined();
    });
});

describe("artifact content citations", () => {
    it("defaults missing citations to an empty list for older artifacts", () => {
        const parsed = parseArtifactContent({
            type: "FLASHCARDS",
            content: { cards: [{ front: "Q", back: "A" }] },
        });

        expect(parsed?.type === "FLASHCARDS" && parsed.content.cards[0].citations).toEqual([]);
    });

    it("keeps valid citations on flashcards and drops malformed ones", () => {
        const parsed = parseArtifactContent({
            type: "FLASHCARDS",
            content: {
                cards: [
                    {
                        front: "Q",
                        back: "A",
                        citations: [stick, { marker: "x" }, "junk"],
                    },
                ],
            },
        });

        expect(parsed?.type === "FLASHCARDS" && parsed.content.cards[0].citations).toEqual([stick]);
    });

    it("reads citations on quiz questions, report sections and summaries", () => {
        const quiz = parseArtifactContent({
            type: "QUIZ",
            content: {
                questions: [
                    {
                        question: "Q?",
                        options: ["a", "b"],
                        correctIndex: 0,
                        explanation: "because",
                        citations: [stick],
                    },
                ],
            },
        });
        const report = parseArtifactContent({
            type: "REPORT",
            content: {
                markdown: "# R",
                sections: [{ title: "S", content: "c", citations: [learn] }],
            },
        });
        const summary = parseArtifactContent({
            type: "SUMMARY",
            content: { markdown: "Text [1]", citations: [stick] },
        });

        expect(quiz?.type === "QUIZ" && quiz.content.questions[0].citations).toEqual([stick]);
        expect(report?.type === "REPORT" && report.content.sections[0].citations).toEqual([learn]);
        expect(summary?.type === "SUMMARY" && summary.content.citations).toEqual([stick]);
    });
});
