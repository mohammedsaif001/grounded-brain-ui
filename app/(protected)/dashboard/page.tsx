import { requireSession } from "@/features/auth/server";
import { DashboardHome } from "@/features/workspaces";

export default async function DashboardPage() {
    // Cached: shares the request made by the protected layout.
    const session = await requireSession();

    return <DashboardHome userName={session.user.name} />;
}
