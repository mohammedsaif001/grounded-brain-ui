"use client";

import { ConfirmDialog } from "@/shared/components/confirm-dialog";

type DeleteSourcesDialogProps = {
    open: boolean;
    /** Names the thing being deleted, e.g. a title or "3 sources". */
    subject: string;
    isPending: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

/** Confirmation for destructive source deletion (single or bulk). */
export function DeleteSourcesDialog({
    open,
    subject,
    isPending,
    onConfirm,
    onCancel,
}: DeleteSourcesDialogProps) {
    return (
        <ConfirmDialog
            open={open}
            title={`Delete ${subject}?`}
            description={
                <>
                    This permanently removes{" "}
                    <span className="font-medium text-foreground">
                        {subject}
                    </span>{" "}
                    and its indexed content. This can&apos;t be undone.
                </>
            }
            isPending={isPending}
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    );
}
