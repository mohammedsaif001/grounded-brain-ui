import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { QuoteIcon } from "lucide-react";
import { LoginForm } from "@/features/auth";
import { GettingStarted } from "@/features/auth/components/getting-started";
import { redirectIfAuthenticated } from "@/features/auth/server";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
    await redirectIfAuthenticated();

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 short:gap-4">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <section className="space-y-6 short:space-y-4">
                <p className="text-eyebrow">A quieter space for big ideas</p>
                <h1 className="text-display text-foreground">
                    Collect knowledge. Grow understanding.
                </h1>
                <p className="text-body max-w-md text-muted-foreground">
                    Turn the things you read, watch and discover into insights
                    that stay with you. Always rooted in your sources.
                </p>

                <figure className="relative hidden h-[clamp(9rem,28svh,18rem)] max-w-xl overflow-hidden rounded-3xl shadow-raised md:block">
                    <Image
                        src="/images/login-hero.svg"
                        alt="A glass book with leaves growing from its pages"
                        fill
                        priority
                        sizes="(min-width: 1024px) 36rem, 100vw"
                        className="object-cover"
                    />
                    <figcaption className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-xl bg-card px-3.5 py-2 text-sm text-card-foreground shadow-surface">
                        <QuoteIcon aria-hidden="true" className="size-4" />
                        Every answer has a place to begin.
                    </figcaption>
                </figure>
            </section>

            <Suspense>
                <LoginForm />
            </Suspense>
        </div>
        <GettingStarted />
        </div>
    );
}
