"use client";

/**
 * Last-resort boundary for errors in the root layout. It replaces the whole document,
 * so it cannot rely on global CSS, fonts or providers and uses inline styles only.
 */
export default function GlobalError({
    error,
    unstable_retry,
}: {
    error: Error & { digest?: string };
    unstable_retry: () => void;
}) {
    return (
        <html lang="en">
            <body
                style={{
                    margin: 0,
                    minHeight: "100vh",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "system-ui, sans-serif",
                    colorScheme: "light dark",
                }}
            >
                <title>Something went wrong</title>
                <main style={{ textAlign: "center", padding: 24 }}>
                    <h1 style={{ fontSize: 20, marginBottom: 8 }}>
                        Something went wrong
                    </h1>
                    <p style={{ opacity: 0.7, marginBottom: 16 }}>
                        The app failed to load. Please try again.
                    </p>
                    {error.digest ? (
                        <p style={{ fontSize: 12, opacity: 0.5 }}>
                            Reference: {error.digest}
                        </p>
                    ) : null}
                    <button
                        type="button"
                        onClick={() => unstable_retry()}
                        style={{ padding: "8px 16px", cursor: "pointer" }}
                    >
                        Try again
                    </button>
                </main>
            </body>
        </html>
    );
}
