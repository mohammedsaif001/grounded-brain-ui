import { cn } from "@/lib/utils";
import { WORKSPACE_ICONS, resolveWorkspaceIcon } from "../lib/workspace-icons";

type WorkspaceIconProps = {
    /** Stored icon value: a registry key, a legacy emoji, or empty. */
    value: string | null | undefined;
    className?: string;
};

/** Renders a workspace's icon as an SVG. Decorative; the workspace title names it. */
export function WorkspaceIcon({ value, className }: WorkspaceIconProps) {
    const { icon: Icon } = WORKSPACE_ICONS[resolveWorkspaceIcon(value)];
    return <Icon aria-hidden="true" className={cn("size-5", className)} />;
}
