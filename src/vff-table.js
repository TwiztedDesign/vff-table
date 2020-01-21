import tableData from '../mocks/table_data';
import titles from '../mocks/sub_header';
import VffRow from "./components/vff-row";

export default class VffTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._header = null;
        this._subHeader = null;
        this._tableBody = null;
        this._footer = null;
        this.shadowRoot.innerHTML = `
            <style>
                :host(*) {
                    box-sizing: border-box;
                }
            </style>
            <div class="vff-table">
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
        this.render();
    }

    disconnectedCallback() {
    }

    /*****************************************
     * render methods
     *****************************************/

    render() {
        this.renderHeader();
        this.renderSubHeader();
        this.renderBody();
        this.renderFooter();
    }

    renderHeader() {
        if (!this._header) return null;
        const header = this.shadowRoot.querySelector('#table-header');
        header.textContent = this._header;
    }

    renderSubHeader() {
        const amountOfColumns = this._subHeader && this._subHeader.length;
        if (!amountOfColumns) return null;
        const subHeader = this.shadowRoot.querySelector('#table-sub-header');
        const row = new VffRow();
        row.columns = this._subHeader;
        subHeader.appendChild(row);
    }

    renderBody() {
        const amountOfRows = this._tableBody && this._tableBody.length;
        if (!amountOfRows) return;
        for (let i = 0; i < amountOfRows; i++) {
            const tableBody = this.shadowRoot.querySelector('#table-body');
            const row = new VffRow();
            row.columns = this._tableBody[i];
            tableBody.appendChild(row);
        }
    }

    renderFooter() {
        if (!this._footer) return null;
        const footer = this.shadowRoot.querySelector('#table-footer');
        footer.textContent = this.footer;
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
