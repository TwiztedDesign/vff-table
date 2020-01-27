import {getStyleVal} from "../utils/utils";

export default class RowWrapper {
    /**
     * @param props
     * @param {HTMLElement} props.domNode
     * @param {number} props.startDragAtY - point where mousedown happened and the element was grabbed
     */
    constructor(props) {
        this._startDragAtY = props.startDragAtY;
        this._domNode = props.domNode;
        this._topRelativePosition = parseInt(getStyleVal(this._domNode, 'top'));
        this._followTheMouse = this._followTheMouse.bind(this);
        window.addEventListener('mousemove', this._followTheMouse);
    }

    /**
     * @return {string}
     */
    get height() {
        return getStyleVal(this._domNode, 'height');
    }

    get position() {
        return Math.round((parseInt(this._domNode.style.top) / parseInt(this.height)) + 1);
    }

    /**
     * @param event
     * @private
     */
    _followTheMouse(event) {
        let newTop = this._topRelativePosition + (event.pageY - this._startDragAtY);
        this._domNode.style.top = newTop + 'px';
    }

    reset() {
        window.removeEventListener('mousemove', this._followTheMouse);
    }
}
