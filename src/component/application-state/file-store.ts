import Store from "./lib/store";
import {
    FileSystemStorageBackend,
    FileTreeNode,
} from "../file-system/interfaces";

export type FileTree = { children: FileTreeNode[] };

export type FileData = Map<FileTreeNode, string>;

export interface FileStoreState {
    fileData: FileData;
    fileTree: FileTree;
}

export class FileSystemStore
    extends Store<FileStoreState>
    implements FileSystemStorageBackend
{
    constructor() {
        super({
            fileData: new Map(),
            fileTree: { children: [] },
        });
    }

    storeFileData(treeNode: FileTreeNode, data: string) {
        const { fileData } = this.getState();
        fileData.set(treeNode, data);
        this.setState({ fileData });
    }

    storeFileTree(fileTree: FileTree) {
        this.setState({ fileTree });
    }
}
