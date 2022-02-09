import * as ace from "ace-code";
import "ace-code/src/ext/language_tools";
import "ace-code/src/webpack-resolver";

import { AceEditorManager } from "./interfaces";
import { OptionsData, OptionsStore } from "../application-state";

class Manager implements AceEditorManager {
    private editors: Map<HTMLElement, any> = new Map();

    constructor(private optionsStore: OptionsStore) {}

    createEditor(targetDomNode: HTMLElement, options: OptionsData): void {
        const editor = ace.edit(targetDomNode, {
            // minLines: 100,
            maxLines: 999,
            wrap: true,
            autoScrollEditorIntoView: true,
        });
        options.forEach((value, key) => editor.setOption(key, value));

        editor.renderer.setScrollMargin(10, 10, 10, 10);

        this.editors.set(targetDomNode, editor);
    }

    updateOption(key: string, value: string): void {
        // update options of open editors
        this.editors.forEach((editor) => editor.setOption(key, value));

        // update data in the store
        this.optionsStore.setOption(key, value);
    }
}

export const createAceManager = (optionsStore: OptionsStore) => {
    return new Manager(optionsStore);
};
