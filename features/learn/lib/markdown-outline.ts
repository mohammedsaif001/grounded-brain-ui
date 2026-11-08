export type OutlineItem = { level: 2 | 3; title: string };

const WORDS_PER_MINUTE = 220;

/** Removes fenced code blocks so `#` comments inside them are not read as headings. */
function stripFences(markdown: string): string {
    return markdown.replace(/```[\s\S]*?```/g, "");
}

/** Second- and third-level headings, in document order. The H1 is the page title, so it is skipped. */
export function extractOutline(markdown: string): OutlineItem[] {
    const items: OutlineItem[] = [];
    for (const line of stripFences(markdown).split("\n")) {
        const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
        if (!match) continue;
        items.push({
            level: match[1].length === 2 ? 2 : 3,
            title: match[2].replace(/[*_`]/g, "").trim(),
        });
    }
    return items;
}

/** Whole minutes to read, never below 1. */
export function estimateReadingMinutes(markdown: string): number {
    const words = stripFences(markdown).split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
