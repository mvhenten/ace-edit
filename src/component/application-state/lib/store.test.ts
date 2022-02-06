import test from "ava";
import Store from "./store";
import sinon from "ts-sinon";

interface FakeState {
    status: string;
    fakeTruth: boolean;
    defaultEnabled: true;
}

class FakeState extends Store {
    constructor() {
        super({
            status: "not ok",
            fakeTruth: true,
        } as FakeState);
    }
}

test("constructor", (t) => {
    const fakeState = new FakeState();
    t.pass("Constructor worked");
    t.is(fakeState.getState().fakeTruth, true);
    t.is(fakeState.getState().status, "not ok");
});

test("observe", (t) => {
    const fakeState = new FakeState();
    const observer = sinon.stub();
    const cleanup = fakeState.observe(observer);

    fakeState.setState({ status: "fake status" });

    t.assert(observer.calledOnce);

    cleanup();

    fakeState.setState({ status: "fake status" });

    t.assert(observer.calledOnce);
});

test("initial state", (t) => {
    const fakeState = new FakeState();
    const observer = sinon.stub();
    const cleanup = fakeState.observe(observer);

    t.throws(
        () => {
            fakeState.setState({ unknown: "does not exist" });
        },
        { message: 'Invalid "unknown" is not part of this state' }
    );

    t.throws(
        () => {
            fakeState.setState({ status: 123 });
        },
        { message: `Expected a "string" but got a "number" for "status"` }
    );

    t.assert(observer.notCalled);
    cleanup();
});
