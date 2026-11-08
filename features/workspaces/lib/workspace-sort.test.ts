import { describe, expect, it } from "vitest";
import { WORKSPACE_SORTS } from "./types";
import {
    DEFAULT_WORKSPACE_SORT,
    WORKSPACE_SORT_OPTIONS,
    getWorkspaceSortOption,
} from "./workspace-sort";

describe("workspace sort options", () => {
    it("only uses sort fields the API accepts", () => {
        for (const option of WORKSPACE_SORT_OPTIONS) {
            expect(WORKSPACE_SORTS).toContain(option.sort);
        }
    });

    it("has unique keys", () => {
        const keys = WORKSPACE_SORT_OPTIONS.map((option) => option.key);
        expect(new Set(keys).size).toBe(keys.length);
    });

    it("defaults to the API default: last updated, newest first", () => {
        expect(getWorkspaceSortOption(DEFAULT_WORKSPACE_SORT)).toMatchObject({
            sort: "updatedAt",
            order: "desc",
        });
    });

    it("sorts titles ascending", () => {
        expect(getWorkspaceSortOption("title")).toMatchObject({
            sort: "title",
            order: "asc",
        });
    });
});
