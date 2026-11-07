"use client"

import { useSyncExternalStore } from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

const subscribe = () => () => {}

/** False during server render and hydration, true afterwards (avoids a theme mismatch). */
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}

/**
 * One-tap light/dark switch. The thumb position and icon are driven by the `dark`
 * class in CSS, so the first paint is already correct; `aria-checked` follows the
 * resolved theme once mounted.
 */
export function ModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const isDark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-border bg-card p-0.5 shadow-surface outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-surface transition-transform duration-200 dark:translate-x-6"
      >
        <SunIcon className="size-3.5 dark:hidden" />
        <MoonIcon className="hidden size-3.5 dark:block" />
      </span>
    </button>
  )
}
