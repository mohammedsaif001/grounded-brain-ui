"use client";

import { useId, useState } from "react";
import { ArrowUpIcon, GlobeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type ChatComposerProps = {
    onSubmit: (text: string) => void;
    disabled?: boolean;
    isStreaming?: boolean;
    webSearchEnabled?: boolean;
    onWebSearchChange?: (enabled: boolean) => void;
    /** Ready sources the answer can draw from; shown in the footer. */
    sourceCount?: number;
    placeholder?: string;
};

export function ChatComposer({
    onSubmit,
    disabled = false,
    isStreaming = false,
    webSearchEnabled = false,
    onWebSearchChange,
    sourceCount,
    placeholder = "Ask a follow-up about your sources…",
}: ChatComposerProps) {
    const [input, setInput] = useState("");
    const inputId = useId();
    const isBusy = disabled || isStreaming;

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const text = input.trim();
        if (!text || isBusy) {
            return;
        }

        onSubmit(text);
        setInput("");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-3 shadow-surface focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20"
        >
            <label htmlFor={inputId} className="sr-only">
                Message
            </label>
            <textarea
                id={inputId}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={placeholder}
                rows={2}
                disabled={isBusy}
                className="field-sizing-content max-h-40 min-h-12 w-full resize-none bg-transparent px-2 py-1.5 text-body outline-none placeholder:text-muted-foreground disabled:opacity-60"
                onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSubmit(event);
                    }
                }}
            />

            <div className="mt-2 flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-x-2">
                    {onWebSearchChange ? (
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            aria-pressed={webSearchEnabled}
                            disabled={isBusy}
                            className={cn(
                                "text-muted-foreground",
                                webSearchEnabled &&
                                    "bg-tint-blue text-tint-blue-foreground hover:bg-tint-blue",
                            )}
                            onClick={() =>
                                onWebSearchChange(!webSearchEnabled)
                            }
                        >
                            <GlobeIcon aria-hidden="true" />
                            Web search {webSearchEnabled ? "on" : "off"}
                        </Button>
                    ) : null}
                    {sourceCount != null ? (
                        <span className="text-caption">
                            {sourceCount} source{sourceCount === 1 ? "" : "s"}
                        </span>
                    ) : null}
                </div>

                <Button
                    type="submit"
                    className="shrink-0"
                    disabled={isBusy || !input.trim()}
                    aria-label="Send message"
                >
                    {isStreaming ? (
                        <Spinner />
                    ) : (
                        <ArrowUpIcon aria-hidden="true" />
                    )}
                    Send
                </Button>
            </div>
        </form>
    );
}
