import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandedPage } from "@/shared/components/branded-page";
import { routes } from "@/shared/config/routes";
import { StatusScreen } from "@/shared/components/status-screen";

export default function NotFound() {
    return (
        <BrandedPage>
            <StatusScreen
                icon={<SearchXIcon />}
                title="Page not found"
                description="This page doesn't exist, or you don't have access to it."
                actions={
                    <Button
                        nativeButton={false}
                        render={<Link href={routes.dashboard} />}
                    >
                        Back to dashboard
                    </Button>
                }
            />
        </BrandedPage>
    );
}
