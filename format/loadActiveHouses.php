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

$WHERE = "";
$ORDERING = "";
if (isset($_POST["data"])) {
    $data=EncodingClass::toVariable($_POST["data"]);
    if (isset($data["cellLng"])) {
        $cellLng=$data["cellLng"];
        $minLng = $cellLng%10000*0.0009009009009009009+ceil($cellLng/10000);
        $maxLng = $minLng+1;
        $WHERE = "lat<=".$maxLng." AND lat>=".$minLng;
    }
    
    if (isset($data["cellLat"])) {
        $cellLat=$data["cellLat"];
        $minLat = $cellLat%10000*0.0009009009009009009+ceil($cellLat/10000);
        $maxLat = $minLat+1;
        if($WHERE!="")
        $WHERE.=" AND ";
        $WHERE = "lng<=".$maxLng." AND lng>=".$minLng;
    }
}else
{
    echo "BAD_REQUEST (400)";
    exit();
}


$result = $connector-> load($prefix.$tableName, $WHERE, $ORDERING);

echo "ok".EncodingClass::fromVariable($result);

exit(0);
?>
