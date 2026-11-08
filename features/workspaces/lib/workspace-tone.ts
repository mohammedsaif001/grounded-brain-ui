import type { Tone } from "@/shared/components/tint";

const TONES = ["green", "blue", "violet", "amber", "rose"] as const satisfies readonly Tone[];

function hashString(value: string) {
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(index);
        hash |= 0;
    }

    return Math.abs(hash);
}

/** Stable accent tint per workspace, so a notebook keeps its colour across sessions. */
export function getWorkspaceTone(workspaceId: string): Tone {
    return TONES[hashString(workspaceId) % TONES.length];
}
