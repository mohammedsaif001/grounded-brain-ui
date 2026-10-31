/**
 * Chat models accepted by the API.
 *
 * Mirrors `CHAT_MODELS` in the backend (`src/config/ai.config.ts`), which validates
 * `model` with `z.enum(CHAT_MODELS)` and rejects anything else. Keep both lists in sync.
 */
export const CHAT_MODELS = ["gpt-4o-mini", "gpt-4o"] as const;

export type ChatModelId = (typeof CHAT_MODELS)[number];

export const DEFAULT_CHAT_MODEL: ChatModelId = "gpt-4o-mini";

export const CHAT_MODEL_LABELS: Record<ChatModelId, string> = {
    "gpt-4o-mini": "GPT-4o mini",
    "gpt-4o": "GPT-4o",
};

export function isChatModel(value: unknown): value is ChatModelId {
    return (
        typeof value === "string" &&
        (CHAT_MODELS as readonly string[]).includes(value)
    );
}

/** Narrows an untrusted model id (e.g. a workspace's stored default) to a supported one. */
export function resolveChatModel(value?: string | null): ChatModelId {
    return isChatModel(value) ? value : DEFAULT_CHAT_MODEL;
}
