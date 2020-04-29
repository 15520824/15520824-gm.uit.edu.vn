<?php
    include_once "./lib/prefix.php";
    include_once "./lib/connection.php";
    include_once "./lib/common.php";
    include_once "./lib/jsdb.php";
    include_once "./lib/jsdom.php";
    include_once "./lib/jsdomelement.php";
    include_once "./lib/jsencoding.php";
    include_once "./lib/jsform_new.php";
    include_once "./lib/jsform.php";
    include_once "./lib/jsmodalelement.php";
    include_once "./lib/menu.php";
    include_once "./lib/jsbootstrap.php";
    include_once "./lib/style_kpi.php";
    include_once "./lib/jsbutton_071218.php";
    include_once "./lib/bsc2kpi_111218.php";
    include_once "./lib/content_module.php";

    session_start();

    ?><!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
        <script>
            <?php
                    include_once "absol/absol_full.php";
                    include_once "module_define.php";
                    include_once "module_style.php";
            ?>
            var systemconfig = {
                separateSign: ",",
                commaSign: "."
            };
        </script>
        <?php
            DOMClass::write_script();
            DOMElementClass::write_script();
            EncodingClass::write_script();
            FormClass::write_script();
            ModalElementClass::write_script();
            BootstrapElementClass::write_script();
            write_common_script();
            write_form_script();
            write_bsc2kpi1112_script();
        ?>
        <title>PIZO<?php if (isset($company_name)) {if ($company_name != "") echo " - ".$company_name;}?></title>
        <script type="text/javascript">
        "use strict";
            var database = {};
            var pizo = {
                menu: {}
            };
            var blackTheme = {
            };
        </script>
        <style media="screen">
            .bodyFrm .resetClass{
                font-family:Arial;
            }
        </style>
        <?php
        $thememode = 1;
        write_button_071218_style_black();
        write_content_script();
        write_kpi_script();
        write_menu_script();
        ?>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
        <script type="text/javascript">
            var init = function () {
                    // pizo.menu.init(holder);
                }
                
            };
        </script>
    </head>
	<body onload="setTimeout('init();',  10);"></body>
</html>
