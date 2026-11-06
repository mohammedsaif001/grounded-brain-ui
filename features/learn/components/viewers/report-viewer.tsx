"use client";

import { StreamdownContent } from "@/shared/components/streamdown-content";

type ReportSection = { title: string; content: string };

export function ReportViewer({
    markdown,
    sections,
}: {
    markdown: string;
    sections?: ReportSection[];
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
                        </section>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
