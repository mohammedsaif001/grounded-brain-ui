"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { routes } from "@/shared/config/routes";
import { signOut } from "../lib/auth-client";

/** Signs out, wipes the query cache and returns to the login page. */
export function useSignOut() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isSigningOut, setIsSigningOut] = useState(false);

    async function handleSignOut() {
        setIsSigningOut(true);

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

        setIsSigningOut(false);
    }

    return { signOut: handleSignOut, isSigningOut };
}
