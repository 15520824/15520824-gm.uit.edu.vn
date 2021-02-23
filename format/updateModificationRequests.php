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

if(isset($_POST["userid"]))
{
    $userid = $_POST["userid"];
    $data["userid"] = $userid;
}
$index = "";
$i = 0;
$insert = array();
$update = array();

if(isset($data["requestFail"]))
{
    $requestFail = $data["requestFail"];
    unset($data->requestFail);
}
if(isset($data["requestSuccess"]))
{
    $requestSuccess = $data["requestSuccess"];
    unset($data->requestSuccess);
}

$data["modified"] = new DateTime();
$result = $connector-> update($prefix."activehouses", $data);
array_push($update,
array(
'activehouses'=> $data
));

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
                    $equipment_old[$j]["content"] = $equipment[$i]["content"];
                    $connector->update($prefix."house_equipments",$equipment_old[$j]);
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
        $connector->insert($prefix."house_equipments",array(
            "equipmentid" => $equipment[$i]["equipmentid"],
            "houseid" => $data["id"],
            "content" => $equipment[$i]["content"],
        ));
    }
}

for($i = 0 ;$i<$count_old;$i++)
{
    $connector->query( "DELETE FROM ".$prefix."house_equipments  WHERE (id = ".$equipment_old[$i]["id"].")");
}

if(isset($data["purpose"]))
{
    $purpose = $data["purpose"];
    $purpose_old = $connector->load($prefix."purpose_link","houseid = ".$data["id"]);
    $count = count($purpose);
    $count_old = count($purpose_old);
    $continue = false;
    for($i = 0;$i<$count;$i++)
    {
        for($j = 0;$j<$count_old;$j++)
        {
            if($purpose[$i]==$purpose_old[$j]["purposeid"])
            {
                array_splice($purpose_old,$j,1);
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
        $connector->insert($prefix."purpose_link",array(
            "purposeid" => $purpose[$i],
            "houseid" => $data["id"],
        ));
    }
}

for($i = 0 ;$i<$count_old;$i++)
{
    $connector->query( "DELETE FROM ".$prefix."purpose_link  WHERE (id = ".$purpose_old[$i]["id"].")");
}

if(isset($data["contact"]))
{
    $contact = $data["contact"];
    $contact_old = $connector->load($prefix."contact_link","houseid = ".$data["id"],'created');
    $count = count($contact);
    $count_old = count($contact_old);
    if($count_old>0)
        $firstContact = $contact_old[0];
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
                    $contact_old[$j]["note"] = $contact[$i]["note"];
                    $contact_old[$j]["typecontact"] = $contact[$i]["typecontact"];
                    $connector->update($prefix."contact_link",$contact_old[$j]);
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
        if(!isset($contact[$i]["statusphone"]))
        $connector->insert($prefix."contact_link",array(
            "userid" => $contact[$i]["id"],
            "houseid" => $data["id"],
            "note" => $contact[$i]["note"],
            "typecontact" => $contact[$i]["typecontact"],
        ));
        else
        {
            if(!isset($contact[$i]["id"]))
            {
                $dataInsertContact = array(
                    "name"=>$contact[$i]["name"],
                    "phone"=>$contact[$i]["phone"],
                    "statusphone"=>$contact[$i]["statusphone"],
                );
                $contact[$i]["id"] = $connector->insert($prefix."contacts",$dataInsertContact);
                $dataInsertContact["id"] = $contact[$i]["id"];
                array_push($insert,array(
                    'contacts'=>$dataInsertContact
                ));
            }
            $connector->insert($prefix."contact_link",array(
                "contactid" => $contact[$i]["id"],
                "houseid" => $data["id"],
                "note" => $contact[$i]["note"],
                "typecontact" => $contact[$i]["typecontact"],
            ));
        }
    }
}

for($i = 0 ;$i<$count_old;$i++)
{
    $connector->query("DELETE FROM ".$prefix."contact_link WHERE( id = ".$contact_old[$i]["id"].")");
    if($firstContact["id"] == $contact_old[$i]["id"])
    $connector->insert($prefix.'possession_history',$firstContact);
}

$image_old = $connector->load($prefix."image","houseid = ".$data["id"]);

$milliseconds = round(microtime(true) * 1000);

if(isset($data["image"]))
{
    $images = $data["image"];
    $count = count($images);
    for ($i = 0; $i < $count; $i++){
        $img = $images[$i];
        $image_object = array();
        $image_object["id"] = $img;
        $image_object["status"] = 1;
        $connector-> update($prefix."image", $image_object);
        array_push($update,
        array(
        'image'=> $image_object
        ));
        for($j = 0;$j<count($image_old);$j++)
        {
            if($img==$image_old[$j]["id"])
            {
                array_splice($image_old,$j,1); 
                break;
            }
        }
    }
}

for($i = 0;$i<count($image_old);$i++)
{
    $image_object = $image_old[$i];
    $image_object["status"] = 0;
    $connector-> update($prefix."image", $image_object);
    array_push($update,
    array(
    'image'=> $image_object
    ));
}

$delete = array();
$modified = new DateTime();

if(isset($requestFail))
{
    for($i = 0;$i<count($requestFail);$i++)
    {
        $object = array();
        $object["id"] = $requestFail[$i];
        $object["validator_userid"] = $userid;
        $object["validator_time"] = $modified;
        $object["status"] = 2;
        $connector-> update($prefix."modification_requests", $object);
        array_push($update,
        array(
        'modification_requests'=> $object
        ));
    }
}

if(isset($requestSuccess))
{
    for($i = 0;$i<count($requestSuccess);$i++)
    {
        $object = array();
        $object["id"] = $requestSuccess[$i];
        $object["validator_userid"] = $userid;
        $object["validator_time"] = $modified;
        $object["status"] = 1;
        $connector-> update($prefix."modification_requests", $object);
        array_push($update,
        array(
        'modification_requests'=> $object
        ));
    }
}

$result = array(
    'delete'=>$delete,
    'add'=>$insert,
    'update'=>$update
);
echo "ok".EncodingClass::fromVariable($result);

exit(0);
?>
