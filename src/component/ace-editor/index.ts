const ace = require("ace-builds/src-noconflict/ace");
require("ace-builds/webpack-resolver");

import { AceEditorManager } from "./interfaces";

class Manager implements AceEditorManager {
    private editors: Map<HTMLElement, any> = new Map();

    createEditor(targetDomNode: HTMLElement) {
        const editor = ace.edit(targetDomNode);

        editor.setTheme("ace/theme/twilight");
        editor.session.setMode("ace/mode/javascript");
        this.editors.set(targetDomNode, editor);
    }
}

export const createAceManager = () => {
    return new Manager();
};
