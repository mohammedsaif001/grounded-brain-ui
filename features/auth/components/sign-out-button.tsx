"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { signOut } from "../lib/auth-client";
import { routes } from "@/shared/config/routes";
import { LogOutIcon } from "lucide-react";

export function SignOutButton() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    async function handleSignOut() {
        setIsLoading(true);

        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    // Drop every cached query so the next user on this device never sees this one's data.
                    queryClient.clear();
                    router.replace(routes.login);
                    router.refresh();
                },
            },
        });

        setIsLoading(false);
    }

    return (
        <Button
            variant="outline"
            onClick={() => void handleSignOut()}
            disabled={isLoading}
        >
            {isLoading ? <Spinner /> : <LogOutIcon aria-hidden="true" />}
            Sign out
        </Button>
    );
}
