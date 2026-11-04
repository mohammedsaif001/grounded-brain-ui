import {
    FileTextIcon,
    GitBranchIcon,
    GlobeIcon,
    NotebookPenIcon,
    TypeIcon,
    VideoIcon,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TypeTile } from "@/shared/components/type-tile";
import type { Tone } from "@/shared/components/tint";
import type { SourceType } from "../lib/types";

const iconMap: Record<SourceType, LucideIcon> = {
    PDF: FileTextIcon,
    WEBSITE: GlobeIcon,
    YOUTUBE: VideoIcon,
    TEXT: TypeIcon,
    MARKDOWN: NotebookPenIcon,
    GITHUB: GitBranchIcon,
};

const toneMap: Record<SourceType, Tone> = {
    PDF: "blue",
    WEBSITE: "violet",
    YOUTUBE: "blue",
    TEXT: "violet",
    MARKDOWN: "blue",
    GITHUB: "violet",
};

type SourceTypeIconProps = {
    type: SourceType;
    className?: string;
};

/** Bare icon, for inline use next to text. */
export function SourceTypeIcon({ type, className }: SourceTypeIconProps) {
    const Icon = iconMap[type];
    return <Icon className={cn("size-4 shrink-0", className)} />;
}

type SourceTypeTileProps = {
    type: SourceType;
    size?: "sm" | "md" | "lg";
    className?: string;
};

/** Tinted tile, for list rows and detail headers. */
export function SourceTypeTile({ type, size, className }: SourceTypeTileProps) {
    return (
        <TypeTile
            icon={iconMap[type]}
            tone={toneMap[type]}
            size={size}
            className={className}
        />
    );
}
