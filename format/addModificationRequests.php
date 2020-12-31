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
$index = "";
$i = 0;
$insert = array();
$update = array();

$milliseconds = round(microtime(true) * 1000);
$isEquipment = false;
if(isset($data["equipment"]))
{
    $equipment = $data["equipment"];
    $equipment_old = $connector->load($prefix."house_equipments","houseid = ".$data["id"]);
    $count = count($equipment);
    $count_old = count($equipment_old);
    $continue = false;
    for($i = 0;$i<$count;$i++)
    {
        for($j = 0;$j<$count_old;$j++)
        {
            if($equipment[$i]["equipmentid"]==$equipment_old[$j]["equipmentid"])
            {
                if($equipment[$i]["content"]!==$equipment_old[$j]["content"])
                {
                    $isEquipment = true;
                }
                array_splice($equipment_old,$j,1);
                $j--;
                $count_old--;
                $continue = true;
                break;
            }
        }
        if($continue === true)
        {
            $continue = false;
            continue;
        }
        $isEquipment = true;
    }
}

for($i = 0 ;$i<$count_old;$i++)
{
    $connector->query( "DELETE FROM ".$prefix."house_equipments  WHERE (id = ".$equipment_old[$i]["id"].")");
}
$isContact = false;
if(isset($data["contact"]))
{
    $contact = $data["contact"];
    $contact_old = $connector->load($prefix."contact_link","houseid = ".$data["id"]);
    $count = count($contact);
    $count_old = count($contact_old);
    $continue = false;
    for($i = 0;$i<$count;$i++)
    {
        if(isset($contact[$i]["id"]))
        for($j = 0;$j<$count_old;$j++)
        {
            if((isset($contact[$i]["statusphone"])&&$contact[$i]["id"]==$contact_old[$j]["contactid"])||!isset($contact[$i]["statusphone"])&&$contact[$i]["id"]==$contact_old[$j]["userid"])
            {
                if($contact[$i]["note"]!==$contact_old[$j]["note"]||$contact[$i]["typecontact"]!==$contact_old[$j]["typecontact"])
                {
                    $isContact = true;
                }
                array_splice($contact_old,$j,1);
                $j--;
                $count_old--;
                $continue = true;
                break;
            }
        }
        if($continue === true)
        {
            $continue = false;
            continue;
        }
        else
        {
             $isContact = true;
        }
    }
}

if(count($contact_old)>0)
{
    $isContact = true;
}

$imageTempStatus = array();
$imageTempJuridical = array();
$imageCheckStatus = false;
$imageCheckJuridical = false;
$image_old = $connector->load($prefix."image","houseid = ".$data["id"]);
if(isset($data["image"]))
{
    $images = $data["image"];
    $count = count($images);
    define('UPLOAD_DIR', "../../assets/upload/");
    for ($i = 0; $i < $count; $i++){
        $img = $images[$i];
        if(is_numeric($img["src"]))
        {
            for($j = 0;$j<count($image_old);$j++)
                {
                    if($img["src"]==$image_old[$j]["id"])
                    {
                        if($image_old[$j]["type"] == 1)
                        {
                            array_push($imageTempStatus,  $img["src"]);
                        }else
                        {
                            array_push($imageTempJuridical,  $img["src"]);
                        }
                       
                        array_splice($image_old,$j,1);
                    
                    }
                }
            continue;
        }
        $img["src"] = str_replace('data:image/', '', $img["src"]);
        $pos = strpos($img["src"], ";");
        $extension = substr($img["src"], 0, $pos);
        $img["src"] = str_replace($extension.';base64,', '', $img["src"]);
        $img["src"] = str_replace(' ', '+', $img["src"]);
        $dataFile = base64_decode($img["src"]);
        $filename = uniqid() .$milliseconds. '.'.$extension;

        $file = UPLOAD_DIR .$filename;
        $success = file_put_contents($file, $dataFile);
        if (!$success){
            echo "Unable to save the file.";
            exit();
        }
        if($img["type"]==0)
        $type = 0;
        else
        $type = 1;
        $obj_list = array(
            'src' => $filename,
            'type' => $type,
            'houseid' => $data["id"],
            'created' => new DateTime(),
            'thumnail' => 0,
            'userid' => $data["userid"]
        );
        $obj_list["id"] = $connector->insert($prefix.'image', $obj_list);
        array_push($insert,array(
            'image'=>$obj_list
        ));
        if( $type == 0)
        {
            array_push($imageTempStatus, $obj_list["id"]);
            $imageCheckJuridical = true;
        }else
        {
            array_push($imageTempJuridical, $obj_list["id"]);
            $imageCheckStatus = true;
        }
    }
}

for($i =0;$i<count($image_old);$i++)
{
    if($image_old[$i]["type"] == 1)
    {
        $imageCheckStatus = true;
    }else
    {
        $imageCheckJuridical = true;
    }
}
$created = new DateTime();
$result = $connector-> load($prefix."activehouses", "id = ".$data["id"]);
$count = count($result);
if($count==1)
{
    $result = $result[0];
    foreach($result as $param=>$value)
    {
        if($param == "created"||$param == "userid"||$param == "modified")
            continue;
        if(isset($result)&&isset($data[$param])&&$data[$param]!=$value)
        {
            $dataRequests = array(
                "type"=>0,
                "userid"=>$data["userid"],
                "houseid"=>$data["id"],
                "objid"=>$param,
                "content"=>$data[$param],
                "created"=>$created
            );
            $dataRequests["id"] = $connector-> insert($prefix."modification_requests", $dataRequests);
            array_push($insert,$dataRequests);
        }
    }
    if($imageCheckStatus==true)
    {
        $dataRequests = array(
            "type"=>0,
            "userid"=>$data["userid"],
            "houseid"=>$data["id"],
            "objid"=>"imageStatus",
            "content"=>json_encode($imageTempStatus),
            "created"=>$created
        );
        $dataRequests["id"] = $connector-> insert($prefix."modification_requests", $dataRequests);
        array_push($insert,$dataRequests);
    }
    if($imageCheckJuridical == true)
    {
        $dataRequests = array(
            "type"=>0,
            "userid"=>$data["userid"],
            "houseid"=>$data["id"],
            "objid"=>"imageJuridical",
            "content"=>json_encode($imageTempJuridical),
            "created"=>$created
        );
        $dataRequests["id"] = $connector-> insert($prefix."modification_requests", $dataRequests);
        array_push($insert,$dataRequests);
    }
    if($isContact == true){
        $dataRequests = array(
            "type"=>0,
            "userid"=>$data["userid"],
            "houseid"=>$data["id"],
            "objid"=>"contact",
            "content"=>json_encode($data["contact"]),
            "created"=>$created
        );
        $dataRequests["id"] = $connector-> insert($prefix."modification_requests", $dataRequests);
        array_push($insert,$dataRequests);
    }
    if($isEquipment == true){
        $dataRequests = array(
            "type"=>0,
            "userid"=>$data["userid"],
            "houseid"=>$data["id"],
            "objid"=>"equipment",
            "content"=>json_encode($data["equipment"]),
            "created"=>$created
        );
        $dataRequests["id"] = $connector-> insert($prefix."modification_requests", $dataRequests);
        array_push($insert,$dataRequests);
    }
}

echo "ok".EncodingClass::fromVariable(array(
    'add'=>array(
        'modification_requests'=> $insert
        ),
    'update'=>$update
));

exit(0);
?>
