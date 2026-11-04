import {
  CheckIcon,
  CircleAlertIcon,
  ClockIcon,
  LoaderCircleIcon,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Lifecycle shared by sources and generated study artifacts. */
export type ProcessingStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

const STATUS_CONFIG: Record<
  ProcessingStatus,
  {
    label: string;
    variant: "amber" | "blue" | "green" | "rose";
    icon: LucideIcon;
    spin?: boolean;
  }
> = {
  PENDING: { label: "Pending", variant: "amber", icon: ClockIcon },
  PROCESSING: {
    label: "Processing",
    variant: "blue",
    icon: LoaderCircleIcon,
    spin: true,
  },
  READY: { label: "Ready", variant: "green", icon: CheckIcon },
  FAILED: { label: "Failed", variant: "rose", icon: CircleAlertIcon },
};

type StatusBadgeProps = {
  status: ProcessingStatus;
  className?: string;
};

/** Single status pill used everywhere a processing state is shown. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, variant, icon: Icon, spin } = STATUS_CONFIG[status];
  return (
    <Badge variant={variant} className={className}>
      <Icon
        aria-hidden="true"
        className={cn(spin && "motion-safe:animate-spin")}
      />
      {label}
    </Badge>
  );
}
