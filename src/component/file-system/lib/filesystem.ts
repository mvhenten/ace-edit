const readWrite = "readwrite" as FileSystemPermissionMode;

async function isReadWrite(fileHandle: FileSystemDirectoryHandle) {
    const permissionDescriptor = {
        mode: readWrite,
    };

    const permission = await fileHandle.requestPermission(permissionDescriptor);
    return permission == "granted";
}

type Leaf = {
    kind: string;
    name: string;
    path: string;
    children?: Leaf[];
    self: FileSystemEntry;
};

const MAX_SIZE = 8e6;

export abstract class FileSystemEntry {
    abstract kind: "directory" | "file";

    constructor(
        protected fileSystemHandle: FileSystemHandle,
        protected filePath = ""
    ) {}

    get path() {
        return [this.filePath, this.name].join("/");
    }

    get name() {
        return this.fileSystemHandle.name;
    }

    get leaf() {
        const { name, kind, path } = this;

        const leaf: Leaf = { name, kind, path, self: this };

        if (kind == "directory") leaf["children"] = [];

        return leaf;
    }
}

export class File extends FileSystemEntry {
    public readonly kind = "file";

    constructor(
        protected fileSystemHandle: FileSystemFileHandle,
        protected filePath = ""
    ) {
        super(fileSystemHandle, filePath);
    }

    async getFileData() {
        const fileData = await this.fileSystemHandle.getFile();
        return fileData;
    }

    async getFileText() {
        const fileData = await this.getFileData();

        if (fileData.size > MAX_SIZE)
            throw new Error(
                `File size to large: ${fileData.size}, max ${MAX_SIZE} supported`
            );

        return await fileData.text();
    }

    async writeFile(contents: string) {
        const writable = await this.fileSystemHandle.createWritable();
        await writable.write(contents);
        await writable.close();
    }
}

export class Directory extends FileSystemEntry {
    childNodes = [];
    public readonly kind = "directory";

    constructor(
        protected fileSystemHandle: FileSystemDirectoryHandle,
        protected filePath = ""
    ) {
        super(fileSystemHandle, filePath);
    }

    static async openFilehandleRW(
        fileHandle: void | FileSystemDirectoryHandle
    ) {
        if (!fileHandle) throw new Error("FileHandle undefined");
        if (!(await isReadWrite(fileHandle)))
            throw new Error("File handle is not writable");
        return new Directory(fileHandle);
    }

    async getFileTee() {
        const root = this.leaf;
        const entries = [root];

        while (entries.length) {
            const entry = entries.pop();
            const dir = entry.self as Directory;

            for (const childNode of await dir.children()) {
                const child = childNode.leaf;

                if (child.kind == "directory") {
                    entries.push(child);
                }
                entry.children.push(child);
            }

            delete entry.self;
        }

        return root;
    }

    async writeFile(pathname: string, contents: string) {
        const file = await this.getFileByPath(pathname);
        await file.writeFile(contents);
    }

    async getFileByPath(pathname: string) {
        const entries = await this.children();

        while (entries.length) {
            const entry = entries.pop();
            if (entry.path == pathname) return entry;

            if (entry.kind == "directory")
                entries.push(...(await entry.children()));
        }

        throw new Error(`File not found in tree: ${pathname}`);
    }

    private async getDirectoryHandle(name: string) {
        return this.fileSystemHandle.getDirectoryHandle(name);
    }

    async children() {
        if (!this.childNodes.length) {
            for await (const child of this.fileSystemHandle.values()) {
                let childNode: FileSystemEntry;

                if (child.kind == "directory") {
                    const fileHandle = await this.getDirectoryHandle(
                        child.name
                    );
                    childNode = new Directory(fileHandle, this.path);
                } else {
                    const fileHandle =
                        await this.fileSystemHandle.getFileHandle(child.name);
                    childNode = new File(fileHandle, this.path);
                }

                this.childNodes.push(childNode);
            }
        }
        return [...this.childNodes];
    }
}
