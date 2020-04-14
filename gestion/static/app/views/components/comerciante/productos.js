import { dataWorker } from '../../../app.js';
class ListaProductos extends HTMLElement {
    
    constructor(){
        super();
        this._productos = {};
        const shadowRoot = this.attachShadow({mode : 'open'});
        shadowRoot.innerHTML = `
            <input type="number" id="buscarid"><button id="nuevo">Nuevo</button>
            <section id="productos"></section>
            <section id="modals"></section>`;
            this.filtroValor = this.shadowRoot.getElementById('buscarid');
            this.productosContainer = shadowRoot.getElementById('productos');
            this.modalsContainer = shadowRoot.getElementById('modals');
        }

    hacerTabla(data){
        let tabla = 
            `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th> 
                    <th>Cantidad</th>
                    <th>Costo</th>
                    <th>Código</th>
                    <th></th>
                    <th></th>
                </tr>
            `;
        for (const key in data) {
            tabla +=
                `
                <tr>
                    <td>${data[key]['id_producto']}</td>
                    <td>${data[key]['nombre_producto']}</td>
                    <td>${data[key]['cantidad_producto']}</td>
                    <td>${data[key]['costo_producto']}</td>
                    <td>${data[key]['cod_barras_producto']}</td>
                    <td><button data-editar-id="${data[key]['id_producto']}">Editar</button></td>
                    <td><button data-borrar-id="${data[key]['id_producto']}">Borrar</button></td>
                </tr>`;
        }
        tabla += `</table>`;
        return tabla
    }

    todos(){ dataWorker.postMessage({ buscar : "productos" }) }

    buscarId(id){ dataWorker.postMessage({ buscarId : "productos", id : id }) } 

    borrarProducto(id){ dataWorker.postMessage({ eliminar : "productos", id : id }) }
    
    crearProducto(){ this.modalsContainer.innerHTML += `<creador-productos></creador-productos>` }

    editarProducto(id){
        this.modalsContainer.innerHTML += `<editor-productos idProducto="${id}"></editor-productos>`
    }

    inyectarTabla(data){ this.productosContainer.innerHTML = this.hacerTabla(data) }
    
    renderizarTabla(){
        if( Number(this.filtroValor.value) == 0 ){ this.todos() }
        else{ this.buscarId(Number(this.filtroValor.value)) }
    }    

    connectedCallback(){
        //Sincroniza la información del worker con el componente
        dataWorker.addEventListener('message', wEvent => {
            if( wEvent.data.update === true ){
                return this.renderizarTabla();
            }
            else if ( wEvent.data.table === true ){
                return this.inyectarTabla(wEvent.data.obj)
            }

        }, false);
        //Renderiza la tabla cuando se ingresa algo en el filtro
        this.filtroValor.addEventListener('input', () => {
            this.renderizarTabla();
        }, false);
        //Detecta click en los botones de la tabla
        this.shadowRoot.addEventListener('click', event =>{
            if(event.target.hasAttribute('data-borrar-id')){
                this.borrarProducto(Number(event.target.attributes['data-borrar-id'].value));
            }
            if(event.target.hasAttribute('data-editar-id')){
                console.log('Solicitando producto para edicion')
                this.editarProducto(Number(event.target.attributes['data-editar-id'].value)) 
            }
            if(event.target.id === 'nuevo'){
                this.crearProducto();
            }
        }, false)

        this.todos()
    }

}

class CreadorProductos extends HTMLElement{
    constructor(){
        super();
        const shadowRoot = this.attachShadow({mode : 'open'});
        shadowRoot.innerHTML = `
        <style>
        :host{
            position: fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 0px;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
        }
        #creador{
            min-width: 80%;
            min-height: 80%;
            background-color: #f1f1f1;
        }
        </style>
        
        <div id="creador">
        </div>
        `;
        this.creadorContainer = shadowRoot.getElementById('creador');
    }

    hacerEstructura(){
        return `<label for="nombre">Nombre: </label>
                <input type="text" name="nombre" id="nombre" value="">
                <br>
                <label for="cantidad">Cantidad: </label>
                <input type="number" name="cantidad" id="cantidad" value="">
                <br>
                <label for="costo">Costo: </label>
                <input type="number" name="costo" id="costo" value="">
                <br>
                <label for="codigo">Código: </label>
                <input type="text" name="codigo" id="codigo" value="">
                <button id="crear">Crear</button>
                <button id="salir">Salir</button>`;
    }

