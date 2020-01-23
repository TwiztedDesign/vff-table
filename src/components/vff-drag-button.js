export default class DragButton extends HTMLElement {
    constructor() {
        super();
        this._index = null;
        this._mouseDown = false;
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                :host(*) {
                    box-sizing: border-box;
                }
                #drag-button {
                    cursor: move;
                    height: 40px;
                    width: 40px;
                    background-color: black;
                }
            </style>
            <div id="drag-button"></div>
        `;
    }

    /**
     * @param {number} num
     */
    set index(num) {
        this._index = num;
    }

    get index() {
        return this._index;
    }

    connectedCallback() {
        document.addEventListener('mouseup', this._onMouseUp.bind(this));
        this.addEventListener('mousedown', this._onMouseDown.bind(this));
        this.addEventListener('mouseup', this._onMouseUp.bind(this));
    }

    disconnectedCallback() {
        this.removeEventListener('mousedown', this._onMouseDown);
        this.removeEventListener('mouseup', this._onMouseUp);
        document.removeEventListener('mouseup', this._onMouseUp);
    }

    _onMouseDown(e) {
        const event = new CustomEvent('vff-allow-draggable', {detail: e.pageY});
        this._mouseDown = true;
        this.dispatchEvent(event);
    }

    _onMouseUp() {
        if (!this._mouseDown) return;
        const event = new Event('vff-prevent-draggable');
        this._mouseDown = false;
        this.dispatchEvent(event);
    }
}
