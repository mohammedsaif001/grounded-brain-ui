import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirectIfAuthenticated } from "@/features/auth/server";
import { AppLogo } from "@/shared/components/brand/app-logo";
import { routes } from "@/shared/config/routes";
import { ArrowRightIcon } from "lucide-react";

export default async function HomePage() {
    await redirectIfAuthenticated();

    return (
        <div className="bg-page flex min-h-svh flex-col items-center justify-center gap-8 p-6">
            <AppLogo />
            <div className="flex max-w-lg flex-col items-center gap-4 text-center">
                <h1 className="text-display">Collect knowledge. Grow understanding.</h1>
                <p className="text-body text-muted-foreground">
                    Sign in to chat with your sources, grounded in citations.
                </p>
                <Button
                    size="lg"
                    nativeButton={false}
                    render={<Link href={routes.login} />}
                >
                    Get started
                    <ArrowRightIcon aria-hidden="true" />
                </Button>
            </div>
        </div>
    );
}
