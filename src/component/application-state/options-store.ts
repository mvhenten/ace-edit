import Store from "./lib/store";

export type OptionsData = Map<string, any>;

export interface OptionsStoreState {
    options: OptionsData;
}

export class OptionsStore extends Store<OptionsStoreState> {
    static initialOptions = new Map<string, any>([
        ["theme", "ace/theme/tomorrow_night_eighties"],
        ["fontSize", 12],
        ["tabSize", 4],
        ["useSoftTabs", true],
        ["wrap", false],
        ["readOnly", false],
        ["showGutter", true],
        ["showLineNumbers", true],
        ["showInvisibles", false],
        ["highlightActiveLine", true],
        ["showPrintMargin", false],
        ["enableLiveAutocompletion", false],
    ]);

    constructor() {
        super({
            options: OptionsStore.initialOptions,
        });
    }

    setOption(key: string, value: any): void {
        const { options } = this.getState();
        options.set(key, value);
        this.setState({ options });
    }
}
