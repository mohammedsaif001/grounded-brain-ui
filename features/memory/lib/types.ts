import type { z } from "zod";
import type { userMemorySchema } from "./schemas";

export type UserMemory = z.infer<typeof userMemorySchema>;

export type CreateMemoryInput = {
    memory: string;
};

export type UpdateMemoryInput = {
    memory: string;
};
