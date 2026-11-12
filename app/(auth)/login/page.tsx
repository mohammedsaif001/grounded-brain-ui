import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { QuoteIcon } from "lucide-react";
import { LoginForm } from "@/features/auth";
import { redirectIfAuthenticated } from "@/features/auth/server";

export const metadata: Metadata = {
    title: "Sign in",
    description:
        "Sign in to Grounded Brain with Google to open your private notebooks and chat with your sources.",
    alternates: { canonical: "/login" },
    robots: { index: false, follow: true },
};

export default async function LoginPage() {
    await redirectIfAuthenticated();

    return (
        <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <section className="space-y-6 short:space-y-4">
                <h1 className="text-headline text-foreground">
                    Collect knowledge. Grow understanding.
                </h1>

                <figure className="relative hidden h-[clamp(11rem,38svh,22rem)] max-w-xl overflow-hidden rounded-3xl shadow-raised md:block">
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
    );
}
