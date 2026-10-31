import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { isProtectedPath, routes } from "@/shared/config/routes";

/**
 * Optimistic auth gate.
 *
 * Proxy runs on every matched request, prefetches included, so it only checks that a
 * session cookie exists and never calls the API. The session itself is verified by the
 * server data layer (`requireSession`) and, ultimately, by the API on every request.
 *
 * Signed-in users are deliberately NOT redirected away from /login here: a stale cookie
 * would bounce between /login and /dashboard forever. The login page does that redirect
 * after a real session check.
 */
export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    if (isProtectedPath(pathname) && !getSessionCookie(request)) {
        const loginUrl = new URL(routes.login, request.url);
        loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/workspace/:path*", "/settings/:path*"],
};
