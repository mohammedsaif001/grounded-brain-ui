"use client";

import { RouteError } from "@/shared/components/route-error";

export default function AppError({
    error,
    unstable_retry,
}: {
    error: Error & { digest?: string };
    unstable_retry: () => void;
}) {
    return (
        <div className="bg-page flex min-h-svh flex-col">
            <RouteError error={error} retry={unstable_retry} />
        </div>
    );
}
