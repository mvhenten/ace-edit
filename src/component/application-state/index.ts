import { FileSystemStore } from "./file-storage";
import { EditorStore } from "./editor-store";
import { OptionsStore } from "./options-store";

export const createApplicationState = () => {
    return {
        fileSystemStore: new FileSystemStore(),
        editorStore: new EditorStore(),
        optionsStore: new OptionsStore(),
    };
};
