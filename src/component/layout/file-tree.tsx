import { FileTreeNode } from "../file-system/interfaces";

import { Component, createRef } from "preact";

import Tree = require("ace-tree/src/tree");
import DataProvider = require("ace-tree/src/data_provider");
import { FileTree } from "../application-state";

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

const NoFileTree = (props: { onOpenFile: () => void }) => {
    return (
        <div className="padding-1 flex col between">
            <p>You have not added a folder to the workspace yet.</p>
            <button
                onClick={props.onOpenFile}
                className="solid button info margin-vertical-1"
            >
                Open Folder
            </button>
        </div>
    );
};

type FileTreeViewProps = {
    onOpenFile: () => void;
    onItemClick: FileTreeCallback;
    fileTree: FileTree;
}

export class FileTreeView extends Component<FileTreeViewProps> {
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
        const { onItemClick, onOpenFile, fileTree } = this.props;
    
        if (!fileTree.nodes.length)
            return <NoFileTree onOpenFile={onOpenFile} />;    

        return (
            <div
                ref={this.ref}
                className="file-tree"
                style="flex: 1; display: flex; height: 100%"
            ></div>
        );
    }
}
