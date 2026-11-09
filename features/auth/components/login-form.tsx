"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    LibraryBigIcon,
    QuoteIcon,
    ShieldCheckIcon,
    SparklesIcon,
} from "lucide-react";
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
import { TypeTile } from "@/shared/components/type-tile";
import { safeRedirectPath } from "@/shared/config/routes";

const HIGHLIGHTS = [
    { icon: LibraryBigIcon, tone: "green", label: "All your sources in one place" },
    { icon: QuoteIcon, tone: "violet", label: "Answers you can trace and trust" },
    { icon: SparklesIcon, tone: "amber", label: "Study material made for your mind" },
] as const;

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
                            className="w-full"
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

                    <ul className="space-y-3 short:space-y-2">
                        {HIGHLIGHTS.map(({ icon, tone, label }) => (
                            <li
                                key={label}
                                className="flex items-center gap-3 text-sm font-medium"
                            >
                                <TypeTile icon={icon} tone={tone} size="sm" />
                                {label}
                            </li>
                        ))}
                    </ul>

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
