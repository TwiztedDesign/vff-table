import VffCol from "./vff-col";
import DragButton from './vff-drag-button';

export default class VffRow extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._columns = [];
        this._dragButton = new DragButton();
        this.shadowRoot.innerHTML = `
            <style>
                :host(*) {
                    box-sizing: border-box;
                }
                :host{                                  
                    margin: 5px;                   
                }
                #row{
                    position:relative;
                    width: 100%;  
                }
                #columns{                  
                    display: flex;
                    flex-direction: row;
                }
                vff-drag-button{                   
                    position: absolute;
                    top: 0;
                    right: 0;
                }
            </style>
            <div id="row">
                <div id="columns"></div>               
            </div>
    `;
    }

    connectedCallback() {
        this._dragButton.addEventListener('vff-allow-draggable', this._onAllowDrag.bind(this));
        this._dragButton.addEventListener('vff-prevent-draggable', this._onPreventDrag.bind(this));
        this._render();
    }

    disconnectedCallback() {
        this._dragButton.removeEventListener('vff-allow-draggable', this._onAllowDrag);
        this._dragButton.removeEventListener('vff-prevent-draggable', this._onPreventDrag);
    }

    /**
     * @param {array} _columns
     */
    set columns(_columns) {
        this._columns = _columns;
    }

    get columns() {
        return this._columns;
    }

    // Render
    _render() {
        if (this._columns.length < 1) return;
        const columns = this.shadowRoot.querySelector('#columns');
        for (let i = 0; i < this._columns.length; i++) {
            const colData = this._columns[i];
            const col = new VffCol();
            col.type = colData.type;
            col.text = colData.data;
            columns.appendChild(col);
        }
        const row = this.shadowRoot.querySelector('#row');
        row.appendChild(this._dragButton);
    }

    _onAllowDrag() {
        console.log('vff-allow-draggable');
    }

    _onPreventDrag() {
        console.log('vff-prevent-draggable');
    }
}
