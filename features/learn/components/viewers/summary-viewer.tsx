"use client";

import { useMemo, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StreamdownContent } from "@/shared/components/streamdown-content";
import { routes } from "@/shared/config/routes";
import {
    findCitationByMarker,
    injectSummaryMarkers,
} from "../../lib/citations";
import { estimateReadingMinutes, extractOutline } from "../../lib/markdown-outline";
import type { ArtifactCitation } from "../../lib/types";

type SummaryViewerProps = {
    markdown: string;
    citations: ArtifactCitation[];
    workspaceId: string;
};

const CITE_TAGS = { cite: ["index"] };
const CITE_LITERAL = ["cite"];

const noteId = (marker: number) => `source-note-${marker}`;

export function SummaryViewer({
    markdown,
    citations,
    workspaceId,
}: SummaryViewerProps) {
    const outline = extractOutline(markdown);
    const minutes = estimateReadingMinutes(markdown);
    const body = useMemo(
        () => injectSummaryMarkers(markdown, citations),
        [markdown, citations],
    );

    // `[n]` in the text jumps to its entry under "Source notes".
    const components = useMemo(
        () => ({
            cite: ({
                index,
                children,
            }: {
                index?: string;
                children?: ReactNode;
            }) => {
                const marker = Number(index ?? children);
                const citation = findCitationByMarker(citations, marker);

                return (
                    <a
                        href={`#${noteId(marker)}`}
                        aria-label={
                            citation
                                ? `Source ${marker}: ${citation.label}`
                                : `Source ${marker}`
                        }
                        title={citation?.label}
                        className="mx-0.5 inline-flex h-5 min-w-5 -translate-y-px items-center justify-center rounded-md bg-tint-green px-1 align-middle text-[11px] font-semibold text-tint-green-foreground no-underline transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    >
                        {marker}
                    </a>
                );
            },
        }),
        [citations],
    );

    return (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <div className="min-w-0 space-y-5">
                <Badge variant="green" className="uppercase tracking-wide">
                    {minutes} min read
                </Badge>
                <div className="[&_h1]:font-serif [&_h1]:text-headline [&_h2]:text-heading [&_h2]:mt-8">
                    <StreamdownContent
                        content={body}
                        mode="static"
                        allowedTags={CITE_TAGS}
                        literalTagContent={CITE_LITERAL}
                        components={components}
                    />
                </div>

                {citations.length > 0 ? (
                    <section
                        aria-labelledby="source-notes-heading"
                        className="space-y-3 border-t border-border pt-5"
                    >
                        <h2 id="source-notes-heading" className="text-heading">
                            Source notes
                        </h2>
                        <ol className="space-y-2">
                            {citations.map((citation) => (
                                <li
                                    key={citation.marker}
                                    id={noteId(citation.marker)}
                                    className="text-caption flex scroll-mt-24 items-baseline gap-2 target:text-foreground"
                                >
                                    <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-tint-green px-1 text-[11px] font-semibold text-tint-green-foreground">
                                        {citation.marker}
                                    </span>
                                    <Link
                                        href={routes.workspace.source(
                                            workspaceId,
                                            citation.sourceId,
                                        )}
                                        className="underline-offset-4 hover:underline focus-visible:underline"
                                    >
                                        {citation.label}
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    </section>
                ) : null}
            </div>

            <aside className="space-y-5 lg:border-l lg:border-border lg:pl-6">
                {outline.length > 0 ? (
                    <nav aria-label="In this summary" className="space-y-3">
                        <h2 className="text-heading">In this summary</h2>
                        <ol className="space-y-2">
                            {outline.map((item, index) => (
                                <li
                                    key={`${item.title}-${index}`}
                                    className={
                                        item.level === 3
                                            ? "text-caption pl-3"
                                            : "text-caption"
                                    }
                                >
                                    {item.title}
                                </li>
                            ))}
                        </ol>
                    </nav>
                ) : null}

                <div className="space-y-3 rounded-xl bg-tint-green p-4 text-tint-green-foreground">
                    <p className="text-headline text-xl">
                        Now, close this summary. What can you recall?
                    </p>
                    <Link
                        href={routes.workspace.learn(workspaceId)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline focus-visible:underline"
                    >
                        Try the flashcards
                        <ArrowRightIcon aria-hidden="true" className="size-4" />
                    </Link>
                </div>
            </aside>
        </div>
    );
}
