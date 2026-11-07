import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BrainIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import { AppLogo } from "./brand/app-logo";
import { BulkActionBar } from "./bulk-action-bar";
import { Callout } from "./callout";
import { EmptyState } from "./empty-state";
import { PageHeader } from "./page-header";
import { StatusBadge, type ProcessingStatus } from "./status-badge";
import { TypeTile } from "./type-tile";

const render = (element: Parameters<typeof renderToStaticMarkup>[0]) =>
    renderToStaticMarkup(element);

describe("StatusBadge", () => {
    const cases: [ProcessingStatus, string, string][] = [
        ["PENDING", "Pending", "bg-tint-amber"],
        ["PROCESSING", "Processing", "bg-tint-blue"],
        ["READY", "Ready", "bg-tint-green"],
        ["FAILED", "Failed", "bg-tint-rose"],
    ];

    it.each(cases)("renders %s as a labelled %s pill", (status, label, tone) => {
        const html = render(h(StatusBadge, { status }));
        expect(html).toContain(label);
        expect(html).toContain(tone);
    });

    it("hides the decorative icon from assistive tech", () => {
        expect(render(h(StatusBadge, { status: "READY" }))).toContain(
            'aria-hidden="true"',
        );
    });

    it("only spins the processing icon, and only when motion is allowed", () => {
        expect(render(h(StatusBadge, { status: "PROCESSING" }))).toContain(
            "motion-safe:animate-spin",
        );
        expect(render(h(StatusBadge, { status: "READY" }))).not.toContain(
            "animate-spin",
        );
    });
});

describe("PageHeader", () => {
    it("renders a single h1 with eyebrow, description and actions", () => {
        const html = render(
            h(PageHeader, {
                eyebrow: "Eyebrow",
                title: "Title",
                description: "Description",
                actions: h("button", null, "Act"),
            }),
        );
        expect(html.match(/<h1/g)).toHaveLength(1);
        expect(html).toContain("Eyebrow");
        expect(html).toContain("Description");
        expect(html).toContain("Act");
    });

    it("omits optional regions when not provided", () => {
        const html = render(h(PageHeader, { title: "Only title" }));
        expect(html).not.toContain("<p");
    });
});

describe("BulkActionBar", () => {
    it("pluralises the count and announces it politely", () => {
        const html = render(
            h(BulkActionBar, {
                count: 2,
                noun: "source",
                onClear: () => {},
                children: h("button", null, "Delete"),
            }),
        );
        expect(html).toContain("2 sources selected");
        expect(html).toContain('aria-live="polite"');
        expect(html).toContain("Clear selection");
    });

    it("uses the singular for one item", () => {
        const html = render(
            h(BulkActionBar, { count: 1, noun: "source", onClear: () => {}, children: null }),
        );
        expect(html).toContain("1 source selected");
    });
});

describe("EmptyState", () => {
    it("renders the title as a heading with optional description and actions", () => {
        const html = render(
            h(EmptyState, {
                icon: BrainIcon,
                title: "Nothing here",
                description: "Add something",
                children: h("button", null, "Add"),
            }),
        );
        expect(html).toContain("<h2");
        expect(html).toContain("Nothing here");
        expect(html).toContain("Add something");
    });
});

describe("Callout", () => {
    it("renders its tone, title and body", () => {
        const html = render(
            h(Callout, { tone: "rose", title: "Failed", children: "Details" }),
        );
        expect(html).toContain("bg-tint-rose");
        expect(html).toContain("Failed");
        expect(html).toContain("Details");
    });
});

describe("TypeTile and AppLogo", () => {
    it("treats the tile as decorative", () => {
        expect(render(h(TypeTile, { icon: BrainIcon }))).toContain(
            'aria-hidden="true"',
        );
    });

    it("keeps an accessible name when only the mark is shown", () => {
        const html = render(h(AppLogo, { markOnly: true }));
        expect(html).toContain("Grounded Brain");
        expect(html).toContain("sr-only");
    });
});
