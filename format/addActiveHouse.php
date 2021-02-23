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

$data["modified"] = new DateTime();
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
    unset($data["equipment"]);
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
    unset($data["purpose"]);
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
    unset($data["contact"]);
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
        $obj_list["id"] = $connector->insert($prefix.'image', $obj_list);
        array_push($insert,array(
            'image'=>$obj_list
        ));
        $data["image"][$i] = $obj_list["id"];
    }
    unset($data["image"]);
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

if(isset($data["oldId"]))
{
    $oldId = $data["oldId"];
    unset($data->oldId);
}

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
            $connector->query("DELETE FROM ".$prefix."contact_link"." WHERE( houseid = ".$oldId[$i].")");
            $connector->query("DELETE FROM ".$prefix."house_equipments"." WHERE( houseid = ".$oldId[$i].")");
            $connector->query("DELETE FROM ".$prefix."purpose_link"." WHERE( houseid = ".$oldId[$i].")");
            $connector->query("DELETE FROM ".$prefix."possession_history"." WHERE( houseid = ".$oldId[$i].")");
            $connector->query("DELETE FROM ".$prefix."activehouses_note"." WHERE( houseid = ".$oldId[$i].")");
            $connector->query("DELETE FROM ".$prefix."modification_requests"." WHERE( houseid = ".$oldId[$i].")");

            $image_old = $connector->load($prefix."image","houseid = ".$oldId[$i]);
            for($i = 0;$i<count($image_old);$i++)
            {
                if (file_exists(UPLOAD_DIR .$image_old[$i]["src"])) {
                    unlink(UPLOAD_DIR .$image_old[$i]["src"]);
                    $connector->query("DELETE FROM ".$prefix."image WHERE( id = ".$image_old[$i]["id"].")");
                } else {
                    echo 'Could not delete '.$filename.', file does not exist';
                }
            }
            $connector->query("DELETE FROM ".$prefix."activehouses WHERE id =".$oldId[$i]);
            // unset($tempData["id"]);
            // $tempData["previousid"] = $oldId[$i];
            // $tempData["id"] = $connector->insert($prefix."inactivehouses",$tempData);
            // array_push($insert,array(
            //     'inactivehouses'=>$tempData
            // ));
        }
    }
    // if(isset($userid));
    // {
    //     $log = "Được gộp vào thời gian ".date("H:i:s d-m-Y"); ;
    //     $logData = array(
    //         'log' => $log,
    //         'houseid' => $data["id"],
    //         'userid' => $userid,
    //     );
    //     $connector->insert($prefix.'activehouses_logs', $logData);
    // }
}else
{
    // if(isset($userid))
    // {
    //     $log = "Được tạo vào thời gian ".date("H:i:s d-m-Y");
    //     $logData = array(
    //         'log' => $log,
    //         'houseid' => $data["id"],
    //         'userid' => $userid,
    //     );
    //     $connector->insert($prefix.'activehouses_logs', $logData);
    // }
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
