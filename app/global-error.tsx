"use client";

import { BrainIcon } from "lucide-react";

/**
 * Last-resort boundary for errors in the root layout. It replaces the whole document,
 * so it cannot rely on global CSS, fonts or providers and uses inline styles only.
 * The brand header is kept so even this screen is recognisably the product.
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
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: "system-ui, sans-serif",
                    colorScheme: "light dark",
                }}
            >
                <title>Something went wrong · Grounded Brain</title>
                <header
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "20px 24px",
                    }}
                >
                    <span
                        aria-hidden="true"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 36,
                            height: 36,
                            borderRadius: 12,
                            background: "#d4ed9a",
                            color: "#1f3a12",
                        }}
                    >
                        <BrainIcon size={20} />
                    </span>
                    <span style={{ fontSize: 17, fontWeight: 600 }}>
                        Grounded Brain
                    </span>
                </header>
                <main
                    style={{
                        flex: 1,
                        display: "grid",
                        placeItems: "center",
                        textAlign: "center",
                        padding: 24,
                    }}
                >
                    <div>
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
                    </div>
                </main>
            </body>
        </html>
    );
}
