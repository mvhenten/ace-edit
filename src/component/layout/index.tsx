import { Component, createRef, render } from "preact";
import { FileTreeView } from "./file-tree";
import { FileSystem, FileTreeNode } from "../file-system/interfaces";

import {
    FileData,
    FileSystemStorage,
    FileTree,
    EditorData,
    EditorStorage,
    OptionsData,
    OptionsStorage,
} from "../application-state/interfaces";
import { Editor } from "./ace-editor";
import { AceEditorManager } from "../ace-editor/interfaces";
import { Preferences } from "./preferences";

// Types for props
type AppProps = {
    title: string;
    fileSystem: FileSystem;
    fileSystemStore: FileSystemStorage;
    aceEditorManager: AceEditorManager;
    editorStore: EditorStorage;
    optionsStore: OptionsStorage;
};

// Types for state
type AppState = {
    toggled: boolean;
    fileTree: FileTree;
    fileData: FileData;
    options: OptionsData;
    editors: EditorData;
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
            options: new Map<string, any>([
                ["mode", "ace/mode/html"],
                ["fontSize", 12],
                ["showGutter", true],
            ]),
            editors: new Map(),
        };
    }

    componentDidMount(): void {
        this.props.fileSystemStore.observe((newState) => {
            const { fileTree, fileData } = newState;
            this.setState({ fileTree, fileData });
        });

        this.props.editorStore.observe(({ editors }) => {
            this.setState({ editors });
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
        // update options of open editors
        for (const editor of this.state.editors.values()) {
            editor.setOption(key, value);
        }

        // update options in the store
        this.props.optionsStore.setValue(key, value);
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
    fileSystemStore: FileSystemStorage;
    aceEditorManager: AceEditorManager;
    editorStore: EditorStorage;
    optionsStore: OptionsStorage;
};

export const createLayout = ({
    hostElementFactory,
    fileSystem,
    fileSystemStore,
    aceEditorManager,
    editorStore,
    optionsStore,
}: ApplicationLayoutProps) => {
    const targetDomNode = hostElementFactory();
    render(
        <App
            aceEditorManager={aceEditorManager}
            fileSystemStore={fileSystemStore}
            fileSystem={fileSystem}
            editorStore={editorStore}
            optionsStore={optionsStore}
            title="Hello world"
        />,
        targetDomNode
    );
};
