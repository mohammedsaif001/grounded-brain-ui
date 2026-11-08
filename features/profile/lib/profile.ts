export const NAME_MAX_LENGTH = 100;

/** Up to two initials for an avatar fallback: "Mohammed Saif" -> "MS". */
export function getInitials(name: string | null | undefined, fallback = "?") {
    const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
        return fallback;
    }

    const letters =
        words.length === 1
            ? Array.from(words[0]).slice(0, 2)
            : [Array.from(words[0])[0], Array.from(words[words.length - 1])[0]];

    return letters.join("").toUpperCase();
}

/** Better Auth's `providerId` for each way of signing in, in plain words. */
const PROVIDER_LABELS: Record<string, string> = {
    google: "Google",
    credential: "Email and password",
};

export function describeProvider(providerId: string) {
    return (
        PROVIDER_LABELS[providerId] ??
        providerId.charAt(0).toUpperCase() + providerId.slice(1)
    );
}

/** "Chrome on Windows" from a raw user-agent string; best effort, never throws. */
export function describeUserAgent(userAgent: string | null | undefined) {
    if (!userAgent) {
        return "Unknown device";
    }

    // Order matters: Edge and Opera also say "Chrome", Chrome also says "Safari".
    const browser = /Edg\//.test(userAgent)
        ? "Edge"
        : /OPR\/|Opera/.test(userAgent)
          ? "Opera"
          : /Firefox\//.test(userAgent)
            ? "Firefox"
            : /Chrome\/|CriOS\//.test(userAgent)
              ? "Chrome"
              : /Safari\//.test(userAgent)
                ? "Safari"
                : null;

    // iPhone and Android user agents also contain "Mac OS X" / "Linux".
    const os = /iPhone|iPad|iPod/.test(userAgent)
        ? "iOS"
        : /Android/.test(userAgent)
          ? "Android"
          : /Windows/.test(userAgent)
            ? "Windows"
            : /Mac OS X|Macintosh/.test(userAgent)
              ? "macOS"
              : /Linux|X11/.test(userAgent)
                ? "Linux"
                : null;

    if (browser && os) {
        return `${browser} on ${os}`;
    }
    return browser ?? os ?? "Unknown device";
}
