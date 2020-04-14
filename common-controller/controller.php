<?php
namespace Destackar;

if($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Headers: X-Requested-With, origin, content-type, accept");
    header('content-type: application/json; charset=utf-8');
}
else if($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: X-Requested-With, origin, content-type, accept");
    header('content-type: application/json; charset=utf-8');
}
else if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    header("Access-Control-Allow-Headers: Authorization, Content-Type,Accept, Origin");
}
else if($_SERVER['REQUEST_METHOD'] === 'PUT') {
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: X-Requested-With, origin, content-type, accept");
    header('content-type: application/json; charset=utf-8');
}
else if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: X-Requested-With, origin, content-type, accept");
    header('content-type: application/json; charset=utf-8');
}
else {
    http_response_code(404);
    echo json_encode(array("Mensaje" => "Acceso denegado."));
    die();
}