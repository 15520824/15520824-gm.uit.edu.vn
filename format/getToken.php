<?php
include_once "../lib/jsdb.php";
include_once "../lib/jsencoding.php";
include_once "../lib/prefix.php";
include_once "../lib/connection.php";

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
$connector = DatabaseClass::init($host, $username , $password, $dbname);
if ($connector == null) {
    echo "Can not connect to database!";
    exit(0);
}

$connector ->db -> set_charset("utf8");

$milliseconds = round(microtime(true) * 1000);

$result = $connector-> insert($prefix."ticket", array(
    "token"=>uniqid() .$milliseconds
));
$data["id"] = $result;
echo "ok".EncodingClass::fromVariable(array(
    'data'=>$data
));

exit(0);
?>
