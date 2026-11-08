/**
 * Single source of truth for app URLs.
 *
 * Features import from here instead of from each other, which keeps the feature
 * modules decoupled. Dynamic segments are URI-encoded so ids can never break a path.
 */
const segment = encodeURIComponent;

export const routes = {
    home: "/",
    login: "/login",
    dashboard: "/dashboard",
    memorySettings: "/settings/memory",
    profile: "/settings/profile",
    docs: "/docs",
    workspace: {
        chat: (workspaceId: string) => `/workspace/${segment(workspaceId)}`,
        settings: (workspaceId: string) =>
            `/workspace/${segment(workspaceId)}/settings`,
        sources: (workspaceId: string) =>
            `/workspace/${segment(workspaceId)}/sources`,
        source: (workspaceId: string, sourceId: string) =>
            `/workspace/${segment(workspaceId)}/sources/${segment(sourceId)}`,
        learn: (workspaceId: string) =>
            `/workspace/${segment(workspaceId)}/learn`,
        artifact: (workspaceId: string, artifactId: string) =>
            `/workspace/${segment(workspaceId)}/learn/${segment(artifactId)}`,
    },
} as const;

/** Path prefixes that require a signed-in user. */
const PROTECTED_PREFIXES = ["/dashboard", "/workspace", "/settings"] as const;

/** Paths a signed-in user should be bounced away from. */
const GUEST_ONLY_PREFIXES = [routes.login] as const;

function matchesPrefix(pathname: string, prefixes: readonly string[]) {
    return prefixes.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
}

export function isProtectedPath(pathname: string) {
    return matchesPrefix(pathname, PROTECTED_PREFIXES);
}

export function isGuestOnlyPath(pathname: string) {
    return matchesPrefix(pathname, GUEST_ONLY_PREFIXES);
}

/**
 * Returns `value` only if it is a same-origin path, otherwise `fallback`.
 *
 * Guards post-login redirects (`?callbackUrl=`) against open redirects such as
 * `https://evil.com`, `//evil.com` or `/\evil.com`, which browsers treat as absolute.
 */
export function safeRedirectPath(
    value: string | null | undefined,
    fallback: string = routes.dashboard,
): string {
    if (!value || !value.startsWith("/") || /^\/[/\\]/.test(value)) {
        return fallback;
    }

    try {
        const base = "http://internal.invalid";
        const url = new URL(value, base);
        return url.origin === base
            ? `${url.pathname}${url.search}${url.hash}`
            : fallback;
    } catch {
        return fallback;
    }
}
