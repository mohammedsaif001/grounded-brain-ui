"use client";

import { useState } from "react";
import { useCreateSource } from "../../hooks/use-sources";
import {
    FormError,
    SubmitFooter,
    TextAreaField,
    TextField,
    useSourceSubmit,
    type OnSourceCreated,
} from "./form-fields";

const COPY = {
    TEXT: {
        titlePlaceholder: "Meeting notes",
        contentLabel: "Content",
        contentPlaceholder: "Paste your text here...",
        submit: "Add text source",
        rows: 6,
    },
    MARKDOWN: {
        titlePlaceholder: "Research notes",
        contentLabel: "Markdown",
        contentPlaceholder: "# Heading\n\nWrite markdown here...",
        submit: "Add markdown source",
        rows: 8,
    },
} as const;

type TextSourceFormProps = {
    workspaceId: string;
    kind: "TEXT" | "MARKDOWN";
    onCreated: OnSourceCreated;
};

/** Pasted plain text or markdown. */
export function TextSourceForm({
    workspaceId,
    kind,
    onCreated,
}: TextSourceFormProps) {
    const copy = COPY[kind];
    const idPrefix = kind.toLowerCase();
    const createSource = useCreateSource(workspaceId, {
        suppressErrorToast: true,
    });
    const { error, submit } = useSourceSubmit(onCreated);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    return (
        <form
            className="grid grid-cols-1 gap-4 pt-4 short:gap-3 short:pt-3"
            onSubmit={(event) => {
                event.preventDefault();
                void submit(
                    () =>
                        createSource.mutateAsync({
                            type: kind,
                            title: title.trim(),
                            content,
                        }),
                    `Failed to add ${kind === "TEXT" ? "text" : "markdown"} source`,
                );
            }}
        >
            <TextField
                id={`${idPrefix}-title`}
                label="Title"
                value={title}
                onValueChange={setTitle}
                placeholder={copy.titlePlaceholder}
                disabled={createSource.isPending}
                required
            />
            <TextAreaField
                id={`${idPrefix}-content`}
                label={copy.contentLabel}
                value={content}
                onValueChange={setContent}
                placeholder={copy.contentPlaceholder}
                rows={copy.rows}
                disabled={createSource.isPending}
                required
            />
            <FormError message={error} />
            <SubmitFooter pending={createSource.isPending}>
                {copy.submit}
            </SubmitFooter>
        </form>
    );
}
