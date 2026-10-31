"use client";

import {
    useMutation,
    useQueryClient,
    type QueryClient,
    type QueryKey,
} from "@tanstack/react-query";

export type MutationHookOptions = {
    /**
     * Skip the global error toast because the caller renders the error itself
     * (e.g. inline in a form). The mutation still rejects/reports via `error`.
     */
    suppressErrorToast?: boolean;
};

type InvalidatingMutationConfig<TData, TVariables> = MutationHookOptions & {
    mutationFn: (variables: TVariables) => Promise<TData>;
    /** Query keys to invalidate after success. Awaited, so `mutateAsync` resolves on fresh data. */
    invalidates: (data: TData, variables: TVariables) => QueryKey[];
    /** Synchronous cache writes to apply before invalidation (setQueryData/removeQueries). */
    updateCache?: (
        queryClient: QueryClient,
        data: TData,
        variables: TVariables,
    ) => void;
};

/** `useMutation` with the cache-invalidation boilerplate every write in this app needs. */
export function useInvalidatingMutation<TData, TVariables = void>({
    mutationFn,
    invalidates,
    updateCache,
    suppressErrorToast,
}: InvalidatingMutationConfig<TData, TVariables>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        meta: { suppressErrorToast },
        onSuccess: async (data, variables) => {
            updateCache?.(queryClient, data, variables);
            await Promise.all(
                invalidates(data, variables).map((queryKey) =>
                    queryClient.invalidateQueries({ queryKey }),
                ),
            );
        },
    });
}
