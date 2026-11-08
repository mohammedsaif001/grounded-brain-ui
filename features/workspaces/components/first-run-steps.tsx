import { LibraryBigIcon, MessageSquareIcon, SparklesIcon } from "lucide-react";
import { TypeTile } from "@/shared/components/type-tile";

const STEPS = [
    {
        icon: LibraryBigIcon,
        tone: "green",
        title: "Add your sources",
        description: "PDFs, websites, YouTube videos, GitHub repos and notes, all in one notebook.",
    },
    {
        icon: MessageSquareIcon,
        tone: "blue",
        title: "Chat with context",
        description: "Ask anything. Answers cite the exact passages they came from.",
    },
    {
        icon: SparklesIcon,
        tone: "violet",
        title: "Learn faster",
        description: "Turn them into flashcards, quizzes, mind maps and summaries.",
    },
] as const;

/** Shown to someone with no notebooks yet, in place of the "continue" shortcut. */
export function FirstRunSteps() {
    return (
        <section aria-labelledby="first-run-title" className="space-y-4">
            <div className="space-y-1">
                <p className="text-eyebrow">Getting started</p>
                <h2 id="first-run-title" className="text-heading">
                    Three steps from a pile of reading to real understanding
                </h2>
            </div>
            <ol className="grid gap-3 md:grid-cols-3">
                {STEPS.map((step, index) => (
                    <li
                        key={step.title}
                        className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-surface md:flex-col md:gap-3 md:p-5"
                    >
                        <div className="flex items-center gap-3">
                            <TypeTile icon={step.icon} tone={step.tone} />
                            <span className="text-caption font-semibold tabular-nums md:ml-auto">
                                Step {index + 1}
                            </span>
                        </div>
                        <div className="min-w-0 space-y-1">
                            <h3 className="text-sm font-semibold">{step.title}</h3>
                            <p className="text-caption">{step.description}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}
