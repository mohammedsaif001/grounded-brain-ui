import type { ArtifactType } from "./types";

export const ARTIFACT_TYPE_LABELS: Record<ArtifactType, string> = {
    SUMMARY: "Summary",
    TAKEAWAYS: "Key Takeaways",
    FLASHCARDS: "Flashcards",
    QUIZ: "Quiz",
    MINDMAP: "Mind Map",
    REPORT: "AI Report",
    WIKI: "Repo Wiki",
};

export const ARTIFACT_TYPE_DESCRIPTIONS: Record<ArtifactType, string> = {
    SUMMARY: "A structured markdown summary of your sources",
    TAKEAWAYS: "Bullet-point insights you can copy and review",
    FLASHCARDS: "Flip cards for active recall study",
    QUIZ: "Multiple-choice quiz with explanations",
    MINDMAP: "Visual concept map of the material",
    REPORT: "Long-form report with sections",
    WIKI: "Architecture, diagram and module guide for a GitHub repository",
};

export const ARTIFACT_TYPES: ArtifactType[] = [
    "SUMMARY",
    "TAKEAWAYS",
    "FLASHCARDS",
    "QUIZ",
    "MINDMAP",
    "REPORT",
    "WIKI",
];

export const ARTIFACT_STATUS_LABELS = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    READY: "Ready",
    FAILED: "Failed",
} as const;
