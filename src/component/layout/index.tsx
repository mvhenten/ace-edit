import { Component, createRef, render } from "preact";
import { FileTree } from "./file-tree";
import { FileSystem, FileTreeNode } from "../file-system/interfaces";

import {
    FileStoreState,
    FileSystemStorage,
} from "../application-state/interfaces";
import { Editor } from "./ace-editor";
import { AceEditorManager } from "../ace-editor/interfaces";

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
                <div className="app-layout-center">
                    <div className="slot-filetree">
                        <FileTree
                            onItemClick={(e) => this.onFileTreeClick(e)}
                            tree={this.props.fileSystem.getFileTree()}
                        />
                    </div>
                    <div className="slot-editor">
                        <Editor
                            aceEditorManager={this.props.aceEditorManager}
                            fileSystemStore={this.props.fileSystemStore}
                        />
                    </div>
                    <div className="slot-preferences"></div>
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
