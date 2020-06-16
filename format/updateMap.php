<?php
include_once "../lib/jsencoding.php";
include_once "../lib/prefix.php";
include_once "../lib/connection.php";

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
$connector = new mysqli($host, $username, $password, $dbname);
mysqli_set_charset($connector, 'UTF8');

if ($connector->connect_error) {
    die("Connection failed: " . $connector->connect_error);
}

if (isset($_POST["data"])) {
    $data=EncodingClass::toVariable($_POST["data"]);
}else
{
    echo "BAD_REQUEST (400)";
    exit();
}
$wkt = $data["map"];
$created = $data['created'];
$insert_data = array(
    "cellLat"=>$data["cellLat"],
    "cellLng"=>$data["cellLng"],
    "created"=>$created,
    "map"=>"GeomFromText('".$wkt."')"
);
$result = $connector->query("UPDATE `geometry` SET `map`=".$insert_data["map"]." WHERE `cellLat`=".$insert_data["cellLat"]." AND `cellLng`=".$insert_data["cellLng"]." AND `created`='".$insert_data["created"]."'");
if($result == false)
    die("Error");
echo "ok".EncodingClass::fromVariable($result);
?>