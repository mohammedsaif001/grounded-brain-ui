import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { AppLogo } from "@/shared/components/brand/app-logo";
import { routes } from "@/shared/config/routes";

/** Same branded bar as the dashboard, so settings pages never feel detached from the app. */
export function ProfileHeader() {
    return (
        <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
                <AppLogo />

                <div className="flex items-center gap-1.5 sm:gap-2">
                    <Button
                        nativeButton={false}
                        variant="ghost"
                        size="sm"
                        className="hidden sm:inline-flex"
                        render={<Link href={routes.dashboard} />}
                    >
                        <ArrowLeftIcon aria-hidden="true" />
                        Dashboard
                    </Button>
                    <ModeToggle />
                    <SignOutButton />
                </div>
            </div>
        </header>
    );
}
