export default class DragButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                :host(*) {
                    box-sizing: border-box;
                }
                #drag-controller {
                    height: 40px;
                    width: 40px;
                    background-color: black;
                }
            </style>
            <div id="drag-controller"></div>
        `;
    }

    static get observedAttributes() {
        return [/* array of attribute names to monitor for changes */];
    }

    connectedCallback() {
        this.addEventListener('mouseenter', this._onMouseEnter.bind(this));
        this.addEventListener('mouseleave', this._onMouseLeave.bind(this));
    }

    disconnectedCallback() {
        this.removeEventListener('mouseenter', this._onMouseEnter);
        this.removeEventListener('mouseleave', this._onMouseLeave);
    }

    _onMouseEnter() {
        const event = new Event('vff-allow-draggable');
        this.dispatchEvent(event);
    }

    _onMouseLeave() {
        const event = new Event('vff-prevent-draggable');
        this.dispatchEvent(event);
    }
}
