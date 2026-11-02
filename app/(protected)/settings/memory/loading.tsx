import { ListPageSkeleton } from "@/shared/components/page-skeletons";

export default function MemorySettingsLoading() {
    return <ListPageSkeleton rows={4} className="mx-auto w-full max-w-3xl" />;
}
