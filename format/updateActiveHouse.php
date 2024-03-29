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
    $data["userid_updated"] = $userid;
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
    unset($data["contact"]);
}

for($i = 0 ;$i<$count_old;$i++)
{
    $connector->query("DELETE FROM ".$prefix."contact_link WHERE( id = ".$contact_old[$i]["id"].")");
    if($firstContact["id"] == $contact_old[$i]["id"])
     $connector->insert($prefix.'possession_history',$firstContact);
}

$image_old = $connector->load($prefix."image","houseid = ".$data["id"]);

if(isset($data["image"]))
{
    $images = $data["image"];
    $count = count($images);
    define('UPLOAD_DIR', "../../assets/upload/");
    for ($i = 0; $i < $count; $i++){
        $img = $images[$i];
        if(is_numeric($img))
        {
            for($j = 0;$j<count($image_old);$j++)
            {
                if($img==$image_old[$j]["id"])
                {
                    array_splice($image_old,$j,1);
                    $data["image"][$i] = intval($img);
                    break;
                }
            }
            continue;
        }

        if (is_numeric ($img["src"]))
        {
            for($j = 0;$j<count($image_old);$j++)
            {
                if($img["src"]==$image_old[$j]["id"])
                {
                    if(isset($img["thumnail"])&&$image_old[$j]["thumnail"]!=$img["thumnail"])
                    {
                        $connector->update($prefix.'image',array(
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
        }else
        {
            // information of second server
            $ftp_server = "103.1.238.95";
            // name file in serverA that you want to store file in serverB
            $file = UPLOAD_DIR .$filename;
            $remote_file = UPLOAD_DIR .$filename;

            // set up basic connection
            $conn_id = ftp_connect($ftp_server);

            $ftp_user_name = 'root';
            $ftp_user_pass = 'Mp4hRj5PfC19';
            // login with username and password
            $login_result = ftp_login($conn_id, $ftp_user_name, $ftp_user_pass);

            // upload a file
            if (ftp_put($conn_id, $remote_file, $file, FTP_ASCII)) {
                unlink($file);
            } else {
                // echo "There was a problem while uploading $file\n";
            }
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
        $obj_list["id"] = $image_id;
        array_push($insert,array(
            'image'=>$obj_list
        ));
        $data["image"][$i] = $image_id;
    }
    unset($data["image"]);
}

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

// if(isset($userid))
// {
//     $log = "Được cập nhật vào thời gian ".date("H:i:s d-m-Y");
//     $logData = array(
//         'log' => $log,
//         'houseid' => $data["id"],
//         'userid' => $userid,
//     );
//     $connector->insert($prefix.'activehouses_logs', $logData);
// }

$data["modified"] = new DateTime();
$data["modified"] = new DateTime();
$result = $connector-> update($prefix."activehouses", $data);

$result = array(
    'data'=>$data,
    'add'=>$insert,
    'update'=>$update
);
echo "ok".EncodingClass::fromVariable($result);

exit(0);
?>
