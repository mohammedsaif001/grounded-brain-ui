import { describe, expect, it } from "vitest";
import {
    isGuestOnlyPath,
    isProtectedPath,
    routes,
    safeRedirectPath,
} from "./routes";

describe("routes", () => {
    it("URI-encodes dynamic segments", () => {
        expect(routes.workspace.source("ws 1", "../etc")).toBe(
            "/workspace/ws%201/sources/..%2Fetc",
        );
    });
});

describe("isProtectedPath", () => {
    it.each([
        ["/dashboard", true],
        ["/workspace/abc/learn", true],
        ["/settings/memory", true],
        ["/", false],
        ["/login", false],
        ["/dashboards", false],
        ["/workspaces", false],
    ])("%s -> %s", (pathname, expected) => {
        expect(isProtectedPath(pathname)).toBe(expected);
    });
});

describe("isGuestOnlyPath", () => {
    it("matches the login page only", () => {
        expect(isGuestOnlyPath("/login")).toBe(true);
        expect(isGuestOnlyPath("/dashboard")).toBe(false);
    });
});

describe("safeRedirectPath", () => {
    it("keeps same-origin paths with query and hash", () => {
        expect(safeRedirectPath("/workspace/1?ask=hi#top")).toBe(
            "/workspace/1?ask=hi#top",
        );
    });

    it.each([
        ["absolute URL", "https://evil.com"],
        ["scheme-relative URL", "//evil.com"],
        ["backslash trick", "/\\evil.com"],
        ["javascript URL", "javascript:alert(1)"],
        ["relative path", "dashboard"],
        ["empty", ""],
        ["null", null],
    ])("falls back for %s", (_label, value) => {
        expect(safeRedirectPath(value)).toBe(routes.dashboard);
    });

    it("uses the provided fallback", () => {
        expect(safeRedirectPath("//evil.com", "/")).toBe("/");
    });
});
