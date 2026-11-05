"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type FilterOption<T extends string> = {
  value: T;
  label: string;
};

type FilterSelectProps<T extends string> = {
  /** Accessible name; the trigger only shows the current label. */
  label: string;
  /** Label for the "no filter" choice, e.g. "All types". */
  allLabel: string;
  options: readonly FilterOption<T>[];
  /** `undefined` means "no filter". */
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  className?: string;
};

const ALL = "__all__";

/**
 * Single-choice filter with an explicit "all" option. Passing `items` to the
 * root lets the trigger render the option label instead of the raw value.
 */
export function FilterSelect<T extends string>({
  label,
  allLabel,
  options,
  value,
  onChange,
  className,
}: FilterSelectProps<T>) {
  const items: Record<string, string> = { [ALL]: allLabel };
  for (const option of options) items[option.value] = option.label;

  return (
    <Select
      items={items}
      value={value ?? ALL}
      onValueChange={(next) =>
        onChange(next === ALL ? undefined : (next as T))
      }
    >
      <SelectTrigger aria-label={label} className={cn("min-w-32", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} className="min-w-40">
        <SelectItem value={ALL}>{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
