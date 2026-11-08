import { z } from "zod";

export const workspaceSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    icon: z.string().nullable(),
    defaultModel: z.string(),
    /** Every source in the notebook, whatever its status. */
    sourceCount: z.number(),
    /** Every artifact, including ones still generating or failed. */
    artifactCount: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const workspaceListSchema = z.array(workspaceSchema);

export const workspaceSummarySchema = z.object({
    sourceCount: z.number(),
    readySourceCount: z.number(),
    /** Artifacts that are PENDING or PROCESSING. */
    processingArtifactCount: z.number(),
    /** READY artifacts the user has not opened yet. */
    unseenArtifactCount: z.number(),
});
