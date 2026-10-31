"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUploadPdfSource } from "../../hooks/use-sources";
import { MAX_PDF_SIZE_BYTES } from "../../lib/constants";
import {
    FormError,
    SubmitFooter,
    TextField,
    useSourceSubmit,
    type OnSourceCreated,
} from "./form-fields";

const MAX_PDF_SIZE_MB = MAX_PDF_SIZE_BYTES / (1024 * 1024);

/** Checks a picked file before uploading it, so the user is not left waiting on a doomed request. */
function validatePdf(file: File): string | null {
    const isPdf =
        file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
        return "Only PDF files are supported.";
    }
    if (file.size > MAX_PDF_SIZE_BYTES) {
        return `PDFs must be ${MAX_PDF_SIZE_MB}MB or smaller.`;
    }
    return null;
}

export function PdfSourceForm({
    workspaceId,
    onCreated,
}: {
    workspaceId: string;
    onCreated: OnSourceCreated;
}) {
    const uploadPdf = useUploadPdfSource(workspaceId, {
        suppressErrorToast: true,
    });
    const { error, setError, submit } = useSourceSubmit(onCreated);
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);

    return (
        <form
            className="grid gap-4 pt-2"
            onSubmit={(event) => {
                event.preventDefault();
                if (!file) {
                    setError("Choose a PDF file to upload.");
                    return;
                }
                const invalid = validatePdf(file);
                if (invalid) {
                    setError(invalid);
                    return;
                }
                void submit(
                    () =>
                        uploadPdf.mutateAsync({
                            file,
                            title: title.trim() || undefined,
                        }),
                    "Failed to upload PDF",
                );
            }}
        >
            <TextField
                id="pdf-title"
                label="Title (optional)"
                value={title}
                onValueChange={setTitle}
                placeholder="Research paper"
                disabled={uploadPdf.isPending}
            />
            <div className="grid gap-2">
                <Label htmlFor="pdf-file">PDF file</Label>
                <Input
                    id="pdf-file"
                    type="file"
                    accept="application/pdf,.pdf"
                    disabled={uploadPdf.isPending}
                    onChange={(event) => {
                        const picked = event.target.files?.[0] ?? null;
                        setFile(picked);
                        setError(picked ? validatePdf(picked) : null);
                    }}
                />
                <p className="text-xs text-muted-foreground">
                    {file
                        ? `Selected: ${file.name}`
                        : `Up to ${MAX_PDF_SIZE_MB}MB.`}
                </p>
            </div>
            <FormError message={error} />
            <SubmitFooter pending={uploadPdf.isPending}>Upload PDF</SubmitFooter>
        </form>
    );
}
