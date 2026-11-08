import Link from "next/link";
import {
    ArrowRightIcon,
    ChevronRightIcon,
    LogInIcon,
    MessageSquareIcon,
    NotebookPenIcon,
} from "lucide-react";
import { TypeTile } from "@/shared/components/type-tile";
import { routes } from "@/shared/config/routes";

/** The first-run path, in the order a new visitor will do it. The full tour is /docs. */
const STEPS = [
    {
        icon: LogInIcon,
        tone: "blue",
        title: "Sign in",
        caption: "With your Google account",
    },
    {
        icon: NotebookPenIcon,
        tone: "green",
        title: "Create a notebook",
        caption: "Then add your sources",
    },
    {
        icon: MessageSquareIcon,
        tone: "violet",
        title: "Chat and study",
        caption: "Answers cite your sources",
    },
] as const;

/**
 * Slim onboarding strip for the sign-in page: three steps and a link to the guide.
 * Kept separate from the sign-in card so the card stays about one decision.
 */
export function GettingStarted() {
    return (
        <section
            aria-labelledby="getting-started-heading"
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card/70 p-3 shadow-surface backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5 short:py-2"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <h2
                    id="getting-started-heading"
                    className="text-eyebrow shrink-0"
                >
                    Get started in 3 steps
                </h2>
                <ol className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                    {STEPS.map((step, index) => (
                        <li
                            key={step.title}
                            className="flex items-center gap-2"
                        >
                            <TypeTile
                                icon={step.icon}
                                tone={step.tone}
                                size="sm"
                            />
                            <span className="leading-tight">
                                <span className="block text-sm font-semibold">
                                    <span className="sr-only">
                                        Step {index + 1}:{" "}
                                    </span>
                                    {step.title}
                                </span>
                                <span className="text-caption hidden md:block">
                                    {step.caption}
                                </span>
                            </span>
                            {index < STEPS.length - 1 ? (
                                <ChevronRightIcon
                                    aria-hidden="true"
                                    className="mx-1 hidden size-4 text-muted-foreground sm:block"
                                />
                            ) : null}
                        </li>
                    ))}
                </ol>
            </div>

            <Link
                href={routes.docs}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md text-sm font-semibold underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/40"
            >
                Read the full guide
                <ArrowRightIcon aria-hidden="true" className="size-4" />
            </Link>
        </section>
    );
}
