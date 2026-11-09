import { cn } from "@/lib/utils";

import { LogoMark } from "./logo-mark";

type AppLogoProps = {
  /** Hide the wordmark and render only the mark (collapsed sidebar). */
  markOnly?: boolean;
  className?: string;
};

export function AppLogo({ markOnly = false, className }: AppLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 sm:gap-2.5", className)}>
      <LogoMark className="size-8 drop-shadow-sm sm:size-9" />
      {markOnly ? (
        <span className="sr-only">Grounded Brain</span>
      ) : (
        <span className="text-heading tracking-tight whitespace-nowrap max-sm:text-[0.9375rem] max-[22.5rem]:sr-only">
          Grounded Brain
        </span>
      )}
    </span>
  );
}
