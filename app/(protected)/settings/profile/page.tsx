import type { Metadata } from "next";
import { requireSession } from "@/features/auth/server";
import { ProfileSettings } from "@/features/profile";

export const metadata: Metadata = {
    title: "Profile",
    description: "Edit your name and profile picture, and manage signed-in devices.",
};

export default async function ProfilePage() {
    // Cached: shares the request made by the protected layout.
    const { user, session } = await requireSession();

    return (
        <ProfileSettings
            initialUser={{
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
                image: user.image ?? null,
                createdAt: new Date(user.createdAt).toISOString(),
            }}
            currentSessionToken={session.token}
        />
    );
}
