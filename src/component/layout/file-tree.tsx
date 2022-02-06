import { FileTreeNode } from "../file-system/interfaces";

type FileTreeCallback = (element: FileTreeNode) => void;

type FileTreeProps = {
    onItemClick: FileTreeCallback;
    tree: { nodes: FileTreeNode[] };
};

const FileTreeItemChildren = (props: {
    element: FileTreeNode;
    onItemClick: FileTreeCallback;
}) => {
    const { element, onItemClick } = props;

    if (element.kind !== "Directory") return null;

    return (
        <ul>
            {element.children.map((el) => (
                <FileTreeItem element={el} onItemClick={onItemClick} />
            ))}
        </ul>
    );
};

const FileTreeItem = (props: {
    element: FileTreeNode;
    onItemClick: FileTreeCallback;
}) => {
    const { element, onItemClick } = props;

    const onClick = () => {
        if (element.kind !== "Directory") onItemClick(element);
    };

    const className =
        element.kind === "Directory" ? "tree-item directory" : "tree-item file";

    return (
        <li className={className} onClick={onClick}>
            {element.path}
            <FileTreeItemChildren element={element} onItemClick={onItemClick} />
        </li>
    );
};

// todo replace this with a real file tree
export const FileTree = (props: FileTreeProps) => {
    // just flatten the thing
    const flatTree: any[] = [];
    const { onItemClick, tree } = props;
    const stack = tree.nodes;

    if (tree.nodes.length) {
        const file = tree.nodes[0].children[0];
        setTimeout(() => {
            onItemClick(file);
        }, 500);
    }

    return (
        <ul className="file-tree">
            {tree.nodes.map((el) => (
                <FileTreeItem element={el} onItemClick={onItemClick} />
            ))}
        </ul>
    );
};
