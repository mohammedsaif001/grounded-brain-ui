import { artifactContentSchemas } from "./schemas";
import type { ArtifactContent, LearningArtifact } from "./types";

/**
 * Validates an artifact's LLM-generated content against the schema for its type.
 * Returns `null` when there is no content or it is unusable.
 */
export function parseArtifactContent(
    artifact: Pick<LearningArtifact, "type" | "content">,
): ArtifactContent | null {
    if (!artifact.content) {
        return null;
    }

    const result = artifactContentSchemas[artifact.type].safeParse(
        artifact.content,
    );

    return result.success
        ? ({ type: artifact.type, content: result.data } as ArtifactContent)
        : null;
}
