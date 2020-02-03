export default class DragButton extends HTMLElement {
    constructor() {
        super();
        this._index = null;
        this._mouseDown = false;
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    cursor: move;                                      
                    background-color: black;
                    display: block;
                    height: 100%;                   
                    width: 50px;     
                }
                :host(*) {
                    box-sizing: border-box;
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
        const event = new CustomEvent('vff-grab-drag-button', {detail: {startDragAtY: e.pageY}});
        this._mouseDown = true;
        this.dispatchEvent(event);
    }

    _onMouseUp() {
        if (!this._mouseDown) return;
        const event = new Event('vff-release-drag-button');
        this._mouseDown = false;
        this.dispatchEvent(event);
    }
}
