import { describe, expect, it } from "vitest";
import { exportConversationMarkdown } from "./export-chat";
import type { ChatMessage } from "./types";

const exportedAt = new Date("2026-01-01T00:00:00Z");

describe("exportConversationMarkdown", () => {
    it("labels persisted USER/ASSISTANT messages correctly", () => {
        const messages: ChatMessage[] = [
            {
                id: "1",
                conversationId: "c",
                role: "USER",
                content: "What is RAG?",
                citations: null,
                createdAt: "",
            },
            {
                id: "2",
                conversationId: "c",
                role: "ASSISTANT",
                content: "Retrieval-augmented generation.",
                citations: [
                    {
                        sourceTitle: "Paper",
                        sourceType: "PDF",
                        page: 3,
                        excerpt: "RAG combines...",
                    },
                ],
                createdAt: "",
            },
        ];

        const markdown = exportConversationMarkdown({
            conversation: {
                id: "c",
                workspaceId: "w",
                title: "RAG basics",
                createdAt: "",
                updatedAt: "",
            },
            messages,
            exportedAt,
        });

        expect(markdown).toContain("# RAG basics");
        expect(markdown).toMatch(/## You\n\nWhat is RAG\?/);
        expect(markdown).toMatch(/## Assistant\n\nRetrieval-augmented generation\./);
        expect(markdown).toContain("- Paper (PDF, page 3)\n  RAG combines...");
    });

    it("reads text parts and citation overrides for AI SDK messages", () => {
        const markdown = exportConversationMarkdown({
            messages: [
                {
                    id: "m1",
                    role: "assistant",
                    parts: [
                        { type: "text", text: "Hello " },
                        { type: "text", text: "world" },
                    ],
                },
            ],
            citationsByMessageId: {
                m1: [
                    {
                        sourceTitle: "Blog",
                        sourceType: "WEB",
                        url: "https://example.com",
                        excerpt: "Hi",
                    },
                ],
            },
            exportedAt,
        });

        expect(markdown).toContain("# Chat export");
        expect(markdown).toContain("## Assistant\n\nHello world");
        expect(markdown).toContain("- [Blog](https://example.com)\n  Hi");
    });
});
