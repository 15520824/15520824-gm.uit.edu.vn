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

$result = $connector->load($prefix."safe_login","token = '".$token."' AND userid = ".$userid);
if(count($result)>0)
{
    $id = $result[0]["id"];
    $connector->query("UPDATE ".$prefix."safe_login SET created = now() WHERE id = ".$id);
    $token = $connector->load($prefix."users","id = ".$userid);
}else
    $token = false;

echo "ok".EncodingClass::fromVariable($token);

exit(0);
?>
