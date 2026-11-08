import { formatDistanceToNow } from "date-fns";
import type { Source } from "./types";

/**
 * The normalised keys the API puts in `source.metadata`. Keys that do not apply to a
 * source type are absent (never null), and sources created before the API added them
 * lack them until they are reprocessed or re-imported, so every field is optional.
 */
export type SourceFacts = {
    /** PDF author, YouTube channel, site name or repo owner. */
    author?: string;
    pageCount?: number;
    wordCount?: number;
    durationSeconds?: number;
    fileCount?: number;
    /** Repository name only; use {@link repoFullName} for `owner/repo`. */
    repo?: string;
    owner?: string;
};

function text(value: unknown): string | undefined {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function count(value: unknown): number | undefined {
    return typeof value === "number" && Number.isFinite(value) && value >= 0
        ? value
        : undefined;
}

export function readSourceFacts(
    metadata: Source["metadata"] | undefined,
): SourceFacts {
    const raw = metadata ?? {};
    return {
        author: text(raw.author),
        pageCount: count(raw.pageCount),
        wordCount: count(raw.wordCount),
        durationSeconds: count(raw.durationSeconds),
        fileCount: count(raw.fileCount),
        repo: text(raw.repo),
        owner: text(raw.owner),
    };
}

/** `owner/repo` for a GitHub source, or whichever half is known. */
export function repoFullName({ owner, repo }: SourceFacts): string | undefined {
    return owner && repo ? `${owner}/${repo}` : (repo ?? owner);
}

const plural = (value: number, noun: string) =>
    `${value.toLocaleString("en-US")} ${noun}${value === 1 ? "" : "s"}`;

/** 1122 → "18:42", 3725 → "1:02:05". */
export function formatDuration(totalSeconds: number): string {
    const seconds = Math.floor(totalSeconds);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const rest = String(seconds % 60).padStart(2, "0");

    return hours > 0
        ? `${hours}:${String(minutes).padStart(2, "0")}:${rest}`
        : `${minutes}:${rest}`;
}

function hostOf(url: string | null): string | undefined {
    if (!url) {
        return undefined;
    }
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return undefined;
    }
}

function factParts(source: Pick<Source, "type" | "url">, facts: SourceFacts) {
    const words =
        facts.wordCount !== undefined ? plural(facts.wordCount, "word") : undefined;

    switch (source.type) {
        case "PDF":
            return [
                facts.author,
                facts.pageCount !== undefined
                    ? plural(facts.pageCount, "page")
                    : words,
            ];
        case "YOUTUBE":
            return [
                facts.author,
                facts.durationSeconds !== undefined
                    ? formatDuration(facts.durationSeconds)
                    : words,
            ];
        case "GITHUB":
            return [
                repoFullName(facts),
                facts.fileCount !== undefined
                    ? plural(facts.fileCount, "file")
                    : words,
            ];
        case "WEBSITE":
            return [hostOf(source.url), words];
        default:
            return [words];
    }
}

/** "Brown, Roediger & McDaniel · 24 pages", or `null` when the metadata has nothing to say. */
export function describeSourceFacts(
    source: Pick<Source, "type" | "url" | "metadata">,
): string | null {
    const parts = factParts(source, readSourceFacts(source.metadata)).filter(
        (part): part is string => Boolean(part),
    );

    return parts.length > 0 ? parts.join(" · ") : null;
}

/**
 * Secondary line under a source title. Falls back to the host and then to when it was
 * added, so there is always something to show for sources that predate the metadata.
 */
export function describeSource(
    source: Pick<Source, "type" | "url" | "metadata" | "createdAt">,
): string {
    return (
        describeSourceFacts(source) ??
        hostOf(source.url) ??
        `Added ${formatDistanceToNow(new Date(source.createdAt), { addSuffix: true })}`
    );
}
