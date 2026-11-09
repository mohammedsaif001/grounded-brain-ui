"use client";

import {
    MoreHorizontalIcon,
    PencilIcon,
    RefreshCwIcon,
    Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Source } from "../lib/types";

/** A source being indexed cannot be edited; the API answers 409. */
export function isIngesting(source: Pick<Source, "status">) {
    return source.status === "PENDING" || source.status === "PROCESSING";
}

type SourceRowActionsProps = {
    source: Source;
    onEdit?: (source: Source) => void;
    onDelete?: (source: Source) => void;
    onReprocess?: (source: Source) => void;
};

/** Per-source overflow menu shared by the table rows and grid cards. */
export function SourceRowActions({
    source,
    onEdit,
    onDelete,
    onReprocess,
}: SourceRowActionsProps) {
    if (!onEdit && !onDelete && !onReprocess) return null;

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
                {onEdit ? (
                    <DropdownMenuItem
                        disabled={isIngesting(source)}
                        onClick={() => onEdit(source)}
                    >
                        <PencilIcon />
                        Edit
                    </DropdownMenuItem>
                ) : null}
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
