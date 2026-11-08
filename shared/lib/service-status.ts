export type ServiceState = "up" | "down" | "unknown";

export type ServiceStatus = {
    server: ServiceState;
    /** Mem0. `unknown` when it is not configured or the report does not mention it. */
    memory: ServiceState;
};

type HealthReport = {
    checks?: Record<string, { status?: string } | undefined>;
};

/**
 * Reduces the API's `/health/ready` answer to what the UI needs. A 503 from that
 * endpoint means a required dependency (database, vector store, AI provider) is down,
 * so the app as a whole is unavailable; Mem0 is optional and reported separately.
 */
export function summarizeHealth(
    ok: boolean,
    report: HealthReport | null | undefined,
): ServiceStatus {
    const mem0 = report?.checks?.mem0?.status;

    return {
        server: ok ? "up" : "down",
        memory:
            mem0 === "down"
                ? "down"
                : mem0 === "up" || mem0 === "configured"
                  ? "up"
                  : "unknown",
    };
}

/** What `/status` answers when the API cannot be reached at all. */
export const UNREACHABLE_STATUS: ServiceStatus = {
    server: "down",
    memory: "unknown",
};
