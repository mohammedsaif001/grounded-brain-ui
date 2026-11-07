import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * WCAG 2.2 AA contrast audit of the theme tokens in app/globals.css.
 * Normal text needs 4.5:1. Reads the real stylesheet, so a token edit that
 * regresses contrast fails CI.
 */

const css = readFileSync(
    fileURLToPath(new URL("../app/globals.css", import.meta.url)),
    "utf8",
);

function readTheme(selector: string): Record<string, string> {
    const start = css.indexOf(`${selector} {`);
    if (start < 0) throw new Error(`Theme block ${selector} not found`);
    const end = css.indexOf("\n}", start);
    const vars: Record<string, string> = {};
    for (const match of css.slice(start, end).matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
        vars[match[1]] = match[2];
    }
    return vars;
}

function luminance(hex: string): number {
    const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const [r, g, b] = channels.map((c) =>
        c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (light + 0.05) / (dark + 0.05);
}

/** [foreground token, background token] pairs that carry normal-size text. */
const PAIRS: [string, string][] = [
    ["foreground", "background"],
    ["card-foreground", "card"],
    ["popover-foreground", "popover"],
    ["muted-foreground", "background"],
    ["muted-foreground", "card"],
    ["muted-foreground", "muted"],
    ["primary-foreground", "primary"],
    ["secondary-foreground", "secondary"],
    ["accent-foreground", "accent"],
    ["sidebar-foreground", "sidebar"],
    ["muted-foreground", "sidebar"],
    ["destructive", "card"],
    ["tint-green-foreground", "tint-green"],
    ["tint-blue-foreground", "tint-blue"],
    ["tint-amber-foreground", "tint-amber"],
    ["tint-rose-foreground", "tint-rose"],
    ["tint-violet-foreground", "tint-violet"],
];

describe.each([
    ["Pearl (light)", ":root"],
    ["Forest (dark)", ".dark"],
])("%s theme contrast", (_name, selector) => {
    const theme = readTheme(selector);

    it.each(PAIRS)("%s on %s meets 4.5:1", (fg, bg) => {
        expect(theme[fg], `missing --${fg}`).toBeDefined();
        expect(theme[bg], `missing --${bg}`).toBeDefined();
        expect(contrast(theme[fg], theme[bg])).toBeGreaterThanOrEqual(4.5);
    });
});