    enviarDatos(){
        dataWorker.postMessage({ nuevo : 'productos', obj : {
            nombre : this.shadowRoot.getElementById('nombre').value,
            cantidad : this.shadowRoot.getElementById('cantidad').value,
            costo : this.shadowRoot.getElementById('costo').value,
            codigo : this.shadowRoot.getElementById('codigo').value
        } })
    }

    inyectarEstructura(){
        this.creadorContainer.innerHTML = this.hacerEstructura();
        this.shadowRoot.getElementById('salir').addEventListener('click', ()=> this.remove() );
        this.shadowRoot.getElementById('crear').addEventListener('click', ()=> this.enviarDatos() );
    }

    connectedCallback(){
        this.inyectarEstructura();
    }

}

class EditorProductos extends HTMLElement{

    get idProducto(){
        return this.getAttribute('idProducto')
    }
    set idProducto(id){
        if(id){ this.setAttribute('idProducto','') }
        else { this.removeAttribute('idProducto') }
    }
    constructor(){
        super();
        const shadowRoot = this.attachShadow({mode : 'open'});
        shadowRoot.innerHTML = `
        <style>
        :host{
            position: fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 0px;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
        }
        #editor{
            min-width: 80%;
            min-height: 80%;
            background-color: #f1f1f1;
        }
        </style>
        
        <div id="editor">
        </div>
        `;
        this.editorContainer = shadowRoot.getElementById('editor');
    }

    hacerEstructura(obj){
        return `
                <input type="hidden" name="id_producto" id="id" value="${obj.id_producto}">
                <br>
                <label for="nombre">Nombre: </label>
                <input type="text" name="nombre" id="nombre" value="${obj.nombre_producto}">
                <br>
                <label for="cantidad">Cantidad: </label>
                <input type="number" name="cantidad" id="cantidad" value="${obj.cantidad_producto}">
                <br>
                <label for="costo">Costo: </label>
                <input type="number" name="costo" id="costo" value="${obj.costo_producto}">
                <br>
                <label for="codigo">Código: </label>
                <input type="text" name="codigo" id="codigo" value="${obj.cod_barras_producto}">
                <button id="guardar">Guardar</button>
                <button id="salir">Salir</button>`;
    }
    
    detectarModal(e){
        e.path[0] == this ? this.remove() : false;
    }

    inyectarEstructura(obj){
        this.editorContainer.innerHTML += this.hacerEstructura(obj);
        this.shadowRoot.getElementById('salir').addEventListener('click', ()=> this.remove() );
        this.shadowRoot.getElementById('guardar').addEventListener('click', ()=> { 
            this.guardarCambios();
            this.remove();
        })
        this.addEventListener('click', (e) => this.detectarModal(e), false);
        window.addEventListener('keyup', this.listenerKeyUp = (e) => { if (e.key === "Escape"){ this.remove() } } )
    }

    guardarCambios(){
        dataWorker.postMessage({ 
        editar : "productos",
        guardar : true,
        cambios : { id : this.shadowRoot.getElementById('id').value,
                    nombre : this.shadowRoot.getElementById('nombre').value,
                    cantidad : this.shadowRoot.getElementById('cantidad').value,
                    costo : this.shadowRoot.getElementById('costo').value, 
                    codigo : this.shadowRoot.getElementById('codigo').value
                } 
        })
    }

    connectedCallback(){
        dataWorker.addEventListener('message',this.listener = wEvent =>{
            if(wEvent.data.edit === true){
                this.inyectarEstructura(wEvent.data.obj)
            }
        })
        dataWorker.postMessage({ editar : "productos", guardar : false, id : this.idProducto});
    }
    disconnectedCallback(){
        dataWorker.removeEventListener('message', this.listener);
        window.removeEventListener('keyup', this.listenerKeyUp)
    }
}

window.customElements.define('lista-productos', ListaProductos);
window.customElements.define('editor-productos', EditorProductos);
window.customElements.define('creador-productos', CreadorProductos);

export { ListaProductos }