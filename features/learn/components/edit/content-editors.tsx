"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    EDIT_LIMITS,
    removeQuizOption,
    type EditableContent,
} from "../../lib/edit";
import { AddButton, EditorField, EditorItem } from "./editor-parts";

type ContentEditorProps<T> = {
    value: T;
    onChange: (value: T) => void;
};

/** Immutable replace-at-index. */
function replaceAt<T>(items: T[], index: number, next: T): T[] {
    return items.map((item, position) => (position === index ? next : item));
}

function removeAt<T>(items: T[], index: number): T[] {
    return items.filter((_, position) => position !== index);
}

export function SummaryEditor({
    value,
    onChange,
}: ContentEditorProps<EditableContent<"SUMMARY">>) {
    return (
        <EditorField id="edit-summary" label="Summary (Markdown)">
            <Textarea
                id="edit-summary"
                rows={16}
                value={value.markdown}
                onChange={(event) =>
                    onChange({ ...value, markdown: event.target.value })
                }
                className="text-sm"
            />
            <p className="text-caption">
                Keep the [1], [2] markers to preserve source references.
            </p>
        </EditorField>
    );
}

export function TakeawaysEditor({
    value,
    onChange,
}: ContentEditorProps<EditableContent<"TAKEAWAYS">>) {
    const { items } = value;

    return (
        <div className="space-y-3">
            <ol className="space-y-3">
                {items.map((item, index) => (
                    <EditorItem
                        key={index}
                        label={`Takeaway ${index + 1}`}
                        onRemove={
                            items.length > EDIT_LIMITS.takeaways.min
                                ? () => onChange({ items: removeAt(items, index) })
                                : undefined
                        }
                    >
                        <Textarea
                            aria-label={`Takeaway ${index + 1}`}
                            rows={2}
                            value={item}
                            onChange={(event) =>
                                onChange({
                                    items: replaceAt(items, index, event.target.value),
                                })
                            }
                        />
                    </EditorItem>
                ))}
            </ol>
            <AddButton
                label="Add takeaway"
                disabled={items.length >= EDIT_LIMITS.takeaways.max}
                onClick={() => onChange({ items: [...items, ""] })}
            />
        </div>
    );
}

export function FlashcardsEditor({
    value,
    onChange,
}: ContentEditorProps<EditableContent<"FLASHCARDS">>) {
    const { cards } = value;

    return (
        <div className="space-y-3">
            <ol className="space-y-3">
                {cards.map((card, index) => (
                    <EditorItem
                        key={index}
                        label={`Card ${index + 1}`}
                        onRemove={
                            cards.length > EDIT_LIMITS.flashcards.min
                                ? () => onChange({ cards: removeAt(cards, index) })
                                : undefined
                        }
                    >
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <EditorField id={`card-${index}-front`} label="Front">
                                <Textarea
                                    id={`card-${index}-front`}
                                    rows={3}
                                    value={card.front}
                                    onChange={(event) =>
                                        onChange({
                                            cards: replaceAt(cards, index, {
                                                ...card,
                                                front: event.target.value,
                                            }),
                                        })
                                    }
                                />
                            </EditorField>
                            <EditorField id={`card-${index}-back`} label="Back">
                                <Textarea
                                    id={`card-${index}-back`}
                                    rows={3}
                                    value={card.back}
                                    onChange={(event) =>
                                        onChange({
                                            cards: replaceAt(cards, index, {
                                                ...card,
                                                back: event.target.value,
                                            }),
                                        })
                                    }
                                />
                            </EditorField>
                        </div>
                    </EditorItem>
                ))}
            </ol>
            <AddButton
                label="Add card"
                disabled={cards.length >= EDIT_LIMITS.flashcards.max}
                onClick={() =>
                    onChange({
                        cards: [...cards, { front: "", back: "", citations: [] }],
                    })
                }
            />
        </div>
    );
}

