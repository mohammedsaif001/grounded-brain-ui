import Image from "next/image";
import Link from "next/link";
import {
    ArrowRightIcon,
    BookOpenTextIcon,
    BrainIcon,
    GraduationCapIcon,
    LibraryBigIcon,
    LockKeyholeIcon,
    MessageSquareQuoteIcon,
    NetworkIcon,
    QuoteIcon,
    ShieldCheckIcon,
    SparklesIcon,
    type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { AppLogo } from "@/shared/components/brand/app-logo";
import { CtaBanner } from "@/shared/components/cta-banner";
import { TypeTile } from "@/shared/components/type-tile";
import type { Tone } from "@/shared/components/tint";
import { routes } from "@/shared/config/routes";

type Feature = {
    icon: LucideIcon;
    tone: Tone;
    title: string;
    description: string;
};

const FEATURES: readonly Feature[] = [
    {
        icon: LibraryBigIcon,
        tone: "green",
        title: "Bring every source",
        description:
            "PDFs, websites, YouTube videos, GitHub repositories and your own notes, together in one notebook.",
    },
    {
        icon: MessageSquareQuoteIcon,
        tone: "violet",
        title: "Answers with citations",
        description:
            "Every answer points to the exact passage, with its page or section, so you can check it yourself.",
    },
    {
        icon: GraduationCapIcon,
        tone: "rose",
        title: "Study tools, made for you",
        description:
            "Turn your sources or a conversation into summaries, flashcards, quizzes and reports.",
    },
    {
        icon: NetworkIcon,
        tone: "blue",
        title: "See how ideas connect",
        description:
            "Mind maps and repo wikis show the shape of a topic or a codebase at a glance.",
    },
    {
        icon: BrainIcon,
        tone: "amber",
        title: "A memory that learns you",
        description:
            "Grounded Brain remembers what matters to you across notebooks, and you stay in control of it.",
    },
    {
        icon: LockKeyholeIcon,
        tone: "neutral",
        title: "Private by design",
        description:
            "Sign in with Google. Your notebooks, sources and memories are visible only to you.",
    },
];

const STEPS = [
    {
        title: "Create a notebook",
        description: "One notebook per topic keeps every answer focused.",
    },
    {
        title: "Add your sources",
        description: "Upload, paste or link them. We read and index each one.",
    },
    {
        title: "Ask, then study",
        description: "Chat with citations, then generate material to revise.",
    },
] as const;

const NAV = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: routes.docs, label: "Guide" },
] as const;

