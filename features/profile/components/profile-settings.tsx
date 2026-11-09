"use client";

import { useRef, useState } from "react";
import { format } from "date-fns";
import {
    CameraIcon,
    CheckIcon,
    LockIcon,
    MailIcon,
    Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useSession } from "@/features/auth/lib/auth-client";
import { GoogleIcon } from "@/shared/components/brand/google-icon";
import { PageHeader } from "@/shared/components/page-header";
import { UserAvatar } from "@/shared/components/user-avatar";
import { getErrorMessage } from "@/shared/lib/errors";
import { useLinkedAccounts, useUpdateProfile } from "../hooks/use-profile";
import { imageFileToAvatar } from "../lib/image";
import {
    describeProvider,
    getInitials,
    NAME_MAX_LENGTH,
} from "../lib/profile";
import { ProfileHeader } from "./profile-header";
import { SessionsCard } from "./sessions-card";

export type ProfileUser = {
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
};

type ProfileSettingsProps = {
    /** From the server session, so the page renders complete before the client session loads. */
    initialUser: ProfileUser;
    /** The current session's token, to mark "this device" in the session list. */
    currentSessionToken: string;
};

/** A sign-in method with its logo when we have one. */
function ProviderChip({ providerId }: { providerId: string }) {
    return (
        <span className="inline-flex h-7 items-center gap-2 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground">
            {providerId === "google" ? (
                <GoogleIcon />
            ) : providerId === "credential" ? (
                <MailIcon aria-hidden="true" className="size-4" />
            ) : null}
            {describeProvider(providerId)}
        </span>
    );
}

