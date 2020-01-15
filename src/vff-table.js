import tableData from '../mocks/table_data';
import titles from '../mocks/sub_header';

export default class VffTable extends HTMLElement {
    constructor() {
        super();

        this._header = 'Header Content';
        this._subHeader = titles;
        this._tableBody = tableData.body; // array of arrays
        this._footer = 'Footer Content';
    }

    /*****************************************
     * Get / Set
     *****************************************/

    get header() {
        return this._header;
    }

    /**
     * @param {string} text
     */
    set header(text) {
        if (!text) return;
        this._header = text;
        this.render();
    }

    /**
     * @param data
     * @param {col:number} data.column
     * @param {*} data.value
     */
    set subHeaderCell(data) {
        if (!data) return;
        this._subHeader[data.column].data = data.value;
        this.render();
    }

    /**
     * @param data
     * @param {{row:number, col:number}} data.coordinates
     * @param {*} data.value
     */
    set tableCell(data) {
        if (!data) return;
        this._tableBody[data.coordinates.row][data.coordinates.col].data = data.value;
        this.render();
    }

    get footer() {
        return this._footer;
    }

    /**
     * @param {string} text
     */
    set footer(text) {
        this._footer = text;
        this.render();
    }

    /*****************************************
     * Life Cycle methods
     *****************************************/

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
    }

    /*****************************************
     * render methods
     *****************************************/

    render() {
        this.innerHTML = `
            <div class="vff-table">
                ${this.renderHeader()}
                ${this.renderSubHeader()}
                ${this.renderBody()}
                ${this.renderFooter()}
            </div>
        `;
    }

    renderHeader() {
        return (
            `<div class="vff-table__header">${this._header}</div>`
        );
    }

    renderSubHeader() {
        const amountOfColumns = this._subHeader.length;
        const cols = [];

        for (let i = 0; i < amountOfColumns; i++) {
            const data = this._subHeader[i].data;
            const col = `<div class="vff-table__col">${data}</div>`;
            cols.push(col);
        }

        return (
            `<div class="vff-table__sub-header">
                    <div class="vff-table__row">
                        ${cols.join('')}
                    </div>
                </div>`
        );
    }

    renderBody() {
        const amountOfRows = this._tableBody.length;
        const rows = [];

        for (let i = 0; i < amountOfRows; i++) {
            const amountOfColumns = this._tableBody[i].length;
            const cols = [];

            for (let j = 0; j < amountOfColumns; j++) {
                let columnContent = this._tableBody[i][j].data;
                let col = `<div class="vff-table__col">${columnContent}</div>`;

                cols.push(col);
            }

            rows.push(`<div class="vff-table__row">${cols.join('')}</div>`);
        }

        return (
            `<div class="vff-table__body">${rows.join('')}</div>`
        );
    }

    renderFooter() {
        return (
            `<div class="vff-table__footer">${this._footer}</div>`
        );
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

window.vff.define("vff-table", VffTable);

