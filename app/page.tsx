import { LandingPage } from "@/features/landing/components/landing-page";
import { redirectIfAuthenticated } from "@/features/auth/server";

export default async function HomePage() {
    await redirectIfAuthenticated();

    return <LandingPage />;
}
