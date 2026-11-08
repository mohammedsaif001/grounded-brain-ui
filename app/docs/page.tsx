import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSessionCookie } from "better-auth/cookies";
import { DocsPage } from "@/features/docs/components/docs-page";

export const metadata: Metadata = {
    title: "Guide",
    description:
        "How to use Grounded Brain: create a notebook, add sources, chat with citations and study.",
};

/**
 * Public on purpose, so it can be read before signing in. It only checks that a session
 * cookie exists (to point the buttons at the dashboard instead of sign-in) and never
 * calls the API, which keeps the guide available even during an outage.
 */
export default async function DocsRoute() {
    const signedIn = Boolean(getSessionCookie(await headers()));

    return <DocsPage signedIn={signedIn} />;
}
