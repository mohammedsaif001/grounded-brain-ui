import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  feedbackSurfaceClasses,
  feedbackTone,
  toneClasses,
  type Feedback,
} from "./tint";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: React.ReactNode;
  /** Buttons or links rendered under the copy. */
  children?: React.ReactNode;
  /** Colours the placeholder as feedback (e.g. warning for maintenance, error for failures). */
  feedback?: Feedback;
  className?: string;
};

/** Centered, dashed placeholder for empty lists and zero-result searches. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  feedback,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed px-6 py-16 text-center",
        feedback ? feedbackSurfaceClasses[feedback] : "border-border bg-card/50",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-12 items-center justify-center rounded-2xl",
          feedback ? toneClasses[feedbackTone[feedback]] : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="max-w-sm space-y-1.5">
        <h2 className="text-heading">{title}</h2>
        {description ? (
          <p className="text-body text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? (
        <div className="flex flex-wrap justify-center gap-2">{children}</div>
      ) : null}
    </div>
  );
}
