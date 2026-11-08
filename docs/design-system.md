# Design system

Visual source of truth: `Figma-UI/*.png`. Pearl is the light theme, Forest is the dark theme.
Both are defined in `app/globals.css`; nothing else in the codebase should define a colour.

## Tokens

| Group | Tokens | Use |
| --- | --- | --- |
| Surface | `background`, `card`, `popover`, `surface-sunken`, `sidebar` | Page, panels, overlays, table headers |
| Text | `foreground`, `muted-foreground` | Body copy, secondary copy |
| Action | `primary`, `secondary`, `accent`, `destructive` | Buttons, selection, danger |
| Tints | `tint-{green,blue,amber,rose,violet}` + `-foreground` | Status pills, type tiles, callouts |
| Canvas | `--page-gradient` via `bg-page` | Page background (sage to lavender / green to indigo) |
| Elevation | `shadow-surface`, `shadow-raised`, `shadow-overlay` | Cards, hovered cards, popups |

Use Tailwind utilities (`bg-card`, `text-muted-foreground`, `bg-tint-green text-tint-green-foreground`).
Never write a hex value or a raw palette class (`bg-red-500`) in a component.

## Typography

Fonts are loaded in `app/layout.tsx` with `next/font`: Inter (UI), Lora (display serif), JetBrains Mono (code only).

| Utility | Use |
| --- | --- |
| `text-display` | Hero headlines (serif) |
| `text-headline` | Answer and viewer headlines (serif) |
| `text-title` | Page titles |
| `text-heading` | Card and section titles |
| `text-body` | Paragraph text |
| `text-caption` | Secondary, muted detail |
| `text-eyebrow` | Uppercase section label |

## Shared components (`shared/components/`)

`PageHeader`, `AppLogo`, `StatusBadge`, `TypeTile`, `Callout`, `SectionCard`, `EmptyState`,
`FilterSelect`, `ViewToggle`, `BulkActionBar`, `ConfirmDialog`. Primitives live in `components/ui/`.

Rules of thumb:

- One component per pattern. Source and artifact status both use `StatusBadge`.
- Icons are Lucide SVGs. Do not use emoji as UI.
- Decorative icons get `aria-hidden="true"`; icon-only buttons get an `sr-only` label.
- Destructive actions go through `ConfirmDialog`.
- Every list has loading, empty and error states.

## Guardrails (run in `npm test`, therefore in CI)

- `shared/design-tokens.test.ts` fails on hardcoded hex colours, raw palette classes and stray `font-mono`.
- `shared/design-contrast.test.ts` fails if any text/background token pair drops below WCAG AA (4.5:1) in either theme.

Adding a legitimate exception means adding the file and the reason to the allow-list in the test.
