import tableData from '../../mocks/table_data';
import titles from '../../mocks/sub_header';
import VffRow from "./vff-row";
import DragButton from './vff-drag-button';

export default class VffTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._header = null;
        this._subHeader = null;
        this._tableBody = null;
        this._footer = null;
        this._isDragAllowed = false;
        this.shadowRoot.innerHTML = `
            <style>
                :host(*) {
                    box-sizing: border-box;
                }
                #row-wrapper{
                    transition: all .15s;
                    position: relative;
                }                                          
                vff-drag-button{
                    transition: all .15s;                                 
                    position: absolute;
                    top: 0;
                    right: 0;
                }
            </style>           
                <div id="table-header"></div>
                <div id="table-sub-header"></div>
                <div id="table-body"></div>
                <div id="table-footer"></div>           
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
        this._subHeader = titles;
        this._tableBody = tableData.body; // array of arrays
        this._footer = 'Footer Content';
        this._render();
    }

    disconnectedCallback() {
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
    }

    _renderHeader() {
        if (!this._header) return null;
        return this._header;
    }

    _renderSubHeader() {
        const amountOfColumns = this._subHeader && this._subHeader.length;
        if (!amountOfColumns) return null;
        const row = new VffRow();
        row.columns = this._subHeader;
        return row;
    }

    _renderBody() {
        const amountOfRows = this._tableBody && this._tableBody.length;
        if (!amountOfRows) return;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < amountOfRows; i++) {
            const rowWrapper = document.createElement('div');
            rowWrapper.setAttribute('id', 'row-wrapper');
            const row = new VffRow();
            row.index = i;
            row.columns = this._tableBody[i];
            const dragButton = new DragButton();
            dragButton.index = i;
            dragButton.addEventListener('vff-allow-draggable', this._onAllowDrag.bind(this));
            dragButton.addEventListener('vff-prevent-draggable', this._onPreventDrag.bind(this));
            rowWrapper.addEventListener('mouseenter', function(table, btn) {
                if (!table._isDragAllowed) return;
                this.style.paddingTop = '40px';
                btn.style.paddingTop = '40px';
            }.bind(rowWrapper, this, dragButton));
            rowWrapper.addEventListener('mouseleave', function(table, btn) {
                if (!table._isDragAllowed) return;
                this.style.paddingTop = '0';
                btn.style.paddingTop = '0';
            }.bind(rowWrapper, this, dragButton));
            rowWrapper.appendChild(row);
            rowWrapper.appendChild(dragButton);
            fragment.appendChild(rowWrapper);
        }
        return fragment;
    }

    _renderFooter() {
        if (!this._footer) return null;
        return this.footer;
    }

    _onAllowDrag() {
        this._isDragAllowed = true;
    }

    _onPreventDrag() {
        if (this._isDragAllowed) this._render();
        this._isDragAllowed = false;
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
