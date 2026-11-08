"use client";

import Link from "next/link";
import { ArrowUpRightIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { routes } from "@/shared/config/routes";
import { SOURCE_TYPE_LABELS } from "../lib/constants";
import { describeSource } from "../lib/source-metadata";
import type { Source } from "../lib/types";
import { SourceRowActions } from "./source-row-actions";
import { SourceStatusBadge } from "./source-status-badge";
import { SourceTypeTile } from "./source-type-icon";

type SourceTableProps = {
    sources: readonly Source[];
    selectedIds: ReadonlySet<string>;
    onToggleOne: (id: string, selected: boolean) => void;
    onToggleAll: (selected: boolean) => void;
    onEdit: (source: Source) => void;
    onDelete: (source: Source) => void;
    onReprocess: (source: Source) => void;
};

export function SourceTable({
    sources,
    selectedIds,
    onToggleOne,
    onToggleAll,
    onEdit,
    onDelete,
    onReprocess,
}: SourceTableProps) {
    const selectedCount = sources.filter((source) =>
        selectedIds.has(source.id),
    ).length;
    const allSelected = sources.length > 0 && selectedCount === sources.length;

    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-surface">
            <table className="w-full border-collapse text-left text-sm">
                <thead>
                    <tr className="bg-surface-sunken text-eyebrow">
                        <th scope="col" className="w-12 py-3 pl-4">
                            <Checkbox
                                aria-label="Select all sources"
                                checked={allSelected}
                                indeterminate={
                                    selectedCount > 0 && !allSelected
                                }
                                onCheckedChange={(checked) =>
                                    onToggleAll(checked)
                                }
                            />
                        </th>
                        <th scope="col" className="py-3 pr-4 font-semibold">
                            Source
                        </th>
                        <th
                            scope="col"
                            className="hidden py-3 pr-4 font-semibold md:table-cell"
                        >
                            Type
                        </th>
                        <th
                            scope="col"
                            className="hidden py-3 pr-4 font-semibold md:table-cell"
                        >
                            Status
                        </th>
                        <th scope="col" className="w-28 py-3 pr-4 text-right font-semibold">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sources.map((source) => {
                        const isSelected = selectedIds.has(source.id);
                        const href = routes.workspace.source(
                            source.workspaceId,
                            source.id,
                        );
                        return (
                            <tr
                                key={source.id}
                                data-selected={isSelected || undefined}
                                className={cn(
                                    "border-t border-border transition-colors hover:bg-muted/60",
                                    isSelected && "bg-accent/40",
                                )}
                            >
                                <td className="py-3 pl-4 align-middle">
                                    <Checkbox
                                        aria-label={`Select ${source.title}`}
                                        checked={isSelected}
                                        onCheckedChange={(checked) =>
                                            onToggleOne(source.id, checked)
                                        }
                                    />
                                </td>
                                <td className="max-w-0 py-3 pr-4 align-middle">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <SourceTypeTile type={source.type} />
                                        <div className="min-w-0">
                                            <Link
                                                href={href}
                                                className="block truncate font-medium outline-none hover:underline focus-visible:underline"
                                            >
                                                {source.title}
                                            </Link>
                                            <p className="text-caption truncate">
                                                {describeSource(source)}
                                            </p>
                                            <SourceStatusBadge
                                                status={source.status}
                                                className="mt-1.5 md:hidden"
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="hidden py-3 pr-4 align-middle text-muted-foreground md:table-cell">
                                    {SOURCE_TYPE_LABELS[source.type]}
                                </td>
                                <td className="hidden py-3 pr-4 align-middle md:table-cell">
                                    <SourceStatusBadge status={source.status} />
                                </td>
                                <td className="py-3 pr-3 align-middle">
                                    <div className="flex items-center justify-end gap-1">
                                        {source.status === "FAILED" ? (
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() =>
                                                    onReprocess(source)
                                                }
                                            >
                                                <RefreshCwIcon aria-hidden="true" />
                                                <span className="sr-only">
                                                    Reprocess {source.title}
                                                </span>
                                            </Button>
                                        ) : (
                                            <Button
                                                nativeButton={false}
                                                variant="ghost"
                                                size="icon-sm"
                                                className="hidden sm:inline-flex"
                                                render={<Link href={href} />}
                                            >
                                                <ArrowUpRightIcon aria-hidden="true" />
                                                <span className="sr-only">
                                                    Open {source.title}
                                                </span>
                                            </Button>
                                        )}
                                        <SourceRowActions
                                            source={source}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                            onReprocess={
                                                source.status === "FAILED"
                                                    ? onReprocess
                                                    : undefined
                                            }
                                        />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
