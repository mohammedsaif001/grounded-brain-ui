import { requireSession } from "@/features/auth/server";
import { MemorySettings } from "@/features/memory";

export default async function MemorySettingsPage() {
    await requireSession();

    return <MemorySettings />;
}
