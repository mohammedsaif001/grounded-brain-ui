/** Which part of the product is unavailable. */
export type OutageService = "server" | "memory";

export const OUTAGE_COPY: Record<
    OutageService,
    { title: string; message: string }
> = {
    server: {
        title: "Our server is under maintenance",
        message:
            "Our server is under maintenance. Please try again in a few minutes.",
    },
    memory: {
        title: "Mem0 is under maintenance",
        message:
            "Mem0, our memory service, is under maintenance. Your memories are safe. Please try again shortly.",
    },
};

/**
 * True when a failed response means the backend itself is unavailable, as opposed to
 * a request the backend understood and rejected. The API always answers with its JSON
 * envelope, so a 5xx without one came from the proxy or a crashed process, and 502/504
 * are gateway failures. A JSON 503 is left alone: it names an integration that is not
 * configured or rate-limited ("Firecrawl is not configured"), which is worth showing.
 */
export function isServerOutageResponse(status: number, hasEnvelope: boolean) {
    return status === 502 || status === 504 || (status >= 500 && !hasEnvelope);
}
