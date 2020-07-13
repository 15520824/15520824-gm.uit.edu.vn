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
    
    if(isset($data["WHERE"]))
    {
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

$result = $connector-> query("SELECT * FROM ".$prefix."activehouses".$WHERE.$ORDERING);
$data = array();
$i = 0; 
$check = array();
if(isset($data["loaded"])){
    for($i = 0;$i<count($data["loaded"]);$i++)
    {
        $check[$data["loaded"][$i]] = $i;
    }
}

if($result)
{
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            if(isset($check[$row["id"]]))
                $data[$i] = $row["id"];
            else
            {
                $data[$i] = $row;
                $equipment = $connector->load($prefix."house_equipments","houseid = ".$row["id"]);
                $data[$i]["equipment"]=$equipment;
                $contact = $connector->load($prefix."contact_link","houseid = ".$row["id"]);
                $data[$i]["contact"]=$contact;
                $image = $connector->load($prefix."image","houseid = ".$row["id"]);
    
                $imageresource = $connector-> query("SELECT * FROM ".$prefix."image"." WHERE( houseid = ".$row["id"]." )");
                $imageJuridical = array();
                $imageCurrentStaus = array();
                if($imageresource)
                    if ($imageresource->num_rows > 0) {
                        while($rowResource = $imageresource->fetch_assoc())
                        {
                            switch($rowResource["type"])
                            {
                                case 0:
                                    array_push($imageJuridical,$rowResource);  
                                break;
                                case 1:
                                    array_push($imageCurrentStaus,$rowResource);  
                                break;
                            }
                        }
                    }
                $data[$i]["imageJuridical"]=$imageJuridical;
                $data[$i]["imageCurrentStaus"]=$imageCurrentStaus;
            }
            $i++;
        }
    } else {
    }
}


if(isset($isFirst))
{
    $count = $connector-> query("SELECT COUNT(*) FROM ".$prefix."activehouses");
    if($count)
    if ($count->num_rows == 1) {
        array_push($data,$count->fetch_assoc());
    }
}

echo "ok".EncodingClass::fromVariable($data);

exit(0);
?>
