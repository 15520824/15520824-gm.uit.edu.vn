<?php
/*
php:
function buttonClass.write_script();
function buttonClass.generate(params);

javascript:
function buttonClass.generate({
    [optional] type: "white-gray",
    [optional] caption: "ok",
    [optional] width: 120,
    [optional] height: 26,
    [optional] command: "alert('ok');"
});
*/

include_once    "jsencoding.php";

$button_script_written = 0;

class buttonClass {
    public static function write_script() {
        global $button_script_written;
        if ($button_script_written == 1) return;
        EncodingClass::write_script();
        $button_script_written = 1;
        ?>
        <script type="text/javascript">

            'use strict';

            var buttonClass = {
                generate: function (params) {
                    var st;
                    if (params.type === undefined) params.type = "white-gray";
                    if (params.caption === undefined) params.caption = "";
                    if (params.command === undefined) params.command = "";
                    if (params.width === undefined) params.width = 0;
                    if (params.height === undefined) params.height = 0;
                    switch (params.type) {
                        case "black":
                            st = "<input type=\"submit\" style=\"text-align:center; background-color:#666666; color:white; border-radius:5px; border:2px solid #444444;";
                            if (params.height > 0) {
                                st += " height: " + params.height + "px;";
                            }
                            else {
                                st += " height: 26px;";
                            }
                            if (params.width > 0) {
                                st += " width: " + params.width + "px;";
                            }
                            st += "\" value=\"" + EncodingClass.inputvalue(params.caption) + "\" onclick=\"" + params.command + " ; event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\"/>";
                            break;
                        case "black-red":
                            st = "<input type=\"submit\" style=\"text-align:center;";
                            if (params.height > 0) {
                                st += " height: " + params.height + "px;";
                            }
                            else {
                                st += " height: 26px;";
                            }
                            if (params.width > 0) {
                                st += " width: " + params.width + "px;";
                            }
                            
                            st += "\" class=\"button-black-red\" value=\"" + EncodingClass.inputvalue(params.caption) + "\" onclick=\"" + params.command + " ; event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\"/>";
                            break;
                        case "black-gray":
                            st = "<input type=\"submit\" style=\"text-align:center;";
                            if (params.height > 0) {
                                st += " height: " + params.height + "px;";
                            }
                            else {
                                st += " height: 26px;";
                            }
                            if (params.width > 0) {
                                st += " width: " + params.width + "px;";
                            }
                            
                            st += "\" class=\"button-black-gray\" value=\"" + EncodingClass.inputvalue(params.caption) + "\" onclick=\"" + params.command + " ; event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\"/>";
                            break;
                        case "white-gray":
                            
                        case "white-red":
                        default:
                            st = "<table style=\"border: 0; border-spacing: 0; border-collapse: collapse; padding: 0;\" onmouseover=\"buttonClass.mouseOverFunction({element: this, type: '" + params.type + "', caption: '" + EncodingClass.inputvalue(params.caption) + "'});\"";
                            st += " onmouseout=\"buttonClass.mouseOutFunction({element: this, type: '" + params.type + "', caption: '" + EncodingClass.inputvalue(params.caption) + "'});\">";
                            st += "<tr><td style=\"width: 1px; background-color: #DFDFDF; border-spacing: 0; padding: 1px;\"></td><td align=\"center\" style=\"";
                            if (params.width > 0) st += " width: " + params.width + "px;";
                            if (params.height > 0) st += " height: " + params.height + "px;";
                            st += " background-color: #FFFFFF; border-spacing: 0; padding: 1px; color: black; cursor: pointer; font-weight: bold; font-size: 12px;\" nowrap onclick=\"" + params.command + "event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\">";
                            st += EncodingClass.inputvalue(params.caption) + "</td>";
                            st += "<td style=\"width: 1px; background-color: #C8C8C8; border-spacing: 0; padding: 1px;\"></td></tr>";
                            st += "<tr><td style=\"border-spacing: 0; padding: 1px;\"></td><td style=\"height: 1px; background-color: #C8C8C8; padding: 1px;\"></td><td style=\"border-spacing: 0; padding: 1px;\"></td></tr>";
                            st += "</table>";
                            break;
                    }
                    return st;
                },
                mouseOverFunction: function (params) {
                    var element = params.element;
                    var type = params.type;
                    if (element === undefined) return;
                    if (type === undefined) return;
                    var tbody = element.childNodes[0];
                    var tr, td;
                    switch (type) {
                        case "white-gray":
                            tr = tbody.childNodes[0];
                            tr.childNodes[0].style.background = "#C6C7C9";
                            tr.childNodes[1].style.background = "#D1D2D4";
                            break;
                        case "white-red":
                            tr = tbody.childNodes[0];
                            tr.childNodes[0].style.background = "#C78271";
                            tr.childNodes[1].style.background = "#FF0000";
                            tr.childNodes[1].style.color = "white";
                            tr.childNodes[2].style.background = "#C78271";
                            tr = tbody.childNodes[1];
                            tr.childNodes[1].style.background = "#C78271";
                            break;
                    }
                },

                mouseOutFunction: function (params) {
                    var element = params.element;
                    var type = params.type;
                    if (element === undefined) return;
                    if (type === undefined) return;
                    var tbody = element.childNodes[0];
                    var tr, td;
                    switch (type) {
                        case "white-gray":
                            tr = tbody.childNodes[0];
                            tr.childNodes[0].style.background = "#DFDFDF";
                            tr.childNodes[1].style.background = "#FFFFFF";
                            break;
                        case "white-red":
                            tr = tbody.childNodes[0];
                            tr.childNodes[0].style.background = "#DFDFDF";
                            tr.childNodes[1].style.background = "#FFFFFF";
                            tr.childNodes[1].style.color = "black";
                            tr.childNodes[2].style.background = "#DFDFDF";
                            tr = tbody.childNodes[1];
                            tr.childNodes[1].style.background = "#C8C8C8";
                            break;
                    }
                }
            }

        </script>
        <?php
    }

