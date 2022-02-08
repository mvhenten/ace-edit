import { FileTreeNode } from "../file-system/interfaces";
import { FileTree } from "../application-state";

type FileTreeCallback = (element: FileTreeNode) => void;

const FileTreeItemChildren = (props: {
    element: FileTreeNode;
    onItemClick: FileTreeCallback;
}) => {
    const { element, onItemClick } = props;

    if (element.kind !== "directory") return null;

    return (
        <ul>
            {element.children.map((el) => (
                <FileTreeItem
                    key={el.path}
                    element={el}
                    onItemClick={onItemClick}
                />
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
        if (element.kind !== "directory") onItemClick(element);
    };

    const className =
        element.kind === "directory" ? "tree-item directory" : "tree-item file";

    return (
        <li className={className} onClick={onClick}>
            {element.path}
            <FileTreeItemChildren element={element} onItemClick={onItemClick} />
        </li>
    );
};

// todo replace this with a real file tree
export const FileTreeView = (props: {
    onItemClick: FileTreeCallback;
    fileTree: FileTree;
}) => {
    const { onItemClick } = props;
    const { fileTree } = props;

    if (!fileTree.nodes.length) return null;

    return (
        <ul className="file-tree">
            {fileTree.nodes.map((el) => (
                <FileTreeItem
                    key={el.path}
                    element={el}
                    onItemClick={onItemClick}
                />
            ))}
        </ul>
    );
};
