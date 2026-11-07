import { ModeToggle } from "@/components/ui/mode-toggle";
import { AppLogo } from "@/shared/components/brand/app-logo";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-page flex min-h-svh flex-col">
            <header className="flex items-center justify-between px-6 py-5 short:py-3 md:px-14">
                <AppLogo />
                <ModeToggle />
            </header>

            <main className="flex flex-1 items-center px-6 py-8 short:py-3 md:px-14">
                {children}
            </main>

            <footer className="text-caption flex flex-wrap items-center justify-between gap-2 px-6 py-5 short:py-3 md:px-14">
                <span>© Grounded Brain</span>
                <span>Built for curiosity. Grounded in evidence.</span>
            </footer>
        </div>
    );
}
