"use client";

import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSignOut } from "../hooks/use-sign-out";

export function SignOutButton() {
    const { signOut, isSigningOut } = useSignOut();

    return (
        <Button
            variant="outline"
            onClick={() => void signOut()}
            disabled={isSigningOut}
        >
            {isSigningOut ? <Spinner /> : <LogOutIcon aria-hidden="true" />}
            Sign out
        </Button>
    );
}
