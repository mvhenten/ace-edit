import Store from "./lib/store";
import { EditorStoreState, EditorStorage } from "./interfaces";

export class EditorStore extends Store implements EditorStorage {
    constructor() {
        super({
            editors: new Map(),
        } as EditorStoreState);
    }

    openEditor(aceEditor: any) {
        const { editors } = this.getState() as EditorStoreState;
        editors.set(aceEditor.container, aceEditor);
        this.setState({ editors });
    }

    closeEditor(aceEditor: any) {
        const { editors } = this.getState() as EditorStoreState;
        editors.delete(aceEditor.container);
        this.setState({ editors });
    }
}
