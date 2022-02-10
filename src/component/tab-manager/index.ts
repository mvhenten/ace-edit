import { BoxPanel, DockPanel, Widget } from "@lumino/widgets";
import { Tab, TabManager } from "./interfaces";
import { FileTreeNode, FileSystem } from "../file-system/interfaces";
import { AceEditorManager } from "../ace-editor/interfaces";
import { OptionsData, OptionsStore } from "../application-state";

class AceTabManager implements TabManager {
    private editorOptions: OptionsData = OptionsStore.initialOptions;
    private mounted = false;
    private mainPanel: BoxPanel;
    private dockPanel: DockPanel;
    private _tabs: AceTabWidget[] = [];
    private _activeTab: AceTabWidget;

    constructor(
        private aceEditorManager: AceEditorManager,
        private fileSystem: FileSystem,
        private optionsStore: OptionsStore
    ) {
        this.optionsStore.observe((state) => {
            this.editorOptions = state.options;
        });

        this.fileSystem.on("openFile", (treeNode, fileContent) => {
            this.openEditor(treeNode, fileContent, this.editorOptions);
        });
    }

    get tabs(): Tab[] {
        return this._tabs;
    }

    get activeTab(): Tab {
        return this._activeTab;
    }

    mountToDOM(hostElement: HTMLElement): void {
        if (this.mounted) {
            throw new Error("Already mounted.");
        }

        this.dockPanel = new DockPanel();
        this.dockPanel.tabsConstrained = true;
        this.dockPanel.tabsMovable = true;
        this.dockPanel.node.classList.add("dock-panel");
        BoxPanel.setStretch(this.dockPanel, 1);

        this.mainPanel = new BoxPanel({
            direction: "left-to-right",
            spacing: 0,
        });
        this.mainPanel.node.classList.add("main-panel");
        this.mainPanel.addWidget(this.dockPanel);
        new ResizeObserver(() => this.mainPanel.update()).observe(hostElement);
        Widget.attach(this.mainPanel, hostElement);

        this.mounted = true;
    }

    openEditor(
        treeNode: FileTreeNode,
        fileContent: string,
        editorOptions: OptionsData
    ): void {
        if (!this.mounted) {
            console.error("The tab manager is not initialized yet.");
            return;
        }

        const existingTab = this._tabs.find((x) => x.tabPath === treeNode.path);
        if (existingTab) {
            this.dockPanel.activateWidget(existingTab);
            return;
        }

        const tab = new AceTabWidget(
            this.aceEditorManager,
            treeNode,
            fileContent,
            editorOptions
        );
        tab.onAttach(() => {
            this.tabs.push(tab);
        });
        tab.onActivate(() => {
            this._activeTab = tab;
        });
        tab.onDetach(() => {
            this._activeTab = undefined;
            const tabIndex = this.tabs.indexOf(tab);
            if (tabIndex >= 0) {
                this.tabs.splice(tabIndex, 1);
            }
        });
        this.dockPanel.addWidget(tab);
        this.dockPanel.activateWidget(tab);
    }
}

class AceTabWidget extends Widget implements Tab {
    static createNode(fileContent: string): HTMLElement {
        const node = document.createElement("div");
        const content = document.createElement("pre");
        content.classList.add("editor-content");
        content.textContent = fileContent;
        node.appendChild(content);
        return node;
    }

    private onAttachCallback: () => void;
    private onActivateCallback: () => void;
    private onDetachCallback: () => void;

    constructor(
        private aceEditorManager: AceEditorManager,
        private treeNode: FileTreeNode,
        fileContent: string,
        private editorOptions: OptionsData
    ) {
        super({ node: AceTabWidget.createNode(fileContent) });

        this.setFlag(Widget.Flag.DisallowLayout);
        this.addClass("tab");
        this.title.label = this.getFilename(treeNode.path);
        this.title.closable = true;
    }

    get editorNode(): HTMLElement {
        return this.node.getElementsByClassName(
            "editor-content"
        )[0] as HTMLElement;
    }

    get tabName(): string {
        return this.title.label;
    }

    get tabPath(): string {
        return this.treeNode.path;
    }

    onAttach(callback: () => void): void {
        this.onAttachCallback = callback;
    }

    onActivate(callback: () => void): void {
        this.onActivateCallback = callback;
    }

    onDetach(callback: () => void): void {
        this.onDetachCallback = callback;
    }

    protected onAfterAttach(): void {
        this.aceEditorManager.createEditor(
            this.editorNode,
            this.treeNode,
            this.editorOptions
        );

        if (this.onAttachCallback) {
            this.onAttachCallback();
        }
    }

    protected onActivateRequest(): void {
        if (this.isAttached) {
            this.aceEditorManager.resize(this.editorNode);
            this.aceEditorManager.focus(this.editorNode);

            if (this.onActivateCallback) {
                this.onActivateCallback();
            }
        }
    }

    protected onAfterDetach(): void {
        this.aceEditorManager.destroyEditor(this.editorNode);

        if (this.onDetachCallback) {
            this.onDetachCallback();
        }
    }

    private getFilename(path: string) {
        return path.substring(path.lastIndexOf("/") + 1);
    }
}

export const createTabManager = (
    aceEditorManager: AceEditorManager,
    fileSystem: FileSystem,
    optionsStore: OptionsStore
) => {
    return new AceTabManager(aceEditorManager, fileSystem, optionsStore);
};
