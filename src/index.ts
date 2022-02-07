import { createLayout } from "./component/layout";
import { createFileSystem as createMockFileSystem } from "./component/file-system/file-system-mock";
import { createFileSystem } from "./component/file-system/file-system-web";
import { createApplicationState } from "./component/application-state";
import { createAceManager } from "./component/ace-editor";
import { setupTabPane } from "./component/tab-pane";

const hostElementFactory = () => {
    const el = document.querySelector("body");

    if (!el) throw new Error("Missing dom element!");
    return el;
};

const useMock = /mock=1/.test(document.location.search);

const main = () => {
    const applicationState = createApplicationState();
    const { fileSystemStore } = applicationState;
    const fileSystem = useMock
        ? createMockFileSystem(fileSystemStore)
        : createFileSystem(fileSystemStore);
    const aceEditorManager = createAceManager();

    createLayout({
        aceEditorManager,
        hostElementFactory,
        fileSystem,
        fileSystemStore,
    });
};

setupTabPane();
main();
