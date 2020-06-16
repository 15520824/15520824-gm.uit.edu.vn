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

$result = $connector->query("INSERT INTO ".$prefix."geometry(`cellLat`, `cellLng`, `created`, `map`) VALUES (".$insert_data["cellLat"].",".$insert_data["cellLng"].",'".$insert_data["created"]."',".$insert_data["map"].")");
$id = $connector->query("select last_insert_id()");
$id = (int)$id->fetch_assoc()["last_insert_id()"];
echo "ok".EncodingClass::fromVariable($id);
?>