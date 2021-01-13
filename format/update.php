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

if(isset($WHERE))
{
    $WHERE = " WHERE ".$WHERE;
}

if(isset($ORDERING))
{
    $ORDERING = " ORDER BY ".$ORDERING;
}

if(isset($data["modified"]))
{
    $data["modified"] = new DateTime();
}

$result = $connector-> update($prefix.$tableName, $data);

echo "ok".EncodingClass::fromVariable(array(
    'data'=>$data
));

exit(0);
?>
