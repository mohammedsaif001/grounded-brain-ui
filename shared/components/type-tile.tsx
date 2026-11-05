import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { toneClasses, type Tone } from "./tint";

type TypeTileProps = {
  icon: LucideIcon;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "size-8 rounded-lg [&_svg]:size-4",
  md: "size-10 rounded-xl [&_svg]:size-[18px]",
  lg: "size-12 rounded-2xl [&_svg]:size-5",
} as const;

/** Rounded, tinted icon tile used for source types, artifact types and feature rows. */
export function TypeTile({
  icon: Icon,
  tone = "blue",
  size = "md",
  className,
}: TypeTileProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
    >
      <Icon />
    </span>
  );
}
