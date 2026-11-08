import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSessionCookie } from "better-auth/cookies";
import { DocsPage } from "@/features/docs/components/docs-page";
import { DOCS_SECTIONS, QUICK_START_IDS } from "@/features/docs/lib/content";
import { JsonLd } from "@/shared/components/json-ld";
import { routes } from "@/shared/config/routes";
import { absoluteUrl } from "@/shared/config/site";

const description =
    "Step-by-step guide to Grounded Brain: create a notebook, add PDFs, websites, YouTube and GitHub sources, chat with cited answers, and study with flashcards, quizzes and mind maps.";

export const metadata: Metadata = {
    title: "Guide: how to chat with your sources",
    description,
    keywords: [
        "Grounded Brain guide",
        "how to chat with PDF",
        "how to add sources",
        "AI flashcards tutorial",
        "cited AI answers tutorial",
        "AI notebook tutorial",
    ],
    alternates: { canonical: routes.docs },
    openGraph: {
        type: "article",
        title: "How to use Grounded Brain",
        description,
        url: routes.docs,
    },
    twitter: { title: "How to use Grounded Brain", description },
};

const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "HowTo",
            name: "How to use Grounded Brain",
            description,
            inLanguage: "en",
            step: DOCS_SECTIONS.filter((s) =>
                (QUICK_START_IDS as readonly string[]).includes(s.id),
            ).map((section, index) => ({
                "@type": "HowToStep",
                position: index + 1,
                name: section.title,
                text: section.summary,
                url: absoluteUrl(`${routes.docs}#${section.id}`),
            })),
        },
        {
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(routes.home) },
                { "@type": "ListItem", position: 2, name: "Guide", item: absoluteUrl(routes.docs) },
            ],
        },
    ],
};

/**
 * Public on purpose, so it can be read before signing in. It only checks that a session
 * cookie exists (to point the buttons at the dashboard instead of sign-in) and never
 * calls the API, which keeps the guide available even during an outage.
 */
export default async function DocsRoute() {
    const signedIn = Boolean(getSessionCookie(await headers()));

    return (
        <>
            <JsonLd data={structuredData} />
            <DocsPage signedIn={signedIn} />
        </>
    );
}
