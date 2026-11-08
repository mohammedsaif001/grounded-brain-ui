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

/**
 * Feedback semantics on top of the tint tones: success = green, info = blue,
 * warning (maintenance, delays, degraded) = amber, error = rose.
 */
export type Feedback = "success" | "info" | "warning" | "error";

export const feedbackTone: Record<Feedback, Tone> = {
  success: "green",
  info: "blue",
  warning: "amber",
  error: "rose",
};

/** Border + faint wash for a surface that carries a feedback message. */
export const feedbackSurfaceClasses: Record<Feedback, string> = {
  success: "border-tint-green-foreground/25 bg-tint-green/40",
  info: "border-tint-blue-foreground/25 bg-tint-blue/40",
  warning: "border-tint-amber-foreground/30 bg-tint-amber/40",
  error: "border-tint-rose-foreground/30 bg-tint-rose/40",
};
