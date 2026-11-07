"use client";

import { useMemo, type ComponentProps } from "react";
import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";

type StreamdownContentProps = {
    content: string;
    mode?: "static" | "streaming";
    isAnimating?: boolean;
    className?: string;
    /** Custom tags to allow (e.g. `{ cite: ["index"] }`) and the components that render them. */
    allowedTags?: Record<string, string[]>;
    literalTagContent?: string[];
    components?: ComponentProps<typeof Streamdown>["components"];
};

export function StreamdownContent({
    content,
    mode = "static",
    isAnimating = false,
    className,
    allowedTags,
    literalTagContent,
    components,
}: StreamdownContentProps) {
    const plugins = useMemo(() => ({ code }), []);

    return (
        <Streamdown
            mode={mode}
            isAnimating={isAnimating}
            plugins={plugins}
            className={className}
            allowedTags={allowedTags}
            literalTagContent={literalTagContent}
            components={components}
        >
            {content}
        </Streamdown>
    );
}
