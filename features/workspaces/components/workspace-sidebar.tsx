"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ArrowLeftIcon,
    LibraryBigIcon,
    MessageSquareIcon,
    SettingsIcon,
    ShieldCheckIcon,
    SparklesIcon,
    type LucideIcon,
} from "lucide-react";
import { SourceSidebarList } from "@/features/sources";
import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import { AppLogo } from "@/shared/components/brand/app-logo";
import { routes } from "@/shared/config/routes";
import { useWorkspaceSummary } from "../hooks/use-workspaces";
import type { Workspace } from "../lib/types";
import type { WorkspaceSection } from "../lib/workspace-sections";
import { WorkspaceIcon } from "./workspace-icon";

type NavItem = {
    section: WorkspaceSection;
    label: string;
    icon: LucideIcon;
    href: (workspaceId: string) => string;
};

const NAV_ITEMS: readonly NavItem[] = [
    {
        section: "chat",
        label: "Chat",
        icon: MessageSquareIcon,
        href: routes.workspace.chat,
    },
    {
        section: "learn",
        label: "Learn",
        icon: SparklesIcon,
        href: routes.workspace.learn,
    },
    {
        section: "sources",
        label: "Sources",
        icon: LibraryBigIcon,
        href: routes.workspace.sources,
    },
    {
        section: "settings",
        label: "Settings",
        icon: SettingsIcon,
        href: routes.workspace.settings,
    },
];

type WorkspaceSidebarProps = {
    workspace: Workspace;
    activeSection: WorkspaceSection;
    onAddSource: () => void;
};

export function WorkspaceSidebar({
    workspace,
    activeSection,
    onAddSource,
}: WorkspaceSidebarProps) {
    const { data: summary } = useWorkspaceSummary(workspace.id);
    const pathname = usePathname();
    const { isMobile, setOpenMobile } = useSidebar();

    // On a phone the sidebar is a drawer, so it must get out of the way once the user
    // picks something. Closing on the tap covers links to the page you are already on
    // (the route does not change then); the effect covers every other kind of navigation.
    useEffect(() => {
        setOpenMobile(false);
    }, [pathname, setOpenMobile]);

    function closeDrawerOnLink(event: React.MouseEvent) {
        if (isMobile && (event.target as HTMLElement).closest("a[href]")) {
            setOpenMobile(false);
        }
    }
    const sourceCount = summary?.sourceCount;
    const hasUnseenLearning = (summary?.unseenArtifactCount ?? 0) > 0;

    return (
        <Sidebar>
            <SidebarHeader
                className="gap-5 px-4 pt-5"
                onClick={closeDrawerOnLink}
            >
                <Link
                    href={routes.dashboard}
                    className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/40"
                >
                    <AppLogo />
                </Link>

                <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-accent text-sidebar-accent-foreground">
                        <WorkspaceIcon
                            value={workspace.icon}
                            className="size-5"
                        />
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                            {workspace.title}
                        </p>
                        <p className="text-caption truncate">
                            Personal workspace
                        </p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2" onClick={closeDrawerOnLink}>
                <SidebarGroup>
                    <SidebarGroupLabel className="sr-only">
                        Workspace
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {NAV_ITEMS.map((item) => {
                                const isActive = activeSection === item.section;
                                return (
                                    <SidebarMenuItem key={item.section}>
                                        <SidebarMenuButton
                                            isActive={isActive}
                                            render={
                                                <Link
                                                    href={item.href(
                                                        workspace.id,
                                                    )}
                                                    aria-current={
                                                        isActive
                                                            ? "page"
                                                            : undefined
                                                    }
                                                />
                                            }
                                        >
                                            <item.icon aria-hidden="true" />
                                            <span>{item.label}</span>
                                            {item.section === "sources" &&
                                            sourceCount ? (
                                                <span className="text-caption ml-auto tabular-nums">
                                                    {sourceCount}
                                                </span>
                                            ) : null}
                                            {item.section === "learn" &&
                                            hasUnseenLearning ? (
                                                <span className="ml-auto flex items-center">
                                                    <span
                                                        aria-hidden="true"
                                                        className="size-2 rounded-full bg-primary"
                                                    />
                                                    <span className="sr-only">
                                                        New study material
                                                    </span>
                                                </span>
                                            ) : null}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SourceSidebarList
                    workspaceId={workspace.id}
                    onAddSource={() => {
                        setOpenMobile(false);
                        onAddSource();
                    }}
                />
            </SidebarContent>

            <SidebarFooter className="gap-3 p-3" onClick={closeDrawerOnLink}>
                <div className="flex items-start gap-3 rounded-xl bg-sidebar-accent/60 p-3">
                    <ShieldCheckIcon
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    />
                    <p className="text-caption">
                        Your sources. Your thinking. Always grounded.
                    </p>
                </div>
                <Button
                    nativeButton={false}
                    variant="ghost"
                    className="w-full justify-start"
                    render={<Link href={routes.dashboard} />}
                >
                    <ArrowLeftIcon aria-hidden="true" />
                    All workspaces
                </Button>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