export function ProfileSettings({
    initialUser,
    currentSessionToken,
}: ProfileSettingsProps) {
    const { data: session } = useSession();
    // The live session wins once it loads, so a save is reflected without a reload.
    const live = session?.user;
    const user: ProfileUser = {
        name: live?.name ?? initialUser.name,
        email: live?.email ?? initialUser.email,
        emailVerified: live?.emailVerified ?? initialUser.emailVerified,
        image: live ? (live.image ?? null) : initialUser.image,
        createdAt: live
            ? new Date(live.createdAt).toISOString()
            : initialUser.createdAt,
    };

    const updateProfile = useUpdateProfile({ suppressErrorToast: true });
    const { data: accounts } = useLinkedAccounts();
    const fileInput = useRef<HTMLInputElement>(null);
    const [name, setName] = useState(initialUser.name);
    const [avatarError, setAvatarError] = useState<string | null>(null);
    const [nameError, setNameError] = useState<string | null>(null);
    const [isReadingImage, setIsReadingImage] = useState(false);

    const trimmedName = name.trim();
    const canSaveName = trimmedName.length > 0 && trimmedName !== user.name;
    const initials = getInitials(user.name, getInitials(user.email));
    const isBusy = updateProfile.isPending || isReadingImage;

    async function handleSaveName(event: React.FormEvent) {
        event.preventDefault();
        if (!canSaveName) {
            return;
        }
        setNameError(null);

        try {
            await updateProfile.mutateAsync({ name: trimmedName });
        } catch (error) {
            setNameError(getErrorMessage(error));
            return;
        }
        toast.add({ type: "success", title: "Name updated" });
    }

    async function handlePickImage(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        // Allow picking the same file again after removing it.
        event.target.value = "";
        if (!file) {
            return;
        }
        setAvatarError(null);
        setIsReadingImage(true);

        try {
            const image = await imageFileToAvatar(file);
            await updateProfile.mutateAsync({ image });
            toast.add({ type: "success", title: "Profile picture updated" });
        } catch (error) {
            setAvatarError(getErrorMessage(error));
        } finally {
            setIsReadingImage(false);
        }
    }

    async function handleRemoveImage() {
        setAvatarError(null);
        try {
            await updateProfile.mutateAsync({ image: null });
            toast.add({ type: "success", title: "Profile picture removed" });
        } catch (error) {
            setAvatarError(getErrorMessage(error));
        }
    }

    return (
        // From md up the page is exactly one screen: only the device list scrolls, inside its card.
        <div className="bg-page flex min-h-svh flex-col md:h-svh md:overflow-hidden">
            <ProfileHeader />

            <main className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-5 md:px-8 md:py-6">
                <PageHeader eyebrow="Settings" title="Your profile" />

                <div className="grid min-h-0 flex-1 overflow-hidden rounded-3xl border border-border bg-card shadow-surface md:grid-cols-[18rem_1fr] md:grid-rows-[minmax(0,1fr)]">
                    <aside className="flex min-h-0 flex-col items-center gap-4 overflow-y-auto bg-tint-green/40 p-5 text-center md:p-6">
                        <UserAvatar
                            name={user.name}
                            image={user.image}
                            initials={initials}
                            size="2xl"
                            shape="rounded"
                            className="short:size-28 short:text-4xl"
                        />

                        <div className="space-y-2">
                            <h2 className="text-heading wrap-break-word">
                                {user.name}
                            </h2>
                            {user.emailVerified ? (
                                <p className="inline-flex items-center gap-1 rounded-full bg-tint-green px-3 py-1 text-xs font-semibold text-tint-green-foreground">
                                    <CheckIcon
                                        aria-hidden="true"
                                        className="size-3"
                                    />
                                    Verified
                                </p>
                            ) : null}
                        </div>

                        <div className="flex w-full flex-col gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                disabled={isBusy}
                                onClick={() => fileInput.current?.click()}
                            >
                                {isReadingImage ? (
                                    <Spinner />
                                ) : (
                                    <CameraIcon aria-hidden="true" />
                                )}
                                {user.image ? "Change photo" : "Upload photo"}
                            </Button>
                            {user.image ? (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full"
                                    disabled={isBusy}
                                    onClick={() => void handleRemoveImage()}
                                >
                                    <Trash2Icon aria-hidden="true" />
                                    Remove photo
                                </Button>
                            ) : null}
                            {avatarError ? (
                                <p
                                    role="alert"
                                    className="text-caption text-destructive"
                                >
                                    {avatarError}
                                </p>
                            ) : (
                                <p className="text-caption">
                                    PNG, JPEG, WebP or GIF, cropped to a square.
                                </p>
                            )}
                            <input
                                ref={fileInput}
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/gif"
                                className="sr-only"
                                tabIndex={-1}
                                aria-label="Choose a profile picture"
                                onChange={(event) => void handlePickImage(event)}
                            />
                        </div>

                        <dl className="w-full space-y-3 border-t border-border pt-4 text-left text-sm">
                            <div className="space-y-1">
                                <dt className="text-eyebrow">Member since</dt>
                                <dd>
                                    {format(new Date(user.createdAt), "d MMMM yyyy")}
                                </dd>
                            </div>
                            <div className="space-y-1.5">
                                <dt className="text-eyebrow">Signs in with</dt>
                                <dd className="flex flex-wrap gap-1.5">
                                    {accounts && accounts.length > 0 ? (
                                        accounts.map((account) => (
                                            <ProviderChip
                                                key={account.id}
                                                providerId={account.providerId}
                                            />
                                        ))
                                    ) : (
                                        <span className="text-muted-foreground">
                                            &mdash;
                                        </span>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </aside>

                    <div className="flex min-h-0 flex-col gap-6 p-6 md:p-8">
                        <form
                            onSubmit={(event) => void handleSaveName(event)}
                            className="shrink-0 space-y-4"
                        >
                            <div className="space-y-1">
                                <p className="text-eyebrow">Details</p>
                                <h2 className="text-heading">Your details</h2>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="profile-name">Name</Label>
                                <Input
                                    id="profile-name"
                                    value={name}
                                    maxLength={NAME_MAX_LENGTH}
                                    autoComplete="name"
                                    aria-invalid={nameError ? true : undefined}
                                    onChange={(event) => setName(event.target.value)}
                                    required
                                />
                                {nameError ? (
                                    <p
                                        role="alert"
                                        className="text-caption text-destructive"
                                    >
                                        {nameError}
                                    </p>
                                ) : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="profile-email">Email</Label>
                                {/* Disabled inputs ignore the pointer, so the wrapper shows the cursor. */}
                                <div className="relative cursor-not-allowed">
                                    <Input
                                        id="profile-email"
                                        value={user.email}
                                        disabled
                                        aria-describedby="profile-email-hint"
                                        className="bg-muted pr-10 text-muted-foreground"
                                    />
                                    <LockIcon
                                        aria-hidden="true"
                                        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                                    />
                                </div>
                                <p
                                    id="profile-email-hint"
                                    className="text-caption"
                                >
                                    Your email is your sign-in identity, so it
                                    can&apos;t be changed here.
                                </p>
                            </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={!canSaveName || updateProfile.isPending}
                            >
                                {updateProfile.isPending && !isReadingImage ? (
                                    <Spinner />
                                ) : (
                                    <CheckIcon aria-hidden="true" />
                                )}
                                Save changes
                            </Button>
                        </form>

                        <SessionsCard
                            currentSessionToken={currentSessionToken}
                            className="min-h-0 flex-1 border-t border-border pt-6"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
