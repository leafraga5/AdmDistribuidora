<?php
namespace Gestion;

include_once $_SERVER['DOCUMENT_ROOT'] . '/common-model/model.php';
include_once '../database/database.php';

class Productos {
    static function findById($id){
        return \Destackar\Model::findById(Database::getConnection(), "CALL productos_buscarId(:id)", $id);
    }

    static function all(){
        return \Destackar\Model::all(Database::getConnection(), "CALL productos_todos()");
    }

    static function new($data){
        return \Destackar\Model::new(Database::getConnection(), "CALL productos_nuevo(:nombre_producto, :cantidad_producto, :costo_producto, :cod_barras_producto)", $data);
    }

    static function update($data){
        return \Destackar\Model::new(Database::getConnection(), "CALL productos_editar(:id_producto, :nombre_producto, :cantidad_producto, :costo_producto, :cod_barras_producto)", $data);
    }

    static function delete($id){
        return \Destackar\Model::delete(Database::getConnection(), "CALL productos_borrar(:id)", $id);
    }
}