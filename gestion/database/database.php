<?php
namespace Gestion;

include_once $_SERVER['DOCUMENT_ROOT'] . '/common-data/database.php';

class Database{
 
    public static function getConnection()
    {
        if (session_status() !== PHP_SESSION_ACTIVE)
            session_start();
            //$cfg = $_SESSION['wapp']->connection; <- descomentar para producción
            $cfg = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/login/config/database.json', true));

        return \Destackar\Database::getConnection($cfg);
    } 
}
?>