<?php
    include_once $_SERVER['DOCUMENT_ROOT'] . '/common-session/session.php';

    session_start();

    if (isset($_SESSION['token']) && isset($_SESSION['wapp']) && isset($_SESSION['cfg'])) {
        $args = array('token' => $_SESSION['token'], 'cfg' => $_SESSION['cfg']);
        $result = Session::logout(json_decode(json_encode($args)));

        session_destroy();
        $_SESSION['login'] = false;
        unset($_SESSION['token']);
        unset($_SESSION['wapp']);
        unset($_SESSION['cfg']);
    }
    else {
        $_SESSION['login'] = false;
    }
?>