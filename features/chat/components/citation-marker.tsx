"use client";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { ChatCitation } from "../lib/types";
import { CitationPreview } from "./citation-preview";
import { useCitationSelection } from "./citation-selection";

type CitationMarkerProps = {
    index: number;
    citation: ChatCitation;
    workspaceId: string;
    prefix?: string;
};

export function CitationMarker({
    index,
    citation,
    workspaceId,
    prefix,
}: CitationMarkerProps) {
    const label = prefix ? `${prefix}${index}` : String(index);
    const selection = useCitationSelection();
    const isSelected =
        selection?.selected?.citation === citation &&
        selection.selected.label === label;

    return (
        <HoverCard>
            <HoverCardTrigger
                delay={120}
                closeDelay={80}
                render={
                    <button
                        type="button"
                        aria-pressed={selection ? isSelected : undefined}
                        className="mx-0.5 inline-flex h-5 min-w-5 -translate-y-px items-center justify-center rounded-md bg-tint-green px-1 align-middle text-[11px] font-semibold text-tint-green-foreground transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                        aria-label={`Source ${label}: ${citation.sourceTitle}`}
                        onClick={() => selection?.select({ citation, label })}
                    >
                        {label}
                    </button>
                }
            />
            <HoverCardContent side="top" align="start" className="w-80">
                <CitationPreview
                    citation={citation}
                    workspaceId={workspaceId}
                    markerIndex={index}
                />
            </HoverCardContent>
        </HoverCard>
    );
}
