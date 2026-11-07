"use client";

import { useRef, useState } from "react";
import { FileTextIcon, UploadIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TypeTile } from "@/shared/components/type-tile";
import { useUploadPdfSource } from "../../hooks/use-sources";
import { MAX_PDF_SIZE_BYTES } from "../../lib/constants";
import { formatFileSize } from "../../lib/format-file-size";
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
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const isPending = uploadPdf.isPending;

    function pick(picked: File | null) {
        setFile(picked);
        setError(picked ? validatePdf(picked) : null);
    }

    return (
        <form
            className="grid gap-4 pt-4 short:gap-3 short:pt-3"
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
            <div
                onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                    event.preventDefault();
                    setDragging(false);
                    if (!isPending) pick(event.dataTransfer.files?.[0] ?? null);
                }}
                className={cn(
                    "flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-10 short:py-6 text-center transition-colors",
                    dragging
                        ? "border-ring bg-accent/50"
                        : "border-border bg-card/40",
                )}
            >
                <TypeTile icon={UploadIcon} tone="green" size="lg" />
                <p className="text-heading">
                    Drop your PDF here, or{" "}
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => inputRef.current?.click()}
                        className="rounded-sm underline underline-offset-4 outline-none hover:decoration-2 focus-visible:ring-3 focus-visible:ring-ring/40"
                    >
                        browse files
                    </button>
                </p>
                <p className="text-caption">
                    PDF only · up to {MAX_PDF_SIZE_MB} MB · one file at a time
                </p>
                <input
                    ref={inputRef}
                    id="pdf-file"
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    tabIndex={-1}
                    aria-label="PDF file"
                    disabled={isPending}
                    onChange={(event) => {
                        pick(event.target.files?.[0] ?? null);
                        // Allow re-picking the same file after removing it.
                        event.target.value = "";
                    }}
                />
            </div>

            {file ? (
                <>
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-surface">
                        <TypeTile icon={FileTextIcon} tone="blue" size="md" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                                {file.name}
                            </p>
                            <p className="text-caption">
                                {formatFileSize(file.size)} · Ready to upload
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            disabled={isPending}
                            onClick={() => pick(null)}
                        >
                            <XIcon aria-hidden="true" />
                            <span className="sr-only">Remove {file.name}</span>
                        </Button>
                    </div>
                    <TextField
                        id="pdf-title"
                        label="Title (optional)"
                        value={title}
                        onValueChange={setTitle}
                        placeholder="Research paper"
                        disabled={isPending}
                    />
                </>
            ) : null}

            <FormError message={error} />
            <SubmitFooter pending={isPending} disabled={!file}>
                Add 1 source
            </SubmitFooter>
        </form>
    );
}
