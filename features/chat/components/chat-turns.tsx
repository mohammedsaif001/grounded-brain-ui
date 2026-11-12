"use client";

import { CircleAlertIcon, RotateCcwIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/features/auth/lib/auth-client";
import { getInitials } from "@/features/profile";
import { LogoMark } from "@/shared/components/brand/logo-mark";
import { UserAvatar } from "@/shared/components/user-avatar";
import { cn } from "@/lib/utils";
import { uniqueCitationsBySource } from "../lib/citations";
import type { ChatCitation } from "../lib/types";
import { ChatMessageBody } from "./chat-message-body";
import { CitationSources } from "./citation-sources";

export function UserTurn({ text }: { text: string }) {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <div className="flex flex-row-reverse items-end gap-2.5 sm:gap-3">
            <UserAvatar
                name={user?.name}
                image={user?.image}
                initials={getInitials(user?.name ?? user?.email)}
                size="sm"
                className="mb-0.5"
            />
            <p className="text-body max-w-[85%] min-w-0 rounded-2xl rounded-br-md bg-primary px-4 py-2.5 font-medium whitespace-pre-wrap wrap-break-word text-primary-foreground shadow-surface sm:max-w-[75%]">
                {text}
            </p>
        </div>
    );
}

type AssistantShellProps = {
    label: string;
    tone?: "default" | "error";
    /** Shown next to the name, e.g. the source-count badge. */
    meta?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
};

/** The left-aligned frame every assistant turn shares: brand mark, then a card. */
function AssistantShell({
    label,
    tone = "default",
    meta,
    children,
    className,
}: AssistantShellProps) {
    return (
        <div className="flex items-start gap-2.5 sm:gap-3">
            <LogoMark className="size-8 drop-shadow-sm" />
            <article
                aria-label={label}
                className={cn(
                    "min-w-0 max-w-full flex-1 space-y-4 rounded-2xl rounded-tl-md border p-4 shadow-surface sm:space-y-5 sm:p-5",
                    tone === "error"
                        ? "border-destructive/25 bg-tint-rose/60"
                        : "border-border bg-card",
                    className,
                )}
            >
                <header className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold">
                        Grounded Brain
                    </span>
                    {meta}
                </header>
                {children}
            </article>
        </div>
    );
}

/** Three dots rising and falling in sequence: the answer is on its way. */
function ThinkingWave() {
    return (
        <span aria-hidden="true" className="flex items-center gap-1">
            {[0, 150, 300].map((delay) => (
                <span
                    key={delay}
                    className="size-1.5 animate-thinking-wave rounded-full bg-primary"
                    style={{ animationDelay: `${delay}ms` }}
                />
            ))}
        </span>
    );
}

function ThinkingIndicator() {
    return (
        <p role="status" className="text-caption flex items-center gap-2.5">
            <ThinkingWave />
            Connecting the evidence…
        </p>
    );
}

/**
 * Placeholder answer shown from the moment a question is sent until the first token
 * arrives, so the thread never sits on an unanswered question with no feedback.
 */
export function AssistantPendingTurn() {
    return (
        <AssistantShell label="Grounded Brain is answering">
            <ThinkingIndicator />
        </AssistantShell>
    );
}

type AssistantErrorTurnProps = {
    message: string;
    onRetry?: () => void;
};

/** A failed answer, shown in the thread where the answer would have been. */
export function AssistantErrorTurn({ message, onRetry }: AssistantErrorTurnProps) {
    return (
        <AssistantShell label="Answer failed" tone="error">
            <div role="alert" className="flex items-start gap-2.5">
                <CircleAlertIcon
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-destructive"
                />
                <div className="min-w-0 space-y-1">
                    <p className="text-sm font-medium text-tint-rose-foreground">
                        Couldn&apos;t generate an answer
                    </p>
                    <p className="text-sm wrap-break-word text-tint-rose-foreground/90">
                        {message}
                    </p>
                </div>
            </div>
            {onRetry ? (
                <Button size="sm" variant="outline" onClick={onRetry}>
                    <RotateCcwIcon aria-hidden="true" />
                    Try again
                </Button>
            ) : null}
        </AssistantShell>
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
        <AssistantShell
            label="Grounded Brain answer"
            meta={
                sourceCount > 0 ? (
                    <Badge variant="green">
                        {sourceCount} source{sourceCount === 1 ? "" : "s"}
                    </Badge>
                ) : null
            }
        >
            {isWaiting ? (
                <ThinkingIndicator />
            ) : (
                <div className="min-w-0 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_h1]:font-serif [&_h1]:text-headline [&_h2]:font-serif [&_h2]:text-headline [&_h3]:font-serif [&_h3]:text-xl [&_strong]:font-semibold">
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
        </AssistantShell>
    );
}
