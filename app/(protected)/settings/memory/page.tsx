import type { Metadata } from "next";
import { MemorySettings } from "@/features/memory";

export const metadata: Metadata = {
    title: "Memory",
    description: "Review, add and remove what Grounded Brain remembers about you.",
};

export default function MemorySettingsPage() {
    return <MemorySettings />;
}
