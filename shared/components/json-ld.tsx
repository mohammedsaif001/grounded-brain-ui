type JsonLdProps = {
    data: Record<string, unknown>;
};

/** Escapes `<` so a value can never close the script tag (XSS-safe structured data). */
export function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data).replace(/</g, "\\u003c"),
            }}
        />
    );
}
