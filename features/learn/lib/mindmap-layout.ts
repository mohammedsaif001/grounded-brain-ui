import type { MindMapEdge, MindMapNode } from "./types";

/*
 * Pure layout for the mind map: turns the LLM's flat node/edge lists into a tree and
 * positions it as a two-sided map (branches balanced left/right by leaf count).
 * Kept free of React so it can be unit tested.
 */

export const NODE_WIDTH = 200;
export const ROOT_WIDTH = 230;
export const NODE_HEIGHT = 46;
const ROW_GAP = 72;
const COL_GAP = 270;

export type TreeNode = {
    id: string;
    label: string;
    children: TreeNode[];
};

export type Placement = {
    x: number;
    y: number;
    direction: 1 | -1;
    depth: number;
};

/**
 * Builds a tree rooted at the first node without incoming edges. Each node is placed
 * once (cycles and multi-parent nodes are cut) and unreachable nodes become root children.
 */
export function buildTree(nodes: MindMapNode[], edges: MindMapEdge[]) {
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const children = new Map<string, string[]>();
    const incoming = new Map<string, number>();

    for (const node of nodes) {
        children.set(node.id, []);
        incoming.set(node.id, 0);
    }

    for (const edge of edges) {
        if (!children.has(edge.source) || !incoming.has(edge.target)) {
            continue;
        }

        children.get(edge.source)?.push(edge.target);
        incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1);
    }

    const claimed = new Set<string>();

    function toTreeNode(id: string): TreeNode | null {
        const source = nodeMap.get(id);
        if (!source || claimed.has(id)) {
            return null;
        }

        claimed.add(id);

        const childNodes = (children.get(id) ?? [])
            .map((childId) => toTreeNode(childId))
            .filter((child): child is TreeNode => child !== null);

        return {
            id: source.id,
            label: source.label,
            children: childNodes,
        };
    }

    const rootId =
        nodes.find((node) => (incoming.get(node.id) ?? 0) === 0)?.id ??
        nodes[0]?.id;

    if (!rootId) {
        return null;
    }

    const root = toTreeNode(rootId);

    if (!root) {
        return null;
    }

    for (const node of nodes) {
        const orphan = toTreeNode(node.id);
        if (orphan) {
            root.children.push(orphan);
        }
    }

    return root;
}

export function collectExpandableIds(node: TreeNode, ids: string[] = []) {
    if (node.children.length > 0) {
        ids.push(node.id);
        for (const child of node.children) {
            collectExpandableIds(child, ids);
        }
    }

    return ids;
}

function countLeaves(node: TreeNode, collapsed: Set<string>): number {
    if (collapsed.has(node.id) || node.children.length === 0) {
        return 1;
    }

    return node.children.reduce(
        (total, child) => total + countLeaves(child, collapsed),
        0,
    );
}

function layoutBranch(
    node: TreeNode,
    depth: number,
    top: number,
    direction: 1 | -1,
    placements: Map<string, Placement>,
    collapsed: Set<string>,
) {
    const height = countLeaves(node, collapsed) * ROW_GAP;
    const centerX = direction * depth * COL_GAP;
    const centerY = top + height / 2;

    placements.set(node.id, {
        x: centerX - NODE_WIDTH / 2,
        y: centerY - NODE_HEIGHT / 2,
        direction,
        depth,
    });

    if (!collapsed.has(node.id)) {
        let cursor = top;

        for (const child of node.children) {
            cursor += layoutBranch(
                child,
                depth + 1,
                cursor,
                direction,
                placements,
                collapsed,
            );
        }
    }

    return height;
}

export function computeTreeLayout(root: TreeNode, collapsed: Set<string>) {
    const placements = new Map<string, Placement>();

    placements.set(root.id, {
        x: -ROOT_WIDTH / 2,
        y: -NODE_HEIGHT / 2,
        direction: 1,
        depth: 0,
    });

    if (collapsed.has(root.id) || root.children.length === 0) {
        return placements;
    }

    const rightBranches: TreeNode[] = [];
    const leftBranches: TreeNode[] = [];
    let rightLeaves = 0;
    let leftLeaves = 0;

    for (const child of root.children) {
        const leaves = countLeaves(child, collapsed);

        if (rightLeaves <= leftLeaves) {
            rightBranches.push(child);
            rightLeaves += leaves;
        } else {
            leftBranches.push(child);
            leftLeaves += leaves;
        }
    }

    let rightCursor = (-rightLeaves * ROW_GAP) / 2;
    for (const branch of rightBranches) {
        rightCursor += layoutBranch(
            branch,
            1,
            rightCursor,
            1,
            placements,
            collapsed,
        );
    }

    let leftCursor = (-leftLeaves * ROW_GAP) / 2;
    for (const branch of leftBranches) {
        leftCursor += layoutBranch(
            branch,
            1,
            leftCursor,
            -1,
            placements,
            collapsed,
        );
    }

    return placements;
}
