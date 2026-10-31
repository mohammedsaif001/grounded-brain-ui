import { requireSession } from "@/features/auth/server";
import { DashboardHome } from "@/features/workspaces/components/dashboard-home";

export default async function DashboardPage() {
    const session = await requireSession();

    return <DashboardHome userName={session.user.name} />;
}
