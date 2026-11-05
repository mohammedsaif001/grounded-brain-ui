/**
 * Rewrites inline citation markers into <cite> tags that the message renderer
 * turns into interactive markers: `[3]` for source citations and `[W2]` for web results.
 */
export function injectCitationTags(text: string): string {
    return text
        .replace(/\[W(\d+)\]/g, '<cite web="$1">W$1</cite>')
        .replace(/\[(\d+)\]/g, '<cite index="$1">$1</cite>');
}
