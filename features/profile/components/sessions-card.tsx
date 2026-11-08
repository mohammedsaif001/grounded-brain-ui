"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { LaptopIcon, LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { LoadError } from "@/shared/components/load-error";
import {
    useRevokeOtherSessions,
    useRevokeSession,
    useSessions,
} from "../hooks/use-profile";
import { describeUserAgent } from "../lib/profile";

type SessionsCardProps = {
    currentSessionToken: string;
    className?: string;
};

/** Where the account is signed in, with a way to cut off a device you no longer trust. */
export function SessionsCard({
    currentSessionToken,
    className,
}: SessionsCardProps) {
    const { data: sessions, isLoading, error, refetch } = useSessions();
    const revokeSession = useRevokeSession();
    const revokeOthers = useRevokeOtherSessions();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const others =
        sessions?.filter((session) => session.token !== currentSessionToken) ??
        [];
    const ordered = sessions
        ? [
              ...sessions.filter(
                  (session) => session.token === currentSessionToken,
              ),
              ...others,
          ]
        : [];

    return (
        <section
            aria-labelledby="sessions-title"
            className={cn("flex min-h-0 flex-col gap-4", className)}
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-eyebrow">Security</p>
                    <h2 id="sessions-title" className="text-heading">
                        Where you&apos;re signed in
                    </h2>
                </div>
                {others.length > 0 ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmOpen(true)}
                    >
                        <LogOutIcon aria-hidden="true" />
                        Sign out other devices
                    </Button>
                ) : null}
            </div>
            {isLoading ? (
                <div aria-busy="true" className="space-y-2">
                    <Skeleton className="h-14 rounded-xl" />
                    <Skeleton className="h-14 rounded-xl" />
                </div>
            ) : error || !sessions ? (
                <LoadError
                    error={error}
                    icon={LaptopIcon}
                    title="Could not load your sessions"
                    className="py-8"
                >
                    <Button variant="outline" onClick={() => void refetch()}>
                        Try again
                    </Button>
                </LoadError>
            ) : (
                <ul className="min-h-0 flex-1 divide-y divide-border overflow-y-auto">
                    {ordered.map((session) => {
                        const isCurrent = session.token === currentSessionToken;
                        const isRevoking =
                            revokeSession.isPending &&
                            revokeSession.variables === session.token;

                        return (
                            <li
                                key={session.id}
                                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                            >
                                <span
                                    aria-hidden="true"
                                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-tint-blue text-tint-blue-foreground"
                                >
                                    <LaptopIcon className="size-5" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        {describeUserAgent(session.userAgent)}
                                    </p>
                                    <p className="text-caption">
                                        {session.ipAddress
                                            ? `${session.ipAddress} · `
                                            : ""}
                                        Signed in{" "}
                                        {formatDistanceToNow(
                                            new Date(session.createdAt),
                                            { addSuffix: true },
                                        )}
                                    </p>
                                </div>
                                {isCurrent ? (
                                    <Badge variant="green" className="shrink-0">
                                        This device
                                    </Badge>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={isRevoking}
                                        onClick={() =>
                                            revokeSession.mutate(session.token, {
                                                onSuccess: () =>
                                                    toast.add({
                                                        type: "success",
                                                        title: "Device signed out",
                                                    }),
                                            })
                                        }
                                    >
                                        Sign out
                                    </Button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            <ConfirmDialog
                open={confirmOpen}
                title="Sign out other devices?"
                description={`This signs ${others.length} other ${others.length === 1 ? "device" : "devices"} out of your account. You stay signed in here.`}
                confirmLabel="Sign them out"
                isPending={revokeOthers.isPending}
                onConfirm={() =>
                    revokeOthers.mutate(undefined, {
                        onSuccess: () => {
                            setConfirmOpen(false);
                            toast.add({
                                type: "success",
                                title: "Other devices signed out",
                            });
                        },
                    })
                }
                onCancel={() => setConfirmOpen(false)}
            />
        </section>
    );
}
