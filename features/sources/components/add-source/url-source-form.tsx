"use client";

import { useState } from "react";
import {
    useImportWebsiteSource,
    useImportYoutubeSource,
} from "../../hooks/use-sources";
import {
    FormError,
    SubmitFooter,
    TextField,
    useSourceSubmit,
    type OnSourceCreated,
} from "./form-fields";

const COPY = {
    WEBSITE: {
        urlLabel: "Website URL",
        urlPlaceholder: "https://example.com/article",
        titlePlaceholder: "Article title",
        submit: "Import website",
        failure: "Failed to import website",
    },
    YOUTUBE: {
        urlLabel: "YouTube URL",
        urlPlaceholder: "https://www.youtube.com/watch?v=...",
        titlePlaceholder: "Video title",
        submit: "Import transcript",
        failure: "Failed to import YouTube transcript",
    },
} as const;

type UrlSourceFormProps = {
    workspaceId: string;
    kind: "WEBSITE" | "YOUTUBE";
    onCreated: OnSourceCreated;
};

/** Imports a web page or a YouTube transcript by URL. */
export function UrlSourceForm({ workspaceId, kind, onCreated }: UrlSourceFormProps) {
    const copy = COPY[kind];
    const idPrefix = kind.toLowerCase();
    const options = { suppressErrorToast: true };
    const importWebsite = useImportWebsiteSource(workspaceId, options);
    const importYoutube = useImportYoutubeSource(workspaceId, options);
    const mutation = kind === "WEBSITE" ? importWebsite : importYoutube;
    const { error, submit } = useSourceSubmit(onCreated);
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");

    return (
        <form
            className="grid gap-4 pt-4"
            onSubmit={(event) => {
                event.preventDefault();
                void submit(
                    () =>
                        mutation.mutateAsync({
                            url: url.trim(),
                            title: title.trim() || undefined,
                        }),
                    copy.failure,
                );
            }}
        >
            <TextField
                id={`${idPrefix}-url`}
                label={copy.urlLabel}
                type="url"
                inputMode="url"
                value={url}
                onValueChange={setUrl}
                placeholder={copy.urlPlaceholder}
                disabled={mutation.isPending}
                required
            />
            <TextField
                id={`${idPrefix}-title`}
                label="Title (optional)"
                value={title}
                onValueChange={setTitle}
                placeholder={copy.titlePlaceholder}
                disabled={mutation.isPending}
            />
            <FormError message={error} />
            <SubmitFooter pending={mutation.isPending}>{copy.submit}</SubmitFooter>
        </form>
    );
}
