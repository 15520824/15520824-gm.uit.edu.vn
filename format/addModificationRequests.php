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

while (isset($data["addressid".$index]))
{
    $address=$data["addressid".$index];
    if(gettype($address)=="string")
    {
        if($index == "_old")
        break;
        $index = "_old";
        continue;
    }
    if(isset($address["id"])){
        $addressid = $address["id"];
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
    
    $data["addressid".$index] = $addressid;
    if($index == "_old")
    break;
    $index = "_old";
}

$milliseconds = round(microtime(true) * 1000);

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
        {

        }
        // $connector->insert($prefix."contact_link",array(
        //     "userid" => $contact[$i]["id"],
        //     "houseid" => $data["id"],
        //     "note" => $contact[$i]["note"],
        //     "typecontact" => $contact[$i]["typecontact"],
        // ));
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
                $data["contact"][$i] = $dataInsertContact;
                array_push($insert,array(
                    'contacts'=>$dataInsertContact
                ));
            }
            // $connector->insert($prefix."contact_link",array(
            //     "contactid" => $contact[$i]["id"],
            //     "houseid" => $data["id"],
            //     "note" => $contact[$i]["note"],
            //     "typecontact" => $contact[$i]["typecontact"],
            // ));
        }
    }
}



for($i = 0 ;$i<$count_old;$i++)
{
    $connector->query("DELETE FROM ".$prefix."contact_link WHERE( id = ".$contact_old[$i]["id"].")");
}

$imageTemp = array();
$imageCheck = false;
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
                    if(isset($img["thumnail"])&&$image_old[$j]["thumnail"]!=$img["thumnail"])
                    {
                        array_push($imageTemp, array(
                            "id"=>$img["src"],
                            "thumnail"=>$img["thumnail"]
                        ));
                        $imageCheck = true;
                        break;
                    }
                }
            }
            continue;
        }
        $imageCheck = true;
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
            'userid' => $data["userid"]
        );
        array_push($imageTemp,array(
            'image'=>$obj_list
        ));
    }
}



$result = $connector-> load($prefix."activehouses", "id = ".$data["id"]);
$count = count($result);
if($count==1)
{
    $result = $result[0];
    $dataChange = array();
    foreach($result as $param=>$value)
    {
        if($param == "created"||$param == "userid"||$param == "created")
        continue;
        if(isset($result)&&$data[$param]!=$value)
        {
            $dataRequests = array(
                "type"=>0,
                "userid"=>$data["userid"],
                "houseid"=>$data["id"],
                "objid"=>$param,
                "content"=>$data[$param],
            );
            $dataRequests["id"] = $connector-> insert($prefix."modification_requests", $dataRequests);
            array_push($dataChange,$dataRequests);
        }
    }
    if($imageCheck==true)
    {
        $dataRequests = array(
            "type"=>0,
            "userid"=>$data["userid"],
            "houseid"=>$data["id"],
            "objid"=>"image",
            "content"=>EncodingClass::fromVariable($imageTemp),
        );
        $dataRequests["id"] = $connector-> insert($prefix."modification_requests", $dataRequests);
        array_push($dataChange,$dataRequests);
    }
}

echo "ok".EncodingClass::fromVariable(array(
    'data'=>$dataChange,
    'add'=>$insert,
    'update'=>$update
));

exit(0);
?>