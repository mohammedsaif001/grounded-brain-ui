"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckIcon, RotateCcwIcon, TrophyIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StreamdownContent } from "@/shared/components/streamdown-content";
import type { QuizQuestion } from "../../lib/types";
import { ArtifactSources } from "../artifact-sources";

const questionVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
};

/** Progress resets when the parent remounts it (keyed by artifact version). */
export function QuizViewer({
    questions,
    workspaceId,
}: {
    questions: QuizQuestion[];
    workspaceId: string;
}) {
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const question = questions[index];

    const restart = useCallback(() => {
        setIndex(0);
        setSelected(null);
        setScore(0);
        setFinished(false);
    }, []);

    if (!question) {
        return (
            <p className="py-10 text-center text-sm text-muted-foreground">
                This quiz has no questions.
            </p>
        );
    }

    function handleSelect(optionIndex: number) {
        if (selected !== null) {
            return;
        }

        setSelected(optionIndex);

        if (optionIndex === question.correctIndex) {
            setScore((current) => current + 1);
        }
    }

    function nextQuestion() {
        if (index + 1 >= questions.length) {
            setFinished(true);
            return;
        }

        setIndex((current) => current + 1);
        setSelected(null);
    }

    if (finished) {
        const percentage = Math.round((score / questions.length) * 100);

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="mx-auto max-w-lg space-y-5 rounded-2xl border bg-card p-8 text-center shadow-surface"
            >
                <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        delay: 0.1,
                        type: "spring",
                        stiffness: 240,
                        damping: 14,
                    }}
                    className="mx-auto flex size-16 items-center justify-center rounded-full bg-tint-green"
                >
                    <TrophyIcon className="size-7 text-tint-green-foreground" />
                </motion.div>

                <div className="space-y-1">
                    <p className="text-headline">
                        Quiz complete
                    </p>
                    <p className="text-muted-foreground">
                        You scored {score} out of {questions.length}
                    </p>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                    <motion.div
                        className="h-full rounded-full bg-ring"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    />
                </div>

                <Button onClick={restart}>
                    <RotateCcwIcon />
                    Try again
                </Button>
            </motion.div>
        );
    }

    const progress = (index / questions.length) * 100;

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="tabular-nums">
                        Question {index + 1} of {questions.length}
                    </span>
                    <span className="tabular-nums">{score} correct</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <motion.div
                        className="h-full rounded-full bg-ring"
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 220, damping: 30 }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    variants={questionVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.22 }}
                    className="space-y-4"
                >
                    <StreamdownContent
                        content={question.question}
                        className="max-w-none font-serif text-2xl leading-snug [&_p]:my-0"
                    />

                    <div className="grid gap-2">
                        {question.options.map((option, optionIndex) => {
                            const isSelected = selected === optionIndex;
                            const isCorrect =
                                optionIndex === question.correctIndex;
                            const revealed = selected !== null;

                            const stateClass = !revealed
                                ? "border-border bg-card hover:bg-muted/60"
                                : isCorrect
                                  ? "border-ring bg-accent"
                                  : isSelected
                                    ? "border-destructive bg-destructive/10"
                                    : "border-border bg-card opacity-55";

                            return (
                                <motion.button
                                    key={optionIndex}
                                    type="button"
                                    disabled={revealed}
                                    onClick={() => handleSelect(optionIndex)}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: optionIndex * 0.05,
                                        duration: 0.2,
                                    }}
                                    whileTap={
                                        revealed ? undefined : { scale: 0.985 }
                                    }
                                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 ${stateClass}`}
                                >
                                    <span
                                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold ${
                                            revealed && isCorrect
                                                ? "border-transparent bg-primary text-primary-foreground"
                                                : revealed && isSelected
                                                  ? "border-destructive bg-destructive text-white"
                                                  : "border-border bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {revealed && isCorrect ? (
                                            <CheckIcon className="size-3.5" />
                                        ) : revealed && isSelected ? (
                                            <XIcon className="size-3.5" />
                                        ) : (
                                            String.fromCharCode(
                                                65 + optionIndex,
                                            )
                                        )}
                                    </span>
                                    <span className="flex-1">{option}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            <AnimatePresence initial={false}>
                {selected !== null ? (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-3 rounded-2xl border bg-card p-5 shadow-surface">
                            <Badge
                                variant={
                                    selected === question.correctIndex
                                        ? "green"
                                        : "rose"
                                }
                            >
                                {selected === question.correctIndex
                                    ? "That's right"
                                    : "Not quite"}
                            </Badge>
                            <StreamdownContent
                                content={question.explanation}
                                className="text-body max-w-none [&_p]:my-0 [&_p+p]:mt-2"
                            />
                            <ArtifactSources
                                workspaceId={workspaceId}
                                citations={question.citations}
                            />
                            <Button onClick={nextQuestion}>
                                {index + 1 >= questions.length
                                    ? "See score"
                                    : "Next question"}
                            </Button>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
