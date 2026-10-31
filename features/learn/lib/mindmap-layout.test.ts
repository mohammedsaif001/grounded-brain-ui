import { describe, expect, it } from "vitest";
import {
    buildTree,
    collectExpandableIds,
    computeTreeLayout,
    type TreeNode,
} from "./mindmap-layout";

const node = (id: string) => ({ id, label: id.toUpperCase() });
const edge = (source: string, target: string) => ({
    id: `${source}-${target}`,
    source,
    target,
});

function ids(tree: TreeNode | null): unknown {
    return tree ? { [tree.id]: tree.children.map(ids) } : null;
}

describe("buildTree", () => {
    it("returns null for an empty map", () => {
        expect(buildTree([], [])).toBeNull();
    });

    it("roots the tree at the node without incoming edges", () => {
        const tree = buildTree(
            [node("b"), node("root"), node("c")],
            [edge("root", "b"), edge("b", "c")],
        );
        expect(ids(tree)).toEqual({ root: [{ b: [{ c: [] }] }] });
    });

    it("breaks cycles and places multi-parent nodes once", () => {
        const tree = buildTree(
            [node("r"), node("a"), node("b")],
            [edge("r", "a"), edge("r", "b"), edge("a", "b"), edge("b", "a")],
        );
        expect(ids(tree)).toEqual({ r: [{ a: [{ b: [] }] }] });
    });

    it("attaches unreachable nodes to the root", () => {
        const tree = buildTree([node("r"), node("x")], [edge("x", "x")]);
        expect(ids(tree)).toEqual({ r: [{ x: [] }] });
    });

    it("ignores edges that reference unknown nodes", () => {
        const tree = buildTree([node("r")], [edge("r", "ghost")]);
        expect(ids(tree)).toEqual({ r: [] });
    });
});

describe("collectExpandableIds", () => {
    it("lists every node that has children", () => {
        const tree = buildTree(
            [node("r"), node("a"), node("b"), node("c")],
            [edge("r", "a"), edge("a", "b"), edge("r", "c")],
        )!;
        expect(collectExpandableIds(tree).sort()).toEqual(["a", "r"]);
    });
});

describe("computeTreeLayout", () => {
    const tree = buildTree(
        [node("r"), node("a"), node("b"), node("c"), node("d")],
        [edge("r", "a"), edge("r", "b"), edge("r", "c"), edge("r", "d")],
    )!;

    it("places every visible node", () => {
        const layout = computeTreeLayout(tree, new Set());
        expect([...layout.keys()].sort()).toEqual(["a", "b", "c", "d", "r"]);
    });

    it("balances top-level branches across both sides", () => {
        const layout = computeTreeLayout(tree, new Set());
        const directions = ["a", "b", "c", "d"].map(
            (id) => layout.get(id)!.direction,
        );
        expect(directions.filter((d) => d === 1)).toHaveLength(2);
        expect(directions.filter((d) => d === -1)).toHaveLength(2);
    });

    it("hides the subtree of a collapsed node", () => {
        const layout = computeTreeLayout(tree, new Set(["r"]));
        expect([...layout.keys()]).toEqual(["r"]);
    });
});
