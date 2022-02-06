let customTabCounter = 0;

/**
 * `CustomTabsTab` is a tab for a `<tab-container>` tab panel. `<tab-header>`
 * should always be used with `role=heading` in the markup so that the
 * semantics remain useable when JavaScript is failing.
 *
 * A `<tab-header>` declares which `<custom-panel>` it belongs to by
 * using that panel’s ID as the value for the `aria-controls` attribute.
 *
 * A `<tab-header>` will automatically generate a unique ID if none
 * is specified.
 */
export class TabHeader extends HTMLElement {
    static get observedAttributes() {
        return ["selected"];
    }

    constructor() {
        super();
    }

    connectedCallback() {
        // If this is executed, JavaScript is working and the element
        // changes its role to `tab`.
        this.setAttribute("role", "tab");
        if (!this.id) this.id = `tab-header-generated-${customTabCounter++}`;

        // Set a well-defined initial state.
        this.setAttribute("aria-selected", "false");
        this.setAttribute("tabindex", "-1");
        this._upgradeProperty("selected");
    }

    /**
     * Check if a property has an instance value. If so, copy the value, and
     * delete the instance property so it doesn't shadow the class property
     * setter. Finally, pass the value to the class property setter so it can
     * trigger any side effects.
     * This is to safe guard against cases where, for instance, a framework
     * may have added the element to the page and set a value on one of its
     * properties, but lazy loaded its definition. Without this guard, the
     * upgraded element would miss that property and the instance property
     * would prevent the class property setter from ever being called.
     */
    _upgradeProperty(prop) {
        if (this.hasOwnProperty(prop)) {
            let value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }

    /**
     * Properties and their corresponding attributes should mirror one another.
     * To this effect, the property setter for `selected` handles truthy/falsy
     * values and reflects those to the state of the attribute. It’s important
     * to note that there are no side effects taking place in the property
     * setter. For example, the setter does not set `aria-selected`. Instead,
     * that work happens in the `attributeChangedCallback`. As a general rule,
     * make property setters very dumb, and if setting a property or attribute
     * should cause a side effect (like setting a corresponding ARIA attribute)
     * do that work in the `attributeChangedCallback()`. This will avoid having
     * to manage complex attribute/property reentrancy scenarios.
     */
    attributeChangedCallback() {
        const value = this.hasAttribute("selected");
        this.setAttribute("aria-selected", `${value}`);
        this.setAttribute("tabindex", value ? "0" : "-1");
    }

    set selected(value) {
        value = Boolean(value);
        if (value) this.setAttribute("selected", "");
        else this.removeAttribute("selected");
    }

    get selected() {
        return this.hasAttribute("selected");
    }
}
