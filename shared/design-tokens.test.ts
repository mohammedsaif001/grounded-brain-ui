import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Design-system guard. Colours, fonts and shadows must come from the tokens in
 * app/globals.css so that Pearl and Forest stay in sync everywhere. This test fails
 * (and therefore CI fails) when a component hardcodes one of them.
 */

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SCAN_DIRS = ["app", "components", "features", "shared"];

/** Files that legitimately contain literal colours, with the reason. */
const ALLOWED_HEX = new Set([
    // Brand-mandated Google "G" logo colours.
    "shared/components/brand/google-icon.tsx",
    // Replaces the whole document, so it cannot use stylesheet tokens.
    "app/global-error.tsx",
]);

const RULES: { name: string; pattern: RegExp; allow?: Set<string> }[] = [
    { name: "hex colour", pattern: /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?=["'\s;)\]])/, allow: ALLOWED_HEX },
    {
        name: "raw palette class",
        pattern:
            /\b(?:bg|text|border|ring|from|to|via|fill|stroke)-(?:red|green|blue|amber|yellow|emerald|sky|violet|purple|orange|rose|zinc|slate|gray|neutral|stone|lime|teal|cyan|indigo|pink|fuchsia)-\d{2,3}\b/,
    },
    {
        name: "font-mono utility (monospace is reserved for code)",
        pattern: /\bfont-mono\b/,
        // Code-like text: key hints, file names/paths and error digests.
        allow: new Set([
            "components/ui/kbd.tsx",
            "features/learn/components/viewers/wiki-viewer.tsx",
            "features/sources/components/github-source-panel.tsx",
            "shared/components/route-error.tsx",
        ]),
    },
];

function collect(dir: string, files: string[] = []): string[] {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) {
            collect(path, files);
        } else if (/\.tsx$/.test(entry.name)) {
            files.push(path);
        }
    }
    return files;
}

describe("design tokens", () => {
    const files = SCAN_DIRS.flatMap((dir) => collect(join(ROOT, dir)));

    for (const rule of RULES) {
        it(`has no ${rule.name} in components`, () => {
            const violations: string[] = [];
            for (const file of files) {
                const rel = relative(ROOT, file).split(sep).join("/");
                if (rule.allow?.has(rel)) continue;
                readFileSync(file, "utf8")
                    .split("\n")
                    .forEach((line, index) => {
                        if (rule.pattern.test(line)) {
                            violations.push(`${rel}:${index + 1}  ${line.trim().slice(0, 100)}`);
                        }
                    });
            }
            expect(violations).toEqual([]);
        });
    }
});
