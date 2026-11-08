import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
    ApiError,
    apiPath,
    fetchOrOutage,
    parseApiResponse,
    parsePageResponse,
} from "./api";

function jsonResponse(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
    });
}

describe("apiPath", () => {
    it("encodes every interpolated value", () => {
        const id = "a/b?c";
        expect(apiPath`/api/workspaces/${id}/sources`).toBe(
            "/api/workspaces/a%2Fb%3Fc/sources",
        );
    });

    it("leaves literal parts untouched", () => {
        expect(apiPath`/api/memory`).toBe("/api/memory");
    });
});

describe("parseApiResponse", () => {
    const schema = z.object({ id: z.string() });

    it("unwraps the { success, data } envelope", async () => {
        const result = await parseApiResponse(
            jsonResponse({ success: true, data: { id: "1" } }),
            { schema },
        );
        expect(result).toEqual({ id: "1" });
    });

    it("accepts un-enveloped payloads (e.g. better-auth)", async () => {
        const result = await parseApiResponse(jsonResponse({ id: "2" }), {
            schema,
        });
        expect(result).toEqual({ id: "2" });
    });

    it("returns undefined for 204 No Content", async () => {
        const result = await parseApiResponse(
            new Response(null, { status: 204 }),
        );
        expect(result).toBeUndefined();
    });

    it("throws ApiError with the server's message on failure", async () => {
        const response = jsonResponse(
            {
                success: false,
                error: { code: "NOT_FOUND", message: "Workspace not found" },
            },
            404,
        );

        const error = await parseApiResponse(response).catch((e) => e);
        expect(error).toBeInstanceOf(ApiError);
        expect(error).toMatchObject({
            status: 404,
            message: "Workspace not found",
            isClientError: true,
        });
    });

    it("falls back to a generic message for non-JSON errors", async () => {
        const response = new Response("<html>Not Found</html>", {
            status: 404,
        });
        const error = await parseApiResponse(response, {
            fallbackMessage: "Request failed",
        }).catch((e) => e);
        expect(error).toMatchObject({ status: 404, message: "Request failed" });
        expect(error.isClientError).toBe(true);
    });

    it("rejects payloads that do not match the schema", async () => {
        const error = await parseApiResponse(
            jsonResponse({ success: true, data: { id: 42 } }),
            { schema },
        ).catch((e) => e);
        expect(error).toBeInstanceOf(ApiError);
        expect(error.status).toBe(502);
    });
});

describe("parsePageResponse", () => {
    const item = z.object({ id: z.string() });

    it("returns the rows together with the pagination meta", async () => {
        const page = await parsePageResponse(
            jsonResponse({
                success: true,
                data: [{ id: "1" }, { id: "2" }],
                meta: { total: 9, nextCursor: "2" },
            }),
            item,
        );

        expect(page.items).toEqual([{ id: "1" }, { id: "2" }]);
        expect(page.meta).toEqual({ total: 9, nextCursor: "2" });
    });

    it("falls back to a single page when meta is missing", async () => {
        const page = await parsePageResponse(
            jsonResponse({ success: true, data: [{ id: "1" }] }),
            item,
        );

        expect(page.meta).toEqual({ total: 1, nextCursor: null });
    });

    it("rejects rows that do not match the schema", async () => {
        const error = await parsePageResponse(
            jsonResponse({ success: true, data: [{ nope: true }] }),
            item,
        ).catch((e) => e);

        expect(error).toBeInstanceOf(ApiError);
        expect(error.status).toBe(502);
    });

    it("throws ApiError for failed requests", async () => {
        const error = await parsePageResponse(
            jsonResponse(
                { success: false, error: { message: "Bad cursor" } },
                400,
            ),
            item,
        ).catch((e) => e);

        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toBe("Bad cursor");
    });
});

describe("outage handling", () => {
    it("reports a non-JSON 5xx as a server outage", async () => {
        const error = await parseApiResponse(
            new Response("Internal Server Error", { status: 500 }),
        ).catch((e) => e);

        expect(error).toBeInstanceOf(ApiError);
        expect(error.service).toBe("server");
        expect(error.isOutage).toBe(true);
    });

    it("reports a gateway timeout as a server outage", async () => {
        const error = await parseApiResponse(
            jsonResponse({ success: false, error: { message: "x" } }, 504),
        ).catch((e) => e);

        expect(error.service).toBe("server");
    });

    it("keeps an enveloped 503 message, such as an unconfigured integration", async () => {
        const error = await parseApiResponse(
            jsonResponse(
                { success: false, error: { message: "Firecrawl is not configured" } },
                503,
            ),
        ).catch((e) => e);

        expect(error.message).toBe("Firecrawl is not configured");
        expect(error.isOutage).toBe(false);
    });

    it("turns an unreachable backend into a server outage", async () => {
        const original = globalThis.fetch;
        globalThis.fetch = (() =>
            Promise.reject(new TypeError("fetch failed"))) as typeof fetch;

        try {
            const error = await fetchOrOutage("/api/x").catch((e) => e);
            expect(error).toBeInstanceOf(ApiError);
            expect(error.service).toBe("server");
        } finally {
            globalThis.fetch = original;
        }
    });

    it("lets a caller's own abort through", async () => {
        const original = globalThis.fetch;
        globalThis.fetch = (() =>
            Promise.reject(
                new DOMException("aborted", "AbortError"),
            )) as typeof fetch;

        try {
            const error = await fetchOrOutage("/api/x").catch((e) => e);
            expect(error).not.toBeInstanceOf(ApiError);
        } finally {
            globalThis.fetch = original;
        }
    });
});
