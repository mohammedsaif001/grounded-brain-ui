"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { DocsSection } from "../lib/content";

type DocsTocProps = {
    sections: readonly Pick<DocsSection, "id" | "title">[];
};

/**
 * Table of contents that follows the reader: a sticky column on wide screens and a
 * horizontally scrolling strip under the header on narrow ones. The section nearest the
 * top of the viewport is highlighted.
 */
export function DocsToc({ sections }: DocsTocProps) {
    const [activeId, setActiveId] = useState(sections[0]?.id);

    useEffect(() => {
        const elements = sections
            .map((section) => document.getElementById(section.id))
            .filter((element): element is HTMLElement => element !== null);

        // A section counts as current once it crosses a line a little below the header.
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top,
                    );
                if (visible[0]) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: "-96px 0px -60% 0px" },
        );

        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, [sections]);

    return (
        <nav aria-label="On this page">
            <p className="text-eyebrow mb-3 hidden lg:block">On this page</p>
            <ol className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                {sections.map((section) => {
                    const isActive = section.id === activeId;
                    return (
                        <li key={section.id} className="shrink-0">
                            <a
                                href={`#${section.id}`}
                                aria-current={isActive ? "location" : undefined}
                                className={cn(
                                    "block rounded-lg px-3 py-1.5 text-sm whitespace-nowrap outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/40",
                                    isActive
                                        ? "bg-accent font-medium text-accent-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                )}
                            >
                                {section.title}
                            </a>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
