import { redirect } from "next/navigation";
import { getSession } from "./auth-server";
import { routes } from "@/shared/config/routes";

export async function unauth() {
    const session = await getSession();

    if (session) {
        redirect(routes.dashboard);
    }
}
