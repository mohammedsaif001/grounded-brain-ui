"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import {
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CircleHelpIcon,
    LayersIcon,
    LightbulbIcon,
    RefreshCwIcon,
    RotateCcwIcon,
    ShuffleIcon,
    SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { StreamdownContent } from "@/shared/components/streamdown-content";
import type { ArtifactCitation, Flashcard } from "../../lib/types";
import { ArtifactSources } from "../artifact-sources";

const SWIPE_THRESHOLD = 90;
const SWIPE_VELOCITY = 400;

const cardVariants = {
    enter: (direction: number) => ({
        x: direction >= 0 ? 260 : -260,
        opacity: 0,
        scale: 0.92,
        rotate: direction >= 0 ? 4 : -4,
    }),
    center: { x: 0, opacity: 1, scale: 1, rotate: 0 },
    exit: (direction: number) => ({
        x: direction >= 0 ? -260 : 260,
        opacity: 0,
        scale: 0.92,
        rotate: direction >= 0 ? -4 : 4,
    }),
};

function shuffleOrder(length: number) {
    const order = Array.from({ length }, (_, index) => index);

    for (let i = order.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }

    return order;
}

/** Progress resets when the parent remounts it (keyed by artifact version). */
export function FlashcardsViewer({
    cards,
    workspaceId,
}: {
    cards: Flashcard[];
    workspaceId: string;
}) {
    const [order, setOrder] = useState(() =>
        Array.from({ length: cards.length }, (_, index) => index),
    );
    const [position, setPosition] = useState(0);
    const [direction, setDirection] = useState(1);
    const [flipped, setFlipped] = useState(false);
    const [known, setKnown] = useState<Set<number>>(new Set());
    const dragged = useRef(false);

    const cardIndex = order[position];
    const card = cards[cardIndex];

    const goTo = useCallback(
        (nextDirection: number) => {
            if (cards.length === 0) {
                return;
            }

            setDirection(nextDirection);
            setFlipped(false);
            setPosition((current) => {
                const next = current + nextDirection;
                return (next + cards.length) % cards.length;
            });
        },
        [cards.length],
    );

    const flip = useCallback(() => setFlipped((value) => !value), []);

    const markKnown = useCallback(() => {
        setKnown((current) => {
            const next = new Set(current);
            next.add(cardIndex);
            return next;
        });
        goTo(1);
    }, [cardIndex, goTo]);

    const markUnknown = useCallback(() => {
        setKnown((current) => {
            if (!current.has(cardIndex)) {
                return current;
            }
            const next = new Set(current);
            next.delete(cardIndex);
            return next;
        });
        goTo(1);
    }, [cardIndex, goTo]);

    const shuffle = useCallback(() => {
        setOrder(shuffleOrder(cards.length));
        setPosition(0);
        setDirection(1);
        setFlipped(false);
    }, [cards.length]);

    const restart = useCallback(() => {
        setOrder(Array.from({ length: cards.length }, (_, index) => index));
        setPosition(0);
        setDirection(1);
        setFlipped(false);
        setKnown(new Set());
    }, [cards.length]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const target = event.target as HTMLElement | null;
            if (
                target &&
                ["INPUT", "TEXTAREA"].includes(target.tagName)
            ) {
                return;
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                goTo(1);
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                goTo(-1);
            } else if (event.key === " " || event.key === "Enter") {
                event.preventDefault();
                flip();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goTo, flip]);

    const handleDragEnd = useCallback(
        (_event: unknown, info: PanInfo) => {
            const { offset, velocity } = info;

            if (
                offset.x < -SWIPE_THRESHOLD ||
                velocity.x < -SWIPE_VELOCITY
            ) {
                goTo(1);
            } else if (
                offset.x > SWIPE_THRESHOLD ||
                velocity.x > SWIPE_VELOCITY
            ) {
                goTo(-1);
            }

            window.setTimeout(() => {
                dragged.current = false;
            }, 0);
        },
        [goTo],
    );

    const progress = useMemo(
        () => (cards.length ? (known.size / cards.length) * 100 : 0),
        [known.size, cards.length],
    );

    if (!card) {
        return (
            <p className="py-10 text-center text-sm text-muted-foreground">
                This deck has no cards.
            </p>
        );
    }

    const isKnown = known.has(cardIndex);
    const allKnown = known.size === cards.length;

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-tint-violet px-3 py-1 text-xs font-semibold tabular-nums text-tint-violet-foreground">
                        <LayersIcon aria-hidden="true" className="size-3.5" />
                        Card {position + 1} of {cards.length}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-tint-green px-3 py-1 text-xs font-semibold tabular-nums text-tint-green-foreground">
                        <SparklesIcon aria-hidden="true" className="size-3.5" />
                        {known.size} learned
                    </span>
                </div>
                <div
                    role="progressbar"
                    aria-label="Cards learned"
                    aria-valuemin={0}
                    aria-valuemax={cards.length}
                    aria-valuenow={known.size}
                    className="h-2 w-full overflow-hidden rounded-full bg-muted"
                >
                    <motion.div
                        className="h-full rounded-full bg-linear-to-r from-primary to-[color-mix(in_oklab,var(--primary),black_18%)]"
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 220, damping: 30 }}
                    />
                </div>
            </div>

            <div className="relative h-[21rem] perspective-[1600px] sm:h-96">
                <div
                    aria-hidden
                    className="absolute inset-x-8 top-4 h-full rounded-3xl border border-border/60 bg-tint-violet/40"
                />
                <div
                    aria-hidden
                    className="absolute inset-x-4 top-2 h-full rounded-3xl border border-border bg-tint-violet/70"
                />

                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={position}
                        custom={direction}
                        variants={cardVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            type: "spring",
                            stiffness: 320,
                            damping: 32,
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.35}
                        onDragStart={() => {
                            dragged.current = true;
                        }}
                        onDragEnd={handleDragEnd}
                        className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    >
                        <motion.div
                            className="relative size-full"
                            style={{ transformStyle: "preserve-3d" }}
                            animate={{ rotateY: flipped ? 180 : 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 26,
                            }}
                            onClick={() => {
                                if (dragged.current) {
                                    return;
                                }
                                flip();
                            }}
                        >
                            <CardFace
                                side="Front"
                                content={card.front}
                                isKnown={isKnown}
                                index={position + 1}
                                total={cards.length}
                            />
                            <CardFace
                                side="Back"
                                content={card.back}
                                isKnown={isKnown}
                                index={position + 1}
                                total={cards.length}
                                back
                                workspaceId={workspaceId}
                                citations={card.citations}
                            />
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex items-center justify-between gap-2">
                <Button
                    variant="outline"
                    onClick={() => goTo(-1)}
                    aria-label="Previous card"
                >
                    <ChevronLeftIcon />
                    <span className="hidden sm:inline">Previous</span>
                </Button>

                <Button variant="secondary" onClick={flip} className="px-6">
                    <RotateCcwIcon />
                    {flipped ? "Show question" : "Reveal answer"}
                </Button>

                <Button
                    variant="outline"
                    onClick={() => goTo(1)}
                    aria-label="Next card"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRightIcon />
                </Button>
            </div>

            <AnimatePresence initial={false}>
                {flipped ? (
                    <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -8, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="lg"
                                className="flex-1 hover:bg-tint-rose hover:text-tint-rose-foreground"
                                onClick={markUnknown}
                            >
                                <RefreshCwIcon />
                                Still learning
                            </Button>
                            <Button
                                size="lg"
                                className="flex-1"
                                onClick={markKnown}
                            >
                                <CheckIcon />
                                Got it
                            </Button>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <Kbd>←</Kbd>
                    <Kbd>→</Kbd>
                    to navigate
                    <Kbd className="ml-1.5">Space</Kbd>
                    to flip, or swipe the card
                </p>
                <div className="flex gap-1.5">
                    <Button variant="ghost" size="sm" onClick={shuffle}>
                        <ShuffleIcon />
                        Shuffle
                    </Button>
                    <Button variant="ghost" size="sm" onClick={restart}>
                        <RotateCcwIcon />
                        Restart
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {allKnown ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="rounded-xl bg-tint-green px-4 py-3 text-center text-sm text-tint-green-foreground"
                    >
                        You have marked every card as learned. Nice work.
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}

function CardFace({
    content,
    isKnown,
    index,
    total,
    back = false,
    workspaceId,
    citations,
}: {
    side: string;
    content: string;
    isKnown: boolean;
    index: number;
    total: number;
    back?: boolean;
    /** Only the back shows where the answer comes from. */
    workspaceId?: string;
    citations?: readonly ArtifactCitation[];
}) {
    const Watermark = back ? LightbulbIcon : LayersIcon;

    return (
        <div
            className={`absolute inset-0 flex flex-col overflow-hidden rounded-3xl border p-6 shadow-overlay backface-hidden sm:p-8 ${
                back
                    ? "border-tint-green-foreground/20 bg-linear-to-br from-tint-green to-card text-foreground transform-[rotateY(180deg)]"
                    : "border-tint-violet-foreground/20 bg-linear-to-br from-tint-violet to-card text-foreground"
            } ${isKnown ? "ring-2 ring-primary" : ""}`}
        >
            <Watermark
                aria-hidden="true"
                className={`pointer-events-none absolute -right-8 -bottom-8 size-48 -rotate-12 ${
                    back
                        ? "text-tint-green-foreground/10"
                        : "text-tint-violet-foreground/10"
                }`}
            />

            <div className="relative flex items-center justify-between gap-3">
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        back
                            ? "bg-tint-green-foreground/10 text-tint-green-foreground"
                            : "bg-tint-violet-foreground/10 text-tint-violet-foreground"
                    }`}
                >
                    {back ? (
                        <LightbulbIcon aria-hidden="true" className="size-3.5" />
                    ) : (
                        <CircleHelpIcon aria-hidden="true" className="size-3.5" />
                    )}
                    {back ? "Answer" : "Question"}
                </span>
                {isKnown ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                        <CheckIcon aria-hidden="true" className="size-3.5" />
                        Learned
                    </span>
                ) : (
                    <span className="text-xs font-medium tabular-nums text-muted-foreground">
                        {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
                    </span>
                )}
            </div>

            <div className="relative flex flex-1 items-center overflow-y-auto py-4">
                <StreamdownContent
                    content={content}
                    className={
                        back
                            ? "text-body max-w-none text-base leading-relaxed [&_p]:my-0 [&_p+p]:mt-3"
                            : "max-w-none font-serif text-2xl leading-snug sm:text-3xl [&_p]:my-0 [&_p+p]:mt-3"
                    }
                />
            </div>

            {back && workspaceId && citations?.length ? (
                <ArtifactSources
                    workspaceId={workspaceId}
                    citations={citations}
                    className="relative border-t border-border/60 pt-3"
                />
            ) : (
                <p className="relative flex items-center gap-1.5 text-xs text-muted-foreground">
                    <RotateCcwIcon aria-hidden="true" className="size-3.5" />
                    {back ? "Tap to see the question" : "Tap the card to reveal the answer"}
                </p>
            )}
        </div>
    );
}
