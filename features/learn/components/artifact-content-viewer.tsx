"use client";

import { parseArtifactContent } from "../lib/content";
import type { LearningArtifact } from "../lib/types";
import { FlashcardsViewer } from "./viewers/flashcards-viewer";
import { MindMapViewer } from "./viewers/mindmap-viewer";
import { QuizViewer } from "./viewers/quiz-viewer";
import { ReportViewer } from "./viewers/report-viewer";
import { SummaryViewer } from "./viewers/summary-viewer";
import { TakeawaysViewer } from "./viewers/takeaways-viewer";
import { WikiViewer } from "./viewers/wiki-viewer";

type ArtifactContentViewerProps = {
    artifact: LearningArtifact;
    workspaceId: string;
};

export function ArtifactContentViewer({
    artifact,
    workspaceId,
}: ArtifactContentViewerProps) {
    const parsed = parseArtifactContent(artifact);

    if (!parsed) {
        return (
            <p className="py-10 text-center text-sm text-muted-foreground">
                This artifact&apos;s content could not be displayed. Try
                generating it again.
            </p>
        );
    }

    // Stateful viewers (quiz, flashcards) restart when the artifact is regenerated.
    const versionKey = `${artifact.id}:${artifact.updatedAt}`;

    switch (parsed.type) {
        case "SUMMARY":
            return <SummaryViewer markdown={parsed.content.markdown} />;
        case "TAKEAWAYS":
            return <TakeawaysViewer items={parsed.content.items} />;
        case "FLASHCARDS":
            return <FlashcardsViewer key={versionKey} cards={parsed.content.cards} />;
        case "QUIZ":
            return (
                <QuizViewer key={versionKey} questions={parsed.content.questions} />
            );
        case "MINDMAP":
            return (
                <MindMapViewer
                    workspaceId={workspaceId}
                    nodes={parsed.content.nodes}
                    edges={parsed.content.edges}
                />
            );
        case "REPORT":
            return (
                <ReportViewer
                    markdown={parsed.content.markdown}
                    sections={parsed.content.sections}
                />
            );
        case "WIKI":
            return <WikiViewer wiki={parsed.content} />;
    }
}
