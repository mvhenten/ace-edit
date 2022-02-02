import EventEmitter from "events";
import { FileSystem } from "./interfaces";

class FileSystemMock extends EventEmitter implements FileSystem {
    open(_fileHandle:any): void {}

    listFileTree() {
        
    }

}

export const createFileSystem = ():FileSystem => {
    return new FileSystemMock();
}