import {
    FileTreeNode,
    FileSystemStorageBackend,
} from "../file-system/interfaces";
import Store from "./lib/store";

export interface FileStoreState {
    fileData: Map<FileTreeNode, string>;
}

export interface FileSystemStorage extends Store {}
