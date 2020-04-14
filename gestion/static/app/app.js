//Iniciar app
//Importación de módulos

import { NavBar } from './views/components/navBar.js';
import { Modal } from './views/components/modal.js';
import { ListaProductos } from './views/components/comerciante/productos.js';

//Workers
let dataWorker = new Worker('./services/data.js')
export { dataWorker }