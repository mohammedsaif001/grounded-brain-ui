import { NextRequest, NextResponse } from "next/server";
import {
    isGuestOnlyPath,
    isProtectedPath,
    routes,
} from "@/shared/config/routes";

async function fetchSession(request: NextRequest) {
    const response = await fetch(
        new URL("/api/auth/get-session", request.nextUrl.origin),
        {
            headers: {
                cookie: request.headers.get("cookie") ?? "",
            },
            cache: "no-store",
        },
    );

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data?.user ? data : null;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = await fetchSession(request);

    if (isProtectedPath(pathname) && !session) {
        const loginUrl = new URL(routes.login, request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isGuestOnlyPath(pathname) && session) {
        return NextResponse.redirect(new URL(routes.dashboard, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/workspace/:path*", "/settings/:path*", "/login"],
};
