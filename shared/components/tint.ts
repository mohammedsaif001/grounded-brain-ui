/**
 * Shared tint vocabulary. Each tone maps to a `--tint-*` / `--tint-*-foreground`
 * token pair defined in app/globals.css, so every surface stays theme-aware.
 */
export type Tone = "green" | "blue" | "amber" | "rose" | "violet" | "neutral";

export const toneClasses: Record<Tone, string> = {
  green: "bg-tint-green text-tint-green-foreground",
  blue: "bg-tint-blue text-tint-blue-foreground",
  amber: "bg-tint-amber text-tint-amber-foreground",
  rose: "bg-tint-rose text-tint-rose-foreground",
  violet: "bg-tint-violet text-tint-violet-foreground",
  neutral: "bg-muted text-muted-foreground",
};
