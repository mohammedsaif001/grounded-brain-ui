import { Skeleton } from "@/components/ui/skeleton";

/**
 * Placeholder for {@link WorkspaceShell} while the workspace layout loads.
 *
 * `workspace/[id]/layout.tsx` awaits the API, and a segment's `loading.tsx` never
 * wraps its own layout, so this is rendered from `workspace/loading.tsx` (one level up).
 * Mirrors the real shell's geometry: 16rem sidebar, 68px header.
 */
export function WorkspaceShellSkeleton({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            role="status"
            aria-busy="true"
            aria-live="polite"
            className="bg-page flex min-h-svh w-full"
        >
            <span className="sr-only">Loading workspace…</span>

            <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar md:flex">
                <div className="flex items-center gap-3 border-b border-sidebar-border p-4">
                    <Skeleton className="size-8 rounded-xl" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>

                <div className="flex flex-1 flex-col gap-6 p-4">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-16" />
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton key={index} className="h-10 w-full rounded-xl" />
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-14" />
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="h-10 w-full rounded-xl" />
                        ))}
                    </div>
                </div>

                <div className="border-t border-sidebar-border p-2">
                    <Skeleton className="h-8 w-full" />
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-[68px] items-center gap-3 border-b bg-background/85 px-4 md:px-6">
                    <Skeleton className="size-7" />
                    <Skeleton className="h-5 w-40" />
                    <div className="ml-auto flex items-center gap-2">
                        <Skeleton className="h-7 w-28" />
                        <Skeleton className="hidden h-8 w-[140px] sm:block" />
                        <Skeleton className="size-8" />
                        <Skeleton className="size-7" />
                    </div>
                </header>

                <div className="flex min-h-0 flex-1 flex-col">{children}</div>
            </div>
        </div>
    );
}
