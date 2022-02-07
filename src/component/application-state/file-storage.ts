import Store from "./lib/store";
import { FileTreeNode } from "../file-system/interfaces";

import { FileStoreState, FileSystemStorage, FileTree } from "./interfaces";

export class FileSystemStore extends Store implements FileSystemStorage {
    constructor() {
        super({
            fileData: new Map(),
            fileTree: { nodes: [] },
        } as FileStoreState);
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
