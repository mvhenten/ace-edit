export class BoxResizable extends HTMLElement {
    private events: Record<string, (evt: MouseEvent) => void>;
    private resizeLeft = false;

    constructor() {
        super();

        const template = document.createElement("template");
        template.innerHTML = `
        <style>
        :host {
            display: flex;
            flex-direction: ${this.resizeLeft ? "row-reverse" : "row"};
        }

        :host .grippy {
            background-color: #666;
            cursor: col-resize;
            width: 3px;
        }
        </style>
        <div class="resizable">
            <slot name="resizable-content"></slot>
        </div>
        <div class="grippy">
        </div>
`;

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.setupResize();
    }

    get grip() {
        return this.getElement(".grippy");
    }

    get resizable() {
        return this.getElement(".resizable");
    }

    private getElement(querySelector: string): HTMLElement {
        const element = this.shadowRoot.querySelector(
            querySelector
        ) as HTMLElement;
        if (!element)
            throw new Error(`Unexpected missing element ${querySelector}`);
        return element;
    }

    private setupResize() {
        let active = false;

        const mouseDown = (evt: MouseEvent) => {
            active = true;
            evt.preventDefault();
        };

        const mouseUp = () => {
            active = false;
        };

        const mouseMove = (evt: MouseEvent) => {
            if (!active) return;
            const width = this.resizable.offsetWidth;
            let offset = evt.movementX;

            if (this.resizeLeft) offset = -offset;

            this.resize(width + offset);
        };

        this.grip.addEventListener("mousedown", mouseDown);
        window.document.addEventListener("mouseup", mouseUp);
        window.document.addEventListener("mousemove", mouseMove);
        this.events = { mouseDown, mouseUp, mouseMove };
    }

    private resize(width) {
        this.resizable.style.width = `${width}px`;
    }

    disconnectedCallback() {
        const { mouseDown, mouseUp, mouseMove } = this.events;
        this.grip.removeEventListener("mousedown", mouseDown);
        window.document.removeEventListener("mouseup", mouseUp);
        window.document.removeEventListener("mousemove", mouseMove);
    }

    connectedCallback() {
        this.resizeLeft = this.dataset.resizedirection == "left";

        if (this.resizeLeft) {
            const css = this.getElement("style").innerText;
            this.getElement("style").innerText =
                css + ":host { flex-direction: row-reverse; }";
        }
    }
}
