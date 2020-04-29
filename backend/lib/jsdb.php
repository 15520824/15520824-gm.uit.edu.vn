<?php
/*
php:
function DatabaseClass::init($host, $username , $password, $dbname);    // return new DatabaseClass;
function DatabaseClass::init2($host, $port, $username , $password, $dbname);    // return new DatabaseClass;
function DatabaseClass::syncDB($host, $username , $password, $params);
function DatabaseClass.load($tablename, $condition, $order);
function DatabaseClass.insert($tablename, $data)            // insert single record
function DatabaseClass.insert2($tablename, $dataArray)      // insert multiple records
function DatabaseClass.update($tablename, $data)
function DatabaseClass.backupTable($tablename)

javascript:
*/

class DatabaseClass {

    public $db;
    public $dbname;
    public $lastquery;
    public $lasterror;

    public static function init($host, $username , $password, $dbname) {
        $db = mysqli_connect($host, $username , $password, $dbname);
        if (!$db) return null;
        $retval = new DatabaseClass();
        $retval->db = $db;
        $retval->dbname = $dbname;
        return $retval;
    }

    public static function init2($host, $port, $username , $password, $dbname) {
        $db = mysqli_connect($host, $username , $password, $dbname, $port);
        if (!$db) return null;
        $retval = new DatabaseClass();
        $retval->db = $db;
        $retval->dbname = $dbname;
        return $retval;
    }

    public function query($querystring) {
        $this->lastquery = $querystring;
        $retval = mysqli_query($this->db, $querystring);
        $this->lasterror = mysqli_error($this->db);
        return $retval;
    }

    private static function myaddslashes($value) {
        $xvalue = $value."";
        return addslashes($xvalue);
    }

    private static function getType($name) {
        $typelist = array (
            array("long" => "varchar", "short" => "vc"),
            array("long" => "text", "short" => "t"),
            array("long" => "int", "short" => "i"),
            array("long" => "decimal", "short" => "i"),
            array("long" => "double", "short" => "f"),
            array("long" => "float", "short" => "f"),
            array("long" => "date", "short" => "d"),
            array("long" => "time", "short" => "d"),
            array("long" => "datetime", "short" => "d")
        );
        $n = sizeof($typelist);
        for ($i = 0; $i < $n; $i++) {
            if (strcasecmp($name, $typelist[$i]["long"]) == 0) return $typelist[$i]["short"];
            if (stristr($name, $typelist[$i]["long"]) !== FALSE) return $typelist[$i]["short"];
        }
        return "";
    }

    private static function getSimpleType($name) {
        $x = DatabaseClass::getType($name);
        if (strcmp($x, "vc") == 0) return "t";
        if (strcmp($x, "t") == 0) return "t";
        if (strcmp($x, "i") == 0) return "n";
        if (strcmp($x, "f") == 0) return "n";
        if (strcmp($x, "d") == 0) return "d";
        return "";
    }

    public function load($tablename, $condition = "", $order = "") {
        $result2 = $this->query('DESCRIBE '.$tablename);
        $nfield = 0;

        if ($result2 == null) return array();
        while ($row2 = mysqli_fetch_array($result2, MYSQLI_BOTH)) {
            $field_name[$nfield] = strtolower($row2["Field"]);
            $field_type[$nfield] = strtolower($row2["Type"]);
            if (strlen($field_name[$nfield]) == 0) continue;
            if (strlen($field_type[$nfield]) == 0) continue;
            $scode_type[$nfield] = DatabaseClass::getType($field_type[$nfield]);
            $nfield++;
        }
        if ($nfield > 0) {
            $querystring = "SELECT ";
            for ($i = 0; $i < $nfield; $i++) {
                if ($i > 0) $querystring .= ", ";
                if (strcmp($scode_type[$i], "d") == 0) {
                    $querystring .= "UNIX_TIMESTAMP(`".$field_name[$i]."`)";
                }
                else {
                    $querystring .= "`".$field_name[$i]."`";
                }
            }
            $querystring .= " FROM `".$tablename."`";
            if ((is_string($condition)) && ($condition != null)) {
                if (strlen($condition) > 0) $querystring .= " WHERE (".$condition.")";
            }
            if ((is_string($order)) && ($order != null)) {
                if (strlen($order) > 0) $querystring .= " ORDER BY ".$order;
            }
            $result = $this->query($querystring);
            $n = 0;
            if ($result) {
                while ($row = mysqli_fetch_array($result, MYSQLI_BOTH)) {
                    for ($i = 0; $i < $nfield; $i++) {
                        if (strcmp($scode_type[$i], "i") == 0) {
                            $retval[$n][$field_name[$i]] = intval($row[$i]);
                        }
                        else if (strcmp($scode_type[$i], "d") == 0) {
                            $ts = intval($row[$i]);
                            $retval[$n][$field_name[$i]] = new DateTime("@$ts");
                        }
                        else if (strcmp($scode_type[$i], "f") == 0) {
                            $retval[$n][$field_name[$i]] = floatval($row[$i]);
                        }
                        else {
                            $retval[$n][$field_name[$i]] = strval($row[$i]);
                        }
                    }
                    $n++;
                }
            }
        }
        if (isset($retval)) return $retval;
        return array();
    }

