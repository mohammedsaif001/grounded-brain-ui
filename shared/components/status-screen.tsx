import type { ReactNode } from "react";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import {
    feedbackSurfaceClasses,
    feedbackTone,
    toneClasses,
    type Feedback,
} from "./tint";

type StatusScreenProps = {
    icon: ReactNode;
    title: string;
    description: ReactNode;
    actions?: ReactNode;
    /** Colours the screen as feedback: warning for maintenance, error for failures. */
    feedback?: Feedback;
};

/** Full-area message used by error, not-found and empty states. */
export function StatusScreen({
    icon,
    title,
    description,
    actions,
    feedback,
}: StatusScreenProps) {
    return (
        <div className="flex flex-1 items-center justify-center p-6">
            <Empty
                className={cn(
                    "max-w-md",
                    feedback && feedbackSurfaceClasses[feedback],
                )}
            >
                <EmptyHeader>
                    <EmptyMedia
                        variant="icon"
                        className={
                            feedback ? toneClasses[feedbackTone[feedback]] : undefined
                        }
                    >
                        {icon}
                    </EmptyMedia>
                    <EmptyTitle>{title}</EmptyTitle>
                    <EmptyDescription>{description}</EmptyDescription>
                </EmptyHeader>
                {actions ? <EmptyContent>{actions}</EmptyContent> : null}
            </Empty>
        </div>
    );
}
