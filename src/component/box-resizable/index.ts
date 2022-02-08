import { BoxResizable } from "./lib/box-resizable";

/* eslint-disable */
declare module "preact/src/jsx" {
    namespace JSXInternal {
        import HTMLAttributes = JSXInternal.HTMLAttributes;

        interface IntrinsicElements {
            "box-resizable": HTMLAttributes<BoxResizable>;
        }
    }
}

export const setupBoxResizable = () => {
    customElements.define("box-resizable", BoxResizable);
};
