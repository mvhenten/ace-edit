import { Component, createRef } from "preact";
import { FileTreeNode } from "../file-system/interfaces";
import { AceEditorManager } from "../ace-editor/interfaces";
import { FileData } from "../application-state/interfaces";

const filename = (path: string) => {
    return path.substring(path.lastIndexOf("/") + 1);
};

export type AceEditorProps = {
    aceEditorManager: AceEditorManager;
    treeNode: FileTreeNode;
    fileData: string;
};

export class AceEditor extends Component<AceEditorProps> {
    ref = createRef();

    componentDidMount() {
        const { aceEditorManager } = this.props;
        aceEditorManager.createEditor(this.ref.current);
    }

    render() {
        return <pre ref={this.ref}>{this.props.fileData}</pre>;
    }
}

export const Editor = (props: {
    aceEditorManager: AceEditorManager;
    fileData: FileData;
}) => {
    const { fileData, aceEditorManager } = props;
    const entries = [];

    for (const [treeNode, fileContents] of fileData.entries()) {
        entries.push(
            <tab-header slot="tab">{filename(treeNode.path)}</tab-header>,
            <tab-body slot="panel">
                <div className="scroll-box">
                    <AceEditor
                        fileData={fileContents}
                        treeNode={treeNode}
                        aceEditorManager={aceEditorManager}
                    />
                </div>
            </tab-body>
        );
    }

    return <tab-container>{entries}</tab-container>;
};
