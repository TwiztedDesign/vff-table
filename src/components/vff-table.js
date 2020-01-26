import tableData from '../../mocks/table_data';
import titles from '../../mocks/sub_header';
import VffRow from "./vff-row";
import DragButton from './vff-drag-button';
import DraggableRow from '../classes/draggable-row';
import {getStyleVal} from "../utils/utils";

let oldY = 0;
let yDirection;

const updateMouseDirection = function(event) {
    if (oldY < event.pageY) {
        yDirection = "down";
    } else if (oldY > event.pageY) {
        yDirection = "up";
    }
    oldY = event.pageY;
};

export default class VffTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._header = null;
        this._subHeader = null;
        this._tableBody = null;
        this._footer = null;
        this._tableSort = {over: null, drag: null, leave: null};
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
        this._draggableRow = new DraggableRow({domNode: rowWrapper, startY: event.detail});
        document.body.addEventListener('mousemove', updateMouseDirection);
    }

    /**
     * @param index - of dragged element
     * @private
     */
    _onPreventDrag() {
        this._arrangeDataModel();
        this._resetTableSort();
        document.body.removeEventListener('mousemove', updateMouseDirection);
        this._draggableRow.reset();
        this._draggableRow = null;
        this._render();
    }

    _resetTableSort() {
        this._tableSort.over = null;
        this._tableSort.drag = null;
    }

    _arrangeDataModel() {
        const from = this._tableSort.drag;
        const to = this._tableSort.over;
        const tableData = this._tableBody.slice();
        if (from === null || to === null) return;
        tableData.splice(to, 0, tableData.splice(from, 1)[0]);
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
        const dragButton = new DragButton();
        dragButton.addEventListener('vff-allow-draggable', this._onAllowDrag.bind(this, index, rowWrapper));
        dragButton.addEventListener('vff-prevent-draggable', this._onPreventDrag.bind(this, index));

        rowWrapper.addEventListener('mousedown', function() {
            if (!this._draggableRow) return;
            this._tableSort.drag = index;
            this._tableSort.over = index;
            rowWrapper.style.zIndex = '-1000';
        }.bind(this));

        rowWrapper.addEventListener('mouseenter', function() {
            if (!this._draggableRow) return;
            this._tableSort.over = index;
            //console.log('mouseenter: ', this._tableSort.over);
            const draggableRow = this._draggableRow;
            const margin = parseInt(getStyleVal(draggableRow._domNode, 'margin-top'));
            const height = parseInt(draggableRow.height);
            const sum = height + margin + 'px';
            if (rowWrapper.style.top !== '') { // moving back in case of up / down drag
                if (yDirection === 'up') {
                    this._tableSort.over = this._tableSort.over - 1;
                } else {
                    this._tableSort.over = this._tableSort.over + 1;
                }
                rowWrapper.style.top = '';
            } else if (yDirection === 'down') { // down
                rowWrapper.style.top = '-' + sum;
            } else if (yDirection === 'up') { // up
                rowWrapper.style.top = sum;
            }
        }.bind(this));

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
