import { FileTreeNode } from "../file-system/interfaces";

import { Component, createRef } from "preact";

import Tree = require("ace-tree/src/tree");
import DataProvider = require("ace-tree/src/data_provider");

const tree = new Tree();
const model = new DataProvider({});
tree.setDataProvider(model);

model.getIconHTML = function (node) {
    if (node.fsNode?.kind == "directory") {
        return "";
    } else {
        return "❮❯";
    }
};

(window as any).tree = tree;
function transform(node: any) {
    const path = node.path || "";
    const name = path.slice(path.lastIndexOf("/") + 1);
    let children = node.nodes || node.children;
    if (children) children = children.map(transform);
    return {
        fsNode: node,
        name,
        children,
    };
}

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

export class FileTreeView extends Component<any> {
    ref = createRef();

    componentDidMount() {
        const props = this.props;
        const { onItemClick } = props;
        const { fileTree } = props;

        tree.container.style.flex = 1;
        tree.container.style.display = "flex";
        this.ref.current.appendChild(tree.container);
        // terrible hack
        tree.container.style.minHeight = "100vh";

        tree.resize();
    }

    updateTreeData() {
        if (!model.root || model.root.fsNode != this.props.fileTree) {
            const treeNodes = transform(this.props.fileTree);
            if (treeNodes.children.length == 1) {
                treeNodes.children[0].isOpen = true;
            }
            model.setRoot(treeNodes);
            tree.on("afterChoose", () => {
                const fsNode = tree.selection.getCursor()?.fsNode;
                if (fsNode && fsNode.kind != "directory") {
                    this.props.onItemClick(fsNode);
                }
            });
        }
    }

    render() {
        this.updateTreeData();
        return (
            <div
                ref={this.ref}
                className="file-tree"
                style="flex: 1; display: flex; height: 100%"
            ></div>
        );
    }
}
