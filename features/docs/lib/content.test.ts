import { describe, expect, it } from "vitest";
import { ARTIFACT_TYPE_LABELS } from "@/features/learn/lib/constants";
import { DOCS_SECTIONS, QUICK_START_IDS, getDocsSection } from "./content";

describe("docs content", () => {
    it("has unique, URL-safe section ids", () => {
        const ids = DOCS_SECTIONS.map((section) => section.id);

        expect(new Set(ids).size).toBe(ids.length);
        for (const id of ids) {
            expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        }
    });

    it("gives every section a summary and at least one step", () => {
        for (const section of DOCS_SECTIONS) {
            expect(section.summary.length).toBeGreaterThan(0);
            expect(section.steps.length).toBeGreaterThan(0);
            for (const step of section.steps) {
                expect(step.title.trim()).not.toBe("");
                expect(step.body.trim()).not.toBe("");
            }
        }
    });

    it("builds the quick-start flow only from sections that exist", () => {
        for (const id of QUICK_START_IDS) {
            expect(getDocsSection(id)).toBeDefined();
        }
    });

    it("names every study tool the app can generate", () => {
        const learn = getDocsSection("learn");
        const text = learn?.steps.map((step) => step.body).join(" ") ?? "";

        // Labels are matched case-insensitively: the tutorial says "Key Takeaways", etc.
        for (const label of Object.values(ARTIFACT_TYPE_LABELS)) {
            expect(text.toLowerCase()).toContain(label.toLowerCase());
        }
    });
});
