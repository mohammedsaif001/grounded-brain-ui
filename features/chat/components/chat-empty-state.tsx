"use client";

import {
    MessageSquareIcon,
    MessageSquareTextIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STARTER_PROMPTS = [
    "Summarize the key ideas across my sources",
    "What are the most important concepts I should remember?",
    "Where do my sources disagree?",
] as const;

type ChatEmptyStateProps = {
    onPick: (prompt: string) => void;
    disabled?: boolean;
};

export function ChatEmptyState({ onPick, disabled }: ChatEmptyStateProps) {
    return (
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-dashed border-border bg-card/50 px-4 py-10 text-center sm:px-6 sm:py-14">
            <span
                aria-hidden="true"
                className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground"
            >
                <MessageSquareTextIcon className="size-5" />
            </span>
            <div className="max-w-md space-y-1.5">
                <h2 className="text-headline">Chat with your sources</h2>
                <p className="text-body text-muted-foreground">
                    Ask questions about the materials in this workspace. Every
                    answer is grounded in your sources and cites where it came
                    from.
                </p>
            </div>
            <ul className="flex flex-wrap justify-center gap-2">
                {STARTER_PROMPTS.map((prompt) => (
                    <li key={prompt} className="max-w-full">
                        <Button
                            variant="outline"
                            // Long prompts must wrap: a non-wrapping chip is wider than a phone
                            // and drags the whole page's layout past the screen edge.
                            className="h-auto min-h-9 max-w-full py-2 text-left whitespace-normal"
                            disabled={disabled}
                            onClick={() => onPick(prompt)}
                        >
                            <MessageSquareIcon aria-hidden="true" />
                            {prompt}
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
