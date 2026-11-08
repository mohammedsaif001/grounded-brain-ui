import type { Metadata } from "next";
import { requireSession } from "@/features/auth/server";
import { DashboardHome } from "@/features/workspaces";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Your Grounded Brain notebooks, sources and study guides.",
};

export default async function DashboardPage() {
    // Cached: shares the request made by the protected layout.
    const session = await requireSession();

    return <DashboardHome userName={session.user.name} />;
}
