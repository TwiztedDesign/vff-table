/**
 * @param height - height of the whole element to draw rulers across
 * @param columns
 */
import {createElement, getStyleVal, toArray} from "../utils/utils";

export const makeResizerDecorator = function(row) {
    /**
     * 1. get all vff-cols
     * 2. wrap each of them in a wrapper element to allow attaching elements
     * 3. rest of the cols should be listening for changes
     */
    const cols = toArray.call(row.shadowRoot.querySelectorAll('vff-col'));
    if (!cols) return;

    const rowDomElement = row.shadowRoot.querySelector('#row');
    const columns = row.shadowRoot.querySelector('#columns');

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
                height: '200px',
                zIndex: 1000
            },
            data: {
                index
            }
        });
        const colWrapper = createElement('div', {classList: ['col-wrapper']});
        const width = col.style.width;
        colWrapper.appendChild(col);
        if (index !== (arr.length - 1)) { // don't append to last one
            colWrapper.appendChild(ruler);
        }
        colWrapper.style.position = 'relative';
        colWrapper.style.display = 'flex';
        colWrapper.style.flexDirection = 'row';
        colWrapper.style.width = width;
        col.style.width = '100%';
        setListeners(ruler);
        setMutationObserver(colWrapper);
        columns.appendChild(colWrapper);
    });

    function setListeners(div) {
        let pageX,
            curCol,
            nxtCol,
            curColWidth,
            nxtColWidth;

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
        div.addEventListener('mouseover', function(e) {
            e.target.style.borderRight = '2px solid black';
        });

        /**
         * on mouseout we'll hide the resizer
         */
        div.addEventListener('mouseout', function(e) {
            e.target.style.borderRight = '';
        });

        /**
         * If there is a mousemove event with a mousedown event (we're holding and moving an element)
         * update width on elements on resize
         */
        document.addEventListener('mousemove', function(e) {
            if (curCol) {
                const diffX = e.pageX - pageX;
                if (nxtCol) nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';
                curCol.style.width = (curColWidth + diffX) + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
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

export const makeResizeableDecorator = function(row) {
    // console.log(row);
};
