import { getServerEnv } from "@/shared/config/env";
import {
    summarizeHealth,
    UNREACHABLE_STATUS,
    type ServiceStatus,
} from "@/shared/lib/service-status";

export const dynamic = "force-dynamic";

const PROBE_TIMEOUT_MS = 4_000;

/**
 * Public, cheap "is the backend up?" answer for the error screens. Next.js hides server
 * error messages from the browser in production, so an error boundary cannot tell an
 * outage from a bug by itself and asks this instead.
 */
export async function GET(): Promise<Response> {
    let status: ServiceStatus = UNREACHABLE_STATUS;

    try {
        const response = await fetch(
            new URL("/health/ready", getServerEnv().API_URL),
            {
                cache: "no-store",
                signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
            },
        );
        const body = (await response.json().catch(() => null)) as {
            data?: unknown;
            error?: { details?: unknown };
        } | null;
        // 200 carries the report in `data`, a 503 in `error.details`.
        const report = (response.ok ? body?.data : body?.error?.details) as
            | Parameters<typeof summarizeHealth>[1];

        status = body ? summarizeHealth(response.ok, report) : UNREACHABLE_STATUS;
    } catch {
        // Connection refused or timed out: keep UNREACHABLE_STATUS.
    }

    return Response.json(status, {
        headers: { "cache-control": "no-store" },
    });
}
