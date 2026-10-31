import { requireSession } from "@/features/auth/server";

/**
 * Gate for every signed-in route. The proxy has already done an optimistic cookie
 * check; this verifies the session against the API (cached for the request).
 * The API still authorizes every data request on its own.
 */
export default async function ProtectedLayout({
    children,
}: LayoutProps<"/">) {
    await requireSession();

    return children;
}
