import type { z } from "zod";
import type {
    artifactContentSchemas,
    artifactCitationSchema,
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
    /**
     * Generate from a conversation instead of the workspace's sources. The API rejects
     * it together with `sourceIds` and for WIKI artifacts.
     */
    conversationId?: string;
    /** Limits `conversationId` to some of its messages; needs `conversationId`. */
    messageIds?: string[];
};

export type UpdateArtifactInput = {
    /** 1-200 characters. A rename alone does not mark the artifact as edited. */
    title?: string;
    /** The full content object for the artifact's type (same shape `GET` returns). */
    content?: ArtifactContent["content"];
    /** The `updatedAt` last read; a mismatch fails with 409 `CONFLICT`. */
    expectedUpdatedAt?: string;
};

/** True once the user has changed the generated content; regenerating would discard it. */
export function isUserEdited(artifact: Pick<LearningArtifact, "metadata">) {
    return artifact.metadata?.userEdited === true;
}

/** READY and not yet opened: shown with a "New" marker. */
export function isUnseenArtifact(
    artifact: Pick<LearningArtifact, "status" | "viewedAt">,
) {
    return artifact.status === "READY" && artifact.viewedAt === null;
}

export type ArtifactCitation = z.infer<typeof artifactCitationSchema>;
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
