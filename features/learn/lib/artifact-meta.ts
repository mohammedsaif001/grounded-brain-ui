import {
    CircleHelpIcon,
    CodeXmlIcon,
    FileTextIcon,
    LayersIcon,
    ListChecksIcon,
    NetworkIcon,
    ScrollTextIcon,
    type LucideIcon,
} from "lucide-react";
import type { Tone } from "@/shared/components/tint";
import type { ArtifactType } from "./types";

type ArtifactMeta = {
    icon: LucideIcon;
    tone: Tone;
    /** One-line promise shown in the "what would you like to make" picker. */
    tagline: string;
};

/** Visual identity per artifact type. Labels and descriptions live in constants.ts. */
export const ARTIFACT_META: Record<ArtifactType, ArtifactMeta> = {
    SUMMARY: {
        icon: FileTextIcon,
        tone: "green",
        tagline: "The essential story, clearly distilled.",
    },
    TAKEAWAYS: {
        icon: ListChecksIcon,
        tone: "rose",
        tagline: "The ideas worth taking with you.",
    },
    FLASHCARDS: {
        icon: LayersIcon,
        tone: "violet",
        tagline: "Practice recall, one idea at a time.",
    },
    QUIZ: {
        icon: CircleHelpIcon,
        tone: "blue",
        tagline: "Find what you know. Fill the gaps.",
    },
    MINDMAP: {
        icon: NetworkIcon,
        tone: "amber",
        tagline: "See how the ideas connect.",
    },
    REPORT: {
        icon: ScrollTextIcon,
        tone: "blue",
        tagline: "Go deeper with a structured analysis.",
    },
    WIKI: {
        icon: CodeXmlIcon,
        tone: "green",
        tagline: "Make a codebase feel familiar.",
    },
};
