import EventEmitter from "events";
import {
    FileSystem,
    FileTreeNode,
    FileSystemStorageBackend,
} from "./interfaces";

export const fakeFileTree = {
    nodes: [
        {
            kind: "Directory",
            path: "/test",
            children: [
                {
                    kind: "File",
                    path: "/test/index.js",
                },
                {
                    kind: "File",
                    path: "/test/README.md",
                },
                {
                    kind: "File",
                    path: "/test/package.json",
                },
                {
                    kind: "Directory",
                    path: "/test/src",
                    children: [
                        {
                            kind: "File",
                            path: "/test/src/demo.js",
                        },
                        {
                            kind: "File",
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

    open(_fileHandle: any): void {}

    getFileTree() {
        return fakeFileTree;
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
