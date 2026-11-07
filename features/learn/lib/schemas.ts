import { z } from "zod";

export const artifactTypeSchema = z.enum([
    "SUMMARY",
    "TAKEAWAYS",
    "FLASHCARDS",
    "QUIZ",
    "MINDMAP",
    "REPORT",
    "WIKI",
]);

export const artifactStatusSchema = z.enum([
    "PENDING",
    "PROCESSING",
    "READY",
    "FAILED",
]);

export const learningArtifactSchema = z.object({
    id: z.string(),
    workspaceId: z.string(),
    type: artifactTypeSchema,
    title: z.string(),
    // Shape depends on `type`; each viewer narrows it.
    content: z.record(z.string(), z.unknown()).nullable(),
    sourceIds: z.array(z.string()),
    status: artifactStatusSchema,
    metadata: z.record(z.string(), z.unknown()).nullable(),
    /** When the user first opened it; `null` while it is still "new". */
    viewedAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const learningArtifactListSchema = z.array(learningArtifactSchema);

/*
 * Artifact `content` is LLM-generated JSON. Validate it per artifact type before it
 * reaches a viewer: list items that do not match are dropped individually, so one
 * malformed flashcard does not blank the whole deck or crash the page.
 */
function lenientList<T extends z.ZodType>(item: T) {
    return z
        .array(z.unknown())
        .catch([])
        .transform((values) =>
            values.flatMap((value) => {
                const parsed = item.safeParse(value);
                return parsed.success ? [parsed.data as z.infer<T>] : [];
            }),
        );
}

const text = z.string().catch("");

export const flashcardSchema = z.object({
    front: z.string(),
    back: z.string(),
});

export const quizQuestionSchema = z
    .object({
        question: z.string(),
        options: z.array(z.string()).min(2),
        correctIndex: z.number().int().nonnegative(),
        explanation: z.string().catch(""),
    })
    .refine((question) => question.correctIndex < question.options.length, {
        message: "correctIndex out of range",
    });

export const mindMapNodeSchema = z.object({ id: z.string(), label: z.string() });

export const mindMapEdgeSchema = z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
});

export const wikiContentSchema = z.object({
    overview: z.string(),
    techStack: lenientList(z.object({ name: z.string(), purpose: z.string() })),
    architecture: text,
    diagram: text,
    modules: lenientList(
        z.object({
            name: z.string(),
            path: z.string(),
            description: z.string(),
            keyFiles: z.array(z.string()).catch([]),
        }),
    ),
    gettingStarted: text,
});

export const artifactContentSchemas = {
    SUMMARY: z.object({ markdown: text }),
    TAKEAWAYS: z.object({ items: lenientList(z.string()) }),
    FLASHCARDS: z.object({ cards: lenientList(flashcardSchema) }),
    QUIZ: z.object({ questions: lenientList(quizQuestionSchema) }),
    MINDMAP: z.object({
        nodes: lenientList(mindMapNodeSchema),
        edges: lenientList(mindMapEdgeSchema),
    }),
    REPORT: z.object({
        markdown: text,
        sections: lenientList(
            z.object({ title: z.string(), content: z.string() }),
        ),
    }),
    WIKI: wikiContentSchema,
} satisfies Record<z.infer<typeof artifactTypeSchema>, z.ZodType>;
