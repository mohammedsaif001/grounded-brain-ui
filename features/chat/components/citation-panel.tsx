"use client";

import Link from "next/link";
import { ArrowUpRightIcon, PlusIcon, QuoteIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { SOURCE_TYPE_LABELS } from "@/features/sources/lib/constants";
import { useImportWebSearchSource } from "@/features/sources/hooks/use-sources";
import type { SourceType } from "@/features/sources/lib/types";
import { routes } from "@/shared/config/routes";
import { describeCitationLocation } from "../lib/citations";
import type { SelectedCitation } from "./citation-selection";

type CitationPanelProps = {
    workspaceId: string;
    selection: SelectedCitation;
    onClose: () => void;
};

/** Side panel that shows the passage behind the citation marker the reader opened. */
export function CitationPanel({
    workspaceId,
    selection,
    onClose,
}: CitationPanelProps) {
    const { citation, label } = selection;
    const importWebSearch = useImportWebSearchSource(workspaceId);
    const isWeb = citation.sourceType === "WEB";
    const typeLabel =
        citation.sourceType in SOURCE_TYPE_LABELS
            ? SOURCE_TYPE_LABELS[citation.sourceType as SourceType]
            : isWeb
              ? "Web"
              : citation.sourceType;
    const meta = [typeLabel, ...describeCitationLocation(citation)].join(" · ");

    return (
        <section
            aria-label="Citation details"
            className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-surface"
        >
            <div className="flex items-start justify-between gap-3">
                <Badge variant="green">[{label}] Citation</Badge>
                <Button variant="ghost" size="icon-sm" onClick={onClose}>
                    <XIcon aria-hidden="true" />
                    <span className="sr-only">Close citation</span>
                </Button>
            </div>

            <div className="space-y-1.5 border-b border-border pb-4">
                <h2 className="text-heading">{citation.sourceTitle}</h2>
                <p className="text-caption">{meta}</p>
            </div>

            <div className="space-y-3">
                <p className="text-eyebrow">Matching passage</p>
                <blockquote className="space-y-3 rounded-xl bg-tint-green p-4 text-tint-green-foreground">
                    <QuoteIcon aria-hidden="true" className="size-5" />
                    <p className="font-serif text-lg leading-snug">
                        {citation.excerpt}
                    </p>
                </blockquote>
                <p className="text-caption">
                    Opened from marker [{label}] in this answer.
                </p>
            </div>

            {isWeb && citation.url ? (
                <div className="flex flex-wrap gap-2">
                    <Button
                        nativeButton={false}
                        variant="outline"
                        render={
                            <a
                                href={citation.url}
                                target="_blank"
                                rel="noreferrer"
                            />
                        }
                    >
                        <ArrowUpRightIcon aria-hidden="true" />
                        Open link
                    </Button>
                    <Button
                        variant="ghost"
                        disabled={importWebSearch.isPending}
                        onClick={() =>
                            importWebSearch.mutate(
                                {
                                    title: citation.sourceTitle,
                                    content: citation.excerpt,
                                    url: citation.url!,
                                },
                                {
                                    onSuccess: () =>
                                        toast.add({
                                            type: "success",
                                            title: "Saved to library",
                                        }),
                                },
                            )
                        }
                    >
                        <PlusIcon aria-hidden="true" />
                        Save to library
                    </Button>
                </div>
            ) : citation.sourceId ? (
                <Button
                    nativeButton={false}
                    variant="outline"
                    render={
                        <Link
                            href={routes.workspace.source(
                                workspaceId,
                                citation.sourceId,
                            )}
                        />
                    }
                >
                    <ArrowUpRightIcon aria-hidden="true" />
                    {citation.page
                        ? `Open source at page ${citation.page}`
                        : "Open source"}
                </Button>
            ) : null}
        </section>
    );
}
