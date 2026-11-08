import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for {@link DashboardHome}; mirrors its header, hero, shortcut and notebook grid. */
export function DashboardSkeleton() {
    return (
        <div
            role="status"
            aria-busy="true"
            aria-live="polite"
            className="bg-page min-h-svh"
        >
            <span className="sr-only">Loading your notebooks…</span>

            <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 md:px-8">
                    <div className="flex items-center gap-2.5">
                        <Skeleton className="size-9 rounded-xl" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Skeleton className="hidden h-8 w-14 rounded-full sm:block" />
                        <Skeleton className="size-8 rounded-full" />
                    </div>
                </div>
            </header>

            <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 md:gap-10 md:px-8 md:py-10">
                <Skeleton className="h-72 rounded-3xl md:h-64" />
                <Skeleton className="h-28 rounded-2xl" />

                <section className="space-y-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-44" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-10 w-full rounded-xl lg:max-w-xs" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="min-h-48 rounded-2xl sm:min-h-52"
                            />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
