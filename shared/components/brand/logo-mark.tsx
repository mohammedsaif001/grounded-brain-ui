import { cn } from "@/lib/utils";

type LogoMarkProps = {
    className?: string;
};

/**
 * The Grounded Brain mark: a neural constellation (nodes joined into a brain-like
 * shape, one bright core) with an AI spark. Keep in sync with `app/icon.svg`, which
 * is the same drawing with literal colours for the browser tab.
 */
export function LogoMark({ className }: LogoMarkProps) {
    return (
        <svg
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
            className={cn("size-9 shrink-0", className)}
        >
            <defs>
                <linearGradient
                    id="gb-mark-bg"
                    x1="4"
                    y1="2"
                    x2="36"
                    y2="38"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop style={{ stopColor: "color-mix(in oklab, var(--primary), white 45%)" }} />
                    <stop offset="1" style={{ stopColor: "color-mix(in oklab, var(--primary), black 14%)" }} />
                </linearGradient>
            </defs>
            <rect width="40" height="40" rx="11" fill="url(#gb-mark-bg)" />
            <g
                className="stroke-primary-foreground"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
            >
                <path d="M11 21 16 13 24 12 29 20 25 29 15 30 11 21Z" />
                <path d="M20 21 16 13M20 21 29 20M20 21 15 30M20 21 25 29M20 21 11 21M20 21 24 12" />
            </g>
            <g className="fill-primary-foreground">
                <circle cx="11" cy="21" r="2" />
                <circle cx="16" cy="13" r="2" />
                <circle cx="24" cy="12" r="2" />
                <circle cx="29" cy="20" r="2" />
                <circle cx="25" cy="29" r="2" />
                <circle cx="15" cy="30" r="2" />
                <circle cx="20" cy="21" r="3.6" />
            </g>
            <circle cx="20" cy="21" r="1.4" className="fill-primary" />
            {/* AI spark */}
            <path
                d="M32.5 4.5c.4 2.2 1.3 3.1 3.5 3.5-2.2.4-3.1 1.3-3.5 3.5-.4-2.2-1.3-3.1-3.5-3.5 2.2-.4 3.1-1.3 3.5-3.5Z"
                className="fill-primary-foreground"
            />
        </svg>
    );
}
