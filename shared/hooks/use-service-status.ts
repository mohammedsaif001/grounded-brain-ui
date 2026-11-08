"use client";

import { useEffect, useState } from "react";
import type { ServiceStatus } from "@/shared/lib/service-status";

/**
 * Asks `/status` once whether the backend is reachable. Used by error screens to tell
 * an outage ("under maintenance") from a bug. `null` while the probe is in flight, and
 * stays `null` if the probe itself cannot run, so callers fall back to the generic error.
 */
export function useServiceStatus(): ServiceStatus | null {
    const [status, setStatus] = useState<ServiceStatus | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        fetch("/status", { cache: "no-store", signal: controller.signal })
            .then((response) => (response.ok ? response.json() : null))
            .then((body: ServiceStatus | null) => setStatus(body))
            .catch(() => setStatus(null));

        return () => controller.abort();
    }, []);

    return status;
}
