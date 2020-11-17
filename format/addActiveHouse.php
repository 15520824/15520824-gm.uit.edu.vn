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

if(isset($_POST["userid"]))
{
    $userid = $_POST["userid"];
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

while (isset($data["addressid".$index]))
{
    $address=$data["addressid".$index];
    if(isset($address["id"])){
        $addressid = $address["id"];
        if(isset($address["lng"])&&isset($address["lat"]))
        {
            $dataInsertAddress = array(
                'id' => $addressid,
                'lng' => $address["lng"],
                'lat' => $address["lat"]
            );
           $connector-> update($prefix."addresses", $dataInsertAddress);
           array_push($update,
           array(
            'addresses'=> $dataInsertAddress
            ));
        }
    }else{
        if(isset($address["wardid"]))
        {
            $wardid = $address["wardid"];
        }else
        if(isset($address["ward"]))
        {
            $ward = $address["ward"];
            if(isset($address["districtid"]))
            {
                $districtid = $address["districtid"];
            }else
            if(isset($address["district"]))
            {
                $district = $address["district"];
                if(isset($address["stateid"]))
                {
                    $stateid = $address["stateid"];
                }else
                if(isset($address["state"]))
                {
                    $state = $address["state"];
                    $dataState = array(
                        'name'=>$state,
                        'type'=>'Tỉnh'
                    );
                    $stateid = $connector-> insert($prefix."states", $dataState);
                    $dataState["id"] = $stateid;
                    array_push($insert,array(
                        'states'=>$dataState
                    ));
                }
                $dataDitrict = array(
                    'name'=>$district,
                    'stateid'=>$stateid,
                    'type'=>'Huyện'
                );
                $districtid = $connector-> insert($prefix."districts", $dataDitrict);
                $dataDitrict["id"] = $districtid;
                array_push($insert,array(
                    'districts' => $dataDitrict
                ));
            }
            $dataWard = array(
                'name'=>$ward,
                'districtid'=>$districtid
            );
            $wardid = $connector-> insert($prefix."wards", $dataWard);
        }

        if(isset($address["streetid"]))
        {
            $streetid = $address["streetid"];
        }else if(isset($address["street"]))
        {
            $street = $address["street"];
            $dataStreet = array(
                'name'=>$street,
                'wardid'=>$wardid
            );
            $streetid = $connector-> insert($prefix."streets", $dataStreet);
            $dataStreet["id"] = $streetid;
            array_push($insert,array(
                'streets'=>$dataStreet
            ));
        }
        if(isset($address["number"]))
        {
            $number = $address["number"];
        }

        $dataAddress = $connector-> load($prefix."addresses","addressnumber='".$number."' AND streetid=".$streetid." AND wardid=".$wardid);
        if (count($dataAddress) == 0) {
            $dataInsertAddress = array(
                'addressnumber' => $number,
                'wardid' => $wardid,
                'streetid' => $streetid,
            );
            $addressid = $connector-> insert($prefix."addresses", $dataInsertAddress);
            $dataInsertAddress["id"] = $addressid;
            array_push($insert,
                array(
                    'addresses'=>$dataInsertAddress
                ));
        }else
        {
            $addressid = $dataAddress[0]["id"];
        }
    }
    if(isset($addressid))
    $data["addressid".$index] = $addressid;
    else
    $data["addressid".$index] = 0;
    if($index == "_old")
    break;
    $index = "_old";
}
if(!isset($data["addressid_old"]))
$data["addressid_old"] = 0;
if(isset($data["oldId"]))
{
    $oldId = $data["oldId"];
}

$result = $connector-> insert($prefix."activehouses", $data);
$data["id"] = $result;

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
}

$image_old = $connector->load($prefix."image","houseid = ".$data["id"]);

$milliseconds = round(microtime(true) * 1000);
$image_old = $connector->load($prefix."image","houseid = ".$data["id"]);

