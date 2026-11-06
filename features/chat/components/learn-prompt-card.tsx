import Link from "next/link";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import { routes } from "@/shared/config/routes";

/** Nudges readers from a good answer into active study in the Learn hub. */
export function LearnPromptCard({ workspaceId }: { workspaceId: string }) {
    return (
        <aside className="space-y-3 rounded-2xl bg-tint-violet p-5 text-tint-violet-foreground">
            <SparklesIcon aria-hidden="true" className="size-5" />
            <div className="space-y-1">
                <h2 className="text-heading">Make it stick.</h2>
                <p className="text-sm opacity-90">
                    Put retrieval into practice. Turn your sources into
                    flashcards and quizzes.
                </p>
            </div>
            <Link
                href={routes.workspace.learn(workspaceId)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline focus-visible:underline"
            >
                Create flashcards in Learn
                <ArrowRightIcon aria-hidden="true" className="size-4" />
            </Link>
        </aside>
    );
}
