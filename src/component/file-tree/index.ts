import { AceTreeWrapper } from "./lib/ace-tree";

/* eslint-disable */
declare module "preact/src/jsx" {
    namespace JSXInternal {
        import HTMLAttributes = JSXInternal.HTMLAttributes;

        interface IntrinsicElements {
            "ace-tree": HTMLAttributes<AceTreeWrapper>;
        }
    }
}

export const setupAceTree = () => {
    customElements.define("ace-tree", AceTreeWrapper);
};
