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
    if(isset($data["birthday"]))
    $data["birthday"] = new DateTime($data["birthday"]);
}else
{
    echo "BAD_REQUEST (400)";
    exit();
}


$index = "";
$i = 0;
$insert = array();
$update = array();

$milliseconds = round(microtime(true) * 1000);

if(isset($data["avatar"]))
{
    $avatar = $data["avatar"];
    define('UPLOAD_DIR', "../../assets/avatar/");
    $user_old = $connector->load($prefix."users","id = ".$data["id"]);
    if(isset($user_old[0]))
    {
        if($avatar!=$user_old[0]["avatar"])
        {
            $avatar = str_replace('data:image/', '', $avatar);
            $pos = strpos($avatar, ";");
            $extension = substr($avatar, 0, $pos);
            $avatar = str_replace($extension.';base64,', '', $avatar);
            $avatar = str_replace(' ', '+', $avatar);
            $dataFile = base64_decode($avatar);
            $filename = uniqid() .$milliseconds. '.'.$extension;
        
            $file = UPLOAD_DIR .$filename;
            $success = file_put_contents($file, $dataFile);
            if (!$success){
                echo "Unable to save the file.";
                exit();
            }

            $data["avatar"] = $filename;

            if ($user_old[0]["avatar"]!=""&&file_exists(UPLOAD_DIR .$user_old[0]["avatar"])) {
                unlink(UPLOAD_DIR .$user_old[0]["avatar"]);
              }
        }
    }
}

if (isset($data["password"])) {
    $data["password"]=md5($data["password"]."safe.Login.via.normal.HTTP"."000000");
}
$connector->query("DELETE FROM ".$prefix."privileges WHERE userid = ".$data["id"]);
if (isset($data["permission"])) {
    foreach($data["permission"] as $param=>$value)
    {
        if($param === 0)
        $tempData = array();
        else
        $tempData = json_decode($param,true);

        $count = count($value);
        $tempData["userid"] = $data["id"];
        for($i = 0;$i<$count;$i++)
        {
            $tempData["permission"] = $value[$i];
            $result = $connector-> insert($prefix."privileges", $tempData);
        }
          
    }
}
unset($data["permission"]);
$result = $connector-> update($prefix."users", $data);
echo "ok".EncodingClass::fromVariable(array(
    'data'=>$data
));

exit(0);
?>
