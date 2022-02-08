import { FileSystemStore } from "./file-storage";
import { OptionsStore } from "./options-store";

export const createApplicationState = () => {
    return {
        fileSystemStore: new FileSystemStore(),
        optionsStore: new OptionsStore(),
    };
};
