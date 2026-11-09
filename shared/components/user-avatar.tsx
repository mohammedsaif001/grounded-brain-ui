import { cn } from "@/lib/utils";

type UserAvatarProps = {
    name: string | null | undefined;
    image?: string | null;
    initials: string;
    size?: "sm" | "md" | "xl" | "2xl";
    /** `rounded` matches the square portrait on the landing page. */
    shape?: "circle" | "rounded";
    className?: string;
};

const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    xl: "size-24 text-3xl",
    "2xl": "size-40 text-5xl",
} as const;

/** The user's picture, or their initials on a tinted tile when they have none. */
export function UserAvatar({
    name,
    image,
    initials,
    size = "md",
    shape = "circle",
    className,
}: UserAvatarProps) {
    return (
        <span
            className={cn(
                "inline-flex shrink-0 items-center justify-center overflow-hidden bg-tint-green font-semibold text-tint-green-foreground select-none",
                shape === "circle" ? "rounded-full" : "rounded-3xl border border-border shadow-raised",
                sizeClasses[size],
                className,
            )}
        >
            {image ? (
                // Data URLs and Google-hosted pictures: next/image has nothing to optimise.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={image}
                    alt={name ? `${name}'s profile picture` : "Profile picture"}
                    referrerPolicy="no-referrer"
                    className="size-full object-cover"
                />
            ) : (
                <span aria-hidden="true">{initials}</span>
            )}
        </span>
    );
}
