import "server-only";

import { cache } from "react";
import { ApiError } from "@/shared/lib/api";
import { backendFetch } from "@/shared/server/backend";
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
            return await backendFetch<Workspace>(
                `/api/workspaces/${encodeURIComponent(workspaceId)}`,
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
