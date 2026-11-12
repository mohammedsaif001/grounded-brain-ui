export type Faq = { question: string; answer: string };

/** Rendered on the landing page and mirrored into FAQPage structured data for answer engines. */
export const FAQS: readonly Faq[] = [
    {
        question: "What is Grounded Brain?",
        answer: "Grounded Brain is an AI notebook that answers questions only from the sources you add, such as PDFs, websites, YouTube videos and GitHub repositories. Every answer includes citations that point to the exact passage, so you can verify it.",
    },
    {
        question: "How is Grounded Brain different from a general AI chatbot?",
        answer: "A general chatbot answers from what it learned in training. Grounded Brain retrieves passages from your own sources and cites them, so answers are traceable and stay focused on your material.",
    },
    {
        question: "What kinds of sources can I add?",
        answer: "You can add PDFs up to 10 MB, websites, YouTube video transcripts, GitHub repositories, pasted text and Markdown. Each source is read and indexed before it is used in chat.",
    },
    {
        question: "Can it create study material?",
        answer: "Yes. Grounded Brain can turn your sources or a conversation into summaries, key takeaways, flashcards, quizzes, mind maps, reports and repo wikis.",
    },
    {
        question: "Is my data private?",
        answer: "Yes. You sign in with Google, and your notebooks, sources and memories are visible only to you. You can edit or delete anything, including what the assistant remembers.",
    },
    {
        question: "Who built Grounded Brain?",
        answer: "Grounded Brain was built by Mohammed Saif, a senior software engineer focused on full-stack development and generative AI. You can find more about him and his other work at his portfolio, https://www.imohdsaif.in/.",
    },
    {
        question: "How do I get started?",
        answer: "Sign in with Google, create a notebook, add a source and ask your first question. It takes under a minute.",
    },
];
