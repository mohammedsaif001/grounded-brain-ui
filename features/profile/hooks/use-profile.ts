"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/features/auth/lib/auth-client";
import {
    useInvalidatingMutation,
    type MutationHookOptions,
} from "@/shared/hooks/use-invalidating-mutation";

type AuthResult<T> = { data: T | null; error: { message?: string } | null };

/** Better Auth reports failures in the result; this turns them into thrown errors. */
async function unwrap<T>(
    request: Promise<AuthResult<T>>,
    fallback: string,
): Promise<T> {
    const { data, error } = await request;
    if (error || data === null) {
        throw new Error(error?.message || fallback);
    }
    return data;
}

export const profileKeys = {
    all: ["profile"] as const,
    sessions: () => [...profileKeys.all, "sessions"] as const,
    accounts: () => [...profileKeys.all, "accounts"] as const,
};

/**
 * `name` and `image` are what the account model stores. `image: null` removes the
 * picture. The session hook refreshes itself, so headers pick the change up.
 */
export function useUpdateProfile(options?: MutationHookOptions) {
    return useInvalidatingMutation({
        mutationFn: (input: { name?: string; image?: string | null }) =>
            unwrap(
                authClient.updateUser(input),
                "Could not update your profile.",
            ),
        invalidates: () => [],
        ...options,
    });
}

export function useLinkedAccounts() {
    return useQuery({
        queryKey: profileKeys.accounts(),
        queryFn: () =>
            unwrap(authClient.listAccounts(), "Could not load sign-in methods."),
    });
}

export function useSessions() {
    return useQuery({
        queryKey: profileKeys.sessions(),
        queryFn: () =>
            unwrap(authClient.listSessions(), "Could not load your sessions."),
    });
}

export function useRevokeSession() {
    return useInvalidatingMutation({
        mutationFn: (token: string) =>
            unwrap(
                authClient.revokeSession({ token }),
                "Could not sign that device out.",
            ),
        invalidates: () => [profileKeys.sessions()],
    });
}

export function useRevokeOtherSessions() {
    return useInvalidatingMutation({
        mutationFn: () =>
            unwrap(
                authClient.revokeOtherSessions(),
                "Could not sign the other devices out.",
            ),
        invalidates: () => [profileKeys.sessions()],
    });
}
