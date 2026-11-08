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
            className="mx-auto max-w-4xl scroll-mt-20 px-4 py-12 md:px-8 md:py-16"
        >
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-surface">
                <div className="px-6 py-10 text-center md:px-12 md:py-14">
                    <div className="relative mx-auto size-32 overflow-hidden rounded-full border-4 border-card bg-tint-green shadow-raised md:size-40">
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
                                className="flex size-full items-center justify-center text-3xl font-semibold text-tint-green-foreground"
                            >
                                {initials}
                            </span>
                        )}
                    </div>

                    <p className="text-eyebrow mt-5">Built by</p>
                    <h2 id="creator-heading" className="text-title mt-1">
                        {creator.name}
                    </h2>
                    {creator.jobTitle ? (
                        <p className="mt-2 inline-flex rounded-full bg-tint-green px-3 py-1 text-xs font-semibold text-tint-green-foreground">
                            {creator.jobTitle}
                        </p>
                    ) : null}

                    <p className="text-body mx-auto mt-5 max-w-2xl font-medium text-balance">
                        {creator.bio}
                    </p>
                    <ul className="mt-4 flex flex-wrap justify-center gap-2">
                        {creator.skills.map((skill) => (
                            <li
                                key={skill}
                                className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold"
                            >
                                {skill}
                            </li>
                        ))}
                    </ul>
                    <div className="mx-auto mt-5 max-w-2xl space-y-3">
                        {creator.story.map((paragraph) => (
                            <p
                                key={paragraph}
                                className="text-body text-muted-foreground text-pretty"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <div className="mx-auto mt-8 max-w-2xl border-t border-border pt-8">
                        <h3 className="text-heading">
                            Would love to hear from you
                        </h3>
                        <p className="text-body mt-1 text-muted-foreground">
                            Have a question, an idea or just want to say hi?
                            Let&apos;s connect.
                        </p>

                        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                            {creator.email ? (
                                <Button
                                    nativeButton={false}
                                    render={<a href={`mailto:${creator.email}`} />}
                                >
                                    <MailIcon aria-hidden="true" />
                                    {creator.email}
                                </Button>
                            ) : null}
                            {links.map((link) => {
                                const Icon = getSocialIcon(link.label);
                                return (
                                    <Button
                                        key={link.label}
                                        nativeButton={false}
                                        variant="outline"
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
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
