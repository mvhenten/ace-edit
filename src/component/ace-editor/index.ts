import * as ace from "ace-code";
import { Ace } from "ace-code";
import "ace-code/src/ext/language_tools";
import "ace-code/src/webpack-resolver";

import { AceEditorManager } from "./interfaces";
import { OptionsData, OptionsStore } from "../application-state";
import EventEmitter from "events";
import { FileTreeNode } from "../file-system/interfaces";

type Editor = Ace.Editor;

class Manager extends EventEmitter implements AceEditorManager {
    private editors: Map<HTMLElement, any> = new Map();
    private editorMetaData: WeakMap<Editor, FileTreeNode> = new WeakMap();

    constructor(private optionsStore: OptionsStore) {
        super();
    }

    createEditor(
        targetDomNode: HTMLElement,
        treeNode: FileTreeNode,
        options: OptionsData
    ): void {
        const editor = ace.edit(targetDomNode, {
            // name: treeNode.path,
            // minLines: 100,
            // maxLines: 999,
            // wrap: true,
            // autoScrollEditorIntoView: true,
        });
        options.forEach((value, key) => editor.setOption(key, value));

        editor.renderer.setScrollMargin(10, 10, 10, 10);

        this.editors.set(targetDomNode, editor);
        this.editorMetaData.set(editor, treeNode);
        this.emit("createEditor", editor);
    }

    getMetaData(editor: Ace.Editor): FileTreeNode {
        const meta = this.editorMetaData.get(editor);
        if (!meta)
            throw new Error("Tried to get metadata from an unknown editor");
        return meta;
    }

    destroyEditor(targetDomNode: HTMLElement): void {
        this.getEditor(targetDomNode)?.destroy();
    }

    focus(targetDomNode: HTMLElement): void {
        this.getEditor(targetDomNode)?.focus();
    }

    resize(targetDomNode: HTMLElement): void {
        this.getEditor(targetDomNode)?.resize();
    }

    updateOption(key: string, value: string): void {
        // update options of open editors
        this.editors.forEach((editor) => editor.setOption(key, value));

        // update data in the store
        this.optionsStore.setOption(key, value);
    }

    private getEditor(targetDomNode: HTMLElement) {
        return this.editors.get(targetDomNode);
    }
}

export const createAceManager = (optionsStore: OptionsStore) => {
    return new Manager(optionsStore);
};
