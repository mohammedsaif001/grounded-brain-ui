"use client";

import { useEffect, useId, useState } from "react";
import { StreamdownContent } from "@/shared/components/streamdown-content";
import type { WikiContent } from "../../lib/types";

function MermaidDiagram({ code }: { code: string }) {
    const id = `mermaid-${useId().replace(/:/g, "")}`;
    const [svg, setSvg] = useState<string | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function render() {
            try {
                const { default: mermaid } = await import("mermaid");
                mermaid.initialize({ startOnLoad: false, securityLevel: "strict" });
                const result = await mermaid.render(id, code);
                if (!cancelled) {
                    setSvg(result.svg);
                }
            } catch {
                if (!cancelled) {
                    setFailed(true);
                }
            }
        }

        void render();
        return () => {
            cancelled = true;
        };
    }, [code, id]);

    if (failed) {
        return (
            <pre className="overflow-x-auto rounded-2xl border bg-muted/40 p-4 text-xs">
                {code}
            </pre>
        );
    }

    if (!svg) {
        return (
            <p className="text-sm text-muted-foreground">Rendering diagram…</p>
        );
    }

    return (
        <div
            className="overflow-x-auto rounded-2xl border bg-background p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-3">
            <h3 className="font-heading text-lg font-semibold">{title}</h3>
            {children}
        </section>
    );
}

export function WikiViewer({ wiki }: { wiki: WikiContent }) {
    return (
        <div className="space-y-8">
            <Section title="Overview">
                <StreamdownContent content={wiki.overview} mode="static" />
            </Section>

            {wiki.techStack.length > 0 ? (
                <Section title="Tech stack">
                    <ul className="grid gap-2 sm:grid-cols-2">
                        {wiki.techStack.map((tech) => (
                            <li
                                key={tech.name}
                                className="rounded-2xl border p-3 text-sm"
                            >
                                <p className="font-medium">{tech.name}</p>
                                <p className="text-muted-foreground">
                                    {tech.purpose}
                                </p>
                            </li>
                        ))}
                    </ul>
                </Section>
            ) : null}

            <Section title="Architecture">
                <StreamdownContent content={wiki.architecture} mode="static" />
                {wiki.diagram ? <MermaidDiagram code={wiki.diagram} /> : null}
            </Section>

            <Section title="Modules">
                <div className="space-y-3">
                    {wiki.modules.map((module) => (
                        <div
                            key={`${module.path}-${module.name}`}
                            className="space-y-2 rounded-2xl border p-4 text-sm"
                        >
                            <div className="flex flex-wrap items-baseline gap-2">
                                <p className="font-medium">{module.name}</p>
                                <code className="text-xs text-muted-foreground">
                                    {module.path}
                                </code>
                            </div>
                            <p className="text-muted-foreground">
                                {module.description}
                            </p>
                            {module.keyFiles.length > 0 ? (
                                <ul className="flex flex-wrap gap-1.5">
                                    {module.keyFiles.map((file) => (
                                        <li
                                            key={file}
                                            className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs"
                                        >
                                            {file}
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Getting started">
                <StreamdownContent
                    content={wiki.gettingStarted}
                    mode="static"
                />
            </Section>
        </div>
    );
}
