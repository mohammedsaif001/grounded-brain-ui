"use client";

import { StreamdownContent } from "@/shared/components/streamdown-content";

export function MarkdownPreview({ content }: { content: string }) {
    return (
        <div className="max-h-[70vh] overflow-auto rounded-2xl border border-border bg-card p-6 shadow-surface">
            <StreamdownContent content={content} mode="static" />
        </div>
    );
}
