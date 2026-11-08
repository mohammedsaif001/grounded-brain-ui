import { DOCS_SECTIONS } from "@/features/docs/lib/content";
import { routes } from "@/shared/config/routes";
import { absoluteUrl, siteConfig } from "@/shared/config/site";

export const dynamic = "force-static";

/** Plain-text summary for AI answer engines (llms.txt convention). */
export function GET(): Response {
    const guide = DOCS_SECTIONS.map((s) => `- ${s.title}: ${s.summary}`).join("\n");

    const body = `# ${siteConfig.name}

> ${siteConfig.description}

## Pages
- [Home](${absoluteUrl(routes.home)}): what Grounded Brain does and how to start
- [Guide](${absoluteUrl(routes.docs)}): step-by-step tutorial

## What it does
- Add PDFs, websites, YouTube videos, GitHub repositories, text and Markdown as sources
- Ask questions and get answers with citations to the exact passage
- Generate summaries, key takeaways, flashcards, quizzes, mind maps, reports and repo wikis
- Keep a private, user-controlled memory across notebooks
- Sign in with Google; notebooks, sources and memories are private to the user

## Guide topics
${guide}
`;

    return new Response(body, {
        headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600",
        },
    });
}
