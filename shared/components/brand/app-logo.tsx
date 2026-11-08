import { cn } from "@/lib/utils";

import { LogoMark } from "./logo-mark";

type AppLogoProps = {
  /** Hide the wordmark and render only the mark (collapsed sidebar). */
  markOnly?: boolean;
  className?: string;
};

export function AppLogo({ markOnly = false, className }: AppLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-9 drop-shadow-sm" />
      {markOnly ? (
        <span className="sr-only">Grounded Brain</span>
      ) : (
        <span className="text-heading tracking-tight">Grounded Brain</span>
      )}
    </span>
  );
}
