import { apiFetch, apiPath } from "@/shared/lib/api";
import { learningArtifactListSchema, learningArtifactSchema } from "./schemas";
import type { CreateArtifactInput } from "./types";

export function listArtifacts(workspaceId: string) {
    return apiFetch(apiPath`/api/workspaces/${workspaceId}/artifacts`, {
        schema: learningArtifactListSchema,
    });
}

export function getArtifact(workspaceId: string, artifactId: string) {
    return apiFetch(
        apiPath`/api/workspaces/${workspaceId}/artifacts/${artifactId}`,
        { schema: learningArtifactSchema },
    );
}

export function createArtifact(
    workspaceId: string,
    input: CreateArtifactInput,
) {
    return apiFetch(apiPath`/api/workspaces/${workspaceId}/artifacts`, {
        method: "POST",
        body: input,
        schema: learningArtifactSchema,
    });
}

/** Idempotent. Call when the user actually opens the artifact, not when it is fetched. */
export function markArtifactViewed(workspaceId: string, artifactId: string) {
    return apiFetch(
        apiPath`/api/workspaces/${workspaceId}/artifacts/${artifactId}/viewed`,
        { method: "POST" },
    );
}

export function deleteArtifact(workspaceId: string, artifactId: string) {
    return apiFetch(
        apiPath`/api/workspaces/${workspaceId}/artifacts/${artifactId}`,
        { method: "DELETE" },
    );
}
