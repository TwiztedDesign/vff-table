import {getStyleVal} from "../utils/utils";

export default class RowWrapper {
    constructor(props) {
        this.startY = props.startY;
        this.domNode = props.domNode;
        this.topRelativePosition = parseInt(getStyleVal(this.domNode, 'top'));
        this.domNode.style.opacity = '0.6';
        this._followTheMouse = this._followTheMouse.bind(this);
        window.addEventListener('mousemove', this._followTheMouse);
    }

    _followTheMouse(event) {
        let newTop = this.topRelativePosition + (event.pageY - this.startY);
        this.domNode.style.top = newTop + 'px';
    }

    reset() {
        this.domNode.style.opacity = '1';
        window.removeEventListener('mousemove', this._followTheMouse);
    }
}
