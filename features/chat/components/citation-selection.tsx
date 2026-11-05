"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import type { ChatCitation } from "../lib/types";

export type SelectedCitation = {
    citation: ChatCitation;
    /** Marker label as shown in the answer, e.g. "1" or "W2". */
    label: string;
};

type CitationSelectionValue = {
    selected: SelectedCitation | null;
    select: (selection: SelectedCitation) => void;
    clear: () => void;
};

const CitationSelectionContext = createContext<CitationSelectionValue | null>(
    null,
);

/** Holds which citation marker the reader opened, so a side panel can show its passage. */
export function CitationSelectionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [selected, setSelected] = useState<SelectedCitation | null>(null);
    const select = useCallback(
        (selection: SelectedCitation) => setSelected(selection),
        [],
    );
    const clear = useCallback(() => setSelected(null), []);
    const value = useMemo(
        () => ({ selected, select, clear }),
        [selected, select, clear],
    );

    return (
        <CitationSelectionContext.Provider value={value}>
            {children}
        </CitationSelectionContext.Provider>
    );
}

/** Returns null outside a provider so markers still work (hover preview only). */
export function useCitationSelection() {
    return useContext(CitationSelectionContext);
}
