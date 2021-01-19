<?php
    function generalOperator($where)
    {
        $result = "(";
        for($i=0;$i<count($where);$i++)
        {
            if(gettype($where[$i])=="string")
            {
                switch($where[$i])
                {
                    case "&&":
                        $result.=" AND ";
                    break;
                    case "||":
                        $result.=" OR ";
                    break;
                }
            }else
            {
                if(checkArray($where[$i]))
                {
                    $result.=generalOperator($where[$i]);
                }else
                {
                    foreach($where[$i] as $param=>$value)
                    {
                        
                        if(is_array($value))
                        {
                            if(is_a($value["value"],'DateTime'))
                            {
                                $value["value"] = "'".$value["value"]->format('Y-m-d H:i:s')."'";
                            }
                            $result.=$param.$value["operator"].strval($value["value"]);
                        }
                        else
                            $result.=$param."=".strval($value);
                    }
                }
            }
        }
        return $result.")";
    }
    function checkArray($data)
    {
        for($i = 0;$i<count($data);$i++)
        {
            if(!isset($data[$i]))
                return false;
        }
        return true;
    }
?>