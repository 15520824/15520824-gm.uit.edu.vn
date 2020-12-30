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
    
    if(isset($data["isFirst"]))
    {
        $isFirst = $data["isFirst"];
    }

    if (isset($data["WHERE"])) {
        $operator = $data["WHERE"];
        $WHERE = generalOperator($operator);
    }
    
    if (isset($data["ORDERING"])) {
        $ORDERING=$data["ORDERING"];
    }
}else
{
    echo "BAD_REQUEST (400)";
    exit();
}


if($WHERE!=="")
{
    $WHERE = " WHERE ".$WHERE;
}

if($ORDERING!=="")
{
    $ORDERING = " ORDER BY ".$ORDERING;
}

$result = $connector-> query("SELECT * FROM ".$prefix.$tableName.$WHERE.$ORDERING);

$check = array();
if(isset($data["loaded"]))
foreach($data["loaded"] as $param=>$value)
{
    $check[$param] = [];
    for($i = 0;$i<count($value);$i++)
    {
        $check[$param][$value[$i]] = $i;
    }
}
$data = array();
$i = 0;
if($result)
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        if(isset($check[$tableName][$row["id"]]))
        $data[$i++] = $row["id"];
        else
        {
            $row["id"] = intval($row["id"]);
            $data[$i++] = $row;
        }
    }
} else {
}

$sendData = array(
    "data"=>$data
);
if(isset($isFirst))
{
    $count = $connector-> query("SELECT COUNT(*) FROM ".$prefix.$tableName);
    if($count)
    if ($count->num_rows == 1) {
        $sendData["count"] = $count->fetch_row()[0];
    }
}

echo "ok".EncodingClass::fromVariable($sendData);

exit(0);
?>
