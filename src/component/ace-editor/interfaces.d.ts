export interface AceEditorManager {
    createEditor(targetDomNode: HTMLElement, options: OptionsData): void;
    updateOption(key: string, value: string): void;
}
