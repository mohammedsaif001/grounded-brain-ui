"use client";

import { useState } from "react";
import { useImportGithubSource } from "../../hooks/use-sources";
import {
    FormError,
    SubmitFooter,
    TextField,
    useSourceSubmit,
    type OnSourceCreated,
} from "./form-fields";

export function GithubSourceForm({
    workspaceId,
    onCreated,
}: {
    workspaceId: string;
    onCreated: OnSourceCreated;
}) {
    const importGithub = useImportGithubSource(workspaceId, {
        suppressErrorToast: true,
    });
    const { error, submit } = useSourceSubmit(onCreated);
    const [url, setUrl] = useState("");
    const [branch, setBranch] = useState("");
    const [title, setTitle] = useState("");
    const disabled = importGithub.isPending;

    return (
        <form
            className="grid gap-4 pt-4"
            onSubmit={(event) => {
                event.preventDefault();
                void submit(
                    () =>
                        importGithub.mutateAsync({
                            url: url.trim(),
                            branch: branch.trim() || undefined,
                            title: title.trim() || undefined,
                        }),
                    "Failed to import GitHub repository",
                );
            }}
        >
            <TextField
                id="github-url"
                label="Repository"
                value={url}
                onValueChange={setUrl}
                placeholder="owner/repo or https://github.com/owner/repo"
                disabled={disabled}
                required
            />
            <TextField
                id="github-branch"
                label="Branch (optional)"
                value={branch}
                onValueChange={setBranch}
                placeholder="Default branch"
                disabled={disabled}
            />
            <TextField
                id="github-title"
                label="Title (optional)"
                value={title}
                onValueChange={setTitle}
                placeholder="Repository name"
                disabled={disabled}
            />
            <p className="text-xs text-muted-foreground">
                Once indexed, generate a Repo Wiki from the Learn tab.
            </p>
            <FormError message={error} />
            <SubmitFooter pending={disabled}>Import repository</SubmitFooter>
        </form>
    );
}
