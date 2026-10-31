import type { z } from "zod";

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string,
        public readonly details?: unknown,
    ) {
        super(message);
        this.name = "ApiError";
    }

    /** 4xx: the request itself was wrong; retrying will not help. */
    get isClientError() {
        return this.status >= 400 && this.status < 500;
    }
}

/** Backend envelope: `{ success: true, data }` or `{ success: false, error: { code, message, details } }`. */
type Envelope = {
    success?: boolean;
    data?: unknown;
    error?: { code?: string; message?: string; details?: unknown } | string;
};

export type ParseOptions<T> = {
    /** Validates the unwrapped payload; the result is typed from the schema. */
    schema?: z.ZodType<T>;
    fallbackMessage?: string;
};

/**
 * Reads a fetch response, unwraps the API envelope and validates it.
 *
 * Throws {@link ApiError} for non-2xx responses and for payloads that do not match
 * `schema`, so contract drift fails loudly at the boundary instead of deep in the UI.
 */
export async function parseApiResponse<T = void>(
    response: Response,
    { schema, fallbackMessage = "Request failed" }: ParseOptions<T> = {},
): Promise<T> {
    if (response.status === 204) {
        return undefined as T;
    }

    const body = (await response.json().catch(() => null)) as Envelope | null;

    if (!response.ok) {
        const error = body?.error;
        throw new ApiError(
            response.status,
            (typeof error === "string" ? error : error?.message) ??
                fallbackMessage,
            typeof error === "object" ? error?.details : undefined,
        );
    }

    const payload =
        body && typeof body === "object" && "data" in body ? body.data : body;

    if (!schema) {
        return payload as T;
    }

    const result = schema.safeParse(payload);
    if (!result.success) {
        if (process.env.NODE_ENV !== "production") {
            console.error(
                `Unexpected response from ${response.url}`,
                result.error.issues,
            );
        }
        throw new ApiError(
            502,
            "Received an unexpected response from the server.",
            result.error.issues,
        );
    }

    return result.data;
}

export type ApiFetchOptions<T> = Omit<RequestInit, "body"> & {
    /** JSON-serialized unless it is already a `FormData`. */
    body?: unknown;
    schema?: z.ZodType<T>;
};

/** Browser-side API call through the same-origin `/api` rewrite, with session cookies. */
export async function apiFetch<T = void>(
    path: string,
    { schema, body, headers: initHeaders, ...init }: ApiFetchOptions<T> = {},
): Promise<T> {
    const headers = new Headers(initHeaders);
    headers.set("accept", "application/json");

    let requestBody: BodyInit | undefined;
    if (body instanceof FormData) {
        requestBody = body;
    } else if (body !== undefined) {
        headers.set("content-type", "application/json");
        requestBody = JSON.stringify(body);
    }

    const response = await fetch(path, {
        ...init,
        body: requestBody,
        credentials: "include",
        headers,
    });

    return parseApiResponse(response, { schema });
}

/**
 * Tagged template for API paths that URI-encodes every interpolated value:
 * apiPath`/api/workspaces/${id}/sources` cannot be broken out of by an id like `../x`.
 */
export function apiPath(
    strings: TemplateStringsArray,
    ...values: Array<string | number>
): string {
    return strings.reduce(
        (path, part, index) =>
            path +
            part +
            (index < values.length
                ? encodeURIComponent(String(values[index]))
                : ""),
        "",
    );
}
