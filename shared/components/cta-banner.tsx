import Link from "next/link";
import { ArrowRightIcon, SparklesIcon, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CtaAction = {
    href: string;
    label: string;
    icon?: LucideIcon;
};

type CtaBannerProps = {
    /** Id for the heading, so the surrounding section can label itself with it. */
    headingId: string;
    eyebrow?: string;
    title: string;
    description?: string;
    primary: CtaAction;
    secondary?: CtaAction;
    className?: string;
};

/**
 * Closing call to action: solid brand green with dark text, so contrast is the same in
 * the light and dark themes (a tinted surface turns muddy against the dark page).
 */
export function CtaBanner({
    headingId,
    eyebrow = "Ready when you are",
    title,
    description,
    primary,
    secondary,
    className,
}: CtaBannerProps) {
    const PrimaryIcon = primary.icon;
    const SecondaryIcon = secondary?.icon;

    return (
        <div
            className={cn(
                "relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-primary to-[color-mix(in_oklab,var(--primary),black_14%)] px-6 py-10 text-primary-foreground shadow-overlay md:px-12 md:py-14",
                className,
            )}
        >
            <div
                aria-hidden="true"
                className="absolute -top-24 -right-16 -z-10 size-80 rounded-full border-[36px] border-primary-foreground/10"
            />
            <div
                aria-hidden="true"
                className="absolute -right-4 -bottom-28 -z-10 size-72 rounded-full bg-primary-foreground/10"
            />

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl space-y-3">
                    <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold">
                        <SparklesIcon aria-hidden="true" className="size-3.5" />
                        {eyebrow}
                    </p>
                    <h2 id={headingId} className="text-title text-balance">
                        {title}
                    </h2>
                    {description ? (
                        <p className="text-body text-lg opacity-85">
                            {description}
                        </p>
                    ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        size="lg"
                        nativeButton={false}
                        className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                        render={<Link href={primary.href} />}
                    >
                        {PrimaryIcon ? (
                            <PrimaryIcon aria-hidden="true" />
                        ) : null}
                        {primary.label}
                        <ArrowRightIcon aria-hidden="true" />
                    </Button>
                    {secondary ? (
                        <Button
                            size="lg"
                            variant="ghost"
                            nativeButton={false}
                            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                            render={<Link href={secondary.href} />}
                        >
                            {SecondaryIcon ? (
                                <SecondaryIcon aria-hidden="true" />
                            ) : null}
                            {secondary.label}
                        </Button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
