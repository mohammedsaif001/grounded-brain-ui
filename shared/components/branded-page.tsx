import Link from "next/link";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { routes } from "@/shared/config/routes";
import { AppLogo } from "./brand/app-logo";

/**
 * Full-page frame for screens that render outside the app shell (errors, not found),
 * so the brand and the theme switch are always visible.
 */
export function BrandedPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-page flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-5 md:px-14">
        <Link
          href={routes.home}
          className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          <AppLogo />
        </Link>
        <ModeToggle />
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
