"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StreamdownContent } from "@/shared/components/streamdown-content";
import { routes } from "@/shared/config/routes";
import { estimateReadingMinutes, extractOutline } from "../../lib/markdown-outline";

type SummaryViewerProps = {
    markdown: string;
    workspaceId: string;
};

export function SummaryViewer({ markdown, workspaceId }: SummaryViewerProps) {
    const outline = extractOutline(markdown);
    const minutes = estimateReadingMinutes(markdown);

    return (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <div className="min-w-0 space-y-5">
                <Badge variant="green" className="uppercase tracking-wide">
                    {minutes} min read
                </Badge>
                <div className="[&_h1]:font-serif [&_h1]:text-headline [&_h2]:text-heading [&_h2]:mt-8">
                    <StreamdownContent content={markdown} mode="static" />
                </div>
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
