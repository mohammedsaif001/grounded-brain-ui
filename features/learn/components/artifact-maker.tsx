"use client";

import { TypeTile } from "@/shared/components/type-tile";
import { ARTIFACT_META } from "../lib/artifact-meta";
import { ARTIFACT_TYPE_LABELS, ARTIFACT_TYPES } from "../lib/constants";
import type { ArtifactType } from "../lib/types";

type ArtifactMakerProps = {
    readySourceCount: number;
    onPick: (type: ArtifactType) => void;
};

/** "What would you like to make?" panel: one tap starts the generate flow for a type. */
export function ArtifactMaker({ readySourceCount, onPick }: ArtifactMakerProps) {
    return (
        <section
            aria-labelledby="artifact-maker-title"
            className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-raised"
        >
            <div className="space-y-1">
                <h2 id="artifact-maker-title" className="text-heading">
                    What would you like to make?
                </h2>
                <p className="text-caption">
                    Using {readySourceCount} ready source
                    {readySourceCount === 1 ? "" : "s"}
                </p>
            </div>

            <ul className="divide-y divide-border border-y border-border">
                {ARTIFACT_TYPES.map((type) => {
                    const meta = ARTIFACT_META[type];
                    return (
                        <li key={type}>
                            <button
                                type="button"
                                onClick={() => onPick(type)}
                                className="flex w-full items-center gap-3 rounded-lg py-3 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/30"
                            >
                                <TypeTile
                                    icon={meta.icon}
                                    tone={meta.tone}
                                    size="md"
                                />
                                <span className="min-w-0">
                                    <span className="block text-sm font-semibold">
                                        {ARTIFACT_TYPE_LABELS[type]}
                                    </span>
                                    <span className="text-caption block">
                                        {meta.tagline}
                                    </span>
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>

            <p className="text-caption">
                Every artifact stays connected to the sources that shaped it.
            </p>
        </section>
    );
}
