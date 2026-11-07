"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
    LayoutDashboardIcon,
    RefreshCwIcon,
    TriangleAlertIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/shared/config/routes";
import { StatusScreen } from "./status-screen";

type RouteErrorProps = {
    error: Error & { digest?: string };
    retry: () => void;
};

/**
 * Body of the app's error boundaries. Server error messages are replaced by Next.js
 * in production, so only the digest is shown as a reference for support/logs.
 */
export function RouteError({ error, retry }: RouteErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <StatusScreen
            icon={<TriangleAlertIcon />}
            title="Something went wrong"
            description={
                <>
                    We couldn&apos;t load this page. Try again in a moment.
                    {error.digest ? (
                        <span className="mt-2 block font-mono text-xs">
                            Reference: {error.digest}
                        </span>
                    ) : null}
                </>
            }
            actions={
                <div className="flex gap-2">
                    <Button onClick={retry}>
                        <RefreshCwIcon aria-hidden="true" />
                        Try again
                    </Button>
                    <Button
                        variant="outline"
                        nativeButton={false}
                        render={<Link href={routes.dashboard} />}
                    >
                        <LayoutDashboardIcon aria-hidden="true" />
                        Go to dashboard
                    </Button>
                </div>
            }
        />
    );
}
