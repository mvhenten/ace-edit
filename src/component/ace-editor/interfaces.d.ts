import { Ace } from "ace-code";
import EventEmitter from "events";
import { FileTreeNode } from "../file-system/interfaces";

interface AceEditorManagerEvents {
    createEditor: (editor: Ace.Editor) => void;
}

export interface AceEditorManager extends EventEmitter {
    on<U extends keyof AceEditorManagerEvents>(
        event: U,
        listener: AceEditorManagerEvents[U]
    ): this;

    emit<U extends keyof AceEditorManagerEvents>(
        event: U,
        ...args: Parameters<AceEditorManagerEvents[U]>
    ): boolean;

    createEditor(
        targetDomNode: HTMLElement,
        treeNode: FileTreeNode,
        options: OptionsData
    ): void;
    getMetaData(editor: Ace.Editor): FileTreeNode;
    updateOption(key: string, value: string): void;
}
