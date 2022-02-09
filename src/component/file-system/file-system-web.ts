import EventEmitter from "events";
import {
    FileSystem,
    FileTreeNode,
    FileSystemStorageBackend,
} from "./interfaces";

import { Directory } from "./lib/filesystem";

class FileSystemWeb extends EventEmitter implements FileSystem {
    private directory: Directory | void;

    private get dir(): Directory {
        if (!this.directory)
            throw new Error("Accessing directory before created");
        return this.directory;
    }

    constructor(private fileSystemStorage: FileSystemStorageBackend) {
        super();
    }

    async open(): Promise<void> {
        const handle = await window
            .showDirectoryPicker()
            .catch((err) => console.error("showDirectoryPicker:", err.message));

        if (handle) {
            const { err, dir } = await Directory.openFilehandleRW(handle)
                .then((dir) => ({ dir, err: null }))
                .catch((err) => ({ err, dir: null }));

            this.directory = dir;
            this.getFileTree();
        }
    }

    async getFileTree() {
        if (this.directory) {
            const children = [await this.dir.getFileTee()];
            this.fileSystemStorage.storeFileTree({ children });
        }
    }

    async openFile(treeNode: FileTreeNode) {
        const file = await this.dir.getFileByPath(treeNode.path);
        const fileText = await file.getFileText();

        this.fileSystemStorage.storeFileData(treeNode, fileText);
    }
}

export const createFileSystem = (
    fileSystemStorage: FileSystemStorageBackend
): FileSystem => {
    return new FileSystemWeb(fileSystemStorage);
};
