import { FileTreeNode } from "../file-system/interfaces";
import { OptionsData } from "../application-state";

export interface Tab {
    get tabName(): string;
    get tabPath(): string;
    markAsPristine(): void;
    onAttach(callback: () => void): void;
    onActivate(callback: () => void): void;
    onDetach(callback: () => void): void;
}

export interface TabManager {
    get tabs(): Tab[];
    get activeTab(): Tab;
    mountToDOM(hostElement: HTMLElement): void;
    openEditor(
        treeNode: FileTreeNode,
        fileContent: string,
        editorOptions: OptionsData
    ): void;
}
