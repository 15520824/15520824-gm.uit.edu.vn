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

$WHERE = "";
$ORDERING = "";
if (isset($_POST["data"])) {
    $data=EncodingClass::toVariable($_POST["data"]);  
    if (isset($data["WHERE"])) {
        if(isset($data["isFirst"]))
        {
            $isFirst = $data["isFirst"];
        }
        $WHERE=$data["WHERE"];
    }
    
    if (isset($data["ORDERING"])) {
        $ORDERING=$data["ORDERING"];
    }
}else
{
    echo "BAD_REQUEST (400)";
    exit();
}
if($WHERE!="")
$WHERE = " WHERE ".$WHERE;
if($ORDERING!="")
$ORDERING = " ORDER BY ".$ORDERING;
$result = $connector->query("SELECT `id`, `cellLat`, `cellLng`, `created`, AsText(`map`) FROM ".$prefix."geometry".$WHERE.$ORDERING);

 
if(isset($data["loaded"])){
    for($i = 0;$i<count($data["loaded"]);$i++)
    {
        $check[$data["loaded"][$i]] = $i;
    }
}
$data = array();
if($result)
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        if(isset($check[$row["id"]]))
        $data[$i++] = $row["id"];
        else
        $data[$i++] = $row;
    }
} else {
}

$sendData = array(
    "data"=>$data
);

if(isset($isFirst))
{
    $count = $connector-> query("SELECT COUNT(*) as count FROM ".$prefix."geometry");
    
    if($count)
    if ($count->num_rows == 1) {
        $sendData["count"] = $count->fetch_row()[0];
    }
}
echo "ok".EncodingClass::fromVariable($sendData);
exit(0);

// // MultiPoint json example
// print "<br/>";
// $json = 
// '{
//    "type": "MultiPoint",
//    "coordinates": [
//        [100.0, 0.0], [101.0, 1.0]
//    ]
// }';

// $multipoint = geoPHP::load($json, 'json');
// $multipoint_points = $multipoint->getComponents();
// $first_wkt = $multipoint_points[0]->out('wkt');

// print "This multipoint has ".$multipoint->numGeometries()." points. The first point has a wkt representation of ".$first_wkt;
?>