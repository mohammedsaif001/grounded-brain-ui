import { describe, expect, it } from "vitest";

import { getWorkspaceSection } from "./workspace-sections";

describe("getWorkspaceSection", () => {
    const id = "ws_1";

    it.each([
        ["/workspace/ws_1", "chat"],
        ["/workspace/ws_1/sources", "sources"],
        ["/workspace/ws_1/sources/src_9", "sources"],
        ["/workspace/ws_1/learn", "learn"],
        ["/workspace/ws_1/learn/art_3", "learn"],
        ["/workspace/ws_1/settings", "settings"],
    ])("maps %s to %s", (pathname, expected) => {
        expect(getWorkspaceSection(pathname, id)).toBe(expected);
    });

    it("does not confuse a source titled 'settings' with the settings section", () => {
        expect(getWorkspaceSection("/workspace/ws_1/sources/settings", id)).toBe(
            "sources",
        );
    });

    it("does not match sibling ids that share a prefix", () => {
        expect(getWorkspaceSection("/workspace/ws_10/sources", id)).toBe("chat");
    });
});