    public function excelload($tablename, $condition = "", $order = "", $alt = array()) {
        $result = $this->load($tablename, $condition, $order);
        $data = array();
        $count = count($result);
        if ($count > 0){
            $xs = array_keys ($result[0]);
            $ts = array();
            $count2 = count($result[0]);
            $count3 = count($alt);
            for ($j = 0; $j < $count2; $j++){
                for ($k = 0; $k < $count3; $k++) {
                    if (strcasecmp($xs[$j], $alt[$k]["key"]) == 0) {
                        array_push($ts, $alt[$k]["value"]);
                        break;
                    }
                }
                if ($k == $count3) array_push($ts, $xs[$j]);
                array_push($data, array("row" => 0, "col" => $j, "value" => $ts[$j], "bold" => true, "backgroundcolor" => "#e2efda"));
            }
            for ($i = 0; $i < $count; $i++){
                for ($j = 0; $j < $count2; $j++){
                    $x = array("row" => ($i+1), "col" => $j, "value" =>$result[$i][$xs[$j]]);
                    array_push($data, $x);
                }
            }
        }
        return $data;
    }

    public function insert($tablename, $data, $isdebug = FALSE) {
        $result2 = $this->query("DESCRIBE `".$tablename."`");
        $nfield = 0;
        while ($row2 = mysqli_fetch_array($result2, MYSQLI_BOTH)) {
            $field_name[$nfield] = strtolower($row2["Field"]);
            $field_type[$nfield] = strtolower($row2["Type"]);
            if (strlen($field_name[$nfield]) == 0) continue;
            if (strlen($field_type[$nfield]) == 0) continue;
            $scode_type[$nfield] = DatabaseClass::getSimpleType($field_type[$nfield]);
            $nfield++;
        }
        $querystring = "INSERT INTO `".$tablename."` ";
        $fname = "";
        $fvalue = "";
        $c = 0;
        foreach ($data as $key => $value) {
            $key = strtolower($key);
            for ($i = 0; $i < $nfield; $i++) {
                if (strcasecmp($key, $field_name[$i]) == 0) {
                    if ($c > 0) {
                        $fname .= ", ";
                        $fvalue .= ", ";
                    }
                    $fname .= "`".$field_name[$i]."`";
                    if (strcmp($scode_type[$i], "t") == 0) {
                        $fvalue .= "\"".DatabaseClass::myaddslashes($value)."\"";
                    }
                    else if (strcmp($scode_type[$i], "n") == 0) {
                        $fvalue .= $value;
                    }
                    else if (strcmp($scode_type[$i], "d") == 0) {
                        $fvalue .= "FROM_UNIXTIME(".$value->getTimestamp().")";
                    }
                    $c++;
                    break;
                }
            }
        }
        if ($c > 0) {
            $querystring .= " (".$fname.") VALUES (".$fvalue.")";
            if ($isdebug) echo $querystring."<br>\n";
            $this->query($querystring);
            if (strcmp($this->lasterror, "") == 0) {
                $lastid = mysqli_insert_id($this->db);
            }
            else {
                $lastid = 0;
            }
        }
        else {
            $lastid = 0;
        }
        return $lastid;
    }

