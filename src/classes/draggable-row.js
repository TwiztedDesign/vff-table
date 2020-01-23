import {getStyleVal} from "../utils/utils";

export default class RowWrapper {
    constructor(props) {
        this._startY = props.startY;
        this._domNode = props.domNode;
        this._topRelativePosition = parseInt(getStyleVal(this._domNode, 'top'));
        this._domNode.style.opacity = '0.6';
        this._followTheMouse = this._followTheMouse.bind(this);
        window.addEventListener('mousemove', this._followTheMouse);
    }

    _followTheMouse(event) {
        let newTop = this._topRelativePosition + (event.pageY - this._startY);
        this._domNode.style.top = newTop + 'px';
    }

    reset() {
        this._domNode.style.opacity = '1';
        window.removeEventListener('mousemove', this._followTheMouse);
    }
}
