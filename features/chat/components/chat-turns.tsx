"use client";

import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/features/auth/lib/auth-client";
import { getInitials } from "@/features/profile";
import { LogoMark } from "@/shared/components/brand/logo-mark";
import { UserAvatar } from "@/shared/components/user-avatar";
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
            <p className="text-body max-w-[85%] min-w-0 rounded-2xl rounded-br-md bg-primary px-4 py-2.5 font-medium whitespace-pre-wrap break-words text-primary-foreground shadow-surface sm:max-w-[75%]">
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
        <div className="flex items-start gap-2.5 sm:gap-3">
            <LogoMark className="size-8 drop-shadow-sm" />
        <article
            aria-label="Grounded Brain answer"
            className="min-w-0 max-w-full flex-1 space-y-4 rounded-2xl rounded-tl-md border border-border bg-card p-4 shadow-surface sm:space-y-5 sm:p-5"
        >
            <header className="flex items-center gap-2.5">
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
        </article>
        </div>
    );
}
