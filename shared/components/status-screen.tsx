import type { ReactNode } from "react";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";

type StatusScreenProps = {
    icon: ReactNode;
    title: string;
    description: ReactNode;
    actions?: ReactNode;
};

/** Full-area message used by error, not-found and empty states. */
export function StatusScreen({
    icon,
    title,
    description,
    actions,
}: StatusScreenProps) {
    return (
        <div className="flex flex-1 items-center justify-center p-6">
            <Empty className="max-w-md">
                <EmptyHeader>
                    <EmptyMedia variant="icon">{icon}</EmptyMedia>
                    <EmptyTitle>{title}</EmptyTitle>
                    <EmptyDescription>{description}</EmptyDescription>
                </EmptyHeader>
                {actions ? <EmptyContent>{actions}</EmptyContent> : null}
            </Empty>
        </div>
    );
}
