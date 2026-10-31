import type { NextConfig } from "next";
import { serverEnv } from "./shared/config/env";

const isProduction = serverEnv.NODE_ENV === "production";

/**
 * Same-origin only: the browser talks to the API through the `/api` rewrite below,
 * so nothing needs a cross-origin allowance. 'wasm-unsafe-eval' is for the syntax
 * highlighter's WASM engine; 'unsafe-eval' is only for React's dev tooling.
 */
const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isProduction ? "" : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isProduction ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
    { key: "Content-Security-Policy", value: contentSecurityPolicy },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
    },
    ...(isProduction
        ? [
              {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
              },
          ]
        : []),
];

const nextConfig: NextConfig = {
    output: "standalone",
    poweredByHeader: false,

    experimental: {
        // Rewrites proxy through Next's HTTP proxy, whose idle timeout defaults to 30s.
        // Chat streams can stay silent longer than that (retrieval, web search) before
        // the first token, so give them room.
        proxyTimeout: 120_000,
        // Request bodies are buffered (default cap 10MB) before being proxied. The API
        // accepts 10MB PDFs, so leave headroom for multipart overhead.
        proxyClientMaxBodySize: "12mb",
    },

    async headers() {
        return [{ source: "/:path*", headers: securityHeaders }];
    },

    async rewrites() {
        // The app has no API routes of its own; every /api call belongs to the backend.
        return [
            {
                source: "/api/:path*",
                destination: `${serverEnv.API_URL}/api/:path*`,
            },
        ];
    },
};

export default nextConfig;
