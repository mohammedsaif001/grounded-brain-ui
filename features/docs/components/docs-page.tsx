import Link from "next/link";
import {
    ChevronRightIcon,
    LayoutDashboardIcon,
    LogInIcon,
    MousePointerClickIcon,
} from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/shared/components/brand/app-logo";
import { Callout } from "@/shared/components/callout";
import { CtaBanner } from "@/shared/components/cta-banner";
import { PageHeader } from "@/shared/components/page-header";
import { TypeTile } from "@/shared/components/type-tile";
import { routes } from "@/shared/config/routes";
import {
    DOCS_SECTIONS,
    QUICK_START_IDS,
    getDocsSection,
    type DocsSection,
} from "../lib/content";
import { DocsToc } from "./docs-toc";

type DocsPageProps = {
    /** Only changes where the calls to action point; the guide reads the same either way. */
    signedIn: boolean;
};

export function DocsPage({ signedIn }: DocsPageProps) {
    const CtaIcon = signedIn ? LayoutDashboardIcon : LogInIcon;
    const ctaHref = signedIn ? routes.dashboard : routes.login;
    const quickStart = QUICK_START_IDS.map(getDocsSection).filter(
        (section): section is DocsSection => section !== undefined,
    );

    return (
        <div className="bg-page min-h-svh">
            <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
                    <Link
                        href={signedIn ? routes.dashboard : routes.home}
                        className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                    >
                        <AppLogo />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button
                            nativeButton={false}
                            variant="outline"
                            size="sm"
                            render={<Link href={ctaHref} />}
                        >
                            <CtaIcon aria-hidden="true" />
                            {signedIn ? "Dashboard" : "Sign in"}
                        </Button>
                        <ModeToggle />
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
                <PageHeader
                    eyebrow="Guide"
                    title="How to use Grounded Brain"
                    description="A step-by-step tour: from creating your first notebook to chatting with your sources and studying from them. It works the same whether or not you are signed in."
                />

                <section aria-labelledby="flow-heading" className="mt-8 space-y-4">
                    <h2 id="flow-heading" className="text-heading">
                        The flow at a glance
                    </h2>
                    <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-9">
                        {quickStart.map((section, index) => (
                            <li key={section.id} className="relative">
                                <a
                                    href={`#${section.id}`}
                                    className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-surface outline-none transition-shadow hover:shadow-raised focus-visible:ring-3 focus-visible:ring-ring/40"
                                >
                                    <span className="flex items-center justify-between">
                                        <TypeTile
                                            icon={section.icon}
                                            tone={section.tone}
                                            size="md"
                                        />
                                        <span className="text-eyebrow tabular-nums">
                                            Step {index + 1}
                                        </span>
                                    </span>
                                    <span className="space-y-1">
                                        <span className="block text-sm font-semibold">
                                            {section.title}
                                        </span>
                                        <span className="text-caption block">
                                            {section.summary}
                                        </span>
                                    </span>
                                </a>
                                {index < quickStart.length - 1 ? (
                                    <ChevronRightIcon
                                        aria-hidden="true"
                                        className="absolute top-1/2 -right-[28px] hidden size-5 -translate-y-1/2 text-muted-foreground lg:block"
                                    />
                                ) : null}
                            </li>
                        ))}
                    </ol>
                </section>

                <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
                    <aside className="sticky top-14 z-20 -mx-4 self-start border-b bg-background/90 px-4 py-2 backdrop-blur-md md:-mx-8 md:px-8 lg:top-24 lg:mx-0 lg:border-b-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
                        {/* Only plain data crosses into the client component; icons are functions. */}
                        <DocsToc
                            sections={DOCS_SECTIONS.map(({ id, title }) => ({
                                id,
                                title,
                            }))}
                        />
                    </aside>

                    <div className="min-w-0 space-y-8">
                        {DOCS_SECTIONS.map((section) => (
                            <DocsSectionCard key={section.id} section={section} />
                        ))}

                        <section aria-labelledby="docs-cta-heading">
                            <CtaBanner
                                headingId="docs-cta-heading"
                                title={
                                    signedIn
                                        ? "Pick up where you left off"
                                        : "Create your first notebook in under a minute"
                                }
                                primary={{
                                    href: ctaHref,
                                    label: signedIn
                                        ? "Open your notebooks"
                                        : "Sign in to start",
                                    icon: CtaIcon,
                                }}
                            />
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

function DocsSectionCard({ section }: { section: DocsSection }) {
    const headingId = `${section.id}-heading`;

    return (
        <section
            id={section.id}
            aria-labelledby={headingId}
            className="scroll-mt-32 space-y-5 rounded-3xl border border-border bg-card p-5 shadow-surface md:p-8 lg:scroll-mt-24"
        >
            <header className="flex items-start gap-4">
                <TypeTile icon={section.icon} tone={section.tone} size="lg" />
                <div className="min-w-0 space-y-1">
                    <h2 id={headingId} className="text-title">
                        {section.title}
                    </h2>
                    <p className="text-body text-muted-foreground">
                        {section.summary}
                    </p>
                </div>
            </header>

            <ol className="space-y-4">
                {section.steps.map((step, index) => (
                    <li key={step.title} className="flex gap-4">
                        <span
                            aria-hidden="true"
                            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums text-muted-foreground"
                        >
                            {index + 1}
                        </span>
                        <div className="min-w-0 space-y-1.5">
                            <h3 className="text-sm font-semibold">{step.title}</h3>
                            <p className="text-body text-muted-foreground">
                                {step.body}
                            </p>
                            {step.where ? (
                                <p className="text-caption inline-flex items-center gap-1.5 rounded-md bg-tint-green px-2 py-0.5 font-medium text-tint-green-foreground">
                                    <MousePointerClickIcon
                                        aria-hidden="true"
                                        className="size-3.5"
                                    />
                                    {step.where}
                                </p>
                            ) : null}
                        </div>
                    </li>
                ))}
            </ol>

            {section.tips?.length ? (
                <Callout title="Good to know" tone="neutral">
                    <ul className="list-disc space-y-1 pl-4">
                        {section.tips.map((tip) => (
                            <li key={tip}>{tip}</li>
                        ))}
                    </ul>
                </Callout>
            ) : null}
        </section>
    );
}
