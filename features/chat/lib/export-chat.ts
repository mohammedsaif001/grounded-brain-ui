import type { UIMessage } from "ai";
import type { ChatCitation, ChatMessage, Conversation } from "./types";

type ExportableMessage = UIMessage | ChatMessage;

function getMessageText(message: ExportableMessage) {
    if ("parts" in message) {
        return message.parts
            .filter((part) => part.type === "text")
            .map((part) => part.text)
            .join("");
    }

    return message.content;
}

/** Persisted messages use "USER"/"ASSISTANT"; AI SDK messages use "user"/"assistant". */
function isUserMessage(message: ExportableMessage) {
    return message.role.toLowerCase() === "user";
}

function formatCitation(citation: ChatCitation) {
    if (citation.sourceType === "WEB" && citation.url) {
        return `- [${citation.sourceTitle}](${citation.url})\n  ${citation.excerpt}`;
    }

    const page = citation.page !== undefined ? `, page ${citation.page}` : "";
    return `- ${citation.sourceTitle} (${citation.sourceType}${page})\n  ${citation.excerpt}`;
}

export function exportConversationMarkdown(input: {
    conversation?: Conversation | null;
    messages: ExportableMessage[];
    citationsByMessageId?: Record<string, ChatCitation[]>;
    exportedAt?: Date;
}) {
    const title = input.conversation?.title ?? "Chat export";
    const exportedAt = input.exportedAt ?? new Date();
    const lines = [`# ${title}`, "", `_Exported ${exportedAt.toLocaleString()}_`, ""];

    for (const message of input.messages) {
        const author = isUserMessage(message) ? "You" : "Assistant";
        lines.push(`## ${author}`, "", getMessageText(message), "");

        const citations =
            input.citationsByMessageId?.[message.id] ??
            ("citations" in message ? message.citations : null);

        if (citations?.length) {
            lines.push("### Sources", "");
            for (const citation of citations) {
                lines.push(formatCitation(citation));
            }
            lines.push("");
        }
    }

    return lines.join("\n");
}
