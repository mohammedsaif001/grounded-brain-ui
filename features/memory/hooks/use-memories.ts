"use client";

import { useQuery } from "@tanstack/react-query";
import {
    useInvalidatingMutation,
    type MutationHookOptions,
} from "@/shared/hooks/use-invalidating-mutation";
import {
    createMemory,
    deleteMemory,
    listMemories,
    updateMemory,
} from "../lib/api";
import type { CreateMemoryInput, UpdateMemoryInput } from "../lib/types";

export const memoryKeys = {
    all: ["memory"] as const,
    list: () => [...memoryKeys.all, "list"] as const,
};

export function useMemories() {
    return useQuery({
        queryKey: memoryKeys.list(),
        queryFn: listMemories,
    });
}

export function useCreateMemory(options?: MutationHookOptions) {
    return useInvalidatingMutation({
        mutationFn: (input: CreateMemoryInput) => createMemory(input),
        invalidates: () => [memoryKeys.all],
        ...options,
    });
}

export function useUpdateMemory(options?: MutationHookOptions) {
    return useInvalidatingMutation({
        mutationFn: ({
            memoryId,
            input,
        }: {
            memoryId: string;
            input: UpdateMemoryInput;
        }) => updateMemory(memoryId, input),
        invalidates: () => [memoryKeys.all],
        ...options,
    });
}

export function useDeleteMemory(options?: MutationHookOptions) {
    return useInvalidatingMutation({
        mutationFn: (memoryId: string) => deleteMemory(memoryId),
        invalidates: () => [memoryKeys.all],
        ...options,
    });
}