export function LandingPage() {
    return (
        <div className="bg-page min-h-svh">
            <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
                    <Link
                        href={routes.home}
                        className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                    >
                        <AppLogo />
                    </Link>

                    <nav aria-label="Main" className="hidden md:block">
                        <ul className="flex items-center gap-1">
                            {NAV.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="rounded-lg px-3 py-2 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="flex items-center gap-2">
                        <Button
                            nativeButton={false}
                            variant="ghost"
                            className="hidden sm:inline-flex"
                            render={<Link href={routes.login} />}
                        >
                            Sign in
                        </Button>
                        <Button
                            nativeButton={false}
                            render={<Link href={routes.login} />}
                        >
                            Get started
                            <ArrowRightIcon aria-hidden="true" />
                        </Button>
                        <ModeToggle />
                    </div>
                </div>
            </header>

            <main>
                {/* Hero */}
                <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:px-8 md:py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:py-20">
                    <div className="space-y-6">
                        <p className="inline-flex items-center gap-2 rounded-full bg-tint-green px-3 py-1 text-xs font-semibold text-tint-green-foreground">
                            <SparklesIcon aria-hidden="true" className="size-3.5" />
                            Grounded in your sources
                        </p>
                        <h1 className="text-display text-balance">
                            Collect knowledge. Grow understanding.
                        </h1>
                        <p className="text-body max-w-lg text-lg text-muted-foreground">
                            Turn the things you read, watch and discover into
                            answers you can trace and study material that
                            sticks. Every claim points back to your sources.
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                size="lg"
                                nativeButton={false}
                                render={<Link href={routes.login} />}
                            >
                                Get started
                                <ArrowRightIcon aria-hidden="true" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                nativeButton={false}
                                render={<Link href={routes.docs} />}
                            >
                                <BookOpenTextIcon aria-hidden="true" />
                                See how it works
                            </Button>
                        </div>
                        <ul className="text-caption flex flex-wrap gap-x-5 gap-y-2">
                            <li className="flex items-center gap-1.5">
                                <ShieldCheckIcon
                                    aria-hidden="true"
                                    className="size-4"
                                />
                                Private to you
                            </li>
                            <li className="flex items-center gap-1.5">
                                <QuoteIcon aria-hidden="true" className="size-4" />
                                Cited answers
                            </li>
                            <li className="flex items-center gap-1.5">
                                <LockKeyholeIcon
                                    aria-hidden="true"
                                    className="size-4"
                                />
                                No password to remember
                            </li>
                        </ul>
                    </div>

                    <div className="relative">
                        <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-overlay lg:aspect-[5/4]">
                            <Image
                                src="/images/login-hero.svg"
                                alt="A glass book with leaves growing from its pages"
                                fill
                                priority
                                sizes="(min-width: 1024px) 40rem, 100vw"
                                className="object-cover"
                            />
                        </figure>

                        {/* Product cues floating over the image */}
                        <div className="absolute -bottom-5 left-4 flex max-w-[16rem] items-start gap-3 rounded-2xl border border-border bg-card p-3 shadow-raised sm:left-6">
                            <TypeTile icon={QuoteIcon} tone="violet" size="sm" />
                            <p className="text-sm leading-snug">
                                <span className="font-semibold">
                                    Spaced practice works.
                                </span>{" "}
                                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-tint-green px-1 align-middle text-[11px] font-semibold text-tint-green-foreground">
                                    1
                                </span>
                                <span className="text-caption mt-0.5 block">
                                    Make It Stick, page 28
                                </span>
                            </p>
                        </div>
                        <div className="absolute -top-4 right-4 hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium shadow-raised sm:flex">
                            <GraduationCapIcon
                                aria-hidden="true"
                                className="size-4 text-tint-rose-foreground"
                            />
                            12 flashcards ready
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section
                    id="features"
                    aria-labelledby="features-heading"
                    className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 md:px-8 md:py-16"
                >
                    <div className="mx-auto max-w-2xl space-y-3 text-center">
                        <p className="text-eyebrow">Everything in one place</p>
                        <h2 id="features-heading" className="text-title">
                            From a pile of sources to real understanding
                        </h2>
                        <p className="text-body text-muted-foreground">
                            Collect, ask, check and revise without leaving the
                            notebook.
                        </p>
                    </div>
                    <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map((feature) => (
                            <li
                                key={feature.title}
                                className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-surface transition-shadow hover:shadow-raised"
                            >
                                <TypeTile
                                    icon={feature.icon}
                                    tone={feature.tone}
                                    size="lg"
                                />
                                <h3 className="text-heading">{feature.title}</h3>
                                <p className="text-body text-muted-foreground">
                                    {feature.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* How it works */}
                <section
                    id="how-it-works"
                    aria-labelledby="how-heading"
                    className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 md:px-8 md:py-16"
                >
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-surface md:p-10">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div className="space-y-2">
                                <p className="text-eyebrow">How it works</p>
                                <h2 id="how-heading" className="text-title">
                                    Up and running in three steps
                                </h2>
                            </div>
                            <Button
                                nativeButton={false}
                                variant="outline"
                                render={<Link href={routes.docs} />}
                            >
                                <BookOpenTextIcon aria-hidden="true" />
                                Read the full guide
                            </Button>
                        </div>
                        <ol className="mt-8 grid gap-6 md:grid-cols-3">
                            {STEPS.map((step, index) => (
                                <li key={step.title} className="flex gap-4">
                                    <span
                                        aria-hidden="true"
                                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold tabular-nums text-primary-foreground"
                                    >
                                        {index + 1}
                                    </span>
                                    <div className="space-y-1">
                                        <h3 className="text-heading">
                                            {step.title}
                                        </h3>
                                        <p className="text-body text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Closing call to action */}
                <section
                    aria-labelledby="cta-heading"
                    className="mx-auto max-w-6xl px-4 pt-4 pb-16 md:px-8 md:pb-24"
                >
                    <CtaBanner
                        headingId="cta-heading"
                        title="Start your first notebook in under a minute"
                        description="Sign in with Google, add a source and ask your first question."
                        primary={{ href: routes.login, label: "Get started" }}
                        secondary={{
                            href: routes.docs,
                            label: "Read the guide",
                            icon: BookOpenTextIcon,
                        }}
                        className="md:px-14 md:py-16"
                    />
                </section>
            </main>

            <footer className="border-t">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 md:px-8">
                    <AppLogo />
                    <nav aria-label="Footer">
                        <ul className="text-caption flex items-center gap-5">
                            <li>
                                <Link
                                    href={routes.docs}
                                    className="underline-offset-4 hover:underline focus-visible:underline"
                                >
                                    Guide
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={routes.login}
                                    className="underline-offset-4 hover:underline focus-visible:underline"
                                >
                                    Sign in
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <p className="text-caption">
                        Built for curiosity. Grounded in evidence.
                    </p>
                </div>
            </footer>
        </div>
    );
}
