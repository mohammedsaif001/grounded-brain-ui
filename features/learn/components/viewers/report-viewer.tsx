"use client";

import { StreamdownContent } from "@/shared/components/streamdown-content";
import type { ArtifactCitation } from "../../lib/types";
import { ArtifactSources } from "../artifact-sources";

type ReportSection = {
    title: string;
    content: string;
    citations: ArtifactCitation[];
};

export function ReportViewer({
    markdown,
    sections,
    workspaceId,
}: {
    markdown: string;
    sections?: ReportSection[];
    workspaceId: string;
}) {
    return (
        <div className="space-y-8">
            <StreamdownContent content={markdown} mode="static" />
            {sections && sections.length > 0 ? (
                <div className="space-y-8 border-t border-border pt-8">
                    {sections.map((section, index) => (
                        <section key={index} className="space-y-2">
                            <h3 className="text-headline">
                                {section.title}
                            </h3>
                            <StreamdownContent
                                content={section.content}
                                mode="static"
                            />
                            <ArtifactSources
                                workspaceId={workspaceId}
                                citations={section.citations}
                                className="pt-1"
                            />
                        </section>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
