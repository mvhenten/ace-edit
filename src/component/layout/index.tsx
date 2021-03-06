import { Component, createRef, render } from "preact";
import { NoFileTree, FileTreeView } from "./file-tree";
import { FileSystem, FileTreeNode } from "../file-system/interfaces";

import {
    FileData,
    FileSystemStore,
    FileTree,
    OptionsData,
    OptionsStore,
} from "../application-state";
import { AceEditorManager } from "../ace-editor/interfaces";
import { preferenceData } from "../preferences";
import { PreferencesPanel } from "./preferences-panel";
import { TabManager } from "../tab-manager/interfaces";
import { WelcomePage } from "./welcome";

// Types for props
type AppProps = {
    title: string;
    fileSystem: FileSystem;
    fileSystemStore: FileSystemStore;
    aceEditorManager: AceEditorManager;
    tabManager: TabManager;
    optionsStore: OptionsStore;
};

// Types for state
type AppState = {
    toggled: boolean;
    fileTree: FileTree;
    fileData: FileData;
    options: OptionsData;
    leftPaneCollapsed: string;
    rightPaneCollapsed: string;
};

class App extends Component<AppProps, AppState> {
    editorRef = createRef();

    constructor() {
        super();
        this.state = {
            toggled: false,
            fileTree: { nodes: [] },
            fileData: new Map(),
            options: OptionsStore.initialOptions,
            leftPaneCollapsed: "",
            rightPaneCollapsed: "collapsed",
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

        // initialize the tab manager
        const editorArea = this.editorRef.current;
        this.props.tabManager.mountToDOM(editorArea);

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
        const onFileTreeToggle = () => {
            let { leftPaneCollapsed } = this.state;
            leftPaneCollapsed = leftPaneCollapsed == "" ? "collapsed" : "";
            this.setState({ leftPaneCollapsed });
        };

        const onPreferencesToggle = () => {
            let { rightPaneCollapsed } = this.state;
            rightPaneCollapsed = rightPaneCollapsed == "" ? "collapsed" : "";
            this.setState({ rightPaneCollapsed });
        };

        return (
            <div className="app-layout solid dark">
                <div className="slot-notifications"></div>
                <div className="app-layout-center">
                    <div className="slot-filetree solid dark darken">
                        <div className="button-bar button-bar-vertical button-bar-left solid dark">
                            <div
                                className="solid dark darken button"
                                onClick={onFileTreeToggle}
                            >
                                filesystem
                            </div>
                        </div>
                        <box-resizable
                            width={280}
                            value={this.state.leftPaneCollapsed}
                            data-collapsed={this.state.leftPaneCollapsed}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    flexDirection: "column",
                                }}
                                slot="resizable-content"
                            >
                                <div className="padding-1">filesystem</div>
                                <NoFileTree
                                    fileTree={this.state.fileTree}
                                    onOpenFile={() => this.onOpenFileClick()}
                                />
                                <FileTreeView
                                    fileTree={this.state.fileTree}
                                    onItemClick={(e) => this.onFileTreeClick(e)}
                                    onOpenFile={() => this.onOpenFileClick()}
                                />
                            </div>
                        </box-resizable>
                    </div>
                    <div
                        className="slot-editor darken darken dark"
                        ref={this.editorRef}
                    >
                        <WelcomePage fileTree={this.state.fileTree} />
                    </div>
                    <div className="slot-preferences">
                        <box-resizable
                            data-resizeDirection="left"
                            width={300}
                            value={this.state.rightPaneCollapsed}
                            data-collapsed={this.state.rightPaneCollapsed}
                        >
                            <div slot="resizable-content">
                                <PreferencesPanel
                                    preferences={preferenceData}
                                    options={this.state.options}
                                    onOptionChange={(key, value) =>
                                        this.onOptionChange(key, value)
                                    }
                                />
                            </div>
                        </box-resizable>
                        <div className="button-bar button-bar-vertical solid dark">
                            <div
                                className="solid dark darken button"
                                onClick={onPreferencesToggle}
                            >
                                preferences
                            </div>
                        </div>
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
    tabManager: TabManager;
    optionsStore: OptionsStore;
};

export const createLayout = ({
    hostElementFactory,
    fileSystem,
    fileSystemStore,
    aceEditorManager,
    tabManager,
    optionsStore,
}: ApplicationLayoutProps) => {
    const targetDomNode = hostElementFactory();
    render(
        <App
            aceEditorManager={aceEditorManager}
            tabManager={tabManager}
            fileSystemStore={fileSystemStore}
            fileSystem={fileSystem}
            optionsStore={optionsStore}
            title="Hello world"
        />,
        targetDomNode
    );
};
