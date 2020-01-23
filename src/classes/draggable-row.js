import {getStyleVal} from "../utils/utils";

export default class RowWrapper {
    /**
     * @param props
     * @param props.domNode
     * @param props.startY - point where mousedown happened and the element was grabbed
     */
    constructor(props) {
        this._startY = props.startY;
        this._domNode = props.domNode;
        this._topRelativePosition = parseInt(getStyleVal(this._domNode, 'top'));
        this._domNode.style.opacity = '0.9';
        this._domNode.visibility = 'hidden';
        this._domNode.style.zIndex = '-1000';
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
        let newTop = this._topRelativePosition + (event.pageY - this._startY);
        this._domNode.style.top = newTop + 'px';
    }

    reset() {
        this._domNode.style.opacity = '1';
        this._domNode.style.zIndex = '';
        window.removeEventListener('mousemove', this._followTheMouse);
    }
}
