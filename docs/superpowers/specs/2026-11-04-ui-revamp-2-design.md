# UI Revamp 2.0 — Design Spec

Source of truth for visuals: `Figma-UI/*.png` (31 mockups, Pearl = light, Forest = dark).

## Decisions

| Topic | Decision |
| --- | --- |
| Themes | Pearl = `:root` (light), Forest = `.dark`. Existing `next-themes` toggle is reused. |
| Fonts | Inter (UI, `--font-sans`), Lora (display serif, `--font-serif`), JetBrains Mono (code only). Geist and Figtree are removed. |
| New features | Built only where existing hooks/endpoints support them. Anything else is listed as a backend follow-up, never shipped as dead UI. |
| Unmocked pages | `not-found`, errors, skeletons, delete dialogs are derived from the same tokens and components. |
| Delivery | Foundation first, then shared components, shell, and screens in layers. Small conventional commits. |

## Quality bar

- Every colour, font, radius and shadow comes from a token. No hex values or raw palette classes in components.
- WCAG 2.2 AA contrast in both themes; keyboard operable; visible focus; `prefers-reduced-motion` respected.
- Typed props, `cva` variants, one component per pattern (no duplicated status or badge logic).
- Server Components by default; client components only where interactive; heavy viewers lazy-loaded.
- Loading, empty, error and processing states for every screen, with skeletons that match the real layout.
- `lint`, `typecheck` and `test` pass before each phase is considered done.

## Foundation

- `app/globals.css` holds all tokens: shadcn semantic variables plus status/type tints
  (`--tint-{green,blue,amber,rose,violet}-{bg,fg}`), page gradient and shadow scale.
- Typography utilities: `text-display`, `text-eyebrow`, `text-title`, `text-body`, `text-caption`.

## Shared components (`shared/components/`)

`PageHeader`, `AppLogo`, `StatusBadge`, `TypeTile`, `FilterBar`, `ViewToggle`, `BulkActionBar`,
`EmptyState`, `Callout`, `SideCard`, `Eyebrow`, `SectionCard`; plus restyled `Button`, `Input`,
`Select`, `Tabs`, `Dialog`, `Badge`, `Card`.

## Shell

Sidebar: logo, workspace block, nav (Chat, Learn, Sources with count, Settings), recent sources (max 3),
add-source button, grounded-promise card, all-workspaces link. Top bar: breadcrumb, add source,
model picker, theme toggle, preferences, sign out. Mobile: sidebar becomes a drawer.

## Screen order

1. Access (login)  2. Notebooks  3. Sources + detail + add-source dialog  4. Chat
5. Learn hub + 7 study viewers  6. Workspace + memory settings  7. Unmocked pages  8. Mobile and states

## Out of scope / backend follow-ups

Collected during implementation and reported at the end (bulk reprocess/delete endpoints, citation passage
endpoint, learn-activity indicator, etc.).
