self.addEventListener('message', wEvent =>{
    if(wEvent.data.buscarId === "productos"){
        productos.getById(wEvent.data.id)
    }
    else if (wEvent.data.buscar === "productos"){
        productos.getAll();
    }
    else if(wEvent.data.nuevo === 'productos'){
        productos.create(wEvent.data.obj)
    }
    else if (wEvent.data.eliminar === "productos"){
        productos.delete(wEvent.data.id)
    }
    else if (wEvent.data.editar === "productos" && wEvent.data.guardar === false){
        productos.editRequestData(wEvent.data.id)
    }
    else if (wEvent.data.editar === "productos" && wEvent.data.guardar === true){
        console.log('llegó la data editada')
        productos.editSaveChanges(wEvent.data.cambios)
    }
    else { throw new Error("Data Worker: Parámetros de búsqueda incorrectos") }
});

class Data {

    static compararJSON(a, b){ return JSON.stringify(a) === JSON.stringify(b) }

    static orderDesc(obj){ return obj.sort((a,b) => { a - b }) }

    static notifyUpdate(){ return postMessage( { update : true }) }

    set setData(data){
        if(Data.compararJSON(data, this.data)){
            console.log('Worker : No hizo falta actualizar productos');
        }
        else{
            this.data = data;
            Data.notifyUpdate();
            console.log('Worker : Productos actualizados');
        }
    }

    constructor(){
        this.data = {};
        this.url = 'http://localhost/gestion/controllers';
        this.updateData();
        //setInterval(()=>{ this.updateData() }, delayPorPeticion);
    }
    
    updateData(){
        fetch(`${this.url}/productos.php`, { method : 'GET' } )
        .then( data => data.json() )
        .then( data => this.setData = data )
        .catch( e => console.error(`Worker: No se pudo actualizar la información, ${e}`))
    }

    listenSource(){
        let SSE = new EventSource(`${this.url}/chichito`);
        SSE.addEventListener('message', e => this.updateData() )
    }

    getAll(){ postMessage({ table : true, obj : this.data }) }

    getById(id){ postMessage({ table : true, obj : this.data.filter( data => data.id_producto == id ) }) }

    create(obj){
        fetch(`${this.url}/productos`, { method : 'POST', body : JSON.stringify({
                nombre_producto : obj.nombre,
                cantidad_producto : obj.cantidad,
                costo_producto : obj.costo,
                cod_barras_producto : obj.codigo
            })
        })
        .then(() => this.updateData() )
        .catch(e => console.error(`Worker: No se pudo crear un producto, ${e}`) ) 
    }

    delete(id){
        fetch(`${this.url}/productos.php?id=${id}`, { method : 'DELETE' } )
        .then(() => {
            this.data = this.data.filter( data => data.id_producto !== id )
        })
        .then(() => Data.notifyUpdate() )
        .catch(e => console.error(`Worker: No se pudo eliminar un producto, ${e}`) ) 
    }

    editRequestData(id){
        self.postMessage({ edit : true,  obj : this.data.filter( data => data.id_producto == id )[0]})
    }
    editSaveChanges(newValue){
        fetch(`${this.url}/productos`, { method : 'PUT',
            body : JSON.stringify({
                id_producto : newValue.id,
                nombre_producto : newValue.nombre,
                cantidad_producto : newValue.cantidad,
                costo_producto : newValue.costo,
                cod_barras_producto : newValue.codigo
            })
        })
        .then(
            () => {
                for (let i = 0; i < this.data.length; i++) {
                    const element = this.data[i];
                    if(element.id_producto == newValue.id){
                        element.nombre_producto = newValue.nombre,
                        element.cantidad_producto = newValue.cantidad,
                        element.costo_producto = newValue.costo,
                        element.cod_barras_producto = newValue.codigo
                    }
                }
            }
        )
        .then(() => this.data = Data.orderDesc(this.data))
        .then(() => Data.notifyUpdate() )
        .catch(e => console.error(`Worker: No se pudo editar un producto, ${e}`)) 
    }
}

let productos = new Data();