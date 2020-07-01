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

$result = $connector-> insert($prefix."activehouses", $data);
$data["id"] = $result;
$result = array(
    'data'=>$data,
    'add'=>$insert,
    'update'=>$update
);
echo "ok".EncodingClass::fromVariable($result);

exit(0);
?>
