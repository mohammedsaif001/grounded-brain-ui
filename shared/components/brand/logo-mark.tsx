import { cn } from "@/lib/utils";

type LogoMarkProps = {
    className?: string;
};

/**
 * The Grounded Brain mark: two flowing brain hemispheres with glowing synapse nodes and
 * an AI spark, on a soft brand-green tile. Keep in sync with `app/icon.svg`, which is
 * the same drawing with literal colours for the browser tab.
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

            {/* Hemispheres */}
            <g
                className="stroke-primary-foreground"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path
                    className="fill-primary-foreground/10"
                    d="M20 10C16.5 7.8 11 9.2 10 13.8 7 14.8 6 19.2 8.5 21.6 7.5 25.2 10 28.8 14 28.8 15 30.8 18.5 31.3 20 29.8Z"
                />
                <path
                    className="fill-primary-foreground/10"
                    d="M20 10C23.5 7.8 29 9.2 30 13.8 33 14.8 34 19.2 31.5 21.6 32.5 25.2 30 28.8 26 28.8 25 30.8 21.5 31.3 20 29.8Z"
                />
            </g>

            {/* Folds */}
            <g
                className="stroke-primary-foreground"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.85"
            >
                <path d="M13.5 14.6C16 13.6 17.6 15.2 17.6 17.6" />
                <path d="M11.8 21.2C14.2 20.2 16.6 21.7 16.6 24.2" />
                <path d="M26.5 14.6C24 13.6 22.4 15.2 22.4 17.6" />
                <path d="M28.2 21.2C25.8 20.2 23.4 21.7 23.4 24.2" />
            </g>

            {/* Synapse nodes */}
            <g className="fill-primary-foreground">
                <circle cx="17.6" cy="17.6" r="1.5" />
                <circle cx="16.6" cy="24.2" r="1.5" />
                <circle cx="22.4" cy="17.6" r="1.5" />
                <circle cx="23.4" cy="24.2" r="1.5" />
            </g>

            {/* AI spark */}
            <path
                d="M33 3.2c.45 2.4 1.4 3.35 3.8 3.8-2.4.45-3.35 1.4-3.8 3.8-.45-2.4-1.4-3.35-3.8-3.8 2.4-.45 3.35-1.4 3.8-3.8Z"
                className="fill-primary-foreground"
            />
        </svg>
    );
}
