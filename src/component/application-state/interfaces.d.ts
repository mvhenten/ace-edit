import { FileTreeNode } from "../file-system/interfaces";
import Store from "./lib/store";

export type FileTree = { nodes: FileTreeNode[] };

export type FileData = Map<FileTreeNode, string>;

export interface FileStoreState {
    fileData: FileData;
    fileTree: FileTree;
}

export type FileSystemStorage = Store;
