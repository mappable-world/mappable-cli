interface TreeNode {
    nodeName: string;
    attributes: Record<string, string>;
    children?: Array<TreeNode | string>;
}

declare function domToJson(e: Node | ChildNode | null): TreeNode;
