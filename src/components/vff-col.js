export default class VffCol extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._type = 'text';
        this._text = '';
        this.shadowRoot.innerHTML = `
            <style>
                :host(*) {
                    box-sizing: border-box;
                }
                :host{
                    width: 33.333333333333336%;                    
                    height: 100%;                   
                }
                #col{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
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

    connectedCallback() {
    }

    render() {
        const col = this.shadowRoot.querySelector('#col');
        col.textContent = this._text;
        return this;
    }
}
