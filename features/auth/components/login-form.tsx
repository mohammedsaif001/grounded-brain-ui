"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "../lib/auth-client";
import { GoogleIcon } from "@/shared/components/brand/google-icon";
import { safeRedirectPath } from "@/shared/config/routes";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const callbackUrl = safeRedirectPath(searchParams.get("callbackUrl"));

    async function handleGoogleSignIn() {
        setIsLoading(true);
        setError(null);

        const { data, error } = await signIn.social({
            provider: "google",
            callbackURL: callbackUrl,
        });

        if (error) {
            setError(error.message ?? "Something went wrong. Please try again.");
            setIsLoading(false);
            return;
        }

        if (data?.url && data.redirect) {
            window.location.href = data.url;
            return;
        }

        setIsLoading(false);
    }

    return (
        <div className={cn("w-full max-w-lg lg:justify-self-end", className)} {...props}>
            <Card className="rounded-3xl shadow-raised [--card-spacing:--spacing(8)] short:[--card-spacing:--spacing(6)]">
                <CardHeader className="gap-2">
                    <CardTitle className="text-title">
                        Welcome to your studio
                    </CardTitle>
                    <CardDescription className="text-body">
                        Continue with Google to get started. Your first notebook
                        takes under a minute.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 short:space-y-4">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            void handleGoogleSignIn();
                        }}
                        className="space-y-3"
                    >
                        <Button
                            type="submit"
                            variant="outline"
                            size="lg"
                            className="h-12 w-full text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner /> : <GoogleIcon />}
                            Continue with Google
                        </Button>
                        {error ? (
                            <p
                                role="alert"
                                className="text-center text-sm text-destructive"
                            >
                                {error}
                            </p>
                        ) : null}
                    </form>

                    <div className="space-y-4 border-t pt-5 short:space-y-2 short:pt-3">
                        <p className="text-caption">
                            By continuing, you agree to our Terms of service
                            and Privacy policy. Your notebooks stay private to
                            you.
                        </p>
                        <p className="text-caption flex items-center gap-2">
                            <ShieldCheckIcon
                                aria-hidden="true"
                                className="size-4"
                            />
                            Secure sign-in. No password to remember.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
