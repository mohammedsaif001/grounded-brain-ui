import { WrenchIcon, type LucideIcon } from "lucide-react";
import { OUTAGE_COPY } from "@/shared/lib/outage";
import { ApiError } from "@/shared/lib/api";
import { EmptyState } from "./empty-state";

type LoadErrorProps = {
    error: unknown;
    /** Icon and title for an ordinary failure, e.g. "Could not load sources". */
    icon: LucideIcon;
    title: string;
    /** Used when the error carries no message of its own. */
    fallbackDescription?: string;
    /** Buttons under the copy (retry, back). */
    children?: React.ReactNode;
    className?: string;
};

/**
 * Empty state for a list or page that failed to load. A backend or Mem0 outage gets the
 * "under maintenance" wording instead of a generic failure, so users know it is not
 * something they did and that waiting will fix it.
 */
export function LoadError({
    error,
    icon,
    title,
    fallbackDescription = "Please try again in a moment.",
    children,
    className,
}: LoadErrorProps) {
    if (error instanceof ApiError && error.service) {
        const copy = OUTAGE_COPY[error.service];
        return (
            <EmptyState
                icon={WrenchIcon}
                feedback="warning"
                title={copy.title}
                description={copy.message}
                className={className}
            >
                {children}
            </EmptyState>
        );
    }

    return (
        <EmptyState
            icon={icon}
            feedback="error"
            title={title}
            description={
                error instanceof ApiError ? error.message : fallbackDescription
            }
            className={className}
        >
            {children}
        </EmptyState>
    );
}
