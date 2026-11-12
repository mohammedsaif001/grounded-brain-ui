import { OUTAGE_COPY } from "@/shared/lib/outage";

const FALLBACK_MESSAGE =
    "The answer could not be generated. Please try again.";
const NETWORK_MESSAGE =
    "Could not reach Grounded Brain. Check your connection and try again.";

/** Pulls `error.message` (or a string `error`/`message`) out of the API's JSON envelope. */
function messageFromEnvelope(body: unknown): string | null {
    if (!body || typeof body !== "object") {
        return null;
    }
    const { error, message } = body as {
        error?: unknown;
        message?: unknown;
    };
    if (
        error &&
        typeof error === "object" &&
        typeof (error as { message?: unknown }).message === "string"
    ) {
        return (error as { message: string }).message;
    }
    if (typeof error === "string") {
        return error;
    }
    if (typeof message === "string") {
        return message;
    }
    return null;
}

/**
 * Readable text for a failed chat turn. The AI SDK transport puts the raw response body
 * in `error.message`, which may be the API's JSON envelope, a proxy's HTML page, or a
 * browser network failure; none of those should reach the user verbatim.
 */
export function describeChatError(error: Error | undefined): string {
    const raw = error?.message?.trim();
    if (!raw) {
        return FALLBACK_MESSAGE;
    }

    if (/failed to fetch|networkerror|load failed/i.test(raw)) {
        return NETWORK_MESSAGE;
    }

    if (raw.startsWith("{")) {
        try {
            return (
                messageFromEnvelope(JSON.parse(raw))?.trim() || FALLBACK_MESSAGE
            );
        } catch {
            return FALLBACK_MESSAGE;
        }
    }

    // An HTML error page means a proxy or gateway answered, not the API.
    if (raw.startsWith("<")) {
        return OUTAGE_COPY.server.message;
    }

    return raw;
}
