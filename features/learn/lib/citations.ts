import type { ArtifactCitation } from "./types";

/** One entry per source: several items can cite the same source, and so can one item twice. */
export function uniqueCitations(
    citations: readonly ArtifactCitation[],
): ArtifactCitation[] {
    const seen = new Set<string>();
    return citations.filter((citation) => {
        if (seen.has(citation.sourceId)) {
            return false;
        }
        seen.add(citation.sourceId);
        return true;
    });
}

/** "Make It Stick, Learning How to Learn", or `null` when there is nothing to show. */
export function formatSourceLabels(
    citations: readonly ArtifactCitation[],
): string | null {
    const labels = uniqueCitations(citations).map((citation) => citation.label);
    return labels.length > 0 ? labels.join(", ") : null;
}

/**
 * Turns the `[n]` markers in a generated summary into `<cite index="n">` tags the
 * viewer renders as footnote links. Only markers that resolve to a citation are
 * touched, so `[note]`, `[1](https://…)` links and unknown numbers stay as written.
 */
export function injectSummaryMarkers(
    markdown: string,
    citations: readonly ArtifactCitation[],
): string {
    const known = new Set(citations.map((citation) => citation.marker));

    return markdown.replace(/\[(\d+)\](?!\()/g, (match, digits: string) =>
        known.has(Number(digits)) ? `<cite index="${digits}">${digits}</cite>` : match,
    );
}

/** The citation a `[n]` marker points at. */
export function findCitationByMarker(
    citations: readonly ArtifactCitation[],
    marker: number,
): ArtifactCitation | undefined {
    return citations.find((citation) => citation.marker === marker);
}
