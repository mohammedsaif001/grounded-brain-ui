import { apiFetch, apiPath } from "@/shared/lib/api";
import { learningArtifactListSchema, learningArtifactSchema } from "./schemas";
import type { CreateArtifactInput, UpdateArtifactInput } from "./types";

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

/** Rename and/or replace the content of a READY artifact. `content` is the full object. */
export function updateArtifact(
    workspaceId: string,
    artifactId: string,
    input: UpdateArtifactInput,
) {
    return apiFetch(
        apiPath`/api/workspaces/${workspaceId}/artifacts/${artifactId}`,
        { method: "PATCH", body: input, schema: learningArtifactSchema },
    );
}

/**
 * Re-runs generation in place (same id and title). An edited artifact answers 409
 * `ARTIFACT_EDITED` unless `force` is set, because regenerating discards the edits.
 */
export function regenerateArtifact(
    workspaceId: string,
    artifactId: string,
    force = false,
) {
    return apiFetch(
        apiPath`/api/workspaces/${workspaceId}/artifacts/${artifactId}/regenerate`,
        {
            method: "POST",
            body: force ? { force: true } : {},
            schema: learningArtifactSchema,
        },
    );
}

export function deleteArtifact(workspaceId: string, artifactId: string) {
    return apiFetch(
        apiPath`/api/workspaces/${workspaceId}/artifacts/${artifactId}`,
        { method: "DELETE" },
    );
}
