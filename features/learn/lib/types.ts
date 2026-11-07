import type { z } from "zod";
import type {
    artifactContentSchemas,
    artifactStatusSchema,
    artifactTypeSchema,
    flashcardSchema,
    learningArtifactSchema,
    mindMapEdgeSchema,
    mindMapNodeSchema,
    quizQuestionSchema,
    wikiContentSchema,
} from "./schemas";

export type ArtifactType = z.infer<typeof artifactTypeSchema>;

export type ArtifactStatus = z.infer<typeof artifactStatusSchema>;

export type LearningArtifact = z.infer<typeof learningArtifactSchema>;

export type CreateArtifactInput = {
    type: ArtifactType;
    title?: string;
    sourceIds?: string[];
};

/** READY and not yet opened: shown with a "New" marker. */
export function isUnseenArtifact(
    artifact: Pick<LearningArtifact, "status" | "viewedAt">,
) {
    return artifact.status === "READY" && artifact.viewedAt === null;
}

export type Flashcard = z.infer<typeof flashcardSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type MindMapNode = z.infer<typeof mindMapNodeSchema>;
export type MindMapEdge = z.infer<typeof mindMapEdgeSchema>;
export type WikiContent = z.infer<typeof wikiContentSchema>;

/** Validated `content` for each artifact type. */
export type ArtifactContent = {
    [Type in ArtifactType]: {
        type: Type;
        content: z.infer<(typeof artifactContentSchemas)[Type]>;
    };
}[ArtifactType];
