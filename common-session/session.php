<?php
    include_once $_SERVER['DOCUMENT_ROOT'] . '/common-data/database.php';
    use Destackar\Database;
    
    class Session{
        static $conn;
    
        public function __construct() {

        }

        public static function login($json){
            self::$conn = Database::getConnection($json->cfg);

            $response = array('ok' => false);
            $query = "CALL SP_CheckUser(:p_user, :p_password)";
            $stmt = self::$conn->prepare($query);
            
            $stmt->bindParam(':p_user', $json->username, PDO::PARAM_STR);
            $stmt->bindParam(':p_password', $json->password, PDO::PARAM_STR);

            $stmt->execute();
            
            if($stmt->rowCount() > 0){
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                
                $response['user_id'] = $row['user_id'];
                $host_name = gethostname();
                $host_ip = gethostbyname(gethostname());


                $query = "CALL SP_Login(:p_user_id, :p_host_name, :p_host_ip)";
                $stmt = self::$conn->prepare($query);
                
                $stmt->bindParam(':p_user_id', $response['user_id'], PDO::PARAM_INT);
                $stmt->bindParam(':p_host_name', $host_name, PDO::PARAM_STR);
                $stmt->bindParam(':p_host_ip', $host_ip, PDO::PARAM_STR);

                $stmt->execute();
            
                if($stmt->rowCount() > 0){
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    $response['token'] = $row['token'];

                    $query = "CALL SP_GetUserWappsById(:p_user_id)";
                    $stmt = self::$conn->prepare($query);
                    
                    $stmt->bindParam(':p_user_id', $response['user_id'], PDO::PARAM_INT);

                    $stmt->execute();
                
                    if($stmt->rowCount() > 0){
                        $result = $stmt->fetchall();
                        $response['wapp'] = $result[0];
                        //$response['wapp']['connection'] = json_decode($response['wapp']['connection']);
                        $response['cfg'] = $json->cfg;
                        $response['ok'] = true;
                    }
                    else {
                        $response['message'] = 'no se pudieron obtener los permisos del usuario.';    
                    }
                }
                else {
                    $response['message'] = 'no se pudo registrar la sesión correctamente.';
                }
            }
            else {
                $response['message'] = 'el usuario y/o la contraseña ingresados son incorrectos.';
            }

            return $response;
        }

        public static function check_session($json){
            self::$conn = \Destackar\Database::getConnection($json->cfg);

            $query = "CALL SP_CheckSession(:p_token)";
            $stmt = self::$conn->prepare($query);
            
            $stmt->bindParam(':p_token', $json->token, PDO::PARAM_STR);

            $stmt->execute();
            
            if($stmt->rowCount() > 0){
                $row = $stmt->fetch(\PDO::FETCH_ASSOC);

                if ($row['expired'] === 1) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        }

        public static function logout($json){
            self::$conn = \Destackar\Database::getConnection($json->cfg);

            $query = "CALL SP_Logout(:p_token)";
            $stmt = self::$conn->prepare($query);
            
            $stmt->bindParam(':p_token', $json->token, PDO::PARAM_STR);

            $stmt->execute();
            
            if($stmt->rowCount() > 0){
                return true;
            }
            else {
                return false;
            }
        }
    }
?>