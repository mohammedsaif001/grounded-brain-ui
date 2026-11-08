import { describe, expect, it } from "vitest";
import { sourceListSchema, sourceSchema } from "./schemas";

const row = {
    id: "s1",
    workspaceId: "w1",
    type: "PDF",
    title: "Make It Stick",
    url: null,
    status: "READY",
    metadata: { pageCount: 24 },
    createdAt: "2026-11-01T10:00:00Z",
    updatedAt: "2026-11-01T10:00:00Z",
};

describe("source schemas", () => {
    it("accepts list rows that omit content, as the API does", () => {
        // Regression: the paged list returns no `content`, which used to fail validation.
        const parsed = sourceListSchema.safeParse([row, { ...row, id: "s2" }]);

        expect(parsed.success).toBe(true);
    });

    it("still reads content when the single-source endpoint sends it", () => {
        const parsed = sourceSchema.parse({ ...row, content: "Full text" });

        expect(parsed.content).toBe("Full text");
    });

    it("accepts a null content", () => {
        expect(sourceSchema.safeParse({ ...row, content: null }).success).toBe(
            true,
        );
    });
});
