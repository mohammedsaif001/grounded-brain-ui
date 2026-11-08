"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { useSources } from "../hooks/use-sources";
import { SourceTypeIcon } from "./source-type-icon";
import { routes } from "@/shared/config/routes";

/** How many sources the sidebar previews; the full list lives on the Sources page. */
const RECENT_LIMIT = 3;

type SourceSidebarListProps = {
    workspaceId: string;
    onAddSource: () => void;
};

export function SourceSidebarList({
    workspaceId,
    onAddSource,
}: SourceSidebarListProps) {
    const { data: sources, isLoading } = useSources(workspaceId);

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Recent sources</SidebarGroupLabel>
            <SidebarGroupAction
                title="Add source"
                onClick={onAddSource}
            >
                <PlusIcon />
                <span className="sr-only">Add source</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
                {isLoading ? (
                    <div className="flex flex-col gap-2 px-2">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <SidebarMenuSkeleton key={index} showIcon />
                        ))}
                    </div>
                ) : sources && sources.length > 0 ? (
                    <SidebarMenu>
                        {sources.slice(0, RECENT_LIMIT).map((source) => (
                            <SidebarMenuItem key={source.id}>
                                <SidebarMenuButton
                                    render={
                                        <Link
                                            href={routes.workspace.source(
                                                workspaceId,
                                                source.id,
                                            )}
                                        />
                                    }
                                >
                                    <SourceTypeIcon
                                        type={source.type}
                                        className="text-muted-foreground"
                                    />
                                    <span className="truncate">
                                        {source.title}
                                    </span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                        {sources.length > RECENT_LIMIT ? (
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    render={
                                        <Link
                                            href={routes.workspace.sources(
                                                workspaceId,
                                            )}
                                        />
                                    }
                                >
                                    View all ({sources.length})
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ) : null}
                    </SidebarMenu>
                ) : (
                    <div className="space-y-2 px-2 py-1">
                        <p className="text-xs text-muted-foreground">
                            No sources yet.
                        </p>
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-sidebar"
                            onClick={onAddSource}
                        >
                            <PlusIcon />
                            Add source
                        </Button>
                    </div>
                )}
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
