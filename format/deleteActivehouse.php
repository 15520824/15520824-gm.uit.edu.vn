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
define('UPLOAD_DIR', "../../assets/upload/");
if($WHERE!="")
{
    $dataDelete = $connector->load($prefix.$tableName,$WHERE);
    for($i=0;$i<count($dataDelete);$i++)
    {
        $connector->query("DELETE FROM ".$prefix."contact_link"." WHERE( houseid = ".$dataDelete[$i]["id"].")");
        $connector->query("DELETE FROM ".$prefix."house_equipments"." WHERE( houseid = ".$dataDelete[$i]["id"].")");
        $connector->query("DELETE FROM ".$prefix."purpose_link"." WHERE( houseid = ".$dataDelete[$i]["id"].")");
        $connector->query("DELETE FROM ".$prefix."possession_history"." WHERE( houseid = ".$dataDelete[$i]["id"].")");
        $connector->query("DELETE FROM ".$prefix."activehouses_note"." WHERE( houseid = ".$dataDelete[$i]["id"].")");
        $connector->query("DELETE FROM ".$prefix."modification_requests"." WHERE( houseid = ".$dataDelete[$i]["id"].")");

        $image_old = $connector->load($prefix."image","houseid = ".$dataDelete[$i]["id"]);
        for($i = 0;$i<count($image_old);$i++)
        {
            if (file_exists(UPLOAD_DIR .$image_old[$i]["src"])) {
                // unlink(UPLOAD_DIR .$image_old[$i]["src"]);
                file_get_contents('https://pizo.vn/storage/uploads/delete_second_server.php?file='.UPLOAD_DIR.$image_old[$i]["src"].'&some_security_token=*I}|AL[ar:%06oJ^{rD+xR/S8bfH>2wsy*).{LMZMK2]os[8%h{$W+gnrj{ZJD');
                $connector->query("DELETE FROM ".$prefix."image WHERE( id = ".$image_old[$i]["id"].")");
              } else {
                echo 'Could not delete '.$filename.', file does not exist';
              }
        }
    }
    $WHERE = " WHERE (".$WHERE.")";

    $result = $connector->query("DELETE FROM ".$prefix.$tableName.$WHERE);
    echo "ok".EncodingClass::fromVariable($result); 
}else
echo "BAD_REQUEST (400)";


exit(0);
?>
