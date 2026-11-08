import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/shared/config/site";

/** AI answer-engine crawlers are allowed on public pages so Grounded Brain can be cited. */
const AI_CRAWLERS = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "PerplexityBot",
    "Perplexity-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
];

const PRIVATE_PATHS = ["/api/", "/dashboard", "/workspace/", "/settings/", "/status"];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
            { userAgent: AI_CRAWLERS, allow: ["/", "/llms.txt"], disallow: PRIVATE_PATHS },
        ],
        sitemap: absoluteUrl("/sitemap.xml"),
        host: absoluteUrl("/"),
    };
}
