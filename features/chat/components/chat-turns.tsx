"use client";

import { BrainIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { uniqueCitationsBySource } from "../lib/citations";
import type { ChatCitation } from "../lib/types";
import { ChatMessageBody } from "./chat-message-body";
import { CitationSources } from "./citation-sources";

export function UserTurn({ text }: { text: string }) {
    return (
        <div className="flex items-baseline gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-surface">
            <span className="text-eyebrow shrink-0">You</span>
            <p className="text-body min-w-0 font-medium whitespace-pre-wrap break-words">
                {text}
            </p>
        </div>
    );
}

type AssistantTurnProps = {
    text: string;
    workspaceId: string;
    citations?: ChatCitation[];
    isAnimating?: boolean;
};

export function AssistantTurn({
    text,
    workspaceId,
    citations,
    isAnimating = false,
}: AssistantTurnProps) {
    const sourceCount = citations ? uniqueCitationsBySource(citations).length : 0;
    const isWaiting = isAnimating && text.trim().length === 0;

    return (
        <article
            aria-label="Grounded Brain answer"
            className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-surface"
        >
            <header className="flex items-center gap-2.5">
                <BrainIcon aria-hidden="true" className="size-5" />
                <span className="text-sm font-semibold">Grounded Brain</span>
                {sourceCount > 0 ? (
                    <Badge variant="green">
                        {sourceCount} source{sourceCount === 1 ? "" : "s"}
                    </Badge>
                ) : null}
            </header>

            {isWaiting ? (
                <p
                    role="status"
                    className="text-caption flex items-center gap-2"
                >
                    <Spinner className="size-3.5" />
                    Connecting the evidence…
                </p>
            ) : (
                <div className="[&_h1]:font-serif [&_h1]:text-headline [&_h2]:font-serif [&_h2]:text-headline [&_h3]:font-serif [&_h3]:text-xl [&_strong]:font-semibold">
                    <ChatMessageBody
                        text={text}
                        citations={citations}
                        workspaceId={workspaceId}
                        isAnimating={isAnimating}
                    />
                </div>
            )}

            {citations?.length ? (
                <CitationSources
                    workspaceId={workspaceId}
                    citations={citations}
                />
            ) : null}
        </article>
    );
}
