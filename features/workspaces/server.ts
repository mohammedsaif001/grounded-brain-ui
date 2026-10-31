import "server-only";

import { cache } from "react";
import { notFound } from "next/navigation";
import { ApiError, apiPath } from "@/shared/lib/api";
import { backendFetch } from "@/shared/server/backend";
import { workspaceSchema } from "./lib/schemas";
import type { Workspace } from "./lib/types";

/**
 * Loads a workspace the current user can access, or `null` if it does not exist
 * or belongs to someone else (both render as 404 so ids cannot be probed).
 *
 * Cached per request so the workspace layout and its pages share one fetch.
 */
export const getWorkspace = cache(
    async (workspaceId: string): Promise<Workspace | null> => {
        try {
            return await backendFetch(
                apiPath`/api/workspaces/${workspaceId}`,
                { schema: workspaceSchema },
            );
        } catch (error) {
            if (
                error instanceof ApiError &&
                [400, 403, 404].includes(error.status)
            ) {
                return null;
            }
            throw error;
        }
    },
);

/** Like {@link getWorkspace}, but renders the 404 page when the workspace is missing. */
export async function requireWorkspace(workspaceId: string): Promise<Workspace> {
    const workspace = await getWorkspace(workspaceId);

    if (!workspace) {
        notFound();
    }

    return workspace;
}
