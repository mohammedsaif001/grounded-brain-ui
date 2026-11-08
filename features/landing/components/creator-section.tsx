import Image from "next/image";
import { MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSocialIcon } from "@/shared/components/brand/social-icons";
import { creator, getCreatorLinks } from "../lib/creator";

export function CreatorSection() {
    const links = getCreatorLinks();
    const initials = creator.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2);

    return (
        <section
            id="creator"
            aria-labelledby="creator-heading"
            className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 md:px-8 md:py-16"
        >
            <div className="mx-auto max-w-2xl space-y-3 text-center">
                <p className="text-eyebrow">About the developer</p>
                <h2 id="creator-heading" className="text-title">
                    The developer behind Grounded Brain
                </h2>
                <p className="text-body text-muted-foreground">{creator.bio}</p>
            </div>

            <div className="mt-10 grid overflow-hidden rounded-3xl border border-border bg-card shadow-surface md:grid-cols-[18rem_1fr]">
                <div className="flex flex-col items-center gap-4 bg-tint-green/40 p-6 text-center md:p-8">
                    <div className="relative size-40 overflow-hidden rounded-3xl border border-border bg-tint-green shadow-raised">
                        {creator.image ? (
                            <Image
                                src={creator.image}
                                alt={`Portrait of ${creator.name}, creator of Grounded Brain`}
                                fill
                                sizes="10rem"
                                quality={100}
                                className="object-cover"
                            />
                        ) : (
                            <span
                                aria-hidden="true"
                                className="flex size-full items-center justify-center text-4xl font-semibold text-tint-green-foreground"
                            >
                                {initials}
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-heading">{creator.name}</h3>
                        {creator.jobTitle ? (
                            <p className="inline-flex rounded-full bg-tint-green px-3 py-1 text-xs font-semibold text-tint-green-foreground">
                                {creator.jobTitle}
                            </p>
                        ) : null}
                    </div>

                    <ul className="flex w-full flex-col gap-2">
                        {links.map((link) => {
                            const Icon = getSocialIcon(link.label);
                            return (
                                <li key={link.label}>
                                    <Button
                                        nativeButton={false}
                                        variant="outline"
                                        className="w-full"
                                        render={
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="me noopener noreferrer"
                                            />
                                        }
                                    >
                                        <Icon aria-hidden="true" />
                                        {link.label}
                                    </Button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="flex flex-col justify-between gap-8 p-6 md:p-10">
                    <div className="space-y-4">
                        <p className="text-eyebrow">The story</p>
                        {creator.story.map((paragraph) => (
                            <p
                                key={paragraph}
                                className="text-body text-muted-foreground text-pretty"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <div className="space-y-3 border-t border-border pt-6">
                        <h3 className="text-heading">
                            Would love to hear from you
                        </h3>
                        <p className="text-body text-muted-foreground">
                            Have a question, an idea or just want to say hi?
                            Let&apos;s connect.
                        </p>
                        {creator.email ? (
                            <Button
                                nativeButton={false}
                                render={<a href={`mailto:${creator.email}`} />}
                            >
                                <MailIcon aria-hidden="true" />
                                {creator.email}
                            </Button>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}
