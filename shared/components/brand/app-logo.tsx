import { BrainIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type AppLogoProps = {
  /** Hide the wordmark and render only the mark (collapsed sidebar). */
  markOnly?: boolean;
  className?: string;
};

export function AppLogo({ markOnly = false, className }: AppLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-surface"
      >
        <BrainIcon className="size-5" />
      </span>
      {markOnly ? (
        <span className="sr-only">Grounded Brain</span>
      ) : (
        <span className="text-heading tracking-tight">grounded brain</span>
      )}
    </span>
  );
}
