const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

/** User-facing message for an unknown thrown value. */
export function getErrorMessage(
    error: unknown,
    fallback: string = DEFAULT_ERROR_MESSAGE,
): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return fallback;
}
