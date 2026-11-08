import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned actions (buttons, toggles). Wraps below the title on narrow screens. */
  actions?: React.ReactNode;
  className?: string;
};

/** Standard page heading: eyebrow, title, supporting copy and actions. */
export function PageHeader({
  title,
  eyebrow,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-wrap items-end justify-between gap-x-6 gap-y-4",
        className,
      )}
    >
      <div className="min-w-0 space-y-2">
        {eyebrow ? <p className="text-eyebrow">{eyebrow}</p> : null}
        <h1 className="text-title text-foreground">{title}</h1>
        {description ? (
          <p className="text-body max-w-2xl text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {/* Actions are capped to the header's width so toolbars wrap instead of pushing the page wider. */}
      {actions ? (
        <div className="flex max-w-full min-w-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
