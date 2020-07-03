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
        if(isset($address["streetid"]))
    {
        $streetid = $address["streetid"];
    }else if(isset($address["street"]))
    {
        $street = $address["street"];
        $dataStreet = array(
            'name'=>$street,
        );
        $streetid = $connector-> insert($prefix."streets", $dataStreet);
        $dataStreet["id"] = $streetid;
        array_push($insert,array(
            'streets'=>$dataStreet
        ));
    }
        
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

        if(isset($address["number"]))
        {
            $number = $address["number"];
        }
        $dataLinkWardStreet = $connector-> load($prefix."ward_street_link","wardid=".$wardid." AND streetid=".$streetid);
        if (count($dataLinkWardStreet) == 0) {
            $dataWardSteet = array(
                'wardid' => $wardid,
                'streetid' => $streetid
            );
            $linkWardStreet = $connector-> insert($prefix."ward_street_link", $dataWardSteet);
        }

        $dataAddress = $connector-> load($prefix."addresses","addressnumber='".$number."' AND streetid=".$streetid." AND wardid=".$wardid);
        if (count($dataAddress) == 0) {
            $dataInsertAddress = array(
                'addressnumber' => $number,
                'wardid' => $wardid,
                'streetid' => $streetid
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
                $data["contact"][$i] = $dataInsertContact;
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

if(isset($data["imageJuridical"]))
{
    $images = $data["imageJuridical"];
    $count = count($images);
    define('UPLOAD_DIR', "../../assets/upload/");
    for ($i = 0; $i < $count; $i++){
        $img = $images[$i];
        if (isset($img["id"]))
        {
            for($j = 0;$j<count($image_old);$j++)
            {
                if($img["id"]==$image_old[$j]["id"])
                {
                    array_splice($image_old,$j,1);
                    break;
                }
            }
            continue;
        }


        $img = str_replace('data:image/', '', $img);
        $pos = strpos($img, ";");
        $extension = substr($img, 0, $pos);
        $img = str_replace($extension.';base64,', '', $img);
        $img = str_replace(' ', '+', $img);
        $dataFile = base64_decode($img);
        $filename = uniqid() .$milliseconds. '.'.$extension;

        $file = UPLOAD_DIR .$filename;
        $success = file_put_contents($file, $dataFile);
        if (!$success){
            echo "Unable to save the file.";
            exit();
        }

        $obj_list = array(
            'src' => $filename,
            'type' => 0,
            'houseid' => $data["id"],
            'created' => new DateTime(),
        );
        $obj_list["id"] = $connector->insert($prefix.'image', $obj_list);
        array_push($insert,array(
            'image'=>$obj_list
        ));
        $data["imageJuridical"][$i] = $obj_list;
    }
}


if(isset($data["imageCurrentStaus"]))
{
    $images = $data["imageCurrentStaus"];
    $count = count($images);
    for ($i = 0; $i < $count; $i++){
        $img = $images[$i];
        if (isset($img["id"]))
        {
            for($j = 0;$j<count($image_old);$j++)
            {
                if($img["id"]==$image_old[$j]["id"])
                {
                    array_splice($image_old,$j,1);
                    break;
                }
            }
            continue;
        }

        $img = str_replace('data:image/', '', $img);
        $pos = strpos($img, ";");
        $extension = substr($img, 0, $pos);
        $img = str_replace($extension.';base64,', '', $img);
        $img = str_replace(' ', '+', $img);
        $dataFile = base64_decode($img);
        $filename = uniqid() .$milliseconds. '.'.$extension;

        $file = UPLOAD_DIR .$filename;
        $success = file_put_contents($file, $dataFile);
        if (!$success){
            echo "Unable to save the file.";
            exit();
        }

        $obj_list = array(
            'src' => $filename,
            'type' => 1,
            'houseid' => $data["id"],
            'created' => new DateTime(),
        );
        $obj_list["id"] = $connector->insert($prefix.'image', $obj_list);
        array_push($insert,array(
            'image'=>$obj_list
        ));
        $data["imageCurrentStaus"][$i] = $obj_list;
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

$result = $connector-> update($prefix."activehouses", $data);
$result = array(
    'data'=>$data,
    'add'=>$insert,
    'update'=>$update
);
echo "ok".EncodingClass::fromVariable($result);

exit(0);
?>
