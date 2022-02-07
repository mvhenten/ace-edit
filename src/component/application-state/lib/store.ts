type State = Record<string, any>;

type Fn = (...x: any[]) => void;

export default abstract class Store {
    private observers: Set<Fn> = new Set();

    constructor(protected state: State = {}) {}

    observe(fn: Fn): () => void {
        this.observers.add(fn);

        return (): void => {
            this.observers.delete(fn);
        };
    }

    getState(): State {
        return Object.assign({}, this.state);
    }

    setState(newState: State): void {
        for (const key in newState) {
            const value = newState[key];

            if (!(key in this.state))
                throw new Error(`Invalid "${key}" is not part of this state`);

            if (typeof this.state[key] !== typeof value)
                throw new TypeError(
                    `Expected a "${typeof this.state[
                        key
                    ]}" but got a "${typeof value}" for "${key}"`
                );

            this.state[key] = value;
        }

        for (const fn of this.observers) {
            fn(this.getState());
        }
    }
}
