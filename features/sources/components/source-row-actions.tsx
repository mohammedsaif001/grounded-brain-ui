"use client";

import { MoreHorizontalIcon, RefreshCwIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Source } from "../lib/types";

type SourceRowActionsProps = {
    source: Source;
    onDelete?: (source: Source) => void;
    onReprocess?: (source: Source) => void;
};

/** Per-source overflow menu shared by the table rows and grid cards. */
export function SourceRowActions({
    source,
    onDelete,
    onReprocess,
}: SourceRowActionsProps) {
    if (!onDelete && !onReprocess) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0"
                    />
                }
            >
                <MoreHorizontalIcon aria-hidden="true" />
                <span className="sr-only">Actions for {source.title}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {onReprocess ? (
                    <DropdownMenuItem onClick={() => onReprocess(source)}>
                        <RefreshCwIcon />
                        Reprocess
                    </DropdownMenuItem>
                ) : null}
                {onDelete ? (
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDelete(source)}
                    >
                        <Trash2Icon />
                        Delete
                    </DropdownMenuItem>
                ) : null}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
