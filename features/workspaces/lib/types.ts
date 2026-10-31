import type { z } from "zod";
import type { workspaceSchema } from "./schemas";

export type Workspace = z.infer<typeof workspaceSchema>;

export type CreateWorkspaceInput = {
    title: string;
    description?: string;
    icon?: string;
    defaultModel?: string;
};

export type UpdateWorkspaceInput = Partial<CreateWorkspaceInput>;
