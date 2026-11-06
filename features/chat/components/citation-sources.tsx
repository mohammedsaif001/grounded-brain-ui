"use client";

import Link from "next/link";
import { SOURCE_TYPE_LABELS } from "@/features/sources/lib/constants";
import type { SourceType } from "@/features/sources/lib/types";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { routes } from "@/shared/config/routes";
import { toneClasses, type Tone } from "@/shared/components/tint";
import { uniqueCitationsBySource } from "../lib/citations";
import type { ChatCitation } from "../lib/types";
import { CitationPreview } from "./citation-preview";

type CitationSourcesProps = {
    workspaceId: string;
    citations: ChatCitation[];
};

/** Chips cycle through tints so each source stays recognisable across an answer. */
const CHIP_TONES: readonly Tone[] = ["green", "blue", "violet"];

function sourceTypeLabel(type: string) {
    if (type === "WEB") return "Web";
    return type in SOURCE_TYPE_LABELS
        ? SOURCE_TYPE_LABELS[type as SourceType]
        : type;
}

export function CitationSources({
    workspaceId,
    citations,
}: CitationSourcesProps) {
    const unique = uniqueCitationsBySource(citations);

    if (unique.length === 0) {
        return null;
    }

    return (
        <ul
            aria-label="Sources used in this answer"
            className="flex flex-wrap gap-2 border-t border-border pt-4"
        >
            {unique.map((citation, index) => {
                const key =
                    citation.sourceId ?? citation.url ?? citation.sourceTitle;
                const label = [
                    `[${index + 1}] ${citation.sourceTitle}`,
                    citation.page ? `p. ${citation.page}` : null,
                ]
                    .filter(Boolean)
                    .join(" · ");
                const chipClass = cn(
                    "inline-flex max-w-full items-center rounded-lg px-2.5 py-1 text-xs font-medium outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring/40",
                    toneClasses[CHIP_TONES[index % CHIP_TONES.length]],
                );
                const isWeb = citation.sourceType === "WEB" && citation.url;

                return (
                    <li key={key} className="min-w-0">
                        <HoverCard>
                            <HoverCardTrigger
                                delay={150}
                                closeDelay={100}
                                render={
                                    isWeb ? (
                                        <a
                                            href={citation.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={chipClass}
                                            title={sourceTypeLabel(
                                                citation.sourceType,
                                            )}
                                        />
                                    ) : citation.sourceId ? (
                                        <Link
                                            href={routes.workspace.source(
                                                workspaceId,
                                                citation.sourceId,
                                            )}
                                            className={chipClass}
                                            title={sourceTypeLabel(
                                                citation.sourceType,
                                            )}
                                        />
                                    ) : (
                                        <span className={chipClass} />
                                    )
                                }
                            >
                                <span className="truncate">{label}</span>
                            </HoverCardTrigger>
                            <HoverCardContent
                                side="top"
                                align="start"
                                className="w-80"
                            >
                                <CitationPreview
                                    citation={citation}
                                    workspaceId={workspaceId}
                                />
                            </HoverCardContent>
                        </HoverCard>
                    </li>
                );
            })}
        </ul>
    );
}
