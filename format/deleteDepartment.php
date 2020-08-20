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
}else
{
    echo "BAD_REQUEST (400)";
    exit();
}

$WHERE = "";

$isFirst = "";

foreach(array_keys($data) as $param)
{
    $WHERE .= $isFirst.$param."=".$data[$param];
    $isFirst = " AND ";
}
if($WHERE!="")
{
    $WHERE = " WHERE (".$WHERE.")";
    $result = $connector->query("DELETE FROM ".$prefix.$tableName.$WHERE);
    $arrayDelete = array();
    delete($connector,$prefix.$tableName,$data["id"],$arrayDelete);
    echo "ok".EncodingClass::fromVariable(array(
        "data"=>$result,
        "delete"=>$arrayDelete
        )
    ); 
}else
echo "BAD_REQUEST (400)";

function delete($connector,$tableName,$parent_id,&$arrayDelete)
{
    $tempData = $connector->load($tableName,"parent_id = ".$parent_id);
    $count = count($tempData);
    if($count>0)
    {
        for($i = 0;$i<$count;$i++)
        {
            array_push($arrayDelete,array("departments"=>$tempData[$i]));
            delete($connector,$tableName,$tempData[$i]["id"],$arrayDelete);
        }
        $result = $connector->query("DELETE FROM ".$tableName." WHERE (parent_id=".$parent_id.")");
    }
    $tempDataPosition = $connector->load($prefix."positions","department_id = ".$parent_id);
    $countPosition = count($tempDataPosition);
    
    if($countPosition>0)
        for($i = 0;$i<$countPosition;$i++)
            array_push($arrayDelete,array("positions"=>$tempDataPosition[$i]));

    $result = $connector->query("DELETE FROM ".$prefix."positions WHERE (department_id=".$parent_id.")");
}

exit(0);
?>
