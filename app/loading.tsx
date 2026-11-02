import { Spinner } from "@/components/ui/spinner";

/**
 * Root fallback. It also covers `(protected)/layout.tsx`, whose session check would
 * otherwise leave the screen blank on the first navigation into the app. Kept neutral
 * because it can appear before any specific page skeleton is known (login, dashboard).
 */
export default function RootLoading() {
    return (
        <div className="flex min-h-svh flex-1 items-center justify-center">
            <Spinner className="size-6 text-muted-foreground" />
        </div>
    );
}
