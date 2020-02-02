import tableData from '../../mocks/table_data';
import VffRow from "./vff-row";
import {makeSortableDecorator} from "../decorators/sortable-table";
import {makeResizerDecorator} from "../decorators/resizable-columns";

export default class VffTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._header = null;
        this._subHeader = null;
        this._tableBody = null;
        this._footer = null;
        this._onTableBodyChange = this._onTableBodyChange.bind(this);
        this._onColumnWidthChange = this._onColumnWidthChange.bind(this);
        this.shadowRoot.innerHTML = `
            <style>
                :host(*) {
                    box-sizing: border-box;                                
                }
                #table-header,
                #table-footer{
                    text-align: center;
                    margin: 10px 0;
                    background-color: #00cccd29;
                }
                                         
                #table-sub-header {
                    height: 50px;
                    background-color: #00cccd;
                }                         
                .row-wrapper{         
                    will-change: transform;
                    transition: transform 100ms ease-out;
                    height: 50px;                                                   
                    position: relative;
                }                                                          
                vff-drag-button{
                    opacity: 0.1;     
                    height: 100%;  
                    width: 50px;                                              
                    position: absolute;
                    top: 0;
                    right: 0;
                }               
            </style>           
                <div id="table">
                    <div id="table-header"></div>
                    <div id="table-sub-header"></div>
                    <div id="table-body"></div>
                    <div id="table-footer"></div>
                </div>           
        `;
    }

    /*****************************************
     * Get / Set
     *****************************************/

    get header() {
        return this._header || '';
    }

    /**
     * @param {string} text
     */
    set header(text) {
        this._header = text;
    }

    /**
     * @param data
     * @param {col:number} data.column
     * @param {*} data.value
     */
    set subHeaderCell(data) {
        if (!data) return;
        this._subHeader[data.column].data = data.value;
    }

    /**
     * @param data
     * @param {{row:number, col:number}} data.coordinates
     * @param {*} data.value
     */
    set tableCell(data) {
        if (!data) return;
        this._tableBody[data.coordinates.row][data.coordinates.col].data = data.value;
    }

    get footer() {
        return this._footer;
    }

    /**
     * @param {string} text
     */
    set footer(text) {
        this._footer = text;
    }

    /*****************************************
     * Life Cycle methods
     *****************************************/

    connectedCallback() {
        this._header = 'Header Content';
        this._subHeader = tableData.sub_header;
        this._tableBody = tableData.body; // array of arrays
        this._footer = 'Footer Content';
        this.addEventListener('vff-table-body-change', this._onTableBodyChange);
        this.addEventListener('vff-column-width-change', this._onColumnWidthChange);
        this._render();
    }

    disconnectedCallback() {
        this.removeEventListener('vff-table-body-change', this._onTableBodyChange);
    }

    /*****************************************
     * render methods
     *****************************************/

    _render() {
        const header = this.shadowRoot.querySelector('#table-header');
        header.innerHTML = '';
        header.textContent = this._renderHeader();
        const subHeader = this.shadowRoot.querySelector('#table-sub-header');
        subHeader.innerHTML = '';
        subHeader.appendChild(this._renderSubHeader());
        const tableBody = this.shadowRoot.querySelector('#table-body');
        tableBody.innerHTML = '';
        tableBody.appendChild(this._renderBody());
        const footer = this.shadowRoot.querySelector('#table-footer');
        footer.innerHTML = '';
        footer.textContent = this._renderFooter();
        makeResizerDecorator(this);
    }

    _renderHeader() {
        if (!this._header) return null;
        return this._header;
    }

    _renderSubHeader() {
        const amountOfColumns = this._subHeader && this._subHeader.length;
        if (!amountOfColumns) return null;
        const row = new VffRow({columns: this._subHeader, index: 0});
        return row.render();
        //return makeResizerDecorator(this, row.render()); // todo : don't send the original
    }

    _renderBody() {
        const amountOfRows = this._tableBody && this._tableBody.length;
        if (!amountOfRows) return;
        let tableRows = [];
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < amountOfRows; i++) {
            const row = new VffRow({columns: this._tableBody[i], index: i});
            tableRows.push(row.render());
        }
        tableRows = makeSortableDecorator(this, this._tableBody.slice(), tableRows.slice());
        tableRows.forEach(tr => {
            fragment.appendChild(tr);
        });
        return fragment;
    }

    _renderFooter() {
        if (!this._footer) return null;
        return this.footer;
    }

    _onTableBodyChange(event) {
        this._tableBody = event.detail.tableState;
        this._render();
    }

    _onColumnWidthChange(event) {
        const widthArr = event.detail.widthArr;
        this._subHeader.forEach((col, index) => {
            col.width = widthArr[index];
        });
        this._tableBody.forEach((row) => {
            row.forEach((col, index) => {
                col.width = widthArr[index];
            });
        });
        this._render();
    }

    /*****************************************
     * VFF related
     *****************************************/

    expose() {
        return {
            header: 'header',
            subHeaderCell: 'subHeaderCell',
            tableCell: 'tableCell',
            footer: 'footer'
        };
    }
}
