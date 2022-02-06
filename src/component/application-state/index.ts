import { FileSystemStore } from "./file-storage";

export const createApplicationState = () => {
    return {
        fileSystemStore: new FileSystemStore(),
    };
};
