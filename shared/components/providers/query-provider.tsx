"use client";

import { useState, type ReactNode } from "react";
import {
    MutationCache,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/shared/lib/api";
import { getErrorMessage } from "@/shared/lib/errors";

declare module "@tanstack/react-query" {
    interface Register {
        mutationMeta: {
            /** Set when the caller renders its own error UI (e.g. inline form errors). */
            suppressErrorToast?: boolean;
        };
    }
}

const MAX_RETRIES = 2;

function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Avoid refetching the same data on every mount/focus within a short window.
                staleTime: 30_000,
                // Retrying a 4xx (not found, forbidden, validation) only delays the error.
                retry: (failureCount, error) =>
                    !(error instanceof ApiError && error.isClientError) &&
                    failureCount < MAX_RETRIES,
            },
            mutations: {
                retry: false,
            },
        },
        // One place to surface failed mutations, so no action fails silently.
        mutationCache: new MutationCache({
            onError: (error, _variables, _context, mutation) => {
                if (mutation.meta?.suppressErrorToast) {
                    return;
                }
                toast.add({
                    type: "error",
                    title: "Action failed",
                    description: getErrorMessage(error),
                });
            },
        }),
    });
}

export function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(createQueryClient);

    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}
