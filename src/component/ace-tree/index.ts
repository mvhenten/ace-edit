import { AceTree } from "./lib/ace-tree";

/* eslint-disable */
declare module "preact/src/jsx" {
    namespace JSXInternal {
        import HTMLAttributes = JSXInternal.HTMLAttributes;

        interface IntrinsicElements {
            "ace-tree": HTMLAttributes<AceTree>;
        }
    }
}

export const setupAceTree = () => {
    customElements.define("ace-tree", AceTree);
};
