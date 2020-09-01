<?php
include_once "../lib/jsdb.php";
include_once "../lib/jsencoding.php";
include_once "../lib/prefix.php";
include_once "../lib/connection.php";
include_once "../lib/generalOperator.php";

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
$connector = DatabaseClass::init($host, $username , $password, $dbname);
if ($connector == null) {
    echo "Can not connect to database!";
    exit(0);
}

$connector ->db -> set_charset("utf8");
if (isset($_POST["name"])) {
    $tableName=$_POST["name"];
}else
{
    echo "BAD_REQUEST (400)";
    exit();
}

if (isset($_POST["data"])) {
    $data=EncodingClass::toVariable($_POST["data"]);
}else
{
    echo "BAD_REQUEST (400)";
    exit();
}

if (isset($data["token"])) {
    $token=$data["token"];
}else
{
    echo "BAD_REQUEST (400)";
    exit();
}

if (isset($data["userid"])) {
    $userid=$data["userid"];
}else
{
    echo "BAD_REQUEST (400)";
    exit();
}

$result = $connector->query("DELETE FROM ".$prefix."safe_login"." WHERE( token = '".$token."' AND userid = ".$userid.")");

echo "ok".EncodingClass::fromVariable($token);

exit(0);
?>
