<?php

include_once "prefix.php";

$dbname = "help";
$dbhomename = "home_lab";
$username = "root";
$password = "your_root_password";
$host = "localhost";

// $defaultdb = DatabaseClass::init($host, $username , $password, $dbname);

if (version_compare(PHP_VERSION, '7.0.0') >= 0) {
    include_once  "connection_7.php";
} else {
    include_once  "connection_4.php";
}
?>
