import { Component, createRef, render } from "preact";
import { FileTreeView } from "./file-tree";
import { FileSystem, FileTreeNode } from "../file-system/interfaces";

import {
    FileData,
    FileSystemStore,
    FileTree,
    OptionsData,
    OptionsStore,
} from "../application-state";
import { Editor } from "./ace-editor";
import { AceEditorManager } from "../ace-editor/interfaces";
import { Preferences } from "./preferences";

// Types for props
type AppProps = {
    title: string;
    fileSystem: FileSystem;
    fileSystemStore: FileSystemStore;
    aceEditorManager: AceEditorManager;
    optionsStore: OptionsStore;
};

// Types for state
type AppState = {
    toggled: boolean;
    fileTree: FileTree;
    fileData: FileData;
    options: OptionsData;
};

const FileTreeNotification = (props: {
    onClick: () => void;
    fileTree: FileTree;
}) => {
    const { fileTree, onClick } = props;

    if (fileTree.nodes.length) return;

    return (
        <div className="alert alert-info">
            You haven not opened any files yet.
            <button onClick={onClick}>Open file picker</button>
        </div>
    );
};

class App extends Component<AppProps, AppState> {
    ref = createRef();

    constructor({ name }: { name: string }) {
        super();
        this.state = {
            toggled: false,
            fileTree: { nodes: [] },
            fileData: new Map(),
            options: OptionsStore.initialOptions,
        };
    }

    componentDidMount(): void {
        this.props.fileSystemStore.observe((newState) => {
            const { fileTree, fileData } = newState;
            this.setState({ fileTree, fileData });
        });

        this.props.optionsStore.observe(({ options }) => {
            this.setState({ options });
        });

        this.props.fileSystem.getFileTree();
    }

    onOpenFileClick() {
        this.props.fileSystem.open();
    }

    onFileTreeClick(element: FileTreeNode) {
        this.props.fileSystem.openFile(element);
    }

    onOptionChange(key: string, value: any) {
        this.props.aceEditorManager.updateOption(key, value);
    }

    render() {
        const { fileTree } = this.props.fileSystemStore.getState();

        return (
            <div className="app-layout">
                <div className="slot-notifications">
                    <FileTreeNotification
                        onClick={() => this.onOpenFileClick()}
                        fileTree={this.state.fileTree}
                    />
                </div>
                <div className="app-layout-center">
                    <div className="slot-filetree">
                        <FileTreeView
                            fileTree={this.state.fileTree}
                            onItemClick={(e) => this.onFileTreeClick(e)}
                        />
                    </div>
                    <div className="slot-editor">
                        <Editor
                            aceEditorManager={this.props.aceEditorManager}
                            fileData={this.state.fileData}
                            options={this.state.options}
                        />
                    </div>
                    <div className="slot-preferences">
                        <Preferences
                            options={this.state.options}
                            onOptionChange={(key, value) =>
                                this.onOptionChange(key, value)
                            }
                        />
                    </div>
                </div>
            </div>
        );
    }
}

type ApplicationLayoutProps = {
    hostElementFactory: () => Element;
    fileSystem: FileSystem;
    fileSystemStore: FileSystemStore;
    aceEditorManager: AceEditorManager;
    optionsStore: OptionsStore;
};

export const createLayout = ({
    hostElementFactory,
    fileSystem,
    fileSystemStore,
    aceEditorManager,
    optionsStore,
}: ApplicationLayoutProps) => {
    const targetDomNode = hostElementFactory();
    render(
        <App
            aceEditorManager={aceEditorManager}
            fileSystemStore={fileSystemStore}
            fileSystem={fileSystem}
            optionsStore={optionsStore}
            title="Hello world"
        />,
        targetDomNode
    );
};
