"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

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
        <AlertDialog
            open={open}
            onOpenChange={(next) => {
                if (!next) onCancel();
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {subject}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This permanently removes{" "}
                        <span className="font-medium text-foreground">
                            {subject}
                        </span>{" "}
                        and its indexed content. This can&apos;t be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={isPending}
                        onClick={(event) => {
                            event.preventDefault();
                            onConfirm();
                        }}
                    >
                        {isPending ? <Spinner /> : null}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
