export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public details?: unknown,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

/** Backend envelope: `{ success: true, data }` or `{ success: false, error: { code, message, details } }`. */
type Envelope<T> = {
    success?: boolean;
    data?: T;
    error?: { code?: string; message?: string; details?: unknown } | string;
};

/** Reads a fetch response, unwrapping the API envelope and throwing {@link ApiError} on failure. */
export async function parseApiResponse<T>(
    response: Response,
    fallbackMessage = "Request failed",
): Promise<T> {
    if (response.status === 204) {
        return undefined as T;
    }

    const body = (await response.json().catch(() => null)) as Envelope<T> | null;

    if (!response.ok) {
        const error = body?.error;
        throw new ApiError(
            response.status,
            (typeof error === "string" ? error : error?.message) ??
                fallbackMessage,
            typeof error === "object" ? error?.details : undefined,
        );
    }

    return (body?.data ?? body) as T;
}

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const headers = new Headers(options.headers);

    if (
        options.body &&
        !headers.has("Content-Type") &&
        !(options.body instanceof FormData)
    ) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(path, {
        ...options,
        credentials: "include",
        headers,
    });

    return parseApiResponse<T>(response);
}
