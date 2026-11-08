"use client";

import { ArrowDownUpIcon } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
    WORKSPACE_SORT_OPTIONS,
    type WorkspaceSortKey,
} from "../lib/workspace-sort";

const ITEMS = Object.fromEntries(
    WORKSPACE_SORT_OPTIONS.map((option) => [option.key, option.label]),
);

type WorkspaceSortSelectProps = {
    value: WorkspaceSortKey;
    onChange: (value: WorkspaceSortKey) => void;
    className?: string;
};

export function WorkspaceSortSelect({
    value,
    onChange,
    className,
}: WorkspaceSortSelectProps) {
    return (
        <Select
            items={ITEMS}
            value={value}
            onValueChange={(next) => onChange(next as WorkspaceSortKey)}
        >
            <SelectTrigger
                aria-label="Sort notebooks"
                className={cn("min-w-40", className)}
            >
                <ArrowDownUpIcon
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                />
                <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="min-w-40">
                {WORKSPACE_SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
