export default class VffTable extends HTMLElement {
    constructor() {
        super();
        this._rows = 3;
        this._cols = 3;
        this._header = '';
    }

    connectedCallback() {
        this.render();
    }


    disconnectedCallback() {

    }

    render(){

        let html = `
            <div class="vff-table">
                <div class="vff-table-header">Header</div>
                <div class="vff-table-sub-header">
                    <div class="vff-table-row header">
                        <div class="vff-table-col">COL1</div>
                        <div class="vff-table-col">COL2</div>
                    </div>
                </div>
                <div class="vff-table-body">
                    <div class="vff-table-row">
                        <div class="vff-table-col">r1c1</div>
                        <div class="vff-table-col">r1c2</div>
                    </div>
                    <div class="vff-table-row">
                        <div class="vff-table-col">r2c1</div>
                        <div class="vff-table-col">r2c2</div>
                    </div>
                </div>
                <div class="vff-table-footer">Footer</div>
            </div>
        `;

        this.innerHTML = html;
    }

    get header(){
        return this._header;
    }
    set header(text){
        this._header = text;
        this.querySelector('.vff-table-header').innerHTML = this._header;
    }



    get rows(){
        return this._rows;
    }
    set rows(n){
        this._rows = n;
        console.log('rows:',n);
        //TODO manipulate DOM
    }

    get columns(){
        return this._cols;
    }
    set columns(n){
        this._cols = n;
        console.log('cols:',n);
        //TODO manipulate DOM
    }

    // get text() {
    //     return this.getAttribute("text");
    // }
    // set text(value) {
    //     this.render(value);
    // }

    expose(){
        return {
            rows : 'rows',
            columns : 'columns',
            header : 'header'
        };
    }

}

window.vff.define("vff-table", VffTable);

