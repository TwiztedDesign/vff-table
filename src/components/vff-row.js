import VffCol from "./vff-col";

export default class VffRow extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._columns = [];
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
                #drag-button{
                    height: 40px;
                    width: 40px;
                    background-color: black;
                    position: absolute;
                    top: 0;
                    right: 0;
                }
            </style>
            <div id="row">
                <div id="columns"></div>
                <div id="drag-button"></div>
            </div>
    `;
    }

    connectedCallback() {
        this.render();
        // browser calls this method when the element is added to the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    disconnectedCallback() {
        // browser calls this method when the element is removed from the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    static get observedAttributes() {
        return [/* array of attribute names to monitor for changes */];
    }

    // eslint-disable-next-line no-unused-vars
    attributeChangedCallback(name, oldValue, newValue) {
        // called when one of attributes listed above is modified
    }

    adoptedCallback() {
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
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
    render() {
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
