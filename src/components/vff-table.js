import tableData from '../../mocks/table_data';
import titles from '../../mocks/sub_header';
import VffRow from "./vff-row";
import DragButton from './vff-drag-button';
import {getStyleVal, createElement} from '../utils/utils';

export default class VffTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._header = null;
        this._subHeader = null;
        this._tableBody = null;
        this._tableSort = {};
        this._footer = null;
        this._isDragAllowed = false;
        this.shadowRoot.innerHTML = `
            <style>
                :host(*) {
                    box-sizing: border-box;                   
                }
                #row-wrapper{                   
                    position: relative;
                }                                                      
                vff-drag-button{                                                     
                    position: absolute;
                    top: 0;
                    right: 0;
                }               
                .over #row-placeholder {               
                    background-color: yellow;
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
            const placeholder = createElement('div', 'row-placeholder', null, null);
            rowWrapper.appendChild(placeholder);
            const row = new VffRow();
            row.index = i;
            row.columns = this._tableBody[i];
            const dragButton = new DragButton();
            dragButton.index = i;
            dragButton.addEventListener('vff-allow-draggable', this._onAllowDrag.bind(this, i, rowWrapper));
            dragButton.addEventListener('vff-prevent-draggable', this._onPreventDrag.bind(this, i, rowWrapper));

            rowWrapper.addEventListener('mouseenter', function(table, btn, placeHolder) {
                if (!table._isDragAllowed) return;
                const height = getStyleVal(this, 'height');
                this.classList.add('over');
                placeHolder.style.height = height;
                btn.style.paddingTop = height;
                table._tableSort['enter'] = btn.index;
            }.bind(rowWrapper, this, dragButton, placeholder));

            rowWrapper.addEventListener('mouseleave', function(table, btn, placeHolder) {
                if (!table._isDragAllowed) return;
                this.classList.remove('over');
                placeHolder.style.height = '0';
                btn.style.paddingTop = '0';
                table._tableSort['leave'] = btn.index;
            }.bind(rowWrapper, this, dragButton, placeholder));

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

    /**
     * @param index - of dragged element
     * @private
     */
    _onAllowDrag() {
        this._isDragAllowed = true;
    }

    /**
     * @param index - of dragged element
     * @private
     */
    _onPreventDrag(index) {
        this._tableSort['drop'] = index;
        this._arrangeDataModel();
        this._isDragAllowed = false;
        this._render();
    }

    _arrangeDataModel() {
        const from = this._tableSort.drop;
        const to = this._tableSort.enter;
        const tableData = this._tableBody.slice();
        tableData.splice(to, 0, tableData.splice(from, 1)[0]);
        this._tableBody = tableData;
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
