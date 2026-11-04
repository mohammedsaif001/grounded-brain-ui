import { StatusBadge } from "@/shared/components/status-badge";
import type { SourceStatus } from "../lib/types";

type SourceStatusBadgeProps = {
    status: SourceStatus;
    className?: string;
};

export function SourceStatusBadge({ status, className }: SourceStatusBadgeProps) {
    return <StatusBadge status={status} className={className} />;
}
