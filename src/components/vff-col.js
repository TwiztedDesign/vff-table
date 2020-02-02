import BaseShadowRootComponent from "../classes/base-shadow-root-component";

export default class VffCol extends BaseShadowRootComponent {
    /**
     * @param props
     * @param {string }props.type - a component can be of type text or image // todo : extend type support
     * @param {string }props.text - if component is of type text
     * @param {number} props.index - to identify place in a row, starts with 0
     */
    constructor(props) {
        super();
        this._type = props.type || 'text';
        this._text = props.text || '';
        this._index = props.index;
        this.shadowRoot.innerHTML = `
            <style>
                :host(*) {
                    box-sizing: border-box;
                }
                :host{                    
                    height: 100%;                   
                }               
                #col{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    position: relative;
                }
            </style>
            <div id="col"></div>
            `;
    }

    set type(_type) {
        this._type = _type;
    }

    set text(_text) {
        this._text = _text;
    }

    get index() {
        return this._index;
    }

    render() {
        const col = this.shadowRoot.querySelector('#col');
        col.textContent = this._text;
        return this;
    }
}
