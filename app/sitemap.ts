import type { MetadataRoute } from "next";
import { routes } from "@/shared/config/routes";
import { absoluteUrl } from "@/shared/config/site";

/** Only public, indexable pages: everything behind sign-in is excluded on purpose. */
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: absoluteUrl(routes.home), changeFrequency: "weekly", priority: 1 },
        { url: absoluteUrl(routes.docs), changeFrequency: "monthly", priority: 0.8 },
    ];
}
