import { FileTree } from "../../application-state";
import Tree = require("ace-tree/src/tree");
import DataProvider = require("ace-tree/src/data_provider");
import { FileTreeWidget } from "../interfaces";
import { FileTreeNode } from "../../file-system/interfaces";

const setStyle = (
    element: HTMLElement,
    props: Record<string, string | number>
) => {
    for (const key in props) {
        element.style[key] = `${props[key]}`;
    }
};

function transform(node: FileTree | FileTreeNode) {
    const path = node["path"] || "";
    const name = path.slice(path.lastIndexOf("/") + 1);
    let children = node["nodes"] || node["children"];
    if (children) children = children.map(transform);

    return {
        fsNode: node,
        name,
        children,
    };
}

export class AceTreeWrapper extends HTMLElement implements FileTreeWidget {
    private tree: Tree;
    private model: DataProvider;
    private aceSlot: HTMLSlotElement;

    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();

        this.tree = new Tree();
        this.model = new DataProvider({});

        const style = document.createElement("style");

        style.textContent = `
            :host {
                display: flex;
                flex: auto;
            }
        `;

        this.aceSlot = document.createElement("slot");
        this.aceSlot.setAttribute("name", "file-tree");
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(this.aceSlot);
        this.shadowRoot.appendChild(style);
        this.setupAceTree();
    }

    private get aceTreeContainer(): HTMLElement {
        const [element] = this.aceSlot.assignedElements() as HTMLElement[];
        if (!element) throw new Error("Missign container div for ace-tree");
        return element;
    }

    private setupAceTree() {
        this.tree.setDataProvider(this.model);
        this.model.getIconHTML = function (node) {
            // console.log("node", node);
            if (node.fsNode?.kind == "directory") {
                return "";
            } else {
                return "❮❯";
            }
        };

        // @todo why is this needed?
        if (
            typeof window !== "undefined" &&
            typeof window["tree"] !== "undefined"
        ) {
            window["tree"] = this.tree;
        }
    }

    public updateTreeData(fileTree: FileTree) {
        const model = this.model;
        const tree = this.tree;

        if (!model.root || model.root.fsNode != fileTree) {
            const treeNodes = transform(fileTree);

            if (treeNodes.children.length == 1) {
                treeNodes.children[0].isOpen = true;
            }

            model.setRoot(treeNodes);

            tree.on("afterChoose", () => {
                const fsNode = tree.selection.getCursor()?.fsNode;

                if (fsNode && fsNode.kind != "directory") {
                    const event = new CustomEvent("item-click", {
                        detail: fsNode,
                    });
                    this.dispatchEvent(event);
                }
            });
        }

        this.tree.resize();
    }

    connectedCallback() {
        setStyle(this.aceTreeContainer, {
            position: "relative",
            display: "flex",
            flex: "auto",
        });

        setStyle(this.tree.container, {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        });

        this.aceTreeContainer.appendChild(this.tree.container);
        this.tree.resize();
    }
}
