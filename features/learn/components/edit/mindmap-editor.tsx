"use client";

import { ArrowRightIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    EDIT_LIMITS,
    newMindMapId,
    removeMindMapNode,
    type EditableContent,
} from "../../lib/edit";
import { AddButton, nativeSelectClass } from "./editor-parts";

type MindMapEditorProps = {
    value: EditableContent<"MINDMAP">;
    onChange: (value: EditableContent<"MINDMAP">) => void;
};

/**
 * Edits concepts and the connections between them as two lists. Deleting a concept also
 * deletes its connections, so the map can never reference a node that is gone.
 */
export function MindMapEditor({ value, onChange }: MindMapEditorProps) {
    const { nodes, edges } = value;
    const labelOf = (id: string) =>
        nodes.find((node) => node.id === id)?.label.trim() || "Untitled";

    return (
        <div className="space-y-8">
            <section aria-labelledby="mm-nodes" className="space-y-3">
                <h3 id="mm-nodes" className="text-heading">
                    Concepts
                    <span className="text-caption ml-2">{nodes.length}</span>
                </h3>
                <ul className="space-y-2">
                    {nodes.map((node, index) => (
                        <li key={node.id} className="flex items-center gap-2">
                            <Input
                                aria-label={`Concept ${index + 1}`}
                                value={node.label}
                                onChange={(event) =>
                                    onChange({
                                        ...value,
                                        nodes: nodes.map((existing) =>
                                            existing.id === node.id
                                                ? { ...existing, label: event.target.value }
                                                : existing,
                                        ),
                                    })
                                }
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                disabled={nodes.length <= EDIT_LIMITS.mindMapNodes.min}
                                className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => onChange(removeMindMapNode(value, node.id))}
                            >
                                <Trash2Icon aria-hidden="true" />
                                <span className="sr-only">
                                    Remove concept {labelOf(node.id)}
                                </span>
                            </Button>
                        </li>
                    ))}
                </ul>
                <AddButton
                    label="Add concept"
                    disabled={nodes.length >= EDIT_LIMITS.mindMapNodes.max}
                    onClick={() =>
                        onChange({
                            ...value,
                            nodes: [...nodes, { id: newMindMapId("n"), label: "" }],
                        })
                    }
                />
            </section>

            <section aria-labelledby="mm-edges" className="space-y-3">
                <h3 id="mm-edges" className="text-heading">
                    Connections
                    <span className="text-caption ml-2">{edges.length}</span>
                </h3>
                {edges.length === 0 ? (
                    <p className="text-caption">No connections yet.</p>
                ) : null}
                <ul className="space-y-2">
                    {edges.map((edge, index) => (
                        <li key={edge.id} className="flex flex-wrap items-center gap-2">
                            <select
                                aria-label={`Connection ${index + 1} from`}
                                className={nativeSelectClass}
                                value={edge.source}
                                onChange={(event) =>
                                    onChange({
                                        ...value,
                                        edges: edges.map((existing) =>
                                            existing.id === edge.id
                                                ? { ...existing, source: event.target.value }
                                                : existing,
                                        ),
                                    })
                                }
                            >
                                {nodes.map((node) => (
                                    <option key={node.id} value={node.id}>
                                        {labelOf(node.id)}
                                    </option>
                                ))}
                            </select>
                            <ArrowRightIcon
                                aria-hidden="true"
                                className="size-4 shrink-0 text-muted-foreground"
                            />
                            <select
                                aria-label={`Connection ${index + 1} to`}
                                className={nativeSelectClass}
                                value={edge.target}
                                onChange={(event) =>
                                    onChange({
                                        ...value,
                                        edges: edges.map((existing) =>
                                            existing.id === edge.id
                                                ? { ...existing, target: event.target.value }
                                                : existing,
                                        ),
                                    })
                                }
                            >
                                {nodes.map((node) => (
                                    <option key={node.id} value={node.id}>
                                        {labelOf(node.id)}
                                    </option>
                                ))}
                            </select>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                onClick={() =>
                                    onChange({
                                        ...value,
                                        edges: edges.filter(
                                            (existing) => existing.id !== edge.id,
                                        ),
                                    })
                                }
                            >
                                <Trash2Icon aria-hidden="true" />
                                <span className="sr-only">
                                    Remove connection {labelOf(edge.source)} to{" "}
                                    {labelOf(edge.target)}
                                </span>
                            </Button>
                        </li>
                    ))}
                </ul>
                <AddButton
                    label="Add connection"
                    disabled={nodes.length < 2}
                    onClick={() =>
                        onChange({
                            ...value,
                            edges: [
                                ...edges,
                                {
                                    id: newMindMapId("e"),
                                    source: nodes[0].id,
                                    target: nodes[1].id,
                                },
                            ],
                        })
                    }
                />
            </section>
        </div>
    );
}
