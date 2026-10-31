import { describe, expect, it } from "vitest";
import { parseArtifactContent } from "./content";

describe("parseArtifactContent", () => {
    it("returns null when there is no content", () => {
        expect(parseArtifactContent({ type: "SUMMARY", content: null })).toBeNull();
    });

    it("drops malformed flashcards but keeps valid ones", () => {
        const parsed = parseArtifactContent({
            type: "FLASHCARDS",
            content: {
                cards: [
                    { front: "Q1", back: "A1" },
                    { front: "missing back" },
                    "not an object",
                    { front: "Q2", back: "A2" },
                ],
            },
        });

        expect(parsed).toEqual({
            type: "FLASHCARDS",
            content: {
                cards: [
                    { front: "Q1", back: "A1" },
                    { front: "Q2", back: "A2" },
                ],
            },
        });
    });

    it("rejects quiz questions whose answer index is out of range", () => {
        const parsed = parseArtifactContent({
            type: "QUIZ",
            content: {
                questions: [
                    {
                        question: "Valid?",
                        options: ["a", "b"],
                        correctIndex: 1,
                        explanation: "b",
                    },
                    {
                        question: "Broken",
                        options: ["a", "b"],
                        correctIndex: 5,
                        explanation: "",
                    },
                ],
            },
        });

        expect(parsed?.type).toBe("QUIZ");
        if (parsed?.type === "QUIZ") {
            expect(parsed.content.questions.map((q) => q.question)).toEqual([
                "Valid?",
            ]);
        }
    });

    it("treats a non-array list as empty instead of crashing", () => {
        const parsed = parseArtifactContent({
            type: "TAKEAWAYS",
            content: { items: "oops" },
        });
        expect(parsed).toEqual({ type: "TAKEAWAYS", content: { items: [] } });
    });

    it("rejects a wiki without an overview", () => {
        expect(
            parseArtifactContent({ type: "WIKI", content: { modules: [] } }),
        ).toBeNull();
    });
});
