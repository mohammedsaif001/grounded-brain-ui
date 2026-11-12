/** Single source of truth for brand, SEO copy and the canonical origin (set SITE_URL in production). */
const DEV_SITE_URL = "http://localhost:3000";

export const siteConfig = {
    name: "Grounded Brain",
    tagline: "Chat with your sources, grounded in citations",
    description:
        "Grounded Brain, built by Mohammed Saif (imohdsaif.in), is an AI notebook that answers from your own PDFs, websites, YouTube videos and GitHub repos, with citations to the exact passage. Turn sources into flashcards, quizzes, summaries and mind maps.",
    shortDescription:
        "Chat with your PDFs, websites, YouTube videos and GitHub repos. Every answer is cited. Generate flashcards, quizzes and mind maps.",
    keywords: [
        "Grounded Brain",
        "Grounded Brain by Mohammed Saif",
        "Grounded Brain AI",
        "Grounded Brain app",
        "Mohammed Saif",
        "Mohammed Saif portfolio",
        "Mohammed Saif software engineer",
        "imohdsaif",
        "imohdsaif.in",
        "AI notebook",
        "chat with PDF",
        "chat with documents",
        "chat with your sources",
        "AI research assistant",
        "AI study assistant",
        "cited AI answers",
        "answers with citations",
        "grounded AI",
        "retrieval augmented generation",
        "RAG notebook",
        "NotebookLM alternative",
        "AI flashcard generator",
        "AI quiz generator",
        "AI mind map generator",
        "YouTube video summarizer",
        "GitHub repo wiki generator",
        "personal knowledge base",
        "AI second brain",
    ],
    locale: "en_US",
    themeColor: { light: "#eef3e8", dark: "#16261f" },
    /** Pearl theme tokens as literals: the social card renderer cannot read CSS variables. */
    brandColors: {
        background: "#eef3e8",
        card: "#f9fdf7",
        accent: "#d4ed9a",
        foreground: "#1d3029",
        accentForeground: "#1f3a12",
        muted: "#5b6c62",
    },
} as const;

/** Canonical origin without a trailing slash. */
export function getSiteUrl(): URL {
    const raw = process.env.SITE_URL?.trim() || DEV_SITE_URL;

    try {
        return new URL(raw);
    } catch {
        return new URL(DEV_SITE_URL);
    }
}

export function absoluteUrl(path = "/"): string {
    return new URL(path, getSiteUrl()).toString();
}
