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

$connector -> db -> set_charset("utf8");

$result = $connector->query("SELECT DISTINCT `created` FROM ".$prefix."geometry");

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
echo "ok".EncodingClass::fromVariable($data);
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