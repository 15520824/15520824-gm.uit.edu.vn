<?php 
include_once "../lib/jsencoding.php";
include_once "../lib/prefix.php";
include_once "../lib/connection.php";

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

$conn = new mysqli($host, $username, $password, $dbname);
mysqli_set_charset($conn, 'UTF8');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM ".$prefix."content ORDER BY parent_id";

$result = $conn->query($sql);
$data = array();
$i = 0;
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $data[$i++] = $row;
    }
} else {
    echo "0 results";
}
echo "ok";
echo EncodingClass::fromVariable($data);

$conn->close();
?>