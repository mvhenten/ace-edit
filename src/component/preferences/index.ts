import modelist = require("ace-code/src/ext/modelist");
import themelist = require("ace-code/src/ext/themelist");

export type PreferenceItem = {
    key: string;
    label: string;
    type: "select" | "checkbox" | "integerInput";
    selectOptions?: Array<{ text: string; value: any }>;
};

export const preferenceData: PreferenceItem[] = [
    {
        key: "theme",
        label: "Theme",
        type: "select",
        selectOptions: themelist.themes.map((x) => ({
            text: x.caption,
            value: x.theme,
        })),
    },
    {
        key: "fontSize",
        label: "Font size",
        type: "integerInput",
    },
    {
        key: "tabSize",
        label: "Tab size",
        type: "integerInput",
    },
    {
        key: "useSoftTabs",
        label: "Soft tabs",
        type: "checkbox",
    },
    {
        key: "wrap",
        label: "Word wrap",
        type: "checkbox",
    },
    {
        key: "readOnly",
        label: "Read-only",
        type: "checkbox",
    },
    {
        key: "showLineNumbers",
        label: "Show line numbers",
        type: "checkbox",
    },
    {
        key: "showGutter",
        label: "Show gutter",
        type: "checkbox",
    },
    {
        key: "showInvisibles",
        label: "Show invisibles",
        type: "checkbox",
    },
    {
        key: "highlightActiveLine",
        label: "Highlight active line",
        type: "checkbox",
    },
    {
        key: "enableLiveAutocompletion",
        label: "Autocomplete",
        type: "checkbox",
    },
];
