<?php

    include_once $_SERVER['DOCUMENT_ROOT'] . '/common-session/session.php';

    if (session_status() !== PHP_SESSION_ACTIVE)
        session_start();

    if (isset($_SESSION['token']) && isset($_SESSION['wapp']) && isset($_SESSION['cfg'])) {
        $args = array('token' => $_SESSION['token'], 'cfg' => $_SESSION['cfg']);
        $result = Session::check_session(json_decode(json_encode($args)));

        if ($result == false) {
            session_destroy();
            $_SESSION['login'] = false;
            unset($_SESSION['token']);
            unset($_SESSION['wapp']);
            unset($_SESSION['cfg']);
        }
        else {
            $_SESSION['login'] = true;
        }
    }
    else {
        $_SESSION['login'] = false;
    }

    if (!$_SESSION['login']) {
        http_response_code(403); //Forbidden
        exit();
    }

    /*
    class Check {
        public function __construct() {

        }

        public static function check($url) {
            if (isset($_SESSION['token']) && isset($_SESSION['wapp']) && isset($_SESSION['cfg'])) {
                $args = array('token' => $_SESSION['token'], 'cfg' => $_SESSION['cfg']);
                $result = Session::check_session(json_decode(json_encode($args)));

                if ($result == false) {
                    session_destroy();
                    $_SESSION['login'] = false;
                    unset($_SESSION['token']);
                    unset($_SESSION['wapp']);
                    unset($_SESSION['cfg']);
                }
                else {
                    $_SESSION['login'] = true;
                }
            }
            else {
                $_SESSION['login'] = false;
            }

            if (!$_SESSION['login']) {
                http_response_code(403); //Forbidden
                if (isset($url)) {
                    header("Location: " . $url);
                }
                exit();
            }
        }
    }
    */
?>