import Store from "./lib/store";

export type OptionsData = Map<string, any>;

export interface OptionsStoreState {
    options: OptionsData;
}

export class OptionsStore extends Store<OptionsStoreState> {
    static initialOptions = new Map<string, any>([
        ["mode", "ace/mode/html"],
        ["fontSize", 12],
        ["showGutter", true],
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