    public function insert2($tablename, $dataArray) {
        $result2 = $this->query("DESCRIBE `".$tablename."`");
        $nfield = 0;
        while ($row2 = mysqli_fetch_array($result2, MYSQLI_BOTH)) {
            $field_name[$nfield] = strtolower($row2["Field"]);
            $field_type[$nfield] = strtolower($row2["Type"]);
            if (strlen($field_name[$nfield]) == 0) continue;
            if (strlen($field_type[$nfield]) == 0) continue;
            $scode_type[$nfield] = DatabaseClass::getSimpleType($field_type[$nfield]);
            $nfield++;
        }
        $n = count($dataArray);
        for ($k = 0; $k < $n; $k++) {
            $querystring = "INSERT INTO `".$tablename."` ";
            $fname = "";
            $fvalue = "";
            $c = 0;
            foreach ($dataArray[$k] as $key => $value) {
                for ($i = 0; $i < $nfield; $i++) {
                    if (strcasecmp($key, $field_name[$i]) == 0) {
                        if ($c > 0) {
                            $fname .= ", ";
                            $fvalue .= ", ";
                        }
                        $fname .= "`".$field_name[$i]."`";
                        if (strcmp($scode_type[$i], "t") == 0) {
                            $fvalue .= "\"".DatabaseClass::myaddslashes($value)."\"";
                        }
                        else if (strcmp($scode_type[$i], "n") == 0) {
                            $fvalue .= $value;
                        }
                        else if (strcmp($scode_type[$i], "d") == 0) {
                            $fvalue .= "FROM_UNIXTIME(".$value->getTimestamp().")";
                        }
                        $c++;
                        break;
                    }
                }
            }
            if ($c > 0) {
                $querystring .= " (".$fname.") VALUES (".$fvalue.")";
                $this->query($querystring);
                if (strcmp($this->lasterror, "") == 0) {
                    $lastid = mysqli_insert_id($this->db);
                }
                else {
                    $lastid = 0;
                }
            }
            else {
                $lastid = 0;
            }
            $retval[$k] = $lastid;
        }
        if (isset($retval)) {
            return $retval;
        }
        else {
            return array();
        }
    }

    public function insert3($tablename, $dataArray) {
        $result2 = $this->query("DESCRIBE `".$tablename."`");
        $nfield = 0;
        while ($row2 = mysqli_fetch_array($result2, MYSQLI_BOTH)) {
            $field_name[$nfield] = strtolower($row2["Field"]);
            $field_type[$nfield] = strtolower($row2["Type"]);
            if (strlen($field_name[$nfield]) == 0) continue;
            if (strlen($field_type[$nfield]) == 0) continue;
            $scode_type[$nfield] = DatabaseClass::getSimpleType($field_type[$nfield]);
            $nfield++;
        }
        $n = count($dataArray);
        if ($n > 0) {
            $fname = "";
            $querystring = "INSERT INTO `".$tablename."` ";
            for ($i = 0; $i < $nfield; $i++) {
                if ($i > 0) $fname .= ", ";
                $fname .= "`".$field_name[$i]."`";
            }
            $querystring .= " (".$fname.") VALUES ";
            for ($k = 0; $k < $n; $k++) {
                $fvalue = "";
                for ($i = 0; $i < $nfield; $i++) {
                    if ($i > 0) $fvalue .= ", ";
                    if (isset($dataArray[$k][$field_name[$i]])) {
                        $value = $dataArray[$k][$field_name[$i]];
                        if (strcmp($scode_type[$i], "t") == 0) {
                            $fvalue .= "\"".DatabaseClass::myaddslashes($value)."\"";
                        }
                        else if (strcmp($scode_type[$i], "n") == 0) {
                            $fvalue .= $value;
                        }
                        else if (strcmp($scode_type[$i], "d") == 0) {
                            $fvalue .= "FROM_UNIXTIME(".$value->getTimestamp().")";
                        }
                        else {
                            $fvalue .= "NULL";
                        }
                    }
                    else {
                        $fvalue .= "NULL";
                    }
                }
                if ($k == 0) {
                    $querystring .= "(".$fvalue.")";
                }
                else {
                    $querystring .= ", (".$fvalue.")";
                }
            }
            $this->query($querystring);
        }
    }

