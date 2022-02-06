import { Component, createRef, render } from "preact";
import { FileTree } from "./file-tree";
import { FileSystem, FileTreeNode } from "../file-system/interfaces";
import { useState, useEffect } from "preact/hooks";

import {
    FileStoreState,
    FileSystemStorage,
} from "../application-state/interfaces";
import { AceEditor } from "./ace-editor";
import { AceEditorManager } from "../ace-editor/interfaces";

const filename = (path: string) => {
    return path.substr(path.lastIndexOf("/") + 1);
};

const Editor = (props: {
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

    for (let [treeNode, fileData] of state.fileData.entries()) {
        entries.push(
            <tab-header slot="tab">{filename(treeNode.path)}</tab-header>,
            <tab-body slot="panel">
                <div class="scroll-box">
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

// Types for props
type ExpandableProps = {
    title: string;
    fileSystem: FileSystem;
    fileSystemStore: FileSystemStorage;
    aceEditorManager: AceEditorManager;
};

// Types for state
type ExpandableState = {
    toggled: boolean;
};

class App extends Component<ExpandableProps, ExpandableState> {
    ref = createRef();

    constructor({ name }: { name: string }) {
        super();
        this.state = { toggled: false };
    }

    onFileTreeClick(element: FileTreeNode) {
        this.props.fileSystem.openFile(element);
    }

    render() {
        return (
            <div className="app-layout">
                <div className="slot-notifications">notifications</div>
                <div class="app-layout-center">
                    <div class="slot-filetree">
                        <FileTree
                            onItemClick={(e) => this.onFileTreeClick(e)}
                            tree={this.props.fileSystem.getFileTree()}
                        />
                    </div>
                    <div class="slot-editor">
                        <Editor
                            aceEditorManager={this.props.aceEditorManager}
                            fileSystemStore={this.props.fileSystemStore}
                        />
                    </div>
                    <div class="slot-preferences"></div>
                </div>
            </div>
        );
    }
}

type ApplicationLayoutProps = {
    hostElementFactory: () => Element;
    fileSystem: FileSystem;
    fileSystemStore: FileSystemStorage;
    aceEditorManager: AceEditorManager;
};

export const createLayout = ({
    hostElementFactory,
    fileSystem,
    fileSystemStore,
    aceEditorManager,
}: ApplicationLayoutProps) => {
    const targetDomNode = hostElementFactory();
    render(
        <App
            aceEditorManager={aceEditorManager}
            fileSystemStore={fileSystemStore}
            fileSystem={fileSystem}
            title="Hello world"
        />,
        targetDomNode
    );
};
