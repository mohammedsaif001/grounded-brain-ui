"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useCreateArtifact } from "@/features/learn/hooks/use-artifacts";
import { routes } from "@/shared/config/routes";

type LearnPromptCardProps = {
    workspaceId: string;
    /** The open conversation, once it has been saved. */
    conversationId: string | null;
    /** A conversation needs at least one message before it can become a deck. */
    hasMessages: boolean;
    /** Wait for the answer to finish so the deck includes it. */
    isStreaming: boolean;
};

/** Nudges readers from a good answer into active study, starting from this chat. */
export function LearnPromptCard({
    workspaceId,
    conversationId,
    hasMessages,
    isStreaming,
}: LearnPromptCardProps) {
    const router = useRouter();
    const createArtifact = useCreateArtifact(workspaceId);
    const canUseConversation = Boolean(conversationId) && hasMessages;

    function makeFlashcards() {
        if (!conversationId) {
            return;
        }

        createArtifact.mutate(
            { type: "FLASHCARDS", conversationId },
            {
                onSuccess: () => {
                    toast.add({
                        type: "success",
                        title: "Making your flashcards",
                        description: "They will appear in Learn when ready.",
                    });
                    router.push(routes.workspace.learn(workspaceId));
                },
            },
        );
    }

    return (
        <aside className="space-y-3 rounded-2xl bg-tint-violet p-5 text-tint-violet-foreground">
            <SparklesIcon aria-hidden="true" className="size-5" />
            <div className="space-y-1">
                <h2 className="text-heading">Make it stick.</h2>
                <p className="text-sm opacity-90">
                    {canUseConversation
                        ? "Put retrieval into practice. Turn this conversation into a flashcard deck."
                        : "Put retrieval into practice. Turn your sources into flashcards and quizzes."}
                </p>
            </div>

            {canUseConversation ? (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Button
                        size="sm"
                        disabled={isStreaming || createArtifact.isPending}
                        onClick={makeFlashcards}
                    >
                        {createArtifact.isPending ? (
                            <Spinner />
                        ) : (
                            <SparklesIcon aria-hidden="true" />
                        )}
                        Make flashcards from this chat
                    </Button>
                    <Link
                        href={routes.workspace.learn(workspaceId)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline focus-visible:underline"
                    >
                        Open Learn
                        <ArrowRightIcon aria-hidden="true" className="size-4" />
                    </Link>
                </div>
            ) : (
                <Link
                    href={routes.workspace.learn(workspaceId)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline focus-visible:underline"
                >
                    Create flashcards in Learn
                    <ArrowRightIcon aria-hidden="true" className="size-4" />
                </Link>
            )}
        </aside>
    );
}
