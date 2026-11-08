import { ImageResponse } from "next/og";
import { siteConfig } from "@/shared/config/site";

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const colors = siteConfig.brandColors;

/** Shared social card for every page; Next.js wires it to og:image and twitter:image. */
export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: 80,
                    background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.card} 55%, ${colors.background} 100%)`,
                    color: colors.foreground,
                }}
            >
                <div style={{ fontSize: 34, fontWeight: 700, color: colors.accentForeground }}>
                    {siteConfig.name}
                </div>
                <div style={{ marginTop: 24, fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>
                    Collect knowledge. Grow understanding.
                </div>
                <div style={{ marginTop: 32, fontSize: 36, color: colors.muted, lineHeight: 1.3 }}>
                    Chat with your sources. Every answer cited.
                </div>
            </div>
        ),
        size,
    );
}
