import { describe, expect, it } from "vitest";
import { formatWorkspaceCounts } from "./workspace-counts";

describe("formatWorkspaceCounts", () => {
    it("pluralises both counts", () => {
        expect(
            formatWorkspaceCounts({ sourceCount: 8, artifactCount: 6 }),
        ).toBe("8 sources · 6 study guides");
    });

    it("uses singular forms for one", () => {
        expect(
            formatWorkspaceCounts({ sourceCount: 1, artifactCount: 1 }),
        ).toBe("1 source · 1 study guide");
    });

    it("shows zero counts instead of hiding them", () => {
        expect(
            formatWorkspaceCounts({ sourceCount: 0, artifactCount: 0 }),
        ).toBe("0 sources · 0 study guides");
    });
});
