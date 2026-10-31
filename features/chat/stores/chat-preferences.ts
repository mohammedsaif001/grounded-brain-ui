"use client";

import { useCallback, useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
    isChatModel,
    resolveChatModel,
    type ChatModelId,
} from "@/shared/config/models";

type StoredPrefs = {
    model?: ChatModelId;
    webSearch?: boolean;
};

type ChatPreferencesState = {
    byWorkspace: Record<string, StoredPrefs>;
    setModel: (workspaceId: string, model: ChatModelId) => void;
    setWebSearch: (workspaceId: string, enabled: boolean) => void;
};

const useChatPreferencesStore = create<ChatPreferencesState>()(
    persist(
        (set) => ({
            byWorkspace: {},
            setModel: (workspaceId, model) =>
                set((state) => ({
                    byWorkspace: {
                        ...state.byWorkspace,
                        [workspaceId]: { ...state.byWorkspace[workspaceId], model },
                    },
                })),
            setWebSearch: (workspaceId, webSearch) =>
                set((state) => ({
                    byWorkspace: {
                        ...state.byWorkspace,
                        [workspaceId]: {
                            ...state.byWorkspace[workspaceId],
                            webSearch,
                        },
                    },
                })),
        }),
        {
            name: "chaibook-chat-preferences",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ byWorkspace: state.byWorkspace }),
            // Rehydrated after mount (see below) so the first client render matches
            // the server render and React does not throw a hydration mismatch.
            skipHydration: true,
        },
    ),
);

/**
 * Per-workspace chat preferences (model + web search), persisted to localStorage.
 *
 * Subscribes to the workspace's slice of state, so callers re-render when it changes.
 * Falls back to the workspace's default model until the user picks one.
 */
export function useWorkspaceChatPrefs(
    workspaceId: string,
    defaultModel?: string | null,
) {
    const stored = useChatPreferencesStore(
        (state) => state.byWorkspace[workspaceId],
    );
    const storeSetModel = useChatPreferencesStore((state) => state.setModel);
    const storeSetWebSearch = useChatPreferencesStore(
        (state) => state.setWebSearch,
    );

    useEffect(() => {
        if (!useChatPreferencesStore.persist.hasHydrated()) {
            void useChatPreferencesStore.persist.rehydrate();
        }
    }, []);

    const setModel = useCallback(
        (model: ChatModelId) => storeSetModel(workspaceId, model),
        [storeSetModel, workspaceId],
    );
    const setWebSearch = useCallback(
        (enabled: boolean) => storeSetWebSearch(workspaceId, enabled),
        [storeSetWebSearch, workspaceId],
    );

    return {
        model: isChatModel(stored?.model)
            ? stored.model
            : resolveChatModel(defaultModel),
        webSearch: stored?.webSearch ?? false,
        setModel,
        setWebSearch,
    };
}
