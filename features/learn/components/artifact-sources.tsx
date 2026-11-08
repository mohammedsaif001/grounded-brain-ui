import Link from "next/link";
import { BookOpenIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { routes } from "@/shared/config/routes";
import { uniqueCitations } from "../lib/citations";
import type { ArtifactCitation } from "../lib/types";

type ArtifactSourcesProps = {
    workspaceId: string;
    citations: readonly ArtifactCitation[];
    className?: string;
};

/**
 * "Based on" chips for a flashcard, quiz question or report section. The model picks
 * the citations, so this says which source an item draws on, not that it is verified.
 * Renders nothing when there is none (older artifacts, conversation-based ones).
 */
export function ArtifactSources({
    workspaceId,
    citations,
    className,
}: ArtifactSourcesProps) {
    const sources = uniqueCitations(citations);

    if (sources.length === 0) {
        return null;
    }

    return (
        <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
            <span className="text-eyebrow">
                {sources.length === 1 ? "Source" : "Sources"}
            </span>
            <ul className="contents">
                {sources.map((source) => (
                    <li key={source.sourceId} className="min-w-0">
                        <Link
                            href={routes.workspace.source(
                                workspaceId,
                                source.sourceId,
                            )}
                            // Chips sit inside clickable cards; opening a source must not flip them.
                            onClick={(event) => event.stopPropagation()}
                            className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-tint-green px-2 py-0.5 text-xs font-medium text-tint-green-foreground outline-none transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
                        >
                            <BookOpenIcon
                                aria-hidden="true"
                                className="size-3 shrink-0"
                            />
                            <span className="truncate">{source.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
