import { redirect } from "next/navigation";
import { getSession, type Session } from "./auth-server";
import { routes } from "@/shared/config/routes";

export async function requireAuth(): Promise<Session> {
    const session = await getSession();

    if (!session) {
        redirect(routes.login);
    }

    return session;
}
