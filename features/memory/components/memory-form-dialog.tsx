"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/shared/lib/errors";
import type { UserMemory } from "../lib/types";
import { XIcon, CheckIcon, PlusIcon } from "lucide-react";

type MemoryFormValues = { memory: string };

type MemoryFormDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    memory?: UserMemory | null;
    onSubmit: (values: MemoryFormValues) => Promise<void>;
    isPending?: boolean;
};

export function MemoryFormDialog({
    open,
    onOpenChange,
    memory,
    onSubmit,
    isPending = false,
}: MemoryFormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                {/* Mounted only while open, so each opening starts from fresh state. */}
                <MemoryForm
                    memory={memory}
                    onSubmit={onSubmit}
                    onClose={() => onOpenChange(false)}
                    isPending={isPending}
                />
            </DialogContent>
        </Dialog>
    );
}

type MemoryFormProps = {
    memory?: UserMemory | null;
    onSubmit: (values: MemoryFormValues) => Promise<void>;
    onClose: () => void;
    isPending: boolean;
};

function MemoryForm({ memory, onSubmit, onClose, isPending }: MemoryFormProps) {
    const isEditing = Boolean(memory);
    const [value, setValue] = useState(memory?.memory ?? "");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const trimmedValue = value.trim();
        if (!trimmedValue) {
            setError("Memory text is required.");
            return;
        }

        try {
            await onSubmit({ memory: trimmedValue });
            onClose();
        } catch (submitError) {
            setError(getErrorMessage(submitError, "Could not save memory."));
        }
    }

    return (
        <form onSubmit={(event) => void handleSubmit(event)}>
            <DialogHeader>
                <DialogTitle>{isEditing ? "Edit memory" : "Add memory"}</DialogTitle>
                <DialogDescription>
                    Memories are stored in Mem0 and injected into chat when
                    relevant.
                </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="memory-value">Memory</Label>
                    <Textarea
                        id="memory-value"
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        placeholder="Prefers concise explanations with examples"
                        rows={5}
                        disabled={isPending}
                    />
                </div>
                {error ? (
                    <p role="alert" className="text-sm text-destructive">
                        {error}
                    </p>
                ) : null}
            </div>

            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isPending}
                >
                    <XIcon aria-hidden="true" />
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? (
                        <Spinner />
                    ) : isEditing ? (
                        <CheckIcon aria-hidden="true" />
                    ) : (
                        <PlusIcon aria-hidden="true" />
                    )}
                    {isEditing ? "Save" : "Add"}
                </Button>
            </DialogFooter>
        </form>
    );
}
