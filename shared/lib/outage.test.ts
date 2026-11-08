import { describe, expect, it } from "vitest";
import { isServerOutageResponse, OUTAGE_COPY } from "./outage";
import { summarizeHealth } from "./service-status";

describe("isServerOutageResponse", () => {
    it("treats gateway failures as an outage", () => {
        expect(isServerOutageResponse(502, true)).toBe(true);
        expect(isServerOutageResponse(504, true)).toBe(true);
    });

    it("treats a 5xx without the API's JSON envelope as an outage", () => {
        expect(isServerOutageResponse(500, false)).toBe(true);
    });

    it("leaves enveloped 5xx alone, such as an unconfigured integration", () => {
        expect(isServerOutageResponse(503, true)).toBe(false);
        expect(isServerOutageResponse(500, true)).toBe(false);
    });

    it("never flags client errors", () => {
        expect(isServerOutageResponse(404, false)).toBe(false);
    });
});

describe("summarizeHealth", () => {
    it("reports everything up", () => {
        expect(
            summarizeHealth(true, { checks: { mem0: { status: "up" } } }),
        ).toEqual({ server: "up", memory: "up" });
    });

    it("reports Mem0 down while the server is still up", () => {
        expect(
            summarizeHealth(true, { checks: { mem0: { status: "down" } } }),
        ).toEqual({ server: "up", memory: "down" });
    });

    it("reports the server down when a required dependency is down", () => {
        expect(summarizeHealth(false, { checks: {} }).server).toBe("down");
    });

    it("does not guess about Mem0 when it is not configured or missing", () => {
        expect(
            summarizeHealth(true, {
                checks: { mem0: { status: "not_configured" } },
            }).memory,
        ).toBe("unknown");
        expect(summarizeHealth(true, null).memory).toBe("unknown");
    });
});

describe("OUTAGE_COPY", () => {
    it("names the affected service", () => {
        expect(OUTAGE_COPY.server.title).toMatch(/server/i);
        expect(OUTAGE_COPY.memory.title).toMatch(/Mem0/);
    });
});
