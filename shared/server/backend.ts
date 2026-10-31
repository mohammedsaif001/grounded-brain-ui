import "server-only";

import { headers } from "next/headers";
import { serverEnv } from "@/shared/config/env";
import { parseApiResponse } from "@/shared/lib/api";

/**
 * Calls the API directly from the server (Server Components, Route Handlers).
 *
 * Talks to `API_URL` instead of looping back through this app's own rewrites, which
 * saves a network hop and avoids depending on the app knowing its own public URL.
 * The incoming request's cookies are forwarded so the API sees the user's session.
 */
export async function backendFetch<T>(
    path: string,
    init: RequestInit = {},
): Promise<T> {
    const incoming = await headers();
    const outgoing = new Headers(init.headers);
    outgoing.set("accept", "application/json");

    const cookie = incoming.get("cookie");
    if (cookie) {
        outgoing.set("cookie", cookie);
    }

    const response = await fetch(new URL(path, serverEnv.API_URL), {
        ...init,
        headers: outgoing,
        cache: "no-store",
        signal: init.signal ?? AbortSignal.timeout(serverEnv.API_TIMEOUT_MS),
    });

    return parseApiResponse<T>(response);
}
