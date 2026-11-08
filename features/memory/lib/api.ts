import { ApiError, apiFetch, apiPath } from "@/shared/lib/api";
import { userMemoryListSchema, userMemorySchema } from "./schemas";
import type { CreateMemoryInput, UpdateMemoryInput } from "./types";

/**
 * Memory is backed by Mem0. When the server is up but this endpoint fails with a 5xx,
 * Mem0 is what is unavailable, so say that instead of a generic error. A whole-server
 * outage keeps its own message, and 4xx errors (validation, auth) are left alone.
 */
async function asMemoryService<T>(request: Promise<T>): Promise<T> {
    try {
        return await request;
    } catch (error) {
        if (error instanceof ApiError && !error.service && error.status >= 500) {
            throw ApiError.outage("memory", error.details);
        }
        throw error;
    }
}

export function listMemories() {
    return asMemoryService(
        apiFetch("/api/memory", { schema: userMemoryListSchema }),
    );
}

export function createMemory(input: CreateMemoryInput) {
    return asMemoryService(
        apiFetch("/api/memory", {
            method: "POST",
            body: input,
            schema: userMemorySchema,
        }),
    );
}

export function updateMemory(memoryId: string, input: UpdateMemoryInput) {
    return asMemoryService(
        apiFetch(apiPath`/api/memory/${memoryId}`, {
            method: "PATCH",
            body: input,
            schema: userMemorySchema,
        }),
    );
}

export function deleteMemory(memoryId: string) {
    return asMemoryService(
        apiFetch(apiPath`/api/memory/${memoryId}`, { method: "DELETE" }),
    );
}
