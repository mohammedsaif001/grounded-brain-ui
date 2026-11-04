import {
    BookOpenIcon,
    BrainIcon,
    CompassIcon,
    FlaskConicalIcon,
    GraduationCapIcon,
    LibraryIcon,
    LightbulbIcon,
    NotebookPenIcon,
    RocketIcon,
    SparklesIcon,
    SproutIcon,
    TelescopeIcon,
    type LucideIcon,
} from "lucide-react";

/**
 * Workspace icons are stored as short string keys (kept <= 8 chars to stay within
 * the existing `icon` column limit) and rendered as vector icons. Emoji values saved
 * before this registry existed are mapped to the closest icon via LEGACY_EMOJI.
 */
export const WORKSPACE_ICONS = {
    sprout: { icon: SproutIcon, label: "Sprout" },
    library: { icon: LibraryIcon, label: "Library" },
    book: { icon: BookOpenIcon, label: "Open book" },
    notes: { icon: NotebookPenIcon, label: "Notes" },
    cap: { icon: GraduationCapIcon, label: "Graduation cap" },
    idea: { icon: LightbulbIcon, label: "Idea" },
    lab: { icon: FlaskConicalIcon, label: "Lab" },
    brain: { icon: BrainIcon, label: "Brain" },
    spark: { icon: SparklesIcon, label: "Sparkles" },
    rocket: { icon: RocketIcon, label: "Rocket" },
    compass: { icon: CompassIcon, label: "Compass" },
    scope: { icon: TelescopeIcon, label: "Telescope" },
} as const satisfies Record<string, { icon: LucideIcon; label: string }>;

export type WorkspaceIconKey = keyof typeof WORKSPACE_ICONS;

export const WORKSPACE_ICON_KEYS = Object.keys(
    WORKSPACE_ICONS,
) as WorkspaceIconKey[];

export const DEFAULT_WORKSPACE_ICON: WorkspaceIconKey = "sprout";

const LEGACY_EMOJI: Record<string, WorkspaceIconKey> = {
    "📚": "library",
    "📖": "book",
    "📝": "notes",
    "🎓": "cap",
    "💡": "idea",
    "🔬": "lab",
    "🧠": "brain",
    "✨": "spark",
};

/** Resolve any stored icon value (key, legacy emoji, empty or unknown) to a registry key. */
export function resolveWorkspaceIcon(
    value: string | null | undefined,
): WorkspaceIconKey {
    const normalized = value?.trim();
    if (!normalized) return DEFAULT_WORKSPACE_ICON;
    if (normalized in WORKSPACE_ICONS) return normalized as WorkspaceIconKey;
    return LEGACY_EMOJI[normalized] ?? DEFAULT_WORKSPACE_ICON;
}
