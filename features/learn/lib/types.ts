import type { z } from "zod";
import type {
    artifactStatusSchema,
    artifactTypeSchema,
    learningArtifactSchema,
} from "./schemas";

export type ArtifactType = z.infer<typeof artifactTypeSchema>;

export type ArtifactStatus = z.infer<typeof artifactStatusSchema>;

export type LearningArtifact = z.infer<typeof learningArtifactSchema>;

export type CreateArtifactInput = {
    type: ArtifactType;
    title?: string;
    sourceIds?: string[];
};

export type Flashcard = { front: string; back: string };

export type QuizQuestion = {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
};

export type MindMapNode = { id: string; label: string };
export type MindMapEdge = { id: string; source: string; target: string };

export type WikiContent = {
    overview: string;
    techStack: { name: string; purpose: string }[];
    architecture: string;
    diagram: string;
    modules: {
        name: string;
        path: string;
        description: string;
        keyFiles: string[];
    }[];
    gettingStarted: string;
};
