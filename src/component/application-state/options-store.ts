import Store from "./lib/store";
import { OptionsStoreState, OptionsData, OptionsStorage } from "./interfaces";

export class OptionsStore extends Store implements OptionsStorage {
    static initialOptions: OptionsData = new Map<string, any>([
        ["mode", "ace/mode/html"],
        ["fontSize", 12],
        ["showGutter", true],
    ]);

    constructor() {
        super({
            options: OptionsStore.initialOptions,
        } as OptionsStoreState);
    }

    setOption(key: string, value: any): void {
        const { options } = this.getState() as OptionsStoreState;
        options.set(key, value);
        this.setState({ options });
    }
}
