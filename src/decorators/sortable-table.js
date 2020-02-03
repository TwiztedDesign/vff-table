import DragButton from "../components/vff-drag-button";
import DraggableRow from '../classes/draggable-row';
import {createElement, getStyleVal, toArray} from "../utils/utils";

const direction = {
    UP: 'up',
    DOWN: 'down'
};

let oldY = 0;
let yDirection;

const updateMouseDirection = function(event) {
    if (oldY < event.pageY) {
        yDirection = direction.DOWN;
    } else if (oldY > event.pageY) {
        yDirection = direction.UP;
    }
    oldY = event.pageY;
};

class Sortable {
    /**
     * @param {object} props
     * @param {HTMLElement[]} props.tableRows - table rows
     * @param {HTMLElement[]} props.tableBodyState
     * @param {object} props.tableRef - original table object
     */
    constructor(props) {
        this._tableRef = props.tableRef;
        this._tableBodyState = props.tableBodyState;
        this._rows = props.tableRows || [];
        this._deocratedRows = [];
        this._tableSort = {over: null, drag: null};
        this._draggableRow = null;
        this._rows.forEach((row, index) => this._makeDraggable(row, index));
    }

    get sortableRows() {
        return this._deocratedRows;
    }

    /**
     * @param index
     * @param rowWrapper
     * @param event
     * @private
     */
    _onGrabDragButton(index, rowWrapper, event) {
        this._draggableRow = new DraggableRow({
            domNode: rowWrapper,
            startDragAtY: event.detail.startDragAtY
        });
        document.body.addEventListener('mousemove', updateMouseDirection);
    }

    /**
     * @private
     */
    _onReleaseDragButton() {
        this._arrangeDataModel();
        this._resetTableSort();
        const event = new CustomEvent('vff-table-body-change', {detail: {tableState: this._tableBodyState}});
        this._tableRef.dispatchEvent(event);
        this._draggableRow.reset();
        this._draggableRow = null;
        document.body.removeEventListener('mousemove', updateMouseDirection);
    }

    _resetTableSort() {
        this._tableSort.over = null;
        this._tableSort.drag = null;
    }

    _arrangeDataModel() {
        const from = this._tableSort.drag;
        const to = this._tableSort.over;
        const tableBodyState = this._tableBodyState.slice();
        if (from === null || to === null) return;
        tableBodyState.splice(to, 0, tableBodyState.splice(from, 1)[0]);
        this._tableBodyState = tableBodyState;
    }

    /**
     * @param row
     * @param index
     * @return {HTMLElement} - row enabled to be dragged and reordered across the table
     * @private
     */
    _makeDraggable(row, index) {
        const rowWrapper = createElement('div', {classList: ['row-wrapper']});
        const dragButton = new DragButton();
        let isInTransition = false;

        dragButton.addEventListener('vff-grab-drag-button', this._onGrabDragButton.bind(this, index, rowWrapper));
        dragButton.addEventListener('vff-release-drag-button', this._onReleaseDragButton.bind(this, index));

        rowWrapper.addEventListener('mousedown', function() {
            if (!this._draggableRow) return;
            this._tableSort.drag = index;
            this._tableSort.over = index;
        }.bind(this));

        rowWrapper.addEventListener('transitionend', function() {
            isInTransition = false;
        });

        rowWrapper.addEventListener('mouseover', function() {
            if (!this._draggableRow) return;
            if (isInTransition) return;
            this._tableSort.over = index;
            const draggableRow = this._draggableRow;
            const margin = parseInt(getStyleVal(draggableRow._domNode, 'margin-top'));
            const height = parseInt(draggableRow.height);
            const distance = height + margin + 'px';
            isInTransition = true;
            if (rowWrapper.style.transform !== '') { // moving back in case of up / down drag
                if (yDirection === direction.UP) {
                    this._tableSort.over = this._tableSort.over - 1;
                } else {
                    this._tableSort.over = this._tableSort.over + 1;
                }
                rowWrapper.style.transform = '';
            } else {
                const wrappers = this._tableRef.shadowRoot.querySelectorAll('.row-wrapper');
                wrappers.forEach((node, index, list) => {
                    if (index === this._tableSort.drag) return; // don't touch the one that is being dragged
                    if (yDirection === direction.DOWN) {
                        // indexes from the element that is being dragged to the one we're over
                        if (index <= this._tableSort.over && index > this._tableSort.drag) { // translate up all the bigger indexes
                            list[index].style.transform = 'translateY(-' + distance + ')';
                        }
                    } else if (yDirection === direction.UP) {
                        if (index >= this._tableSort.over && index < this._tableSort.drag) {
                            list[index].style.transform = 'translateY(' + distance + ')';
                        }
                    }
                });
            }
        }.bind(this));
        const parent = row.parentElement;
        parent.appendChild(rowWrapper);
        rowWrapper.appendChild(row);
        rowWrapper.appendChild(dragButton);
    }
}

/**
 * @param tableRef
 * @return {[]|*[]}
 */
export const makeSortableDecorator = function(tableRef) {
    const tableBody = tableRef.shadowRoot.querySelector('#table-body');
    const tableRows = toArray(tableBody.querySelectorAll('vff-row'));
    const tableBodyState = tableRef._tableBody.slice();
    new Sortable({tableRef, tableBodyState, tableRows});
};
