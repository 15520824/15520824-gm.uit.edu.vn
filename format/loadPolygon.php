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

    if(isset($data["WHERE"]))
    {
        if(isset($data["isFirst"]))
        {
            $isFirst = $data["isFirst"];
        }
        $data = $data["WHERE"];
        if (isset($data["cellLng"])) {
            $cellLng=$data["cellLng"];
        }
        
        if (isset($data["cellLat"])) {
            $cellLat=$data["cellLat"];
        }
    }
    
}else
{
    echo "BAD_REQUEST (400)";
    exit();
}

$result = $connector->query("SELECT `id`, `cellLat`, `cellLng`, `created`, AsText(`map`) FROM ".$prefix."geometry "."WHERE cellLat = ".$cellLat." AND "."cellLng = ".$cellLng);
$data = array();
$i = 0;
if($result)
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $data[$i++] = $row;
    }
} else {
}
if(isset($isFirst))
{
    $count = $connector-> query("SELECT COUNT(*) FROM ".$prefix."geometry");
    if($count)
    if ($count->num_rows == 1) {
        array_push($data,$count->fetch_assoc());
    }
}
echo "ok".EncodingClass::fromVariable($data);

exit(0);
?>
