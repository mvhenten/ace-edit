import { Component, createRef } from "preact";
import { FileTreeNode } from "../file-system/interfaces";
import { AceEditorManager } from "../ace-editor/interfaces";

export type AceEditorProps = {
    aceEditorManager: AceEditorManager;
    treeNode: FileTreeNode;
    fileData: string;
};

export class AceEditor extends Component<AceEditorProps> {
    ref = createRef();

    componentDidMount() {
        const { aceEditorManager } = this.props;
        aceEditorManager.createEditor(this.ref.current);
    }

    render() {
        return <pre ref={this.ref}>{this.props.fileData}</pre>;
    }
}
