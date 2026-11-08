"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import Link from "next/link";
import {
    Background,
    Controls,
    Handle,
    MiniMap,
    Position,
    ReactFlow,
    ReactFlowProvider,
    useReactFlow,
    type Edge,
    type Node,
    type NodeProps,
} from "@xyflow/react";
import {
    ChevronDownIcon,
    ChevronRightIcon,
    Maximize2Icon,
    MessageSquareIcon,
    Minimize2Icon,
    MinusIcon,
    PlusIcon,
    ScanIcon,
} from "lucide-react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import {
    buildTree,
    collectExpandableIds,
    computeTreeLayout,
    NODE_WIDTH,
    ROOT_WIDTH,
    type Placement,
} from "../../lib/mindmap-layout";
import type { MindMapEdge, MindMapNode } from "../../lib/types";
import { routes } from "@/shared/config/routes";

type MindMapActions = {
    toggleCollapse: (nodeId: string) => void;
    selectNode: (nodeId: string) => void;
};

const MindMapActionsContext = createContext<MindMapActions | null>(null);

function MindMapFlowNode({ id, data, selected }: NodeProps) {
    const actions = useContext(MindMapActionsContext);
    const label = typeof data.label === "string" ? data.label : "Untitled";
    const hasChildren = Boolean(data.hasChildren);
    const collapsed = Boolean(data.collapsed);
    const isRoot = Boolean(data.isRoot);
    const hasLeftBranch = Boolean(data.hasLeftBranch);
    const hasRightBranch = Boolean(data.hasRightBranch);
    const direction = data.direction === -1 ? -1 : 1;

    const handleClass = "size-1.5 border-border! bg-muted-foreground!";
    const hiddenHandleClass = "pointer-events-none opacity-0";

    // Which handles carry a visible connection for this node.
    const isTargetLeft = !isRoot && direction === 1;
    const isTargetRight = !isRoot && direction === -1;
    const isSourceLeft = isRoot ? hasLeftBranch : hasChildren && direction === -1;
    const isSourceRight = isRoot ? hasRightBranch : hasChildren && direction === 1;

    return (
        <div
            style={{ width: isRoot ? ROOT_WIDTH : NODE_WIDTH }}
            className={`rounded-2xl border px-3 py-2 shadow-sm transition-colors ${
                selected
                    ? "border-primary bg-primary/15 ring-2 ring-primary/40"
                    : isRoot
                      ? "border-primary/60 bg-card text-card-foreground"
                      : "border-border bg-card text-card-foreground hover:border-primary/40"
            }`}
            onClick={() => actions?.selectNode(id)}
        >
            {/* All four handles always exist, so an edge never points at a missing one
                (React Flow error #008). Unused ones are invisible and not interactive. */}
            <Handle
                type="target"
                id="tl"
                position={Position.Left}
                className={isTargetLeft ? handleClass : hiddenHandleClass}
            />
            <Handle
                type="target"
                id="tr"
                position={Position.Right}
                className={isTargetRight ? handleClass : hiddenHandleClass}
            />

            <div
                className={`flex items-start gap-1.5 ${
                    direction === -1 && !isRoot ? "flex-row-reverse" : ""
                }`}
            >
                {hasChildren ? (
                    <button
                        type="button"
                        className="mt-0.5 shrink-0 rounded-md p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={(event) => {
                            event.stopPropagation();
                            actions?.toggleCollapse(id);
                        }}
                        aria-label={
                            collapsed ? "Expand branch" : "Collapse branch"
                        }
                    >
                        {collapsed ? (
                            <ChevronRightIcon className="size-4" />
                        ) : (
                            <ChevronDownIcon className="size-4" />
                        )}
                    </button>
                ) : null}
                <p
                    className={`flex-1 text-sm leading-snug ${
                        isRoot
                            ? "text-center font-medium"
                            : direction === -1
                              ? "text-right"
                              : "text-left"
                    }`}
                >
                    {label}
                </p>
            </div>

            <Handle
                type="source"
                id="sl"
                position={Position.Left}
                className={isSourceLeft ? handleClass : hiddenHandleClass}
            />
            <Handle
                type="source"
                id="sr"
                position={Position.Right}
                className={isSourceRight ? handleClass : hiddenHandleClass}
            />
        </div>
    );
}

