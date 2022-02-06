import { createLayout } from "./component/layout";
import { createFileSystem } from "./component/file-system/file-system-mock";
import { createApplicationState } from "./component/application-state";
import { createAceManager } from "./component/ace-editor";
const hostElementFactory = () => {
    const el = document.querySelector("body");

    if (!el) throw new Error("Missing dom element!");
    return el;
};

const main = () => {
    const applicationState = createApplicationState();
    const { fileSystemStore } = applicationState;
    const fileSystem = createFileSystem(fileSystemStore);
    const aceEditorManager = createAceManager();

    createLayout({
        aceEditorManager,
        hostElementFactory,
        fileSystem,
        fileSystemStore,
    });
};

main();
