import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for {@link DashboardHome}; mirrors its header, hero and notebook grid. */
export function DashboardSkeleton() {
    return (
        <div
            role="status"
            aria-busy="true"
            aria-live="polite"
            className="min-h-svh bg-muted/30"
        >
            <span className="sr-only">Loading your notebooks…</span>

            <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
                    <div className="flex items-center gap-2.5">
                        <Skeleton className="size-8 rounded-xl" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="hidden h-7 w-24 sm:block" />
                        <Skeleton className="size-8" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
                <section className="mb-10 space-y-6">
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-9 w-64 max-w-full" />
                        <Skeleton className="h-4 w-full max-w-2xl" />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="h-24" />
                        ))}
                    </div>
                </section>

                <section className="space-y-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-44" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-9 w-full rounded-full sm:max-w-xs" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="min-h-[196px] rounded-3xl"
                            />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
