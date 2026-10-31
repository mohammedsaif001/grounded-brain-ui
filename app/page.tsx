import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirectIfAuthenticated } from "@/features/auth/server";
import { routes } from "@/shared/config/routes";

export default async function HomePage() {
    await redirectIfAuthenticated();

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6">
            <div className="flex max-w-lg flex-col items-center gap-4 text-center">
                <h1 className="font-heading text-3xl font-semibold tracking-tight">
                    Chaibook
                </h1>
                <p className="text-muted-foreground">
                    Sign in to start chatting with your books.
                </p>
                <Button nativeButton={false} render={<Link href={routes.login} />}>
                    Get started
                </Button>
            </div>
        </div>
    );
}
