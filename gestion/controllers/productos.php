<?php
namespace Gestion;

include_once $_SERVER['DOCUMENT_ROOT'] . '/common-controller/controller.php';
include_once '../models/productos.php';

if($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_REQUEST['id'])){
    echo Productos::findById($_REQUEST['id']);
    http_response_code(200);
}
else if($_SERVER['REQUEST_METHOD'] === 'GET'){
    echo Productos::all();
    http_response_code(200);
}
else if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $data = json_decode(file_get_contents("php://input"));

    if(
        !empty($data->nombre_producto) &&
        !empty($data->cantidad_producto) &&
        !empty($data->costo_producto) &&
        !empty($data->cod_barras_producto)
    ){
        echo Productos::new($data);
        http_response_code(201);
    }
    else{
        echo json_encode(array("Mensaje" => "Falta algún dato para crear el producto"));
        echo $data->nombre_producto ." ". $data->cantidad_producto ." ". $data->costo_producto ." ". $data->cod_barras_producto;
        http_response_code(503);
    }
}
else if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){   

}
else if($_SERVER['REQUEST_METHOD'] === 'PUT'){
    $data = json_decode(file_get_contents("php://input"));

    if(
        !empty($data->id_producto) &&
        !empty($data->nombre_producto) &&
        !empty($data->cantidad_producto) &&
        !empty($data->costo_producto) &&
        !empty($data->cod_barras_producto)
    ){
        echo Productos::update($data);
        http_response_code(200);
    }
}
else if($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_REQUEST['id'])){
    echo Productos::delete($_REQUEST['id']);
    http_response_code(200);
}

die();