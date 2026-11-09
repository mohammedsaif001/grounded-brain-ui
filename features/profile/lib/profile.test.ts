import { describe, expect, it } from "vitest";
import { describeProvider, describeUserAgent, getInitials } from "./profile";

describe("getInitials", () => {
    it("uses the first and last word", () => {
        expect(getInitials("Mohammed Saif")).toBe("MS");
        expect(getInitials("Ada Augusta King")).toBe("AK");
    });

    it("takes two letters from a single word", () => {
        expect(getInitials("madonna")).toBe("MA");
    });

    it("falls back when there is no name", () => {
        expect(getInitials("   ")).toBe("?");
        expect(getInitials(null)).toBe("?");
    });
});

describe("describeProvider", () => {
    it("names known providers and capitalises unknown ones", () => {
        expect(describeProvider("google")).toBe("Google");
        expect(describeProvider("credential")).toBe("Email and password");
        expect(describeProvider("github")).toBe("Github");
    });
});

describe("describeUserAgent", () => {
    it("reads Chrome on Windows", () => {
        expect(
            describeUserAgent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
            ),
        ).toBe("Chrome on Windows");
    });

    it("tells Edge apart from Chrome", () => {
        expect(
            describeUserAgent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36 Edg/120.0",
            ),
        ).toBe("Edge on Windows");
    });

    it("reads iPhone Safari as iOS, not macOS", () => {
        expect(
            describeUserAgent(
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile Safari/604.1",
            ),
        ).toBe("Safari on iOS");
    });

    it("reads Android Chrome as Android, not Linux", () => {
        expect(
            describeUserAgent(
                "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36",
            ),
        ).toBe("Chrome on Android");
    });

    it("handles a missing or unknown agent", () => {
        expect(describeUserAgent(null)).toBe("Unknown device");
        expect(describeUserAgent("curl/8.0")).toBe("Unknown device");
    });
});
