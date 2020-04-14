import { productos } from '../../../controllers/productos.js';
class Facturador extends HTMLElement {
    get productos(){
        return this._productos;
    }
    set productos(obj){
        this._productos = obj;
    }
    constructor(){
        super();
        this._productos;       
        this._express = false;
        const shadowRoot = this.attachShadow({mode : 'open'});
        shadowRoot.innerHTML = `<button id="chichito">Boton xdxd</button>`;
    }
    connectedCallback(){
        this.shadowRoot.getElementById('chichito').addEventListener('click', () => console.log(productos.todos));
    }
}

window.customElements.define('component-facturacion', Facturador);

export { Facturador }