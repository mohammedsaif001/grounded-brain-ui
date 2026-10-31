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

export function deleteArtifact(workspaceId: string, artifactId: string) {
    return apiFetch(
        apiPath`/api/workspaces/${workspaceId}/artifacts/${artifactId}`,
        { method: "DELETE" },
    );
}
