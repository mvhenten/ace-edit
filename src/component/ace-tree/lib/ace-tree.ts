import { FileTree } from "../../application-state";
import Tree = require("ace-tree/src/tree");
import DataProvider = require("ace-tree/src/data_provider");
import { FileTreeNode } from "../../file-system/interfaces";

function transform(node: any) {
    const path = node.path || "";
    const name = path.slice(path.lastIndexOf("/") + 1);
    let children = node.nodes || node.children;
    if (children) children = children.map(transform);

    return {
        fsNode: node,
        name,
        children,
    };
}

type FileTreeCallback = (element: FileTreeNode) => void;

export class AceTree extends HTMLElement {
    private tree: Tree;
    private model: DataProvider;
    private resizeObserver: ResizeObserver;
    private aceWrapper: HTMLDivElement;

    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();

        this.tree = new Tree();
        this.model = new DataProvider({});

        this.aceWrapper = document.createElement("div");
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(this.aceWrapper);
        this.resizeObserver = new ResizeObserver((entries) =>
            this.onParentResize(entries)
        );
        this.setupAceTree();
    }

    private onParentResize(entries) {
        for (let entry of entries) {
            if (entry.contentBoxSize) {
                // Firefox implements `contentBoxSize` as a single content rect, rather than an array
                const { blockSize, inlineSize } = Array.isArray(
                    entry.contentBoxSize
                )
                    ? entry.contentBoxSize[0]
                    : entry.contentBoxSize;
                const [height, width] = [blockSize, inlineSize];

                console.log("parent node resized:", { height, width });
            }
        }
        // this.tree.resize();
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
            typeof (window as any).tree !== "undefined"
        )
            (window as any).tree = this.tree;
    }

    updateTreeData(fileTree: FileTree) {
        const model = this.model;
        const tree = this.tree;

        if (!model.root || model.root.fsNode != fileTree) {
            const treeNodes = transform(fileTree);

            console.log({ treeNodes });

            if (treeNodes.children.length == 1) {
                treeNodes.children[0].isOpen = true;
            }

            model.setRoot(treeNodes);

            tree.on("afterChoose", () => {
                const fsNode = tree.selection.getCursor()?.fsNode;

                // @todo emit events

                // if (fsNode && fsNode.kind != "directory") {
                //     this.props.onItemClick(fsNode);
                // }
            });
        }

        this.tree.resize();
    }

    attributeChangedCallback(
        name: string,
        _oldValue: string,
        newValue: string
    ) {
        console.log(name, _oldValue, newValue);
    }

    disconnectedCallback() {
        this.resizeObserver.disconnect();
        console.log("Disconnected");
    }

    connectedCallback() {
        this.resizeObserver.observe(this.parentElement);

        this.tree.container.style.flex = 1;
        this.tree.container.style.display = "flex";
        this.aceWrapper.appendChild(this.tree.container);
        // terrible hack
        this.tree.container.style.minHeight = "80vh";
        this.tree.resize();
    }

    setStyle(props: Record<string, any>) {
        for (let key in props) {
            this.aceWrapper.style[key] = props[key];
        }
    }
}
