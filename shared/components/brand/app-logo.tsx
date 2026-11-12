import Link from "next/link";
import { cn } from "@/lib/utils";
import { routes } from "@/shared/config/routes";

import { LogoMark } from "./logo-mark";

type AppLogoProps = {
  /** Hide the wordmark and render only the mark (collapsed sidebar). */
  markOnly?: boolean;
  className?: string;
};

export function AppLogo({ markOnly = false, className }: AppLogoProps) {
  return (
    <Link
      href={routes.home}
      aria-label="Grounded Brain home"
      className={cn(
        "inline-flex min-w-0 items-center gap-2 rounded-xl outline-none transition-opacity hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/40 sm:gap-2.5",
        className,
      )}
    >
      <LogoMark className="size-8 drop-shadow-sm sm:size-9" />
      {markOnly ? (
        <span className="sr-only">Grounded Brain</span>
      ) : (
        <span className="text-heading tracking-tight whitespace-nowrap max-sm:text-[0.9375rem] max-[22.5rem]:sr-only">
          Grounded Brain
        </span>
      )}
    </Link>
  );
}
