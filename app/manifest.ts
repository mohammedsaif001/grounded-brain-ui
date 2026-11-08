import type { MetadataRoute } from "next";
import { routes } from "@/shared/config/routes";
import { siteConfig } from "@/shared/config/site";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${siteConfig.name}: ${siteConfig.tagline}`,
        short_name: siteConfig.name,
        description: siteConfig.shortDescription,
        start_url: routes.dashboard,
        scope: "/",
        display: "standalone",
        background_color: siteConfig.themeColor.light,
        theme_color: siteConfig.themeColor.light,
        categories: ["education", "productivity"],
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
    };
}
