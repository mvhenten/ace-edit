import { FileTreeNode } from "../file-system/interfaces";

// todo replace this with a real file tree
export const FileTree = (props: {
    onItemClick: (element: FileTreeNode) => void;
    tree: { nodes: FileTreeNode[] };
}) => {
    // just flatten the thing
    const flatTree: any[] = [];
    const { onItemClick, tree } = props;
    const stack = tree.nodes;

    while (true) {
        const element = stack.pop();

        if (!element) break;

        if (element.kind == "Directory" && element.children) {
            stack.push(...element.children);
        } else {
            const item = (
                <li className="tree-item" onClick={() => onItemClick(element)}>
                    {element.path}
                </li>
            );
            flatTree.push(item);
        }
    }

    return <ul className="file-tree">{flatTree}</ul>;
};
