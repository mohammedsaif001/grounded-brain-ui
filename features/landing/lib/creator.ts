export type CreatorLink = {
    label: string;
    /** Leave empty until ready: links without a URL are hidden and left out of the structured data. */
    url: string;
};

/** Edit the details below; the Built-by section, the Person schema and llms.txt all read from here. */
export const creator = {
    name: "Mohammed Saif",
    jobTitle: "Senior Software Engineer",
    email: "imohdsaif.ai@gmail.com",
    bio: "Senior software engineer focused on full-stack development and generative AI.",
    /** Short chips shown on the banner. */
    skills: ["Full-stack development", "Generative AI", "RAG pipelines", "Next.js", "TypeScript"],
    /** The story behind the project, one paragraph per entry. */
    story: [
        "I built Grounded Brain while learning how full-stack AI really works: how retrieval-augmented generation (RAG) pipelines are put together, and what it takes to turn a model into a product people can trust.",
        "Instead of following a tutorial, I built it step by step: ingesting sources, indexing them, retrieving the right passages, and answering with citations you can check. Each piece taught me something new, and the whole repo grew from that.",
        "Once it came together as a full application, I published it. Grounded Brain is the result of that learning, built in the open.",
    ],
    /** Path under /public. Empty shows initials instead. */
    image: "/images/mohammed-saif.png",
    portfolio: { label: "Portfolio", url: "https://mohammedsaif001.github.io/portfolioResume/" } satisfies CreatorLink,
    socials: [
        { label: "GitHub", url: "https://github.com/mohammedsaif001" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/mohammedsaif001/" },
        { label: "X", url: "" },
        { label: "Instagram", url: "" },
    ] satisfies CreatorLink[],
} as const;

export function getCreatorLinks(): CreatorLink[] {
    return [creator.portfolio, ...creator.socials].filter((link) => link.url);
}
