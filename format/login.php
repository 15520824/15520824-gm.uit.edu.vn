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

if (isset($data["phone"])) {
    $phone=$data["phone"];
}else
{
    echo "BAD_REQUEST (400)";
    exit();
}

if (isset($data["password"])) {
    $password=md5($data["password"]."safe.Login.via.normal.HTTP"."000000");
}else
{
    echo "BAD_REQUEST (400)";
    exit();
}

$milliseconds = round(microtime(true) * 1000);
$connector->query("DELETE FROM ".$prefix."safe_login WHERE created < UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL 3 DAY))");
$result = $connector->load($prefix."users","phone = ".$phone." AND password = '".$password."'");
if(count($result)>0)
{
    $token = $milliseconds.uniqid();
    $tempToken = array(
        "token"=>$token,
        "userid"=>$result[0]["id"]
    );
    $connector->insert($prefix."safe_login",$tempToken);
    $token = array(
        "token"=>$token,
        "user"=>$result
    );
    $dataUser = $result[0];
    $dataUser["lastlogin"] = new DateTime();
    $connector->update($prefix."users", $dataUser);
}else
$token = false;

echo "ok".EncodingClass::fromVariable($token);

exit(0);
?>
