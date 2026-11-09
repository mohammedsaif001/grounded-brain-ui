"use client";

import Link from "next/link";
import {
    BookOpenTextIcon,
    BrainIcon,
    LogOutIcon,
    UserRoundIcon,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useSession } from "@/features/auth/lib/auth-client";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { UserAvatar } from "@/shared/components/user-avatar";
import { routes } from "@/shared/config/routes";
import { getInitials } from "../lib/profile";

type UserMenuProps = {
    /** Page-specific entries (e.g. notebook settings) shown above the account links. */
    children?: React.ReactNode;
};

/**
 * Everything account-related behind one avatar, so top bars stay uncluttered on a phone:
 * profile, memory, guide, theme and sign out.
 */
export function UserMenu({ children }: UserMenuProps) {
    const { data: session } = useSession();
    const { signOut, isSigningOut } = useSignOut();
    const user = session?.user;
    const initials = getInitials(user?.name ?? user?.email);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label="Account menu"
                className="shrink-0 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/40 aria-expanded:ring-3 aria-expanded:ring-ring/30"
            >
                <UserAvatar
                    name={user?.name}
                    image={user?.image}
                    initials={initials}
                    size="sm"
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-64">
                <div className="flex items-center gap-3 px-2 py-2">
                    <UserAvatar
                        name={user?.name}
                        image={user?.image}
                        initials={initials}
                        size="md"
                    />
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                            {user?.name ?? "Your account"}
                        </p>
                        {user?.email ? (
                            <p className="text-caption truncate">{user.email}</p>
                        ) : null}
                    </div>
                </div>
                <DropdownMenuSeparator />

                <DropdownMenuItem render={<Link href={routes.profile} />}>
                    <UserRoundIcon />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href={routes.memorySettings} />}>
                    <BrainIcon />
                    Memory
                </DropdownMenuItem>
                <DropdownMenuItem
                    render={<Link href={routes.docs} target="_blank" />}
                >
                    <BookOpenTextIcon />
                    Guide
                </DropdownMenuItem>
                {children}

                {/* The top bar hides the theme switch on phones, so it lives here too. */}
                <div className="flex items-center justify-between gap-3 px-2 py-1.5 text-sm sm:hidden">
                    Dark mode
                    <ModeToggle />
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                    variant="destructive"
                    disabled={isSigningOut}
                    onClick={() => void signOut()}
                >
                    <LogOutIcon />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
