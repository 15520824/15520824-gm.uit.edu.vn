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
    
    if(isset($data["WHERE"]))
    {
        if(isset($data["isFirst"]))
        {
            $isFirst = $data["isFirst"];
        }
        $data = $data["WHERE"];
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
    }
}else
{
    echo "BAD_REQUEST (400)";
    exit();
}


$result = $connector-> query("SELECT * FROM ".$prefix."activehouses".$WHERE.$ORDERING);
$data = array();
$i = 0; 
if($result)
{
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $data[$i] = $row;
            $equipment = $connector->load($prefix."house_equipments","houseid = ".$row["id"]);
            $data[$i]["equipment"]=$equipment;
            $contact = $connector->load($prefix."contact_link","houseid = ".$row["id"]);
            $data[$i]["contact"]=$contact;
            $contact = $connector->load($prefix."image","houseid = ".$row["id"]);
            $data[$i]["image"]=$contact;
            $i++;
        }
    } else {
    }
}


if(isset($isFirst))
{
    $count = $connector-> query("SELECT COUNT(*) FROM ".$prefix."activehouses");
    if($count)
    if ($count->num_rows == 1) {
        array_push($data,$count->fetch_assoc());
    }
}

echo "ok".EncodingClass::fromVariable($data);

exit(0);
?>