    public static function generate($params) {
        if (!isset($params["type"])) $params["type"] = "white-gray";
        if (!isset($params["caption"])) $params["caption"] = "";
        if (!isset($params["command"])) $params["command"] = "";
        if (!isset($params["width"])) $params["width"] = 0;
        if (!isset($params["height"])) $params["height"] = 0;

        switch ($params["type"]) {
            case "black":
                $st = "<input type=\"submit\" style=\"text-align:center; background-color:#666666; color:white; border-radius:5px; border:2px solid #444444;";
                if ($params["height"] > 0) {
                    $st .= " height: ".$params["height"]."px;";
                }
                else {
                    $st .= " height: 26px;";
                }
                if ($params["width"] > 0) {
                    $st .= " width: ".$params["width"]."px;";
                }
                $st .= "\" value=\"".EncodingClass::inputvalue($params["caption"])."\" onclick=\"".$params["command"]." ; event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\"/>";
                break;
            case "white-gray":
            case "white-red":
            default:
                $st = "<table style=\"border: 0; border-spacing: 0; border-collapse: collapse; padding: 0;\" onmouseover=\"buttonClass.mouseOverFunction({element: this, type: '".$params["type"]."', caption: '".EncodingClass::inputvalue($params["caption"])."'});\"";
                $st .= " onmouseout=\"buttonClass.mouseOutFunction({element: this, type: '".$params["type"]."', caption: '".EncodingClass::inputvalue($params["caption"])."'});\">";
                $st .= "<tr><td style=\"width: 1px; background-color: #DFDFDF;\"></td><td align=\"center\" style=\"";
                if ($params["width"] > 0) $st .= " width: ".$params["width"]."px;";
                if ($params["height"] > 0) $st .= " height: ".$params["height"]."px;";
                $st .= " background-color: #FFFFFF; color: black; cursor: pointer; font-weight: bold; font-size: 12px;\" nowrap onclick=\"".$params["command"]."; event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\">";
                $st .= EncodingClass::inputvalue($params["caption"])."</td>";
                $st .= "<td style=\"width: 1px; background-color: #C8C8C8;\"></td></tr>";
                $st .= "<tr><td></td><td style=\"height: 1px; background-color: #C8C8C8;\"></td><td></td></tr>";
                $st .= "</table>";
                break;
        }
        return $st;
    }
}

?>
