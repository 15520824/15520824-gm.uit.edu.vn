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

while (isset($data["addressid".$index]))
{
    $address=$data["addressid".$index];
    if(isset($address["id"])){
       $connector-> update($prefix."addresses_user", $address);
       array_push($update,
       array(
        'addresses_user'=> $dataInsertAddress
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

            $dataInsertAddress = array(
                'addressnumber' => $number,
                'wardid' => $wardid,
                'streetid' => $streetid
            );
            $addressid = $connector-> insert($prefix."addresses_user", $dataInsertAddress);
            $dataInsertAddress["id"] = $addressid;
            array_push($insert,
                array(
                    'addresses_user'=>$dataInsertAddress
                ));
    }
    
    $data["addressid".$index] = $addressid;
    if($index == "")
        break;
}

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

$result = $connector-> insert($prefix."users", $data);
$data["id"] = $result;
echo "ok".EncodingClass::fromVariable(array(
    'data'=>$data
));

exit(0);
?>
