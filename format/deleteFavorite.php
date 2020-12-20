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

$WHERE = "";

$isFirst = "";

foreach(array_keys($data) as $param)
{
    $WHERE .= $isFirst.$param."=".$data[$param];
    $isFirst = " AND ";
}
if($WHERE!="")
{
    $WHERE = " WHERE (".$WHERE.")";
    if(isset($data["userid"])&&isset($data["houseid"]))
    $loadResult = $connector-> query("SELECT * FROM ".$prefix.$tableName." WHERE userid = ".$data["userid"]." AND "."houseid = ".$data["houseid"]);
    if($loadResult&&$loadResult->num_rows > 0){
        $data["id"] = $loadResult->fetch_assoc()["id"];
    }
    $result = $connector->query("DELETE FROM ".$prefix.$tableName.$WHERE);
    echo "ok".EncodingClass::fromVariable(array(
        'data'=>$data
    )); 
}else
echo "BAD_REQUEST (400)";

exit(0);
?>
