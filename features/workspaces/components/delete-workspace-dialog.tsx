"use client";

import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import type { Workspace } from "../lib/types";

type DeleteWorkspaceDialogProps = {
    workspace: Workspace | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void>;
    isPending?: boolean;
};

export function DeleteWorkspaceDialog({
    workspace,
    open,
    onOpenChange,
    onConfirm,
    isPending = false,
}: DeleteWorkspaceDialogProps) {
    return (
        <ConfirmDialog
            open={open}
            title="Delete workspace?"
            description={
                <>
                    This will permanently delete{" "}
                    <span className="font-medium text-foreground">
                        {workspace?.title}
                    </span>
                    . This action cannot be undone.
                </>
            }
            isPending={isPending}
            // Failures are reported by the global mutation error toast.
            onConfirm={() => onConfirm().catch(() => undefined)}
            onCancel={() => onOpenChange(false)}
        />
    );
}
