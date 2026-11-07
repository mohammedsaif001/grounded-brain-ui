"use client";

import { BrandedPage } from "@/shared/components/branded-page";
import { RouteError } from "@/shared/components/route-error";

export default function AppError({
    error,
    unstable_retry,
}: {
    error: Error & { digest?: string };
    unstable_retry: () => void;
}) {
    return (
        <BrandedPage>
            <RouteError error={error} retry={unstable_retry} />
        </BrandedPage>
    );
}
