"use client";

import Link from "next/link";
import { useSession } from "@/features/auth/lib/auth-client";
import { UserAvatar } from "@/shared/components/user-avatar";
import { routes } from "@/shared/config/routes";
import { getInitials } from "../lib/profile";

/** The signed-in user's avatar in the top bars; opens the profile page. */
export function ProfileLink() {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <Link
            href={routes.profile}
            className="shrink-0 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        >
            <UserAvatar
                name={user?.name}
                image={user?.image}
                initials={getInitials(user?.name ?? user?.email)}
                size="sm"
            />
            <span className="sr-only">
                {user?.name ? `${user.name}: your profile` : "Your profile"}
            </span>
        </Link>
    );
}
