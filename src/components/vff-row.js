import VffCol from "./vff-col";

export default class VffRow extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._index = null;
        this._columns = [];
        this.shadowRoot.innerHTML = `
            <style>
                :host(*) {
                    box-sizing: border-box;
                }              
                #row{              
                    height: 100%;     
                    width: 100%;  
                }
                #columns{        
                    height: 100%;      
                    display: flex;
                    flex-direction: row;
                }               
            </style>
            <div id="row">
                <div id="columns"></div>               
            </div>
    `;
    }

    connectedCallback() {
        this._render();
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
    }
}
