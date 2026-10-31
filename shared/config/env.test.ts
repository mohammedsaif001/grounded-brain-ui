import { describe, expect, it } from "vitest";
import { parseServerEnv } from "./env";

describe("parseServerEnv", () => {
    it("falls back to a local API when not required", () => {
        const env = parseServerEnv({}, { requireApiUrl: false });
        expect(env).toEqual({
            API_URL: "http://localhost:8080",
            API_TIMEOUT_MS: 10_000,
        });
    });

    it("fails fast when API_URL is required but missing", () => {
        expect(() => parseServerEnv({}, { requireApiUrl: true })).toThrow(
            /API_URL/,
        );
    });

    it("rejects a malformed URL", () => {
        expect(() =>
            parseServerEnv({ API_URL: "not a url" }, { requireApiUrl: true }),
        ).toThrow(/API_URL/);
    });

    it("coerces the timeout from a string", () => {
        const env = parseServerEnv(
            { API_URL: "https://api.example.com", API_TIMEOUT_MS: "2500" },
            { requireApiUrl: true },
        );
        expect(env.API_TIMEOUT_MS).toBe(2500);
    });
});
