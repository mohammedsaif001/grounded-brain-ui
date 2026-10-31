import { z } from "zod";

/**
 * Server-side environment, validated once at startup.
 *
 * Kept free of `server-only` so `next.config.ts` can import it too. Nothing here is
 * exposed to the browser: only `NEXT_PUBLIC_*` variables are inlined into client bundles.
 */
const serverEnvSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),
    /** Base URL of the grounded-brain API. Read at build time for rewrites and at runtime for server fetches. */
    API_URL: z.url(),
    /** Upper bound for a single upstream request made from the server. */
    API_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function loadServerEnv(): ServerEnv {
    const nodeEnv = process.env.NODE_ENV ?? "development";
    const parsed = serverEnvSchema.safeParse({
        NODE_ENV: nodeEnv,
        // Only fall back to a local API outside production; a missing URL in prod is a deploy bug.
        API_URL:
            process.env.API_URL ??
            (nodeEnv === "production" ? undefined : "http://localhost:8080"),
        API_TIMEOUT_MS: process.env.API_TIMEOUT_MS,
    });

    if (!parsed.success) {
        throw new Error(
            `Invalid environment variables:\n${z.prettifyError(parsed.error)}`,
        );
    }

    return parsed.data;
}

export const serverEnv = loadServerEnv();
