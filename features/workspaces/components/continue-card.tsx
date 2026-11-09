"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
    ArrowRightIcon,
    LibraryBigIcon,
    MessageSquareIcon,
    SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toneClasses } from "@/shared/components/tint";
import { routes } from "@/shared/config/routes";
import type { Workspace } from "../lib/types";
import { formatWorkspaceCounts } from "../lib/workspace-counts";
import { getWorkspaceTone } from "../lib/workspace-tone";
import { WorkspaceIcon } from "./workspace-icon";

type ContinueCardProps = {
    workspace: Workspace;
};

/** One-click way back into the notebook that was worked on last. */
export function ContinueCard({ workspace }: ContinueCardProps) {
    const links = [
        { label: "Chat", icon: MessageSquareIcon, href: routes.workspace.chat(workspace.id) },
        { label: "Learn", icon: SparklesIcon, href: routes.workspace.learn(workspace.id) },
        { label: "Sources", icon: LibraryBigIcon, href: routes.workspace.sources(workspace.id) },
    ];

    return (
        <article className="group/card relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-surface transition-shadow hover:shadow-raised md:flex-row md:items-center md:gap-5 md:p-6">
            <Link
                href={routes.workspace.chat(workspace.id)}
                aria-label={`Continue with ${workspace.title}`}
                className="absolute inset-0 z-0 rounded-[inherit] outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            />

            <div className="pointer-events-none relative flex min-w-0 flex-1 items-center gap-4">
                <span
                    aria-hidden="true"
                    className={cn(
                        "flex size-14 shrink-0 items-center justify-center rounded-2xl",
                        toneClasses[getWorkspaceTone(workspace.id)],
                    )}
                >
                    <WorkspaceIcon value={workspace.icon} className="size-7" />
                </span>
                <div className="min-w-0 space-y-1">
                    <p className="text-eyebrow">Continue where you left off</p>
                    <h2 className="text-heading truncate">{workspace.title}</h2>
                    <p className="text-caption">
                        {formatWorkspaceCounts(workspace)} · Updated{" "}
                        {formatDistanceToNow(new Date(workspace.updatedAt), {
                            addSuffix: true,
                        })}
                    </p>
                </div>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-2">
                {links.map(({ label, icon: Icon, href }) => (
                    <Button
                        key={label}
                        nativeButton={false}
                        variant="outline"
                        size="sm"
                        render={<Link href={href} />}
                    >
                        <Icon aria-hidden="true" />
                        {label}
                    </Button>
                ))}
                <Button
                    nativeButton={false}
                    variant="ghost"
                    size="icon-sm"
                    className="ml-1 hidden text-muted-foreground md:inline-flex"
                    render={<Link href={routes.workspace.chat(workspace.id)} />}
                >
                    <ArrowRightIcon
                        aria-hidden="true"
                        className="transition-transform group-hover/card:translate-x-0.5"
                    />
                    <span className="sr-only">Open {workspace.title}</span>
                </Button>
            </div>
        </article>
    );
}
