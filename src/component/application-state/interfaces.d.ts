import { FileTreeNode } from "../file-system/interfaces";
import Store from "./lib/store";

export type FileTree = { nodes: FileTreeNode[] };

export type FileData = Map<FileTreeNode, string>;

export interface FileStoreState {
    fileData: FileData;
    fileTree: FileTree;
}

export type FileSystemStorage = Store & FileSystemStorageBackend;

export type OptionsData = Map<string, any>;

export interface OptionsStoreState {
    options: OptionsData;
}

export type OptionsStorage = Store & {
    setOption(key: string, value: any): void;
};
