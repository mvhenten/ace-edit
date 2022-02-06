const ace = require("ace-builds/src-noconflict/ace");
require("ace-builds/webpack-resolver");

import { AceEditorManager } from "./interfaces";

class Manager implements AceEditorManager {
    private editors: Map<HTMLElement, any> = new Map();

    createEditor(targetDomNode: HTMLElement) {
        const editor = ace.edit(targetDomNode, {
            theme: "ace/theme/tomorrow_night_eighties",
            mode: "ace/mode/html",
            // minLines: 100,
            maxLines: 999,
            wrap: true,
            autoScrollEditorIntoView: true,
        });

        editor.renderer.setScrollMargin(10, 10, 10, 10);

        // editor.setTheme("ace/theme/twilight");
        // editor.session.setMode("ace/mode/javascript");
        this.editors.set(targetDomNode, editor);
    }
}

export const createAceManager = () => {
    return new Manager();
};
