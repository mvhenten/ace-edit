import EventEmitter from "events";
import { FileTree } from "../application-state/interfaces";

export type FileTreeNode = {
    kind: string;
    children?: FileTreeNode[];
    path: string;
};

export interface FileSystemStorageBackend {
    storeFileTree(fileTree: FileTree);
    storeFileData(treeNode: FileTreeNode, data: string): void;
}

export interface FileSystem extends EventEmitter {
    getFileTree(): void;
    openFile(node: FileTreeNode): void;
    open(): void;
}