    public function update($tablename, $data, $isdebug = FALSE) {
        $result2 = $this->query("DESCRIBE `".$tablename."`");
        $nfield = 0;
        while ($row2 = mysqli_fetch_array($result2, MYSQLI_BOTH)) {
            $field_name[$nfield] = strtolower($row2["Field"]);
            $field_type[$nfield] = strtolower($row2["Type"]);
            if (strlen($field_name[$nfield]) == 0) continue;
            if (strlen($field_type[$nfield]) == 0) continue;
            $scode_type[$nfield] = DatabaseClass::getSimpleType($field_type[$nfield]);
            $iskey[$nfield] = 0;
            $nfield++;
        }
        $st = "SELECT COLUMN_NAME";
        $st .= " FROM INFORMATION_SCHEMA.COLUMNS";
        $st .= " WHERE TABLE_SCHEMA = \"".DatabaseClass::myaddslashes($this->dbname)."\"";
        $st .= " AND TABLE_NAME = \"".DatabaseClass::myaddslashes($tablename)."\"";
        $st .= " AND COLUMN_KEY = \"PRI\"";
        $result3 = $this->query($st);
        while($row3 = mysqli_fetch_array($result3, MYSQLI_BOTH)) {
            for ($i = 0; $i < $nfield; $i++) {
                if (strcasecmp($row3[0], $field_name[$i]) == 0) {
                    $iskey[$i] = 1;
                    break;
                }
            }
        }
        $c = 0;
        $d = 0;
        $fvalue = "";
        $fwhere = "";
        foreach ($data as $key => $value) {
            for ($i = 0; $i < $nfield; $i++) {
                if (strcasecmp($key, $field_name[$i]) == 0) {
                    if ($iskey[$i] == 0) {
                        if ($c > 0) $fvalue .= ", ";
                        if (strcmp($scode_type[$i], "t") == 0) {
                            $fvalue .= "`".$field_name[$i]."`=\"".DatabaseClass::myaddslashes($value)."\"";
                        }
                        else if (strcmp($scode_type[$i], "n") == 0) {
                            $fvalue .= "`".$field_name[$i]."`=".$value;
                        }
                        else if (strcmp($scode_type[$i], "d") == 0) {
                            $fvalue .= "`".$field_name[$i]."`=FROM_UNIXTIME(".$value->format('U').")";
                        }
                        $c++;
                    }
                    else {
                        if ($d > 0) $fwhere .= " AND ";
                        if (strcmp($scode_type[$i], "t") == 0) {
                            $fwhere .= "(`".$field_name[$i]."`=\"".DatabaseClass::myaddslashes($value)."\")";
                        }
                        else if (strcmp($scode_type[$i], "n") == 0) {
                            $fwhere .= "(`".$field_name[$i]."`=".$value.")";
                        }
                        else if (strcmp($scode_type[$i], "d") == 0) {
                            $fwhere .= "(`".$field_name[$i]."`=FROM_UNIXTIME(".$value->getTimestamp()."))";
                        }
                        $d++;
                    }
                    break;
                }
            }
        }
        if (($c > 0) && ($d > 0)) {
            $querystring = "UPDATE `".$tablename."` SET ".$fvalue." WHERE (".$fwhere.")";
            if ($isdebug) echo $querystring."<br>\n";
            $this->query($querystring);
            if (strcmp($this->lasterror, "") == 0) {
                $lastid = 1;
            }
            else {
                $lastid = 0;
            }
        }
        else {
            $lastid = 0;
        }
        return $lastid;
    }

    public function backupTable($tablename, $isdebug = FALSE) {
        $st = "SHOW CREATE TABLE ".$tablename;
        $r = $this->query($st);
        if ($r) {
            if ($row2 = mysqli_fetch_array($r, MYSQLI_BOTH)) {
                $h1 = "CREATE TABLE `";
                $h2 = "` ".substr($row2[1], 15 + strlen($tablename));
                $st = $h1.$tablename.$h2;
                return array(
                    "tablename" => $tablename,
                    "createtablesql" => array (
                        "header" => $h1,
                        "footer" => $h2,
                        "full" => $st
                    ),
                    "data" => EncodingClass::fromVariable($this->load($tablename, "", ""))
                );
            }
        }
        else if ($isdebug) {
            echo "Table <".$tablename."> not found!";
            exit(0);
        }
        return null;
    }

