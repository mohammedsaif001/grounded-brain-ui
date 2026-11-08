import "server-only";

import { headers } from "next/headers";
import { getServerEnv } from "@/shared/config/env";
import {
    fetchOrOutage,
    parseApiResponse,
    type ParseOptions,
} from "@/shared/lib/api";

/**
 * Calls the API directly from the server (Server Components, Route Handlers).
 *
 * Talks to `API_URL` instead of looping back through this app's own rewrites, which
 * saves a network hop and avoids depending on the app knowing its own public URL.
 * The incoming request's cookies are forwarded so the API sees the user's session.
 */
export async function backendFetch<T = void>(
    path: string,
    { schema, ...init }: RequestInit & Pick<ParseOptions<T>, "schema"> = {},
): Promise<T> {
    const env = getServerEnv();
    const incoming = await headers();
    const outgoing = new Headers(init.headers);
    outgoing.set("accept", "application/json");

    const cookie = incoming.get("cookie");
    if (cookie) {
        outgoing.set("cookie", cookie);
    }

    const response = await fetchOrOutage(new URL(path, env.API_URL), {
        ...init,
        headers: outgoing,
        cache: "no-store",
        signal: init.signal ?? AbortSignal.timeout(env.API_TIMEOUT_MS),
    });

    return parseApiResponse(response, { schema });
}
