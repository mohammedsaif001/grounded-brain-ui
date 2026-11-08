import { z } from "zod";
import {
    isServerOutageResponse,
    OUTAGE_COPY,
    type OutageService,
} from "./outage";

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string,
        public readonly details?: unknown,
        /** Set when the failure is an outage of a whole service rather than a rejected request. */
        public readonly service?: OutageService,
        /** The API's machine-readable `error.code`, e.g. `CONFLICT` or `ARTIFACT_EDITED`. */
        public readonly code?: string,
    ) {
        super(message);
        this.name = "ApiError";
    }

    /** The backend (or Mem0) is unavailable; show the maintenance message, not a bug report. */
    get isOutage() {
        return this.service !== undefined;
    }

    static outage(service: OutageService, details?: unknown) {
        return new ApiError(503, OUTAGE_COPY[service].message, details, service);
    }

    /** 409 `CONFLICT`: the item changed since it was loaded; reload before retrying. */
    get isConflict() {
        return this.status === 409 && this.code === "CONFLICT";
    }

    /**
     * Field-level problems from a 400 `VALIDATION_ERROR`, keyed by dotted path
     * (`content.questions.0.correctIndex`). Empty for any other error.
     */
    get fieldErrors(): Record<string, string[]> {
        const details = this.details;
        if (!details || typeof details !== "object" || Array.isArray(details)) {
            return {};
        }
        const result: Record<string, string[]> = {};
        for (const [path, messages] of Object.entries(details)) {
            if (Array.isArray(messages)) {
                result[path] = messages.filter(
                    (message): message is string => typeof message === "string",
                );
            }
        }
        return result;
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
    meta?: unknown;
    error?: { code?: string; message?: string; details?: unknown } | string;
};

export type ParseOptions<T> = {
    /** Validates the unwrapped payload; the result is typed from the schema. */
    schema?: z.ZodType<T>;
    fallbackMessage?: string;
};

function throwForFailure(
    response: Response,
    body: Envelope | null,
    fallbackMessage: string,
): void {
    if (response.ok) {
        return;
    }

    if (isServerOutageResponse(response.status, body !== null)) {
        throw ApiError.outage("server");
    }

    const error = body?.error;
    throw new ApiError(
        response.status,
        (typeof error === "string" ? error : error?.message) ?? fallbackMessage,
        typeof error === "object" ? error?.details : undefined,
        undefined,
        typeof error === "object" ? error?.code : undefined,
    );
}

function validate<T>(
    response: Response,
    payload: unknown,
    schema: z.ZodType<T>,
): T {
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
    throwForFailure(response, body, fallbackMessage);

    const payload =
        body && typeof body === "object" && "data" in body ? body.data : body;

    return schema ? validate(response, payload, schema) : (payload as T);
}

/** The `meta` block the API adds to paginated lists. */
export const pageMetaSchema = z.object({
    /** Rows matching the filters across every page. */
    total: z.number(),
    /** Id to pass as `cursor` for the next page; `null` on the last page. */
    nextCursor: z.string().nullable(),
});

export type PageMeta = z.infer<typeof pageMetaSchema>;

export type Page<T> = { items: T[]; meta: PageMeta };

/** Like {@link parseApiResponse} for list endpoints that return `{ data: [], meta }`. */
export async function parsePageResponse<T>(
    response: Response,
    itemSchema: z.ZodType<T>,
    fallbackMessage = "Request failed",
): Promise<Page<T>> {
    const body = (await response.json().catch(() => null)) as Envelope | null;
    throwForFailure(response, body, fallbackMessage);

    const items = validate(response, body?.data, z.array(itemSchema));
    // Without `limit` the API still sends `meta`, but tolerate its absence.
    const meta = pageMetaSchema.safeParse(body?.meta);

    return {
        items,
        meta: meta.success
            ? meta.data
            : { total: items.length, nextCursor: null },
    };
}

export type ApiFetchOptions<T> = Omit<RequestInit, "body"> & {
    /** JSON-serialized unless it is already a `FormData`. */
    body?: unknown;
    schema?: z.ZodType<T>;
};

/**
 * `fetch` that reports an unreachable backend as a server outage. A refused connection
 * or a timeout rejects with a TypeError or TimeoutError; a caller's own abort (a query
 * being cancelled) is not an outage and passes through untouched.
 */
export async function fetchOrOutage(
    input: RequestInfo | URL,
    init?: RequestInit,
): Promise<Response> {
    try {
        return await fetch(input, init);
    } catch (error) {
        if (
            error instanceof TypeError ||
            (error instanceof DOMException && error.name === "TimeoutError")
        ) {
            throw ApiError.outage("server");
        }
        throw error;
    }
}

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

    const response = await fetchOrOutage(path, {
        ...init,
        body: requestBody,
        credentials: "include",
        headers,
    });

    return parseApiResponse(response, { schema });
}

/** Browser-side call to a paginated list endpoint; returns the rows with their `meta`. */
export async function apiFetchPage<T>(
    path: string,
    itemSchema: z.ZodType<T>,
): Promise<Page<T>> {
    const response = await fetchOrOutage(path, {
        credentials: "include",
        headers: { accept: "application/json" },
    });

    return parsePageResponse(response, itemSchema);
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
