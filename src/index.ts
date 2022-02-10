import { createAceManager } from "./component/ace-editor";
import { createLayout } from "./component/layout";
import { createFileSystem as createMockFileSystem } from "./component/file-system/file-system-mock";
import { createFileSystem } from "./component/file-system/file-system-web";
import { createApplicationState } from "./component/application-state";
import { createKeyboardManager } from "./component/keyboard";

import { setupTabPane } from "./component/tab-pane";
import { setupBoxResizable } from "./component/box-resizable";
import { setupAceTree } from "./component/ace-tree";

import "./style/index";

const hostElementFactory = () => {
    const el = document.querySelector("body");

    if (!el) throw new Error("Missing dom element!");
    return el;
};

const useMock = /mock=1/.test(document.location.search);

const main = () => {
    const applicationState = createApplicationState();
    const { fileSystemStore, optionsStore } = applicationState;
    const fileSystem = useMock
        ? createMockFileSystem(fileSystemStore)
        : createFileSystem(fileSystemStore);
    const aceEditorManager = createAceManager(optionsStore);
    createKeyboardManager(aceEditorManager, fileSystem);

    createLayout({
        aceEditorManager,
        hostElementFactory,
        fileSystem,
        fileSystemStore,
        optionsStore,
    });
};

setupTabPane();
setupBoxResizable();
setupAceTree();
main();
