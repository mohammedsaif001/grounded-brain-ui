import { BookOpenTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { AppLogo } from "@/shared/components/brand/app-logo";
import Link from "next/link";
import { routes } from "@/shared/config/routes";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-page flex min-h-svh flex-col">
            <header className="flex items-center justify-between gap-3 px-4 py-4 short:py-3 sm:px-6 sm:py-5 md:px-14">
                <AppLogo />
                <div className="flex items-center gap-2">
                    <Button
                        nativeButton={false}
                        variant="ghost"
                        size="sm"
                        render={<Link href={routes.docs} />}
                    >
                        <BookOpenTextIcon aria-hidden="true" />
                        <span className="max-sm:sr-only">How it works</span>
                    </Button>
                    <ModeToggle />
                </div>
            </header>

            <main className="flex flex-1 items-center px-4 py-6 sm:px-6 sm:py-8 short:py-3 md:px-14">
                {children}
            </main>

            <footer className="text-caption flex flex-wrap items-center justify-between gap-2 px-6 py-5 short:py-3 md:px-14">
                <span className="flex items-center gap-3">
                    <span>© Grounded Brain</span>
                    <Link
                        href={routes.docs}
                        className="underline-offset-4 hover:underline focus-visible:underline"
                    >
                        How it works
                    </Link>
                </span>
                <span>Built for curiosity. Grounded in evidence.</span>
            </footer>
        </div>
    );
}
