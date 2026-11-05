import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/shared/components/status-badge";
import { ARTIFACT_TYPE_LABELS } from "../lib/constants";
import type { ArtifactStatus, ArtifactType } from "../lib/types";

type ArtifactStatusBadgeProps = {
    status: ArtifactStatus;
};

export function ArtifactStatusBadge({ status }: ArtifactStatusBadgeProps) {
    return <StatusBadge status={status} />;
}

export function ArtifactTypeBadge({ type }: { type: ArtifactType }) {
    return <Badge variant="outline">{ARTIFACT_TYPE_LABELS[type]}</Badge>;
}
