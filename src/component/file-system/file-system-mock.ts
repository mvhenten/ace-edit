import EventEmitter from "events";
import { FileTree } from "../application-state";
import {
    FileSystem,
    FileTreeNode,
    FileSystemStorageBackend,
} from "./interfaces";

export const fakeFileTree = {
    children: [
        {
            kind: "directory",
            path: "/test",
            children: [
                {
                    kind: "file",
                    path: "/test/index.js",
                },
                {
                    kind: "file",
                    path: "/test/README.md",
                },
                {
                    kind: "file",
                    path: "/test/package.json",
                },
                {
                    kind: "directory",
                    path: "/test/src",
                    children: [
                        {
                            kind: "file",
                            path: "/test/src/demo.js",
                        },
                        {
                            kind: "file",
                            path: "/test/src/demo-test.js",
                        },
                    ],
                },
            ],
        },
    ],
};

const fakeFileSystemData = (data: FileTreeNode) => {
    return `
This is just some fake data
it was generated to provide the contents of a file called ${data.path}   
But it really does not exist.
    `;
};

class FileSystemMock extends EventEmitter implements FileSystem {
    constructor(private fileSystemStorage: FileSystemStorageBackend) {
        super();
    }

    open(): void {
        console.error("FileSystem.open called on mock");
    }

    getFileTree() {
        const fileTree = JSON.parse(
            JSON.stringify(fakeFileTree)
        ) as any as FileTree;
        this.fileSystemStorage.storeFileTree(fileTree);
    }

    openFile(treeNode: FileTreeNode) {
        this.fileSystemStorage.storeFileData(
            treeNode,
            fakeFileSystemData(treeNode)
        );
    }
}

export const createFileSystem = (
    fileSystemStorage: FileSystemStorageBackend
): FileSystem => {
    return new FileSystemMock(fileSystemStorage);
};
