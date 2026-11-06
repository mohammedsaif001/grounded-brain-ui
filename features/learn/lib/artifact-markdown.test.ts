import { describe, expect, it } from "vitest";

import { artifactFileName, artifactToMarkdown } from "./artifact-markdown";

describe("artifactToMarkdown", () => {
    it("exports a summary under its title", () => {
        const md = artifactToMarkdown("Notes", {
            type: "SUMMARY",
            content: { markdown: "Body text " },
        });
        expect(md).toBe("# Notes\n\nBody text\n");
    });

    it("numbers takeaways", () => {
        const md = artifactToMarkdown("T", {
            type: "TAKEAWAYS",
            content: { items: ["one", "two"] },
        });
        expect(md).toContain("1. one\n2. two");
    });

    it("exports flashcards as Q and A pairs", () => {
        const md = artifactToMarkdown("Deck", {
            type: "FLASHCARDS",
            content: { cards: [{ front: "Q1", back: "A1" }] },
        });
        expect(md).toContain("## Card 1");
        expect(md).toContain("**Q:** Q1");
        expect(md).toContain("**A:** A1");
    });

    it("marks the correct quiz option and keeps the explanation", () => {
        const md = artifactToMarkdown("Quiz", {
            type: "QUIZ",
            content: {
                questions: [
                    {
                        question: "Pick one",
                        options: ["x", "y"],
                        correctIndex: 1,
                        explanation: "because",
                    },
                ],
            },
        });
        expect(md).toContain("- A. x\n- B. y (correct)");
        expect(md).toContain("_because_");
    });

    it("resolves mind map edge labels", () => {
        const md = artifactToMarkdown("Map", {
            type: "MINDMAP",
            content: {
                nodes: [
                    { id: "a", label: "Alpha" },
                    { id: "b", label: "Beta" },
                ],
                edges: [{ id: "e", source: "a", target: "b" }],
            },
        });
        expect(md).toContain("- Alpha → Beta");
    });
});

describe("artifactFileName", () => {
    it("slugifies the title", () => {
        expect(artifactFileName("Build a Lasting Memory!")).toBe(
            "build-a-lasting-memory.md",
        );
    });

    it("falls back when the title has no usable characters", () => {
        expect(artifactFileName("!!!")).toBe("learning-tool.md");
    });
});
