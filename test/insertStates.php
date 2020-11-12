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

if (isset($_POST["data"])) {
    $data=EncodingClass::toVariable($_POST["data"]);
}else
{
    echo "BAD_REQUEST (400)";
    exit();
}
$sql = "INSERT INTO `streets` (`name`,`wardid`) VALUES ";
$count = count($data);
for($i=0;$i<$count;$i++)
{
    $sql.='("'.$data[$i]["name"].'",'.$data[$i]["wardid"].')';
    if(!($count-1===$i))
    $sql.=',';
}
$connector->query($sql);

exit();
$result = $connector->load("ditricts");
echo "ok".EncodingClass::fromVariable(array(
    'data'=>$result
));

exit(0);
?>