export function QuizEditor({
    value,
    onChange,
}: ContentEditorProps<EditableContent<"QUIZ">>) {
    const { questions } = value;

    return (
        <div className="space-y-3">
            <ol className="space-y-3">
                {questions.map((question, index) => {
                    const update = (next: typeof question) =>
                        onChange({ questions: replaceAt(questions, index, next) });
                    const needsAnswer =
                        question.correctIndex >= question.options.length;

                    return (
                        <EditorItem
                            key={index}
                            label={`Question ${index + 1}`}
                            onRemove={
                                questions.length > EDIT_LIMITS.questions.min
                                    ? () =>
                                          onChange({
                                              questions: removeAt(questions, index),
                                          })
                                    : undefined
                            }
                        >
                            <EditorField
                                id={`q-${index}-text`}
                                label="Question"
                            >
                                <Textarea
                                    id={`q-${index}-text`}
                                    rows={2}
                                    value={question.question}
                                    onChange={(event) =>
                                        update({
                                            ...question,
                                            question: event.target.value,
                                        })
                                    }
                                />
                            </EditorField>

                            <fieldset className="space-y-2">
                                <legend className="text-sm font-medium">
                                    Options{" "}
                                    <span className="text-caption font-normal">
                                        (select the correct answer)
                                    </span>
                                </legend>
                                {question.options.map((option, optionIndex) => (
                                    <div
                                        key={optionIndex}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="radio"
                                            name={`q-${index}-correct`}
                                            aria-label={`Mark option ${optionIndex + 1} correct`}
                                            checked={
                                                question.correctIndex === optionIndex
                                            }
                                            onChange={() =>
                                                update({
                                                    ...question,
                                                    correctIndex: optionIndex,
                                                })
                                            }
                                            className="size-4 shrink-0 accent-ring"
                                        />
                                        <Input
                                            aria-label={`Option ${optionIndex + 1}`}
                                            value={option}
                                            onChange={(event) =>
                                                update({
                                                    ...question,
                                                    options: replaceAt(
                                                        question.options,
                                                        optionIndex,
                                                        event.target.value,
                                                    ),
                                                })
                                            }
                                        />
                                        {question.options.length >
                                        EDIT_LIMITS.options.min ? (
                                            <button
                                                type="button"
                                                className="text-caption shrink-0 underline underline-offset-4 hover:text-destructive"
                                                onClick={() =>
                                                    update(
                                                        removeQuizOption(
                                                            question,
                                                            optionIndex,
                                                        ),
                                                    )
                                                }
                                            >
                                                Remove
                                                <span className="sr-only">
                                                    {" "}
                                                    option {optionIndex + 1}
                                                </span>
                                            </button>
                                        ) : null}
                                    </div>
                                ))}
                                {needsAnswer ? (
                                    <p role="alert" className="text-caption text-destructive">
                                        Pick the correct answer.
                                    </p>
                                ) : null}
                                <AddButton
                                    label="Add option"
                                    disabled={
                                        question.options.length >=
                                        EDIT_LIMITS.options.max
                                    }
                                    onClick={() =>
                                        update({
                                            ...question,
                                            options: [...question.options, ""],
                                        })
                                    }
                                />
                            </fieldset>

                            <EditorField
                                id={`q-${index}-explanation`}
                                label="Explanation"
                            >
                                <Textarea
                                    id={`q-${index}-explanation`}
                                    rows={2}
                                    value={question.explanation}
                                    onChange={(event) =>
                                        update({
                                            ...question,
                                            explanation: event.target.value,
                                        })
                                    }
                                />
                            </EditorField>
                        </EditorItem>
                    );
                })}
            </ol>
            <AddButton
                label="Add question"
                disabled={questions.length >= EDIT_LIMITS.questions.max}
                onClick={() =>
                    onChange({
                        questions: [
                            ...questions,
                            {
                                question: "",
                                options: ["", ""],
                                correctIndex: 0,
                                explanation: "",
                                citations: [],
                            },
                        ],
                    })
                }
            />
        </div>
    );
}

export function ReportEditor({
    value,
    onChange,
}: ContentEditorProps<EditableContent<"REPORT">>) {
    const { sections } = value;

    return (
        <div className="space-y-5">
            <EditorField id="edit-report-markdown" label="Report (Markdown)">
                <Textarea
                    id="edit-report-markdown"
                    rows={10}
                    value={value.markdown}
                    onChange={(event) =>
                        onChange({ ...value, markdown: event.target.value })
                    }
                    className="text-sm"
                />
            </EditorField>

            <div className="space-y-3">
                <p className="text-heading">Sections</p>
                <ol className="space-y-3">
                    {sections.map((section, index) => (
                        <EditorItem
                            key={index}
                            label={`Section ${index + 1}`}
                            onRemove={() =>
                                onChange({
                                    ...value,
                                    sections: removeAt(sections, index),
                                })
                            }
                        >
                            <EditorField
                                id={`section-${index}-title`}
                                label="Title"
                            >
                                <Input
                                    id={`section-${index}-title`}
                                    value={section.title}
                                    onChange={(event) =>
                                        onChange({
                                            ...value,
                                            sections: replaceAt(sections, index, {
                                                ...section,
                                                title: event.target.value,
                                            }),
                                        })
                                    }
                                />
                            </EditorField>
                            <EditorField
                                id={`section-${index}-content`}
                                label="Content"
                            >
                                <Textarea
                                    id={`section-${index}-content`}
                                    rows={5}
                                    value={section.content}
                                    onChange={(event) =>
                                        onChange({
                                            ...value,
                                            sections: replaceAt(sections, index, {
                                                ...section,
                                                content: event.target.value,
                                            }),
                                        })
                                    }
                                />
                            </EditorField>
                        </EditorItem>
                    ))}
                </ol>
                <AddButton
                    label="Add section"
                    onClick={() =>
                        onChange({
                            ...value,
                            sections: [
                                ...sections,
                                { title: "", content: "", citations: [] },
                            ],
                        })
                    }
                />
            </div>
        </div>
    );
}

/**
 * The wiki's prose fields. Tech stack, modules and the diagram are kept exactly as
 * generated; changing them is a regenerate job, not a hand edit.
 */
export function WikiEditor({
    value,
    onChange,
}: ContentEditorProps<EditableContent<"WIKI">>) {
    return (
        <div className="space-y-4">
            {(
                [
                    ["overview", "Overview", 5],
                    ["architecture", "Architecture", 6],
                    ["gettingStarted", "Getting started", 6],
                ] as const
            ).map(([key, label, rows]) => (
                <EditorField key={key} id={`wiki-${key}`} label={label}>
                    <Textarea
                        id={`wiki-${key}`}
                        rows={rows}
                        value={value[key]}
                        onChange={(event) =>
                            onChange({ ...value, [key]: event.target.value })
                        }
                    />
                </EditorField>
            ))}
            <p className="text-caption">
                Tech stack, modules and the diagram are kept as generated.
            </p>
        </div>
    );
}
