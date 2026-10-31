import { LearnHub } from "@/features/learn";

export default async function LearnPage({
    params,
}: PageProps<"/workspace/[id]/learn">) {
    const { id } = await params;

    return <LearnHub workspaceId={id} />;
}
