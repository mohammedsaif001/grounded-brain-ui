import { describe, expect, it } from "vitest";

import {
    DEFAULT_WORKSPACE_ICON,
    WORKSPACE_ICON_KEYS,
    resolveWorkspaceIcon,
} from "./workspace-icons";

describe("resolveWorkspaceIcon", () => {
    it("returns known keys unchanged", () => {
        for (const key of WORKSPACE_ICON_KEYS) {
            expect(resolveWorkspaceIcon(key)).toBe(key);
        }
    });

    it("maps legacy emoji values to the closest icon", () => {
        expect(resolveWorkspaceIcon("🎓")).toBe("cap");
        expect(resolveWorkspaceIcon("🧠")).toBe("brain");
        expect(resolveWorkspaceIcon("📚")).toBe("library");
    });

    it("falls back to the default for empty or unknown values", () => {
        expect(resolveWorkspaceIcon(undefined)).toBe(DEFAULT_WORKSPACE_ICON);
        expect(resolveWorkspaceIcon(null)).toBe(DEFAULT_WORKSPACE_ICON);
        expect(resolveWorkspaceIcon("  ")).toBe(DEFAULT_WORKSPACE_ICON);
        expect(resolveWorkspaceIcon("🦄")).toBe(DEFAULT_WORKSPACE_ICON);
    });

    it("keeps every key within the existing 8 character limit", () => {
        for (const key of WORKSPACE_ICON_KEYS) {
            expect(key.length).toBeLessThanOrEqual(8);
        }
    });
});
