import BaseShadowRootComponent from "../classes/base-shadow-root-component";
import VffCol from "./vff-col";

export default class VffRow extends BaseShadowRootComponent {
    constructor(props) {
        super();
        this._index = null;
        this._columns = props.columns;
        this._resizable = true;
        this.shadowRoot.innerHTML = `
            <style>
                :host(*) {
                    box-sizing: border-box;
                }              
                #row{              
                    height: 100%;     
                    width: 100%; 
                    border-bottom: 1px solid #f0f0f0;
                }
                #columns{
                    height: 100%;      
                    display: flex;
                    flex-direction: row;
                }               
                vff-col:not(:last-child){
                    border-right: 1px solid #f0f0f0;
                } 
            </style>
            <div id="row">
                <div id="columns"></div>               
            </div>
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
        if (this._columns.length < 1) return;
        const columnWidth = 100 / this._columns.length + '%';  // default setting
        const columnsContainer = this.shadowRoot.querySelector('#columns');
        this._columns.forEach((colData, index) => {
            const col = new VffCol({
                type: colData.type, text: colData.data, index: index
            }).render();
            col.style.width = columnWidth;
            columnsContainer.appendChild(col.render());
        });
        return this;
    }
}
