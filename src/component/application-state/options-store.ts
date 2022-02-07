import Store from "./lib/store";
import { OptionsStoreState, OptionsStorage } from "./interfaces";

export class OptionsStore extends Store implements OptionsStorage {
    constructor() {
        super({
            options: new Map<string, any>([
                ["mode", "ace/mode/html"],
                ["fontSize", 12],
                ["showGutter", true],
            ]),
        } as OptionsStoreState);
    }

    setValue(key: string, value: any) {
        const { options } = this.getState() as OptionsStoreState;
        options.set(key, value);
        this.setState({ options });
    }
}
