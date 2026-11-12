import { describe, expect, it } from "vitest";
import { OUTAGE_COPY } from "@/shared/lib/outage";
import { describeChatError } from "./chat-error";

describe("describeChatError", () => {
    it("reads the message from the API error envelope", () => {
        const body = JSON.stringify({
            success: false,
            error: { code: "NO_SOURCES", message: "Add a source first." },
        });
        expect(describeChatError(new Error(body))).toBe("Add a source first.");
    });

    it("accepts a string error or top-level message", () => {
        expect(describeChatError(new Error('{"error":"Rate limited"}'))).toBe(
            "Rate limited",
        );
        expect(describeChatError(new Error('{"message":"Nope"}'))).toBe("Nope");
    });

    it("falls back when the JSON has no usable message", () => {
        expect(describeChatError(new Error('{"success":false}'))).toMatch(
            /could not be generated/,
        );
        expect(describeChatError(new Error("{not json"))).toMatch(
            /could not be generated/,
        );
    });

    it("explains network failures", () => {
        expect(describeChatError(new TypeError("Failed to fetch"))).toMatch(
            /Could not reach/,
        );
    });

    it("treats an HTML page as a server outage", () => {
        expect(
            describeChatError(new Error("<html><body>502</body></html>")),
        ).toBe(OUTAGE_COPY.server.message);
    });

    it("passes plain text through and handles a missing error", () => {
        expect(describeChatError(new Error("Model unavailable"))).toBe(
            "Model unavailable",
        );
        expect(describeChatError(undefined)).toMatch(/could not be generated/);
    });
});
