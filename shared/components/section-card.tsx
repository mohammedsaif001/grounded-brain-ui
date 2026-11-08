import { cn } from "@/lib/utils";

type SectionCardProps = {
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  action?: React.ReactNode;
  tone?: "default" | "violet" | "sunken";
  className?: string;
  children: React.ReactNode;
};

const toneClasses = {
  default: "border-border bg-card text-card-foreground",
  violet: "border-transparent bg-tint-violet text-tint-violet-foreground",
  sunken: "border-border bg-surface-sunken text-foreground",
} as const;

/** Bordered, elevated container for settings groups and side panels. */
export function SectionCard({
  title,
  eyebrow,
  action,
  tone = "default",
  className,
  children,
}: SectionCardProps) {
  const hasHeader = Boolean(title || eyebrow || action);
  return (
    <section
      className={cn(
        "rounded-2xl border p-5 shadow-surface",
        toneClasses[tone],
        className,
      )}
    >
      {hasHeader ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            {eyebrow ? <p className="text-eyebrow">{eyebrow}</p> : null}
            {title ? <h2 className="text-heading">{title}</h2> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
