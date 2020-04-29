<?php
$link = mysql_connect($host, $username , $password);

if (!$link) {
    die("Can not connect to database: " . mysql_error());
}

$defaultdb = mysql_select_db($dbname, $link);
?>
