"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { resolveChatModel, type ChatModelId } from "@/shared/config/models";

type WorkspaceChatPrefs = {
    model: ChatModelId;
    webSearch: boolean;
};

type ChatPreferencesState = {
    byWorkspace: Record<string, WorkspaceChatPrefs>;
    getPrefs: (
        workspaceId: string,
        defaultModel?: string,
    ) => WorkspaceChatPrefs;
    setModel: (workspaceId: string, model: ChatModelId) => void;
    setWebSearch: (workspaceId: string, enabled: boolean) => void;
};

export const useChatPreferences = create<ChatPreferencesState>()(
    persist(
        (set, get) => ({
            byWorkspace: {},
            getPrefs: (workspaceId, defaultModel) => {
                const existing = get().byWorkspace[workspaceId];
                if (existing) {
                    return existing;
                }

                return {
                    model: resolveChatModel(defaultModel),
                    webSearch: false,
                };
            },
            setModel: (workspaceId, model) =>
                set((state) => ({
                    byWorkspace: {
                        ...state.byWorkspace,
                        [workspaceId]: {
                            ...state.getPrefs(workspaceId),
                            model,
                        },
                    },
                })),
            setWebSearch: (workspaceId, webSearch) =>
                set((state) => ({
                    byWorkspace: {
                        ...state.byWorkspace,
                        [workspaceId]: {
                            ...state.getPrefs(workspaceId),
                            webSearch,
                        },
                    },
                })),
        }),
        { name: "chaibook-chat-preferences" },
    ),
);
