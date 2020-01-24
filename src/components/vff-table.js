import tableData from '../../mocks/table_data';
import titles from '../../mocks/sub_header';
import VffRow from "./vff-row";
import DragButton from './vff-drag-button';
import DraggableRow from '../classes/draggable-row';
import {getStyleVal} from "../utils/utils";
// import {createElement} from '../utils/utils';

export default class VffTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._header = null;
        this._subHeader = null;
        this._tableBody = null;
        this._footer = null;
        this._tableSort = {over: null, leave: null, drop: null};
        this._isDragAllowed = false; // flag
        this._draggableRow = null;
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
            const row = new VffRow();
            row.columns = this._tableBody[i];
            const draggableRow = this._makeDraggable(row, i);
            fragment.appendChild(draggableRow);
        }
        return fragment;
    }

    _renderFooter() {
        if (!this._footer) return null;
        return this.footer;
    }

    /**
     * @param index
     * @param rowWrapper
     * @param event
     * @private
     */
    _onAllowDrag(index, rowWrapper, event) {
        this._isDragAllowed = true;
        this._draggableRow = new DraggableRow({domNode: rowWrapper, startY: event.detail});
    }

    /**
     * @param index - of dragged element
     * @private
     */
    _onPreventDrag(index) {
        this._tableSort.drop = index;
        this._draggableRow.reset();
        this._arrangeDataModel();
        this._resetTableSort();
        this._isDragAllowed = false;
        this._render();
    }

    _resetTableSort() {
        this._tableSort.over = null;
        this._tableSort.leave = null;
        this._tableSort.drop = null;
    }

    _arrangeDataModel() {
        const from = this._tableSort.drop;
        const to = this._tableSort.over;
        const tableData = this._tableBody.slice();
        if (from === null || to === null) return;
        if (from < to) {
            tableData.splice((to), 0, tableData.splice(from, 1)[0]);
        } else {
            tableData.splice(to, 0, tableData.splice(from, 1)[0]);
        }
        this._tableBody = tableData;
    }

    /**
     * @param row
     * @param index
     * @return {HTMLDivElement} - row enabled to be dragged and reordered across the table
     * @private
     */
    _makeDraggable(row, index) {
        const rowWrapper = document.createElement('div');
        rowWrapper.setAttribute('class', 'row-wrapper');
        rowWrapper.setAttribute('index', index);
        const dragButton = new DragButton();
        dragButton.addEventListener('vff-allow-draggable', this._onAllowDrag.bind(this, index, rowWrapper));
        dragButton.addEventListener('vff-prevent-draggable', this._onPreventDrag.bind(this, index));

        rowWrapper.addEventListener('mousedown', function(rowWrapper) {
            if (!this._isDragAllowed) return;
            rowWrapper.style.zIndex = '-1000'; // sink the element under the rest of the rows to allow mouseover event to fire
        }.bind(this, rowWrapper));

        rowWrapper.addEventListener('mouseout', function(index) {
            if (!this._isDragAllowed) return;
            this._tableSort.leave = index;
        }.bind(this, index, rowWrapper));

        rowWrapper.addEventListener('mouseover', function(index) {
            if (!this._isDragAllowed) return;
            // todo : check why double mouseover event is fired
            if (this._tableSort.over === index) return; // prevent multiple mouseover events making extra work
            this._tableSort.over = index;
            const draggableRow = this._draggableRow;
            const rowToMove = this.shadowRoot.querySelector("[index='" + index + "']");
            const margin = parseInt(getStyleVal(draggableRow._domNode, 'margin-top'));
            const height = parseInt(draggableRow.height);
            const sum = height + margin + 'px';
            const over = this._tableSort.over;
            const leave = this._tableSort.leave;
            if (over > leave) { // down
                rowToMove.style.top = '-' + sum;
            } else if (over < leave) { // up
                rowToMove.style.top = sum;
            }
        }.bind(this, index, rowWrapper));

        rowWrapper.appendChild(row);
        rowWrapper.appendChild(dragButton);
        return rowWrapper;
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
