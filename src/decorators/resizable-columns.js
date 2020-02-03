/**
 * @param height - height of the whole element to draw rulers across
 * @param columns
 */
import {createElement, getStyleVal, toArray} from "../utils/utils";

export const makeResizerDecorator = function(table) {
    /**
     * 1. get all vff-cols
     * 2. calculate height of a tour
     * 3. wrap each of them in a wrapper element to allow attaching elements
     * 3. rest of the cols should be listening for changes
     */
    const rows = toArray(table.shadowRoot.querySelectorAll('vff-row'));
    const row = rows[0];
    const rulerHeight = rows.reduce((total, row) => {
        const el = row.shadowRoot.querySelector('#row');
        return total + parseInt(getStyleVal(el, 'height'));
    }, 0);
    const cols = toArray(row.shadowRoot.querySelectorAll('vff-col'));
    if (!cols) return;
    const rowDomElement = row.shadowRoot.querySelector('#row');
    const columns = row.shadowRoot.querySelector('#columns');
    const colWrappersList = [];

    cols.forEach((col, index, arr) => {
        const ruler = createElement('div', {
            classList: ['ruler'],
            style: {
                top: 0,
                right: '-2px',
                width: '6px',
                position: 'absolute',
                cursor: 'col-resize',
                userSelect: 'none',
                height: rulerHeight + 'px',
                zIndex: 1000
            }
        });
        const colWrapper = createElement('div', {
            classList: ['col-wrapper'], style: {position: 'relative'}, data: {index}
        });
        const width = col.style.width;
        colWrapper.appendChild(col);
        if (index !== (arr.length - 1)) { // don't append to last one
            colWrapper.appendChild(ruler);
        }
        colWrapper.style.width = width;
        colWrappersList.push(colWrapper);
        col.style.width = '100%';
        setControllerListeners(ruler);
        setMutationObserver(colWrapper);
        columns.appendChild(colWrapper);
    });

    let pageX,
        curColWidth,
        nxtColWidth,
        curCol; // todo: revisit this crap

    const resizableRows = [...rows];
    resizableRows.splice(0, 1);
    resizableRows.forEach(row => {
        const cols = toArray(row.shadowRoot.querySelectorAll('vff-col'));
        cols.forEach(col => {
            setMutationObserver(col);
            setResizableRowsListeners(col);
        });
    });

    function setResizableRowsListeners(col) {
        const nxtCol = col.nextElementSibling;

        table.addEventListener('mousemove', function(e) {
            if (curCol && parseInt(curCol.dataset.index) === col.index) {
                const diffX = e.pageX - pageX;
                if (nxtCol) nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';
                col.style.width = (curColWidth + diffX) + 'px';
            }
        });
    }

    function setControllerListeners(div) {
        let nxtCol;
        /**
         * on mousedown we'll be continuously calculating the widths of the current and next sibling element
         */
        div.addEventListener('mousedown', function(e) {
            curCol = e.target.parentElement;
            nxtCol = curCol.nextElementSibling;
            // e.pageX - Relative to the left edge of the entire document.
            // This includes any portion of the document not currently visible.
            pageX = e.pageX;

            const padding = paddingDiff(curCol);

            curColWidth = curCol.offsetWidth - padding; // width without the padding
            if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
        });

        /**
         * on mouseover we'll make resizer visible
         */
        /*div.addEventListener('mouseover', function(e) {
            e.target.style.borderRight = '2px solid black';
        });*/

        /**
         * on mouseout we'll hide the resizer
         */
        /*div.addEventListener('mouseout', function(e) {
            e.target.style.borderRight = '';
        });*/

        /**
         * If there is a mousemove event with a mousedown event (we're holding and moving an element)
         * update width on elements on resize
         */
        table.addEventListener('mousemove', function(e) {
            if (curCol) {
                const diffX = e.pageX - pageX;
                if (nxtCol) nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';
                curCol.style.width = (curColWidth + diffX) + 'px';
            }
        });

        div.addEventListener('mouseup', function() {
            const widthArr = [];
            colWrappersList.forEach(colWrapper => {
                widthArr.push(colWrapper.style.width);
            });
            const event = new CustomEvent('vff-column-width-change', {detail: {widthArr}});
            table.dispatchEvent(event);
            curCol = undefined;
            nxtCol = undefined;
            pageX = undefined;
            nxtColWidth = undefined;
            curColWidth = undefined;
        });
    }

    function paddingDiff(col) {
        if (getStyleVal(col, 'box-sizing') === 'border-box') {
            return 0;
        }

        const padLeft = getStyleVal(col, 'padding-left');
        const padRight = getStyleVal(col, 'padding-right');
        return (parseInt(padLeft) + parseInt(padRight));

    }

    /*********************************************
     * Observe row mutation and recalculate all columns back from pixels
     * to percentage in order to maintain correct ratio between cells when
     * table is resized.
     ********************************************/
    function setMutationObserver(col) {
        const config = {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        };
        const callback = function(mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    const rowWidth = parseInt(getStyleVal(rowDomElement, 'width'));
                    const lengthString = col.style.width;
                    if (lengthString.indexOf('%') > -1) continue;
                    const length = parseInt(lengthString);
                    col.style.width = length / rowWidth * 100 + '%';
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(col, config);
    }

    return row;
};
