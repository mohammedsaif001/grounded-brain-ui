import type { ArtifactContent, ArtifactType } from "./types";

/** Item-count limits the API enforces on edited content. */
export const EDIT_LIMITS = {
    takeaways: { min: 3, max: 20 },
    flashcards: { min: 3, max: 30 },
    questions: { min: 3, max: 15 },
    options: { min: 2, max: 5 },
    mindMapNodes: { min: 2, max: 40 },
} as const;

export const TITLE_MAX_LENGTH = 200;

/** Editable content for one artifact type, e.g. `EditableContent<"QUIZ">`. */
export type EditableContent<Type extends ArtifactType = ArtifactType> = Extract<
    ArtifactContent,
    { type: Type }
>["content"];

function blank(value: string) {
    return value.trim().length === 0;
}

function outOfRange(
    label: string,
    count: number,
    { min, max }: { min: number; max: number },
) {
    return count < min || count > max
        ? `${label}: keep between ${min} and ${max} (currently ${count}).`
        : null;
}

/**
 * What would make the API reject this content, in plain words. Mirrors the server rules so
 * the editor can block a save instead of round-tripping a 400. Empty means it can be saved.
 */
export function validateContent(parsed: ArtifactContent): string[] {
    const problems: Array<string | null> = [];

    switch (parsed.type) {
        case "SUMMARY":
            problems.push(blank(parsed.content.markdown) ? "The summary is empty." : null);
            break;
        case "TAKEAWAYS": {
            const { items } = parsed.content;
            problems.push(outOfRange("Takeaways", items.length, EDIT_LIMITS.takeaways));
            problems.push(items.some(blank) ? "A takeaway is empty." : null);
            break;
        }
        case "FLASHCARDS": {
            const { cards } = parsed.content;
            problems.push(outOfRange("Cards", cards.length, EDIT_LIMITS.flashcards));
            problems.push(
                cards.some((card) => blank(card.front) || blank(card.back))
                    ? "Every card needs a front and a back."
                    : null,
            );
            break;
        }
        case "QUIZ": {
            const { questions } = parsed.content;
            problems.push(outOfRange("Questions", questions.length, EDIT_LIMITS.questions));
            questions.forEach((question, index) => {
                const label = `Question ${index + 1}`;
                if (blank(question.question)) {
                    problems.push(`${label} has no text.`);
                }
                if (
                    question.options.length < EDIT_LIMITS.options.min ||
                    question.options.length > EDIT_LIMITS.options.max
                ) {
                    problems.push(
                        `${label} needs ${EDIT_LIMITS.options.min}-${EDIT_LIMITS.options.max} options.`,
                    );
                }
                if (question.options.some(blank)) {
                    problems.push(`${label} has an empty option.`);
                }
                if (question.correctIndex >= question.options.length) {
                    problems.push(`${label} needs a correct answer.`);
                }
            });
            break;
        }
        case "MINDMAP": {
            const { nodes, edges } = parsed.content;
            problems.push(outOfRange("Nodes", nodes.length, EDIT_LIMITS.mindMapNodes));
            problems.push(nodes.some((node) => blank(node.label)) ? "A node has no label." : null);
            const ids = new Set(nodes.map((node) => node.id));
            problems.push(
                ids.size !== nodes.length ? "Node ids must be unique." : null,
            );
            problems.push(
                edges.some((edge) => !ids.has(edge.source) || !ids.has(edge.target))
                    ? "A connection points at a node that no longer exists."
                    : null,
            );
            break;
        }
        case "REPORT": {
            const { markdown, sections } = parsed.content;
            problems.push(blank(markdown) ? "The report text is empty." : null);
            problems.push(
                sections.some((section) => blank(section.title) || blank(section.content))
                    ? "Every section needs a title and content."
                    : null,
            );
            break;
        }
        case "WIKI":
            problems.push(blank(parsed.content.overview) ? "The overview is empty." : null);
            break;
    }

    return problems.filter((problem): problem is string => problem !== null);
}

/** Shallow structural equality for the plain JSON the editors work on. */
export function isSameContent(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

/** A fresh, unique id for a mind-map node or edge. */
export function newMindMapId(prefix: "n" | "e") {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

/** Removes a node and every connection that touched it. */
export function removeMindMapNode(
    content: EditableContent<"MINDMAP">,
    nodeId: string,
): EditableContent<"MINDMAP"> {
    return {
        nodes: content.nodes.filter((node) => node.id !== nodeId),
        edges: content.edges.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId,
        ),
    };
}

/** Removes an option and keeps `correctIndex` pointing at the same answer. */
export function removeQuizOption(
    question: EditableContent<"QUIZ">["questions"][number],
    optionIndex: number,
): EditableContent<"QUIZ">["questions"][number] {
    const options = question.options.filter((_, index) => index !== optionIndex);
    let correctIndex = question.correctIndex;
    if (optionIndex < correctIndex) {
        correctIndex -= 1;
    } else if (optionIndex === correctIndex) {
        // The right answer was deleted; the author must pick again.
        correctIndex = options.length;
    }

    return { ...question, options, correctIndex };
}
