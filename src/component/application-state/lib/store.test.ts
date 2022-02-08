import test from "ava";
import Store from "./store";
import sinon from "ts-sinon";

interface FakeState {
    status: string;
    fakeTruth: boolean;
    defaultEnabled: true;
}

class FakeStore extends Store<FakeState> {
    constructor() {
        super({
            status: "not ok",
            fakeTruth: true,
            defaultEnabled: true,
        });
    }
}

test("constructor", (t) => {
    const fakeStore = new FakeStore();
    t.pass("Constructor worked");
    t.is(fakeStore.getState().fakeTruth, true);
    t.is(fakeStore.getState().status, "not ok");
});

test("observe", (t) => {
    const fakeStore = new FakeStore();
    const observer = sinon.stub();
    const cleanup = fakeStore.observe(observer);

    fakeStore.setState({ status: "fake status" });

    t.assert(observer.calledOnce);

    cleanup();

    fakeStore.setState({ status: "fake status" });

    t.assert(observer.calledOnce);
});
