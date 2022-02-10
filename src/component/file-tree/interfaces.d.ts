import { FileTree } from "../application-state";

export interface FileTreeWidget extends HTMLElement {
    updateTreeData(fileTree: FileTree): void;
}
