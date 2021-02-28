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

$result = $connector-> query("SELECT * FROM `modification_requests` WHERE `objid` = 'contact'");
if($result)
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
      $new_value = array();
      $arrTemp = json_decode($row["content"]);
      for($i =0;$i<count($arrTemp);$i++){
        $temp = $connector->load("lck_product_contact_info","id=".$arrTemp[$i]);
        $temp = $temp[0];
        $temp = $connector->load("contacts","phone=".$temp["phone"]);
        $temp = $temp[0];
        array_push($new_value,$temp["id"]);
      }
      // echo "UPDATE `modification_requests` SET content = ".json_encode($new_value)." WHERE id = ".$row["id"];
      // echo '/n';
      $connector-> query("UPDATE `modification_requests` SET `content` = ".json_encode($new_value)." WHERE `id` = ".$row["id"]);
      // echo "UPDATE `modification_requests` SET content = ".json_encode($new_value)." WHERE id = ".$row["id"];
    }
} else {
}


exit(0);
?>
