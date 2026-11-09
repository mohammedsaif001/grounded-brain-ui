import { describe, expect, it } from "vitest";
import {
    removeMindMapNode,
    removeQuizOption,
    validateContent,
    type EditableContent,
} from "./edit";

const quizQuestion = (
    overrides: Partial<EditableContent<"QUIZ">["questions"][number]> = {},
) => ({
    question: "Q?",
    options: ["a", "b", "c"],
    correctIndex: 1,
    explanation: "",
    citations: [],
    ...overrides,
});

describe("validateContent", () => {
    it("accepts a valid quiz", () => {
        const questions = [quizQuestion(), quizQuestion(), quizQuestion()];

        expect(validateContent({ type: "QUIZ", content: { questions } })).toEqual([]);
    });

    it("flags a quiz with too few questions and an out-of-range answer", () => {
        const problems = validateContent({
            type: "QUIZ",
            content: { questions: [quizQuestion({ correctIndex: 5 })] },
        });

        expect(problems.join(" ")).toContain("Questions: keep between 3 and 15");
        expect(problems.join(" ")).toContain("Question 1 needs a correct answer");
    });

    it("flags blank flashcard sides", () => {
        const card = { front: "f", back: "b", citations: [] };
        const problems = validateContent({
            type: "FLASHCARDS",
            content: { cards: [card, card, { ...card, back: "  " }] },
        });

        expect(problems).toContain("Every card needs a front and a back.");
    });

    it("flags a mind-map edge that points at a missing node", () => {
        const problems = validateContent({
            type: "MINDMAP",
            content: {
                nodes: [
                    { id: "a", label: "A" },
                    { id: "b", label: "B" },
                ],
                edges: [{ id: "e1", source: "a", target: "gone" }],
            },
        });

        expect(problems).toContain(
            "A connection points at a node that no longer exists.",
        );
    });

    it("flags duplicate node ids", () => {
        const problems = validateContent({
            type: "MINDMAP",
            content: {
                nodes: [
                    { id: "a", label: "A" },
                    { id: "a", label: "B" },
                ],
                edges: [],
            },
        });

        expect(problems).toContain("Node ids must be unique.");
    });
});

describe("removeMindMapNode", () => {
    it("drops the node and its connections", () => {
        const result = removeMindMapNode(
            {
                nodes: [
                    { id: "a", label: "A" },
                    { id: "b", label: "B" },
                    { id: "c", label: "C" },
                ],
                edges: [
                    { id: "e1", source: "a", target: "b" },
                    { id: "e2", source: "b", target: "c" },
                    { id: "e3", source: "a", target: "c" },
                ],
            },
            "b",
        );

        expect(result.nodes.map((node) => node.id)).toEqual(["a", "c"]);
        expect(result.edges.map((edge) => edge.id)).toEqual(["e3"]);
    });
});

describe("removeQuizOption", () => {
    it("shifts the answer when an earlier option is removed", () => {
        const result = removeQuizOption(quizQuestion({ correctIndex: 2 }), 0);

        expect(result.options).toEqual(["b", "c"]);
        expect(result.correctIndex).toBe(1);
    });

    it("leaves the answer when a later option is removed", () => {
        expect(removeQuizOption(quizQuestion({ correctIndex: 0 }), 2).correctIndex).toBe(0);
    });

    it("invalidates the answer when the correct option is removed", () => {
        const result = removeQuizOption(quizQuestion({ correctIndex: 1 }), 1);

        expect(result.correctIndex).toBeGreaterThanOrEqual(result.options.length);
    });
});