    public static function syncDB($params) {
        if (!isset($params["db1"]["name"])) return "Database 1's name not found";
        if (!isset($params["db2"]["name"])) return "Database 2's name not found";
        if (!isset($params["db1"]["host"])) $params["db1"]["host"] = "localhost";
        if (!isset($params["db1"]["port"])) $params["db1"]["port"] = 3306;
        if (!isset($params["db1"]["username"])) $params["db1"]["username"] = "";
        if (!isset($params["db1"]["password"])) $params["db1"]["password"] = "";
        if (!isset($params["db1"]["prefix"])) $params["db1"]["prefix"] = "";
        if (!isset($params["db2"]["host"])) $params["db2"]["host"] = "localhost";
        if (!isset($params["db2"]["port"])) $params["db2"]["port"] = 3306;
        if (!isset($params["db2"]["username"])) $params["db2"]["username"] = "";
        if (!isset($params["db2"]["password"])) $params["db2"]["password"] = "";
        if (!isset($params["db2"]["prefix"])) $params["db2"]["prefix"] = "";
        $conn1 = DatabaseClass::init2($params["db1"]["host"], $params["db1"]["port"], $params["db1"]["username"] , $params["db1"]["password"], $params["db1"]["name"]);
        if ($conn1 == NULL) {
            echo "Can not connect to database 1";
            exit(0);
        }
        $conn2 = DatabaseClass::init2($params["db2"]["host"], $params["db2"]["port"], $params["db2"]["username"] , $params["db2"]["password"], $params["db2"]["name"]);
        if ($conn2 == NULL) {
            echo "Can not connect to database 2";
            exit(0);
        }
        $st = "SELECT TABLE_NAME, ENGINE, TABLE_ROWS, DATA_LENGTH, TABLE_COLLATION FROM information_schema.TABLES ".
             "WHERE `TABLE_SCHEMA` = '".$params["db1"]["name"]."' ORDER BY TABLE_NAME";
        $result = $conn1->query($st);
        $p1length = strlen($params["db1"]["prefix"]);
        while ($row = mysqli_fetch_array($result, MYSQLI_BOTH)) {
            $x = strlen($row[0]);
            if ($p1length >= $x) continue;
            $ok = 1;
            for ($i = 0; $i < $p1length; $i++) {
                if ($params["db1"]["prefix"][$i] != $row[0][$i]) {
                    $ok = 0;
                    break;
                }
            }
            if ($ok == 0) continue;
            $xname = $params["db2"]["prefix"].substr($row[0], $p1length);
            echo "Source: ".$row[0]."<br>";
            $r = $conn1->query("DESCRIBE `".$row[0]."`");
            $tc1 = array ();
            $td1 = array ();
            if ($r != null) {
                while ($row2 = mysqli_fetch_array($r, MYSQLI_BOTH)) {
                    $s = strtolower($row2["Field"]);
                    $t = strtolower($row2["Type"]);
                    array_push($td1, $s);
                    $tc1[$s] = $t;
                    echo "&emsp;".$s."&emsp;".$t."<br>";
                }
            }
            $r = $conn2->query("DESCRIBE `".$xname."`");
            $tc2 = array ();
            $td2 = array ();
            if ($r != null) {
                echo "Target: ".$xname."<br>";
                while ($row2 = mysqli_fetch_array($r, MYSQLI_BOTH)) {
                    $s = strtolower($row2["Field"]);
                    $t = strtolower($row2["Type"]);
                    array_push($td2, $s);
                    $tc2[$s] = $t;
                    echo "&emsp;".$s."&emsp;".$t."<br>";
                }
                echo "Result:<br>";
                $c = sizeof($td1);
                for ($i = 0; $i < $c; $i++) {
                    $s = $td1[$i];
                    if (!isset($tc2[$s])) {
                        echo "&emsp;".$s.": not found!<br>";
                        $st = "ALTER TABLE `".$xname."` ADD `".$s."` ".$tc1[$s]." NOT NULL ;";
                        echo "&emsp;<span style=\"color: blue; font-weight: bold;\">".$st."</span><br>";
                        $conn2->query($st);
                    }
                    else if (strcasecmp($tc1[$s], $tc2[$s]) != 0) {
                        echo "&emsp;".$s.": not matched: ".$tc1[$s]." - ".$tc2[$s]."<br>";
                        $st = "ALTER TABLE `".$xname."` CHANGE `".$s."` `".$s."` ".$tc1[$s]." ;";
                        echo "&emsp;<span style=\"color: blue; font-weight: bold;\">".$st."</span><br>";
                        $conn2->query($st);
                    }
                    else {
                        echo "&emsp;".$s.": OK!<br>";
                    }
                }
                $c = sizeof($td2);
                for ($i = 0; $i < $c; $i++) {
                    $s = $td2[$i];
                    if (!isset($tc1[$s])) {
                        echo "&emsp;".$s.": not found!<br>";
                        $st = "ALTER TABLE `".$xname."` DROP `".$s."`;";
                        echo "&emsp;<span style=\"color: blue; font-weight: bold;\">".$st."</span><br>";
                        $conn2->query($st);
                    }
                }
            }
            else {
                echo "Target: ".$xname." - not found<br>";
                $st = "SHOW CREATE TABLE ".$row[0];
                $r = $conn1->query($st);
                while ($row2 = mysqli_fetch_array($r, MYSQLI_BOTH)) {
                    $st = "CREATE TABLE `".$xname."` ".substr($row2[1], 15 + strlen($row[0]));
                    echo "&emsp;<span style=\"color: blue; font-weight: bold;\">".$st."</span><br>";
                    $conn2->query($st);
                }
            }
            echo "====================================================================================<br>";
        }
        return "";
    }
};
?>
