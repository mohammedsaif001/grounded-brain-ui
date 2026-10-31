import { describe, expect, it } from "vitest";
import { DEFAULT_CHAT_MODEL, isChatModel, resolveChatModel } from "./models";

describe("chat models", () => {
    it("accepts supported models", () => {
        expect(isChatModel("gpt-4o")).toBe(true);
        expect(resolveChatModel("gpt-4o")).toBe("gpt-4o");
    });

    it.each([undefined, null, "", "gpt-5-unknown", 42])(
        "falls back to the default for %s",
        (value) => {
            expect(isChatModel(value)).toBe(false);
            expect(resolveChatModel(value as string | undefined)).toBe(
                DEFAULT_CHAT_MODEL,
            );
        },
    );
});