if(isset($data["image"]))
{
    $images = $data["image"];
    $count = count($images);
    define('UPLOAD_DIR', "../../assets/upload/");
    for ($i = 0; $i < $count; $i++){
        $img = $images[$i];
        if (is_numeric($img["src"]))
        {
            if(isset($img["copy"]))
            {
                $filename = uniqid().$img["copy"];
                if (!copy(UPLOAD_DIR.$img["copy"], UPLOAD_DIR.$filename)) {
                    echo "failed to copy ".$img['copy']."...\n";
                }else
                {
                    $thumnail = 0;
                    if(isset($img["thumnail"]))
                    $thumnail = $img["thumnail"];

                    $obj_list = array(
                        'src' => $filename,
                        'type' => $img["type"],
                        'houseid' => $data["id"],
                        'created' => new DateTime(),
                        'thumnail' => $thumnail,
                        'userid' => $img["userid"]
                    );
                    $image_id = $connector->insert($prefix.'image', $obj_list);
                    array_push($insert,array(
                        'image'=>$obj_list
                    ));
                    $data["image"][$i] = $image_id;
                }
            }else
            {
                for($j = 0;$j<count($image_old);$j++)
                {
                    if($img["src"]==$image_old[$j]["id"])
                    {
                        if(isset($img["thumnail"])&&$image_old[$j]["thumnail"]!=$img["thumnail"])
                        {
                            $connector->update($prefix.'image', array(
                                "id"=>$img["src"],
                                "thumnail"=>$img["thumnail"]
                            ));
                            $image_old[$j]["thumnail"] = $img["thumnail"];
                            array_push($update,array(
                                'image'=>$image_old[$j]
                            ));
                        }
                        array_splice($image_old,$j,1);
                        $data["image"][$i] = intval($img["src"]);
                        break;
                    }
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
        if(isset($img["thumnail"])&&$img["thumnail"]==1)
        $thumnail=1;
        else
        $thumnail=0;
        $obj_list = array(
            'src' => $filename,
            'type' => $type,
            'houseid' => $data["id"],
            'created' => new DateTime(),
            'thumnail' => $thumnail,
            'userid' => $img["userid"]
        );
        $image_id = $connector->insert($prefix.'image', $obj_list);
        array_push($insert,array(
            'image'=>$obj_list
        ));
        $data["image"][$i] = $image_id;
    }
}

for($i = 0;$i<count($image_old);$i++)
{
    if (file_exists(UPLOAD_DIR .$image_old[$i]["src"])) {
        unlink(UPLOAD_DIR .$image_old[$i]["src"]);
        $connector->query("DELETE FROM ".$prefix."image WHERE( id = ".$image_old[$i]["id"].")");
      } else {
        echo 'Could not delete '.$filename.', file does not exist';
      }
}
$delete = array();
if(isset($oldId))
{
    $mergeData = array();
    for($i=0;$i<count($oldId);$i++)
    {
        $tempData = $connector->load($prefix."activehouses","id =".$oldId[$i]);
        if(count($tempData)>0)
        {
            $tempData = $tempData[0];
            $new = array();
            array_push($mergeData,$tempData["id"]);
            foreach ($tempData as $k => $v) {
                if(gettype($v) == "object")
                $new[$k] = clone $v;
                else
                $new[$k] = $v;
            }
            array_push($delete,array(
                'activehouses'=>$new
            ));
            $connector->query("DELETE FROM ".$prefix."activehouses WHERE id =".$oldId[$i]);
            $tempData["previousid"] = $oldId[$i];
            unset($tempData["id"]);
            $tempData["id"] = $connector->insert($prefix."inactivehouses",$tempData);
            array_push($insert,array(
                'inactivehouses'=>$tempData
            ));
        }
    }
    if(isset($userid));
    {
        $log = "Được gộp vào thời gian ".date("H:i:s d-m-Y")." từ các bất động sản %".json_encode($mergeData); ;
        $logData = array(
            'log' => $log,
            'houseid' => $data["id"],
            'userid' => $userid,
        );
        $connector->insert($prefix.'activehouses_logs', $logData);
    }
}else
{
    if(isset($userid))
    {
        $log = "Được tạo vào thời gian".date("H:i:s d-m-Y");
        $logData = array(
            'log' => $log,
            'houseid' => $data["id"],
            'userid' => $userid,
        );
        $connector->insert($prefix.'activehouses_logs', $logData);
    }
}
$result = array(
    'delete'=>$delete,
    'data'=>$data,
    'add'=>$insert,
    'update'=>$update
);
echo "ok".EncodingClass::fromVariable($result);

exit(0);
?>
