import type { ArtifactContent } from "./types";

/**
 * Serialises a validated artifact to portable Markdown for export. Pure: no DOM, no clock.
 */
export function artifactToMarkdown(
    title: string,
    parsed: ArtifactContent,
): string {
    const heading = `# ${title}\n`;

    switch (parsed.type) {
        case "SUMMARY":
            return `${heading}\n${parsed.content.markdown.trim()}\n`;

        case "TAKEAWAYS":
            return `${heading}\n${parsed.content.items
                .map((item, index) => `${index + 1}. ${item}`)
                .join("\n")}\n`;

        case "FLASHCARDS":
            return `${heading}\n${parsed.content.cards
                .map(
                    (card, index) =>
                        `## Card ${index + 1}\n\n**Q:** ${card.front}\n\n**A:** ${card.back}\n`,
                )
                .join("\n")}`;

        case "QUIZ":
            return `${heading}\n${parsed.content.questions
                .map((question, index) => {
                    const options = question.options
                        .map((option, optionIndex) => {
                            const letter = String.fromCharCode(65 + optionIndex);
                            const mark =
                                optionIndex === question.correctIndex
                                    ? " (correct)"
                                    : "";
                            return `- ${letter}. ${option}${mark}`;
                        })
                        .join("\n");
                    const explanation = question.explanation
                        ? `\n\n_${question.explanation}_`
                        : "";
                    return `## Question ${index + 1}\n\n${question.question}\n\n${options}${explanation}\n`;
                })
                .join("\n")}`;

        case "REPORT": {
            const sections = parsed.content.sections
                .map((section) => `## ${section.title}\n\n${section.content}\n`)
                .join("\n");
            return `${heading}\n${parsed.content.markdown.trim()}\n${
                sections ? `\n${sections}` : ""
            }`;
        }

        case "MINDMAP": {
            const labels = new Map(
                parsed.content.nodes.map((node) => [node.id, node.label]),
            );
            const edges = parsed.content.edges
                .map(
                    (edge) =>
                        `- ${labels.get(edge.source) ?? edge.source} → ${labels.get(edge.target) ?? edge.target}`,
                )
                .join("\n");
            return `${heading}\n## Concepts\n\n${parsed.content.nodes
                .map((node) => `- ${node.label}`)
                .join("\n")}\n\n## Connections\n\n${edges}\n`;
        }

        case "WIKI": {
            const wiki = parsed.content;
            const stack = wiki.techStack
                .map((tech) => `- **${tech.name}**: ${tech.purpose}`)
                .join("\n");
            const modules = wiki.modules
                .map(
                    (module) =>
                        `### ${module.name} (\`${module.path}\`)\n\n${module.description}\n`,
                )
                .join("\n");
            return [
                heading,
                `## Overview\n\n${wiki.overview}\n`,
                stack ? `## Tech stack\n\n${stack}\n` : "",
                `## Architecture\n\n${wiki.architecture}\n`,
                wiki.diagram
                    ? `\`\`\`mermaid\n${wiki.diagram}\n\`\`\`\n`
                    : "",
                modules ? `## Modules\n\n${modules}` : "",
                `## Getting started\n\n${wiki.gettingStarted}\n`,
            ]
                .filter(Boolean)
                .join("\n");
        }
    }
}

/** Filesystem-safe slug for the exported file name. */
export function artifactFileName(title: string): string {
    const slug = title
        .toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return `${slug || "learning-tool"}.md`;
}
