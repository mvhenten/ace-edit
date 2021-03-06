import EventEmitter from "events";
import { FileTree } from "../application-state";
import {
    FileSystem,
    FileTreeNode,
    FileSystemStorageBackend,
} from "./interfaces";

export const fakeFileTree = {
    nodes: [
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
                    path: "/test/scrolllme",
                    children: new Array(100).fill("x").map((n, i) => {
                        return {
                            kind: "file",
                            path: `/test/scrolllme/content-${i}.js`,
                        };
                    }),
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
    return `// file: ${data.path}
function hackathon() {
    let daysToHack = 5;
    const eat = () => console.log("eating...");
    const sleep = () => console.log("sleeping...");
    const hack = (prototype) => {
        console.log("hacking...");
        prototype.push("🚀");
    }

    const prototype = [];
    while (daysToHack--) {
        eat();
        sleep();
        hack(prototype);
    }

    return prototype;
}

hackathon();`;
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
        const fileText = fakeFileSystemData(treeNode);
        this.fileSystemStorage.storeFileData(treeNode, fileText);
        this.emit("openFile", treeNode, fileText);
    }

    writeFile(node: FileTreeNode, data: string): void {
        console.log("Write file", node.path, data);
        this.emit("writeFile", node);
    }
}

export const createFileSystem = (
    fileSystemStorage: FileSystemStorageBackend
): FileSystem => {
    return new FileSystemMock(fileSystemStorage);
};
