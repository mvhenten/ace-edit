let customPanelCounter = 0;

/**
 * `CustomPanel` is a panel for a `<tab-container>` tab panel.
 */
export class TabBody extends HTMLElement {
    connectedCallback() {
        this.setAttribute("role", "tabpanel");
        if (!this.id)
            this.id = `custom-panel-generated-${customPanelCounter++}`;
    }
}
