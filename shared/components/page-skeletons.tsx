import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Loading skeletons for route `loading.tsx` files. Server-safe (no hooks), and sized to
 * match the real pages so content swaps in without layout shift.
 */

type SkeletonRootProps = {
    children: React.ReactNode;
    className?: string;
    label?: string;
};

/** Announces the busy state once instead of every individual placeholder. */
function SkeletonRoot({
    children,
    className,
    label = "Loading",
}: SkeletonRootProps) {
    return (
        <div
            role="status"
            aria-busy="true"
            aria-live="polite"
            className={className}
        >
            <span className="sr-only">{label}…</span>
            {children}
        </div>
    );
}

function PageTitleSkeleton({ withAction = true }: { withAction?: boolean }) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-3">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-72 max-w-full" />
            </div>
            {withAction ? <Skeleton className="h-11 w-32 rounded-xl" /> : null}
        </div>
    );
}

/** Title + a grid of cards (Learn hub, generic page fallback). */
export function CardGridPageSkeleton({
    cards = 6,
    className,
}: {
    cards?: number;
    className?: string;
}) {
    return (
        <SkeletonRoot
            className={cn(
                "mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 md:p-8",
                className,
            )}
        >
            <PageTitleSkeleton />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: cards }).map((_, index) => (
                    <Skeleton key={index} className="h-44 rounded-2xl" />
                ))}
            </div>
        </SkeletonRoot>
    );
}

/** Title + search/filter bar + rows (Sources library, memory list). */
export function ListPageSkeleton({
    rows = 6,
    className,
}: {
    rows?: number;
    className?: string;
}) {
    return (
        <SkeletonRoot
            className={cn(
                "mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 md:p-8",
                className,
            )}
        >
            <PageTitleSkeleton />
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <Skeleton className="h-11 min-w-0 flex-1 rounded-xl" />
                <div className="flex gap-2">
                    <Skeleton className="h-11 w-[130px] rounded-xl" />
                    <Skeleton className="h-11 w-[130px] rounded-xl" />
                </div>
            </div>
            <div className="space-y-3">
                {Array.from({ length: rows }).map((_, index) => (
                    <Skeleton key={index} className="h-16 rounded-xl" />
                ))}
            </div>
        </SkeletonRoot>
    );
}

/** Title + stacked form fields (workspace settings). */
export function FormPageSkeleton({ className }: { className?: string }) {
    return (
        <SkeletonRoot
            className={cn(
                "mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 md:p-8",
                className,
            )}
        >
            <PageTitleSkeleton withAction={false} />
            <div className="max-w-xl space-y-5">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                ))}
                <Skeleton className="h-9 w-32 rounded-xl" />
            </div>
        </SkeletonRoot>
    );
}
