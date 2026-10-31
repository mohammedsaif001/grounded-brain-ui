import { apiFetch, apiPath } from "@/shared/lib/api";
import { userMemoryListSchema, userMemorySchema } from "./schemas";
import type { CreateMemoryInput, UpdateMemoryInput } from "./types";

export function listMemories() {
    return apiFetch("/api/memory", { schema: userMemoryListSchema });
}

export function createMemory(input: CreateMemoryInput) {
    return apiFetch("/api/memory", {
        method: "POST",
        body: input,
        schema: userMemorySchema,
    });
}

export function updateMemory(memoryId: string, input: UpdateMemoryInput) {
    return apiFetch(apiPath`/api/memory/${memoryId}`, {
        method: "PATCH",
        body: input,
        schema: userMemorySchema,
    });
}

export function deleteMemory(memoryId: string) {
    return apiFetch(apiPath`/api/memory/${memoryId}`, { method: "DELETE" });
}
