import type { Metadata } from "next";
import { LearnHub } from "@/features/learn";

export const metadata: Metadata = {
    title: "Learn",
    description:
        "Generate flashcards, quizzes, summaries and mind maps from your sources.",
};

export default async function LearnPage({
    params,
}: PageProps<"/workspace/[id]/learn">) {
    const { id } = await params;

    return <LearnHub workspaceId={id} />;
}
