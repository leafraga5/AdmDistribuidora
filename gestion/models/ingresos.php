<?php
namespace Gestion;

include_once $_SERVER['DOCUMENT_ROOT'] . '/common-model/model.php';
include_once '../database/database.php';

class Ingresos {
    static function findById($id){
        return \Destackar\Model::findById(Database::getConnection(), "CALL ingresos_buscarId(:id)", $id);
    }

    static function all(){
        return \Destackar\Model::all(Database::getConnection(), "CALL ingresos_todos()");
    }

    static function new($data){
        return \Destackar\Model::new(Database::getConnection(), "CALL ingresos_nuevo(:fecha_ingreso, :depositos_id_deposito)", $data);
    }

    static function update($data){
        return \Destackar\Model::new(Database::getConnection(), "CALL ingresos_editar(:id_ingresos, :fecha_ingreso, :depositos_id_deposito)", $data);
    }

    static function delete($id){
        return \Destackar\Model::delete(Database::getConnection(), "CALL ingresos_borrar(:id)", $id);
    }
}