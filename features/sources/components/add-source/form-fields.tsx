"use client";

import {
    createContext,
    useContext,
    useState,
    type ComponentProps,
    type ReactNode,
} from "react";
import {
    PlusIcon,
    ShieldCheckIcon,
    XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/shared/lib/errors";
import type { Source } from "../../lib/types";

type SourceFormContextValue = { onCancel: () => void };

const SourceFormContext = createContext<SourceFormContextValue>({
    onCancel: () => {},
});

/** Lets the shared footer close the dialog without every form threading a cancel prop. */
export const SourceFormProvider = SourceFormContext.Provider;

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
    disabled = false,
    children,
}: {
    pending: boolean;
    /** Extra reason to block submit, e.g. no file chosen yet. */
    disabled?: boolean;
    children: ReactNode;
}) {
    const { onCancel } = useContext(SourceFormContext);

    return (
        <div className="space-y-4 pt-1 short:space-y-3">
            <p className="text-caption flex items-center gap-2">
                <ShieldCheckIcon aria-hidden="true" className="size-4 shrink-0" />
                Sources are private. We extract passages so you can verify every
                answer.
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <p className="text-caption">
                    You can add other source types at any time.
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={pending}
                        onClick={onCancel}
                    >
                        <XIcon aria-hidden="true" />
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        size="lg"
                        disabled={pending || disabled}
                    >
                        {pending ? (
                            <Spinner />
                        ) : (
                            <PlusIcon aria-hidden="true" />
                        )}
                        {children}
                    </Button>
                </div>
            </div>
        </div>
    );
}
