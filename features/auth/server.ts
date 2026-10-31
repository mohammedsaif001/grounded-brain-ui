import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { routes } from "@/shared/config/routes";
import { ApiError } from "@/shared/lib/api";
import { backendFetch } from "@/shared/server/backend";
import type { authClient } from "./lib/auth-client";

export type Session = typeof authClient.$Infer.Session;

/**
 * Resolves the current user's session from the API.
 *
 * Wrapped in React `cache()` so layouts and pages in the same render share a single
 * request. Returns `null` when signed out; other failures (API down, timeouts) throw
 * and surface through the nearest error boundary instead of looking like a sign-out.
 */
export const getSession = cache(async (): Promise<Session | null> => {
    try {
        const session = await backendFetch<Session | null>(
            "/api/auth/get-session",
        );
        return session?.user ? session : null;
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
            return null;
        }
        throw error;
    }
});

/** Returns the session or redirects to the login page. */
export async function requireSession(): Promise<Session> {
    const session = await getSession();

    if (!session) {
        redirect(routes.login);
    }

    return session;
}

/** Sends already-signed-in users to the dashboard (login, landing page). */
export async function redirectIfAuthenticated(): Promise<void> {
    if (await getSession()) {
        redirect(routes.dashboard);
    }
}
