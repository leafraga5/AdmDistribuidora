<?php
namespace Destackar;

class Database{
    public static function getConnection($cfg){
        $conn = null;

        try {
            $options = [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                //\PDO::ATTR_PERSISTENT => true, <- comentada porque tiraba un Warning en Postman
                \PDO::ATTR_TIMEOUT => 0
            ];

            $conn = new \PDO("mysql:host=" . $cfg->host . ";dbname=" . $cfg->dbname, $cfg->user, $cfg->password, $options);
            $conn->exec("set names utf8");
        }
        catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }
 
        return $conn;
    }
}
?>