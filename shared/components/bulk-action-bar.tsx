import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

type BulkActionBarProps = {
  count: number;
  /** Singular noun, e.g. "source". Pluralised with a trailing "s". */
  noun: string;
  onClear: () => void;
  /** Action buttons rendered on the right. */
  children: React.ReactNode;
  className?: string;
};

/** Contextual bar shown while rows are selected. Announced politely to screen readers. */
export function BulkActionBar({
  count,
  noun,
  onClear,
  children,
  className,
}: BulkActionBarProps) {
  return (
    <div
      role="region"
      aria-label="Bulk actions"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-foreground shadow-surface",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <p aria-live="polite" className="text-sm font-medium">
          {count} {noun}
          {count === 1 ? "" : "s"} selected
        </p>
        <Button
          type="button"
          variant="link"
          size="xs"
          className="text-muted-foreground"
          onClick={onClear}
        >
          <XIcon aria-hidden="true" />
          Clear selection
        </Button>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
