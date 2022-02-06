import EventEmitter from "events";

export type FileTreeNode = {
    kind: string;
    children?: FileTreeNode[];
    path: string;
};

export interface FileSystemStorageBackend {
    storeFileData(treeNode: FileTreeNode, data: string): void;
}

export interface FileSystem extends EventEmitter {
    getFileTree(): { nodes: FileTreeNode[] };
    openFile(node: FileTreeNode): void;
}
