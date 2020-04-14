<?php
namespace Gestion;

include_once $_SERVER['DOCUMENT_ROOT'] . '/common-controller/controller.php';
include_once '../models/ingresos.php';

if($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_REQUEST['id'])){
    echo Ingresos::findById($_REQUEST['id']);
    http_response_code(200);
}
else if($_SERVER['REQUEST_METHOD'] === 'GET'){
    echo Ingresos::all();
    http_response_code(200);
} 
else if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $data = json_decode(file_get_contents("php://input"));

    if(
        !empty($data->fecha_producto) &&
        !empty($data->deposito_id_deposito) 
   
    ){
        echo Productos::new($data);
        http_response_code(201);
    }
    else{
        echo json_encode(array("Mensaje" => "Falta algún dato para crear el ingreso"));
        echo $data->fecha_producto ." ". $data->deposito_id_deposito;
        http_response_code(503);
    }
}
else if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){   

}
else if($_SERVER['REQUEST_METHOD'] === 'PUT'){
    $data = json_decode(file_get_contents("php://input"));

    if(
        !empty($data->id_ingresos) &&
        !empty($data->fecha_producto) &&
        !empty($data->deposito_id_deposito) 
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