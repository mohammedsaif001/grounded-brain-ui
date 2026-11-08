"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
    BookOpenTextIcon,
    LibraryBigIcon,
    NotebookTabsIcon,
    PlusIcon,
    SparklesIcon,
    type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TypeTile } from "@/shared/components/type-tile";
import type { Tone } from "@/shared/components/tint";
import { routes } from "@/shared/config/routes";
import { getGreeting, type DashboardTotals } from "../lib/dashboard";

const subscribe = () => () => {};

/**
 * The greeting depends on the visitor's local clock, which the server cannot know. The
 * server snapshot is a neutral line, so hydration matches and it upgrades on the client.
 */
function useGreeting() {
    return useSyncExternalStore(
        subscribe,
        () => getGreeting(new Date().getHours()),
        () => "Welcome back",
    );
}

const STATS: readonly {
    key: keyof DashboardTotals;
    label: string;
    icon: LucideIcon;
    tone: Tone;
}[] = [
    { key: "notebooks", label: "Notebooks", icon: NotebookTabsIcon, tone: "green" },
    { key: "sources", label: "Sources", icon: LibraryBigIcon, tone: "blue" },
    { key: "studyGuides", label: "Study guides", icon: SparklesIcon, tone: "violet" },
];

type DashboardHeroProps = {
    firstName: string;
    /** `undefined` while the notebooks are still loading. */
    totals: DashboardTotals | undefined;
    onCreate: () => void;
};

export function DashboardHero({
    firstName,
    totals,
    onCreate,
}: DashboardHeroProps) {
    const greeting = useGreeting();

    return (
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-surface">
            {/* Soft colour wash behind the copy; purely decorative. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-tint-green/70 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-28 -left-12 size-64 rounded-full bg-tint-violet/70 blur-3xl"
            />

            <div className="relative grid grid-cols-1 gap-6 p-5 sm:p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
                <div className="space-y-4">
                    <p className="text-eyebrow">
                        {greeting}, {firstName}
                    </p>
                    <h1 className="text-headline text-balance">
                        What will you learn today?
                    </h1>
                    <p className="text-body max-w-xl text-muted-foreground">
                        Pick up a notebook, add fresh sources, or start a new
                        one. Every answer stays grounded in what you gave it.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                        <Button size="lg" onClick={onCreate}>
                            <PlusIcon aria-hidden="true" />
                            New notebook
                        </Button>
                        <Button
                            nativeButton={false}
                            size="lg"
                            variant="outline"
                            render={<Link href={routes.docs} />}
                        >
                            <BookOpenTextIcon aria-hidden="true" />
                            Read the guide
                        </Button>
                    </div>
                </div>

                <dl className="grid grid-cols-3 gap-2 sm:gap-3 lg:w-[22rem]">
                    {STATS.map(({ key, label, icon, tone }) => (
                        <div
                            key={key}
                            className="rounded-2xl border border-border/70 bg-background/60 p-3 backdrop-blur sm:p-4"
                        >
                            <TypeTile
                                icon={icon}
                                tone={tone}
                                size="sm"
                                className="mb-2 sm:mb-3"
                            />
                            <dd className="text-title tabular-nums">
                                {totals ? (
                                    totals[key]
                                ) : (
                                    <Skeleton className="h-7 w-8" />
                                )}
                            </dd>
                            <dt className="text-caption">{label}</dt>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
