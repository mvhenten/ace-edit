import { FileTreeNode } from "../file-system/interfaces";
import { Component, createRef } from "preact";
import { FileTree } from "../application-state";
import { FileTreeWidget } from "../file-tree/interfaces";

type FileTreeCallback = (element: FileTreeNode) => void;

export const NoFileTree = (props: {
    fileTree: FileTree;
    onOpenFile: () => void;
}) => {
    if (props.fileTree.nodes.length) return null;

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
};

export class AceTreeView extends Component<FileTreeViewProps> {
    ref = createRef();

    componentDidMount() {
        const aceTree = this.ref.current as FileTreeWidget;
        aceTree.updateTreeData(this.props.fileTree);
        aceTree.addEventListener("item-click", (evt: CustomEvent) => {
            this.props.onItemClick(evt.detail);
        });
    }

    render() {
        return (
            <ace-tree ref={this.ref}>
                <div slot="file-tree" />
            </ace-tree>
        );
    }
}

// Avoid attaching ace-tree to the DOM unless needed
export const FileTreeView = (props: FileTreeViewProps) => {
    if (!props.fileTree.nodes.length) return null;

    return <AceTreeView {...props} />;
};
