import ace = require("ace-builds/src-noconflict/ace");
require("ace-builds/webpack-resolver");

import { AceEditorManager } from "./interfaces";
import { EditorStorage, OptionsData } from "../application-state/interfaces";

class Manager implements AceEditorManager {
    constructor(private editorStore: EditorStorage) {}

    createEditor(targetDomNode: HTMLElement, options: OptionsData) {
        const editor = ace.edit(targetDomNode, {
            theme: "ace/theme/tomorrow_night_eighties",
            mode: "ace/mode/html",
            // minLines: 100,
            maxLines: 999,
            wrap: true,
            autoScrollEditorIntoView: true,
        });
        options.forEach((value, key) => editor.setOption(key, value));

        editor.renderer.setScrollMargin(10, 10, 10, 10);
        // editor.setTheme("ace/theme/twilight");
        // editor.session.setMode("ace/mode/javascript");

        this.editorStore.openEditor(editor);
    }
}

export const createAceManager = (editorStore: EditorStorage) => {
    return new Manager(editorStore);
};
