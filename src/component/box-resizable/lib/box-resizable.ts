export class BoxResizable extends HTMLElement {
    private events: Record<string, (evt: MouseEvent) => void>;
    private resizeLeft = false;
    private previousSize = -1;
    private initialWidth: number = 0;
    private collapsed: boolean = false;


    static get observedAttributes() {
        return ["data-collapsed", "width"];
    }

    constructor() {
        super();

        const template = document.createElement("template");
        template.innerHTML = `
        <style>
        :host {
            display: flex;
            flex-direction: row;
        }

        :host .grippy {
            cursor: col-resize;
            width: var(--grip-width, 3px);
            background-color: var(--grip-background-color, #aaa);
        }

        :host .resizable {
            overflow:hidden;
            display: flex;
        }

        :host .resizable.transition {
            transition: all 0.1s ease-in;
        }

        </style>
        <div class="resizable transition">
            <slot name="resizable-content"></slot>
        </div>
        <div class="grippy">
        </div>
`;

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
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
        const resizable = this.resizable;
        let active = false;

        const mouseDown = (evt: MouseEvent) => {
            active = true;
            evt.preventDefault();
            resizable.classList.remove("transition");
        };

        const mouseUp = () => {
            resizable.classList.add("transition");
            active = false;
        };

        const mouseMove = (evt: MouseEvent) => {
            if (!active) return;
            const width = resizable.offsetWidth;
            let offset = evt.movementX;

            if (this.resizeLeft) offset = -offset;

            this.resize(width + offset);
        };

        this.grip.addEventListener("mousedown", mouseDown);
        window.document.addEventListener("mouseup", mouseUp);
        window.document.addEventListener("mousemove", mouseMove);
        this.events = { mouseDown, mouseUp, mouseMove };
    }

    private triggerResize() {
        if (this.collapsed) {
            this.resize(0);
            return;
        }

        if (this.initialWidth) {
            this.resize(this.initialWidth);
            return;
        }
    }

    private resize(width: number) {
        // noop, also -1 is a special initial value
        if (width < 0) return;

        const offsetWidth = this.resizable.offsetWidth;
        const resizable = this.resizable;
        this.previousSize = offsetWidth;
        resizable.style.width = `${width}px`;
    }


    attributeChangedCallback(
        name: string,
        _oldValue: string,
        newValue: string
    ) {
        const resizable = this.resizable;

        switch(name) {
            case "width":
                this.initialWidth = parseInt(newValue, 10);
                break;
            case "data-collapsed":
                this.collapsed = newValue == "collapsed";
                break;
        }

        this.triggerResize();
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
        this.setupResize();
    }
}
