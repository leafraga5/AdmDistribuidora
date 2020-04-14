class Router {
    static mostrarModulos(url){
        fetch(url)
        .then(res => res.text())
        .then(data => document.getElementById('aplicacion').innerHTML = data)
    }

    static inyectarModulo(asd){
        document.getElementsByTagName('main')[0].innerHTML = asd
    }

    constructor(){

        this.modulos = {
            mostrarTodo(){ Router.mostrarModulos('./views/html/modulos.html') }
        }
    
        this.comerciante = {
            url : 'views/html/comerciante/',
                mostrarTodo(){ Router.mostrarModulos(router.comerciante.url) },
                mostrarFacturacion(){ Router.inyectarModulo('<component-facturacion></component-facturacion>') },
                mostrarProductos(){ Router.inyectarModulo('<lista-productos></lista-productos>') },
                mostrarClientes(){ Router.inyectarModulo('<component-facturacion></component-facturacion>') },
                mostrarProveedores(){ Router.inyectarModulo('<component-facturacion></component-facturacion>') },
                mostrarConfiguracion(){ Router.inyectarModulo('<component-facturacion></component-facturacion>') }
        }
    }
}

let router = new Router();

router.modulos.mostrarTodo();