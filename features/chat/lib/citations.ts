import type { ChatCitation } from "./types";

export function getCitationByIndex(
    citations: ChatCitation[],
    index: number,
) {
    return citations[index - 1] ?? null;
}

/**
 * Where in the source a citation points, e.g. ["Chapter: Memory", "Page 28", "Chunk 12 of 48"].
 * Every part is optional (old sources lack most of them), and a page is never a range
 * because a citation is a single chunk.
 */
export function describeCitationLocation(citation: ChatCitation): string[] {
    const chunk =
        citation.chunkIndex === undefined
            ? null
            : citation.chunkTotal
              ? `Chunk ${citation.chunkIndex + 1} of ${citation.chunkTotal}`
              : `Chunk ${citation.chunkIndex + 1}`;

    return [
        citation.chapter ?? null,
        citation.section ?? null,
        citation.page ? `Page ${citation.page}` : null,
        citation.path ?? null,
        chunk,
    ].filter((part): part is string => Boolean(part));
}

export function uniqueCitationsBySource(citations: ChatCitation[]) {
    return citations.filter((citation, index, array) => {
        const key = citation.sourceId ?? citation.url ?? citation.sourceTitle;
        return (
            array.findIndex(
                (item) =>
                    (item.sourceId ?? item.url ?? item.sourceTitle) === key,
            ) === index
        );
    });
}
