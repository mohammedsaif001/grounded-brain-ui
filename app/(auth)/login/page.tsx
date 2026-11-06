import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { QuoteIcon } from "lucide-react";
import { LoginForm } from "@/features/auth";
import { redirectIfAuthenticated } from "@/features/auth/server";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
    await redirectIfAuthenticated();

    return (
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <section className="space-y-6">
                <p className="text-eyebrow">A quieter space for big ideas</p>
                <h1 className="text-display text-foreground">
                    Collect knowledge. Grow understanding.
                </h1>
                <p className="text-body max-w-md text-muted-foreground">
                    Turn the things you read, watch and discover into insights
                    that stay with you. Always rooted in your sources.
                </p>

                <figure className="relative hidden aspect-[2/1] max-w-xl overflow-hidden rounded-3xl shadow-raised md:block">
                    <Image
                        src="/images/login-hero.jpg"
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
    );
}
