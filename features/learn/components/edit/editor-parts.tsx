"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type EditorItemProps = {
    /** e.g. "Card 3". Also names the remove button for screen readers. */
    label: string;
    onRemove?: () => void;
    children: React.ReactNode;
    className?: string;
};

/** One editable entry (a card, a question, a section) with its remove button. */
export function EditorItem({
    label,
    onRemove,
    children,
    className,
}: EditorItemProps) {
    return (
        <li
            className={cn(
                "space-y-3 rounded-xl border border-border bg-card p-4",
                className,
            )}
        >
            <div className="flex items-center justify-between gap-2">
                <p className="text-eyebrow">{label}</p>
                {onRemove ? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={onRemove}
                    >
                        <Trash2Icon aria-hidden="true" />
                        <span className="sr-only">Remove {label}</span>
                    </Button>
                ) : null}
            </div>
            {children}
        </li>
    );
}

type FieldProps = {
    id: string;
    label: string;
    children: React.ReactNode;
};

export function EditorField({ id, label, children }: FieldProps) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id}>{label}</Label>
            {children}
        </div>
    );
}

type AddButtonProps = {
    label: string;
    onClick: () => void;
    /** Shown instead of the button once the API's maximum is reached. */
    disabled?: boolean;
};

export function AddButton({ label, onClick, disabled }: AddButtonProps) {
    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={onClick}
        >
            <PlusIcon aria-hidden="true" />
            {label}
        </Button>
    );
}

/** Same look as `Input`, for the native `<select>` used in connection pickers. */
export const nativeSelectClass =
    "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";
