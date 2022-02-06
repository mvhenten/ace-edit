import { useState, useEffect } from "preact/hooks";
import { Component, createRef } from "preact";
import { FileTreeNode } from "../file-system/interfaces";
import { AceEditorManager } from "../ace-editor/interfaces";
import {
    FileStoreState,
    FileSystemStorage,
} from "../application-state/interfaces";

const filename = (path: string) => {
    return path.substr(path.lastIndexOf("/") + 1);
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
    fileSystemStore: FileSystemStorage;
    aceEditorManager: AceEditorManager;
}) => {
    const { fileSystemStore, aceEditorManager } = props;
    const [state, setState] = useState(fileSystemStore.getState());

    useEffect(() => {
        const unsubscribe = fileSystemStore.observe((state: FileStoreState) => {
            setState(state);
        });

        return unsubscribe;
    });

    const entries = [];

    for (const [treeNode, fileData] of state.fileData.entries()) {
        entries.push(
            <tab-header slot="tab">{filename(treeNode.path)}</tab-header>,
            <tab-body slot="panel">
                <div className="scroll-box">
                    <AceEditor
                        fileData={fileData}
                        treeNode={treeNode}
                        aceEditorManager={aceEditorManager}
                    />
                </div>
            </tab-body>
        );
    }

    return <tab-container>{entries}</tab-container>;
};
