import {
    BookOpenIcon,
    BrainIcon,
    GraduationCapIcon,
    LibraryBigIcon,
    LifeBuoyIcon,
    LogInIcon,
    MessageSquareIcon,
    SettingsIcon,
    type LucideIcon,
} from "lucide-react";
import type { Tone } from "@/shared/components/tint";

export type DocsStep = {
    title: string;
    body: string;
    /** Where to click, e.g. "Dashboard → Create notebook". */
    where?: string;
};

export type DocsSection = {
    /** URL fragment and table-of-contents key. */
    id: string;
    title: string;
    icon: LucideIcon;
    tone: Tone;
    /** One line shown under the title and in the quick-start flow. */
    summary: string;
    steps: DocsStep[];
    tips?: string[];
};

/**
 * The tutorial, in reading order. It is the single source for the page body, the
 * sticky table of contents and the quick-start flow, so adding a section here is all
 * it takes to document a new area.
 */
export const DOCS_SECTIONS: readonly DocsSection[] = [
    {
        id: "sign-in",
        title: "Sign in",
        icon: LogInIcon,
        tone: "blue",
        summary: "Use your Google account. There is no password to remember.",
        steps: [
            {
                title: "Open the sign-in page",
                body: "Choose Sign in or Get started on the home page.",
                where: "Home → Get started",
            },
            {
                title: "Continue with Google",
                body: "Pick your Google account. You land on your dashboard when it finishes.",
                where: "Sign in → Continue with Google",
            },
        ],
        tips: [
            "Your notebooks, sources and memories are private to your account.",
            "If you open a page while signed out, you are sent to sign in first and brought back afterwards.",
        ],
    },
    {
        id: "notebooks",
        title: "Create a notebook",
        icon: BookOpenIcon,
        tone: "green",
        summary:
            "A notebook is one topic: its own sources, chats, study material and settings.",
        steps: [
            {
                title: "Start a new notebook",
                body: "Choose the Create notebook card at the top of your list.",
                where: "Dashboard → Create notebook",
            },
            {
                title: "Name it and pick an icon",
                body: "Give it a title, an optional description and an icon. You can also choose which chat model it uses by default.",
            },
            {
                title: "Open it",
                body: "After you create it you go straight into the notebook's Chat. Come back any time from All workspaces in the sidebar.",
                where: "Notebook sidebar → All workspaces",
            },
            {
                title: "Find and organise notebooks",
                body: "Search by title or description, and sort by Last updated, Newest first or Title. Each card shows how many sources and study guides it holds. Use the pencil to edit and the bin to delete.",
                where: "Dashboard → Search and Sort",
            },
        ],
        tips: [
            "Keep one notebook per subject. Answers only draw on the sources inside the notebook you are in.",
        ],
    },
    {
        id: "sources",
        title: "Add your sources",
        icon: LibraryBigIcon,
        tone: "amber",
        summary:
            "Sources are what every answer is grounded in. Add them first, then wait for Ready.",
        steps: [
            {
                title: "Open the add-source dialog",
                body: "Use Add source in the top bar, or the plus beside Recent sources in the sidebar.",
                where: "Notebook → Add source",
            },
            {
                title: "Choose a type",
                body: "PDF (up to 10 MB), Website, YouTube (transcript), GitHub repository, pasted Text, or Markdown. Each type has its own tab with the fields it needs.",
            },
            {
                title: "Wait for Ready",
                body: "A new source is Pending, then Processing while it is read and indexed, then Ready. The page updates on its own. Only Ready sources are used in Chat and Learn.",
            },
            {
                title: "Manage your library",
                body: "Open the Sources page to search, filter by type or status, switch between list and grid, and select several rows to reprocess or delete them together. Long libraries load 25 at a time with a Load more button.",
                where: "Notebook → Sources",
            },
        ],
        tips: [
            "If a source shows Failed, open its menu and choose Reprocess. Reprocess failed (top of the library) retries all of them at once.",
            "Rows show useful detail such as author and page count, channel and length, or repository and file count once a source has been processed.",
            "Reprocessing a Ready source briefly removes it from Chat until it is Ready again.",
        ],
    },
    {
        id: "chat",
        title: "Chat with your sources",
        icon: MessageSquareIcon,
        tone: "violet",
        summary:
            "Ask questions and get answers that point back to the exact passage.",
        steps: [
            {
                title: "Ask a question",
                body: "Type in the box at the bottom of Chat, or start from one of the suggested prompts.",
                where: "Notebook → Chat",
            },
            {
                title: "Check the citations",
                body: "Numbers like [1] in an answer are citations. Hover one for a preview, or click it to open the matching passage beside the chat, with its page, chapter or section and its position in the source.",
            },
            {
                title: "Go to the source",
                body: "From the passage panel, choose Open source to read it in full.",
            },
            {
                title: "Turn on web search when you need it",
                body: "The Web search toggle lets an answer include web results. Web citations are marked W and can be saved to your library.",
            },
            {
                title: "Manage conversations",
                body: "Switch between past conversations, start a New chat, export one as Markdown, or delete it.",
                where: "Chat → toolbar above the messages",
            },
            {
                title: "Pick a model",
                body: "Choose the chat model from the top bar. Your notebook's default is selected for you.",
            },
        ],
        tips: [
            "Add the sources before you ask. With none that are Ready, there is nothing to ground the answer in.",
            "Use Make it stick on the right of Chat to turn the conversation you are in into a flashcard deck.",
        ],
    },
    {
        id: "learn",
        title: "Learn and revise",
        icon: GraduationCapIcon,
        tone: "rose",
        summary:
            "Turn sources, or a conversation, into material you can study from.",
        steps: [
            {
                title: "Generate something",
                body: "Open Learn and choose Generate. Pick Summary, Key Takeaways, Flashcards, Quiz, Mind Map, AI Report, or Repo Wiki (needs a Ready GitHub source). It uses every Ready source in the notebook and keeps working in the background.",
                where: "Notebook → Learn → Generate",
            },
            {
                title: "Open it when it is ready",
                body: "New items show a New badge, and the Learn item in the sidebar gets a dot while something unopened is waiting. Opening it clears both.",
            },
            {
                title: "Study with it",
                body: "Flashcards flip and track what you have learned, quizzes explain each answer, summaries link their numbered notes to your sources, and mind maps can be explored visually.",
            },
            {
                title: "See where it came from",
                body: "Flashcards, quiz answers, report sections and summaries show the sources they are based on. Items made from a conversation do not.",
            },
            {
                title: "Export",
                body: "Download an item as Markdown to keep it outside the app.",
            },
        ],
        tips: [
            "Flashcards: use the left and right arrow keys to move, and Space to flip.",
            "The sources named on an item are the model's best match. Treat them as where to look, then check the passage yourself.",
        ],
    },
    {
        id: "memory",
        title: "Memory",
        icon: BrainIcon,
        tone: "green",
        summary:
            "Grounded Brain can remember lasting facts about you across notebooks.",
        steps: [
            {
                title: "Open Memory",
                body: "Choose Memory in the dashboard header.",
                where: "Dashboard → Memory",
            },
            {
                title: "Review what it learned",
                body: "Memories from your chats are marked Learned. Ones you write yourself are marked Manual.",
            },
            {
                title: "Add, edit or remove",
                body: "Add a memory such as 'Prefers concise explanations with examples', and edit or delete any entry whenever you like.",
            },
        ],
        tips: [
            "Memory is powered by Mem0. A new memory can take a moment to appear in the list.",
        ],
    },
    {
        id: "settings",
        title: "Notebook settings",
        icon: SettingsIcon,
        tone: "blue",
        summary: "Rename a notebook, change its default model, or remove it.",
        steps: [
            {
                title: "Open settings",
                body: "Choose Settings in the notebook sidebar.",
                where: "Notebook → Settings",
            },
            {
                title: "Edit the details",
                body: "Change the title, description, icon and default chat model, then Save changes.",
            },
            {
                title: "Delete a notebook",
                body: "The Danger zone removes the notebook with all its sources, conversations and indexed data. This cannot be undone.",
            },
        ],
        tips: [
            "Use the moon icon in any header to switch between the light and dark themes.",
        ],
    },
    {
        id: "help",
        title: "When something goes wrong",
        icon: LifeBuoyIcon,
        tone: "amber",
        summary: "What the messages mean and what to do about them.",
        steps: [
            {
                title: "Our server is under maintenance",
                body: "The service cannot be reached right now. Nothing you did caused it and your data is safe. Wait a few minutes and try again.",
            },
            {
                title: "Mem0 is under maintenance",
                body: "Only the memory service is unavailable. Chat, sources and Learn keep working, and Memory returns when it is back.",
            },
            {
                title: "A source says Failed",
                body: "Reprocess it from its menu. If it keeps failing, check the file or link and add it again.",
            },
            {
                title: "Too many requests",
                body: "Adding sources and generating study material are rate limited. Wait a minute and try again.",
            },
        ],
    },
];

/** Ids of the sections that make up the headline "how it works" flow, in order. */
export const QUICK_START_IDS = [
    "sign-in",
    "notebooks",
    "sources",
    "chat",
    "learn",
] as const;

export function getDocsSection(id: string): DocsSection | undefined {
    return DOCS_SECTIONS.find((section) => section.id === id);
}
