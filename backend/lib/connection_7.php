<?php
$link = mysqli_connect($host, $username , $password);

if (!$link) {
    die("Can not connect to database: " .$host);
}

$defaultdb = mysqli_connect($host, $username , $password, $dbname);

function mysql_query($s) {
    global $defaultdb;
    return $defaultdb->query($s);
}

function mysql_fetch_row($r) {
    return mysqli_fetch_row($r);
}

function mysql_insert_id() {
    global $defaultdb;
    return mysqli_insert_id($defaultdb);
}

function mysql_affected_rows() {
    global $defaultdb;
    return mysqli_affected_rows($defaultdb);
}

function mysql_error() {
    global $defaultdb;
    return mysqli_error($defaultdb);
}

function mysql_num_fields($r) {
    return mysqli_num_fields($r);
}

function mysql_num_rows($r) {
    return mysqli_num_rows($r);
}

function mysql_fetch_field($r, $i) {
    return mysqli_fetch_field_direct($r, $i);
}

function  mysql_fetch_array($r) {
    return mysqli_fetch_array($r, MYSQLI_BOTH);
}
?>
