import { FileTreeNode } from "../file-system/interfaces";

import { Component, createRef } from "preact";

import Tree = require("ace-tree/src/tree");
import DataProvider = require("ace-tree/src/data_provider");
import { escapeHTML } from "ace-code/src/lib/lang";
import { FileTree } from "../application-state";

const tree = new Tree();
const model = new DataProvider({});
tree.setDataProvider(model);

model.getIconHTML = function (node) {
    if (node.kind == "directory") {
        return "";
    } else {
        return "❮❯";
    }
};

model.getCaptionHTML = function (node) {
    const path = node.path || "";
    const name = path.slice(path.lastIndexOf("/") + 1);
    return escapeHTML(name || "");
};

(window as any).tree = tree;

type FileTreeCallback = (element: FileTreeNode) => void;

export class FileTreeView extends Component<{
    fileTree: FileTree;
    onItemClick: FileTreeCallback;
}> {
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
        if (!model.root || model.root != this.props.fileTree) {
            const treeNodes = this.props.fileTree;
            if (treeNodes.children.length == 1) {
                (treeNodes.children[0] as any).isOpen = true;
            }
            model.setRoot(treeNodes);
            tree.on("afterChoose", () => {
                const fsNode = tree.selection.getCursor();
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
