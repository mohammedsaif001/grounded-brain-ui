"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/shared/lib/errors";
import type { Source } from "../../lib/types";

/** Called by every add-source form once the API has accepted the new source. */
export type OnSourceCreated = (source: Source) => void;

/**
 * Runs a create-source request and keeps its error message for inline display.
 * Each form owns one of these, so an error on one tab never leaks into another.
 */
export function useSourceSubmit(onCreated: OnSourceCreated) {
    const [error, setError] = useState<string | null>(null);

    async function submit(
        request: () => Promise<Source>,
        fallbackMessage: string,
    ) {
        setError(null);
        try {
            onCreated(await request());
        } catch (submitError) {
            setError(getErrorMessage(submitError, fallbackMessage));
        }
    }

    return { error, setError, submit };
}

type TextFieldProps = Omit<ComponentProps<typeof Input>, "onChange"> & {
    id: string;
    label: string;
    onValueChange: (value: string) => void;
};

export function TextField({ id, label, onValueChange, ...props }: TextFieldProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                onChange={(event) => onValueChange(event.target.value)}
                {...props}
            />
        </div>
    );
}

type TextAreaFieldProps = Omit<ComponentProps<typeof Textarea>, "onChange"> & {
    id: string;
    label: string;
    onValueChange: (value: string) => void;
};

export function TextAreaField({
    id,
    label,
    onValueChange,
    rows = 6,
    ...props
}: TextAreaFieldProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Textarea
                id={id}
                rows={rows}
                onChange={(event) => onValueChange(event.target.value)}
                {...props}
            />
        </div>
    );
}

export function FormError({ message }: { message: string | null }) {
    return message ? (
        <p role="alert" className="text-sm text-destructive">
            {message}
        </p>
    ) : null;
}

export function SubmitFooter({
    pending,
    children,
}: {
    pending: boolean;
    children: ReactNode;
}) {
    return (
        <DialogFooter>
            <Button type="submit" disabled={pending}>
                {pending ? <Spinner /> : null}
                {children}
            </Button>
        </DialogFooter>
    );
}
