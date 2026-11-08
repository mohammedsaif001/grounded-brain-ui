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
    /** The story behind the project, one paragraph per entry. */
    story: [
        "Grounded Brain is my hands-on project for exploring full-stack AI: how retrieval-augmented generation (RAG) pipelines work end to end, and what it takes to turn a language model into something people can trust.",
        "I'm building it step by step, from ingesting and indexing sources to retrieving the right passages and answering with citations you can verify. Every stage teaches me something new about shipping generative AI features properly.",
        "It's actively evolving. Try it out, and tell me what you'd like to see next.",
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
