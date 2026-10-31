"use client";

import { RouteError } from "@/shared/components/route-error";

/** Keeps the workspace sidebar usable when a single workspace page fails. */
export default function WorkspaceError({
    error,
    unstable_retry,
}: {
    error: Error & { digest?: string };
    unstable_retry: () => void;
}) {
    return <RouteError error={error} retry={unstable_retry} />;
}
