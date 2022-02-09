import { Ace } from "ace-code";
import EventEmitter from "events";
import { AceEditorManager } from "../ace-editor/interfaces";
import { FileSystem } from "../file-system/interfaces";

class KeyboardManager extends EventEmitter {
    constructor(
        private props: {
            aceEditorManager: AceEditorManager;
            fileSystem: FileSystem;
        }
    ) {
        super();

        props.aceEditorManager.on("createEditor", (editor: Ace.Editor) =>
            this.onEditorCreate(editor)
        );
    }

    onEditorCreate(editor: Ace.Editor) {
        var commands = editor.commands;
        commands.addCommand({
            name: "save",
            bindKey: { win: "Ctrl-S", mac: "Command-S" },
            exec: (arg) => {
                const meta = this.props.aceEditorManager.getMetaData(editor);
                this.props.fileSystem.writeFile(
                    meta,
                    editor.session.getValue()
                );
            },
        });
    }
}

export const createKeyboardManager = (
    aceEditorManager: AceEditorManager,
    fileSystem: FileSystem
) => {
    return new KeyboardManager({ aceEditorManager, fileSystem });
};
