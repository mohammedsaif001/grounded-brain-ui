import { Suspense } from "react";
import { LoginForm } from "@/features/auth";
import { redirectIfAuthenticated } from "@/features/auth/server";

export default async function LoginPage() {
    await redirectIfAuthenticated();

    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
