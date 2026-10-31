import { describe, expect, it } from "vitest";
import { z } from "zod";
import { ApiError, apiPath, parseApiResponse } from "./api";

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
        const response = new Response("<html>Bad Gateway</html>", {
            status: 502,
        });
        const error = await parseApiResponse(response, {
            fallbackMessage: "Request failed",
        }).catch((e) => e);
        expect(error).toMatchObject({ status: 502, message: "Request failed" });
        expect(error.isClientError).toBe(false);
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
