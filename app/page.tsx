import type { Metadata } from "next";
import { LandingPage } from "@/features/landing/components/landing-page";
import { FAQS } from "@/features/landing/lib/faq";
import { redirectIfAuthenticated } from "@/features/auth/server";
import { JsonLd } from "@/shared/components/json-ld";
import { routes } from "@/shared/config/routes";
import { absoluteUrl, siteConfig } from "@/shared/config/site";

const title = `${siteConfig.name}: ${siteConfig.tagline}`;

export const metadata: Metadata = {
    title: { absolute: title },
    description: siteConfig.description,
    alternates: { canonical: routes.home },
    openGraph: { title, description: siteConfig.shortDescription, url: routes.home },
};

const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": absoluteUrl("/#organization"),
            name: siteConfig.name,
            url: absoluteUrl("/"),
            logo: absoluteUrl("/icon.svg"),
        },
        {
            "@type": "WebSite",
            "@id": absoluteUrl("/#website"),
            url: absoluteUrl("/"),
            name: siteConfig.name,
            description: siteConfig.description,
            inLanguage: "en",
            publisher: { "@id": absoluteUrl("/#organization") },
        },
        {
            "@type": "SoftwareApplication",
            "@id": absoluteUrl("/#app"),
            name: siteConfig.name,
            url: absoluteUrl("/"),
            description: siteConfig.description,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            inLanguage: "en",
            keywords: siteConfig.keywords.join(", "),
            featureList: [
                "Chat with PDFs, websites, YouTube videos and GitHub repositories",
                "Answers with citations to the exact passage",
                "Flashcards, quizzes, summaries, reports and mind maps",
                "Private memory you control",
            ],
            publisher: { "@id": absoluteUrl("/#organization") },
        },
        {
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
        },
    ],
};

export default async function HomePage() {
    await redirectIfAuthenticated();

    return (
        <>
            <JsonLd data={structuredData} />
            <LandingPage />
        </>
    );
}