const nodeTypes = {
    mindmap: MindMapFlowNode,
};

type MindMapCanvasProps = {
    nodes: MindMapNode[];
    edges: MindMapEdge[];
    workspaceId?: string;
};

function MindMapCanvas({ nodes, edges, workspaceId }: MindMapCanvasProps) {
    const tree = useMemo(() => buildTree(nodes, edges), [nodes, edges]);
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { fitView } = useReactFlow();

    const expandableIds = useMemo(
        () => (tree ? collectExpandableIds(tree) : []),
        [tree],
    );

    const placements = useMemo(
        () =>
            tree
                ? computeTreeLayout(tree, collapsed)
                : new Map<string, Placement>(),
        [tree, collapsed],
    );

    const parentsWithChildren = useMemo(
        () => new Set(edges.map((edge) => edge.source)),
        [edges],
    );

    const flowNodes: Node[] = useMemo(() => {
        if (!tree) {
            return [];
        }

        const rootChildDirections = tree.children
            .map((child) => placements.get(child.id)?.direction)
            .filter((direction): direction is 1 | -1 => direction !== undefined);

        return nodes
            .filter((node) => placements.has(node.id))
            .map((node) => {
                const placement = placements.get(node.id)!;
                const isRoot = node.id === tree.id;

                return {
                    id: node.id,
                    type: "mindmap",
                    draggable: false,
                    data: {
                        label: node.label,
                        hasChildren: parentsWithChildren.has(node.id),
                        collapsed: collapsed.has(node.id),
                        isRoot,
                        direction: placement.direction,
                        hasLeftBranch: rootChildDirections.includes(-1),
                        hasRightBranch: rootChildDirections.includes(1),
                    },
                    position: { x: placement.x, y: placement.y },
                    selected: selectedId === node.id,
                };
            });
    }, [
        nodes,
        tree,
        placements,
        parentsWithChildren,
        collapsed,
        selectedId,
    ]);

    const flowEdges: Edge[] = useMemo(
        () =>
            edges
                .filter(
                    (edge) =>
                        placements.has(edge.source) &&
                        placements.has(edge.target) &&
                        !collapsed.has(edge.source),
                )
                .map((edge) => {
                    const direction =
                        placements.get(edge.target)?.direction ?? 1;
                    const isSelected =
                        selectedId === edge.source || selectedId === edge.target;

                    return {
                        id: edge.id,
                        source: edge.source,
                        target: edge.target,
                        sourceHandle: direction === 1 ? "sr" : "sl",
                        targetHandle: direction === 1 ? "tl" : "tr",
                        type: "bezier",
                        animated: isSelected,
                        style: {
                            stroke: isSelected
                                ? "var(--primary)"
                                : "var(--border)",
                            strokeWidth: isSelected ? 2 : 1.5,
                        },
                    };
                }),
        [edges, placements, collapsed, selectedId],
    );

    const selectedNode = useMemo(
        () => nodes.find((node) => node.id === selectedId) ?? null,
        [nodes, selectedId],
    );

    const toggleCollapse = useCallback((nodeId: string) => {
        setCollapsed((current) => {
            const next = new Set(current);
            if (next.has(nodeId)) {
                next.delete(nodeId);
            } else {
                next.add(nodeId);
            }
            return next;
        });
    }, []);

    const selectNode = useCallback((nodeId: string) => {
        setSelectedId(nodeId);
    }, []);

    const expandAll = useCallback(() => {
        setCollapsed(new Set());
    }, []);

    const collapseAll = useCallback(() => {
        setCollapsed(new Set(expandableIds));
    }, [expandableIds]);

    const fitMap = useCallback(() => {
        void fitView({ padding: 0.2, duration: 300 });
    }, [fitView]);

    useEffect(() => {
        const timer = window.setTimeout(fitMap, 60);
        return () => window.clearTimeout(timer);
    }, [collapsed, fitMap, flowNodes.length]);

    const actions = useMemo(
        () => ({ toggleCollapse, selectNode }),
        [toggleCollapse, selectNode],
    );

    if (!tree) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Mind map data is empty.
            </div>
        );
    }

    const chatHref =
        selectedNode && workspaceId
            ? `${routes.workspace.chat(workspaceId)}?ask=${encodeURIComponent(
                  `Tell me more about "${selectedNode.label}" based on my sources.`,
              )}`
            : null;

    return (
        <MindMapActionsContext.Provider value={actions}>
            <div className="flex h-full min-h-0 flex-col">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-3 py-2">
                    <p className="text-xs text-muted-foreground">
                        Use the arrows to expand or collapse branches. Select a
                        node to explore it in chat.
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                        <Button size="sm" variant="outline" onClick={expandAll}>
                            <PlusIcon />
                            Expand all
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={collapseAll}
                        >
                            <MinusIcon />
                            Collapse all
                        </Button>
                        <Button size="sm" variant="outline" onClick={fitMap}>
                            <ScanIcon />
                            Fit view
                        </Button>
                    </div>
                </div>

                <div className="relative min-h-0 flex-1">
                    <ReactFlow
                        nodes={flowNodes}
                        edges={flowEdges}
                        nodeTypes={nodeTypes}
                        colorMode="dark"
                        fitView
                        fitViewOptions={{ padding: 0.2 }}
                        minZoom={0.15}
                        maxZoom={1.8}
                        nodesDraggable={false}
                        nodesConnectable={false}
                        elementsSelectable
                        panOnScroll
                        zoomOnScroll
                        proOptions={{ hideAttribution: true }}
                    >
                        <MiniMap
                            pannable
                            zoomable
                            nodeColor="var(--muted-foreground)"
                            maskColor="color-mix(in oklab, var(--background) 75%, transparent)"
                            className="rounded-xl! border! border-border! bg-card/90!"
                        />
                        <Controls className="rounded-xl! border! border-border! bg-card! shadow-sm! [&>button]:border-border! [&>button]:bg-card! [&>button]:text-foreground! [&>button:hover]:bg-muted!" />
                        <Background gap={20} color="var(--border)" />
                    </ReactFlow>
                </div>

                {selectedNode ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-card/40 px-4 py-3">
                        <div className="min-w-0">
                            <p className="text-xs tracking-wide text-muted-foreground uppercase">
                                Selected topic
                            </p>
                            <p className="truncate font-medium">
                                {selectedNode.label}
                            </p>
                        </div>
                        {chatHref ? (
                            <Button
                                nativeButton={false}
                                size="sm"
                                render={<Link href={chatHref} />}
                            >
                                <MessageSquareIcon />
                                Ask in chat
                            </Button>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </MindMapActionsContext.Provider>
    );
}

type MindMapViewerProps = {
    nodes: MindMapNode[];
    edges: MindMapEdge[];
    workspaceId?: string;
    className?: string;
};

export function MindMapViewer({
    nodes,
    edges,
    workspaceId,
    className,
}: MindMapViewerProps) {
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        if (!fullscreen) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setFullscreen(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [fullscreen]);

    const containerClass = fullscreen
        ? "fixed inset-0 z-50 flex flex-col bg-background"
        : `flex h-[clamp(28rem,74vh,780px)] flex-col overflow-hidden rounded-2xl border border-border bg-card/50 ${className ?? ""}`;

    return (
        <div className={containerClass}>
            <div className="flex items-center justify-end gap-2 border-b border-border/60 px-3 py-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFullscreen((value) => !value)}
                >
                    {fullscreen ? <Minimize2Icon /> : <Maximize2Icon />}
                    {fullscreen ? "Exit full screen" : "Full screen"}
                </Button>
            </div>

            <div className="min-h-0 flex-1">
                <ReactFlowProvider>
                    <MindMapCanvas
                        nodes={nodes}
                        edges={edges}
                        workspaceId={workspaceId}
                    />
                </ReactFlowProvider>
            </div>
        </div>
    );
}
