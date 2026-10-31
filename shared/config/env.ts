import { z } from "zod";

/**
 * Server-side environment, validated with zod.
 *
 * Kept free of `server-only` so `next.config.ts` can import it too. Nothing here is
 * exposed to the browser: only `NEXT_PUBLIC_*` variables are inlined into client bundles.
 */
const DEV_API_URL = "http://localhost:8080";

const serverEnvSchema = z.object({
    /** Base URL of the grounded-brain API. Read at build time for rewrites and at runtime for server fetches. */
    API_URL: z.url(),
    /** Upper bound for a single upstream request made from the server. */
    API_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

type ParseOptions = {
    /**
     * Fail when API_URL is missing instead of falling back to a local API. Required
     * whenever the app is built or served for real, where a silent localhost default
     * would point production at nothing.
     */
    requireApiUrl: boolean;
};

export function parseServerEnv(
    source: Record<string, string | undefined>,
    { requireApiUrl }: ParseOptions,
): ServerEnv {
    const parsed = serverEnvSchema.safeParse({
        API_URL: source.API_URL ?? (requireApiUrl ? undefined : DEV_API_URL),
        API_TIMEOUT_MS: source.API_TIMEOUT_MS,
    });

    if (!parsed.success) {
        throw new Error(
            `Invalid environment variables:\n${z.prettifyError(parsed.error)}`,
        );
    }

    return parsed.data;
}

let cached: ServerEnv | undefined;

/** Runtime environment for server code; strict in production. */
export function getServerEnv(): ServerEnv {
    cached ??= parseServerEnv(process.env, {
        requireApiUrl: process.env.NODE_ENV === "production",
    });
    return cached;
}
