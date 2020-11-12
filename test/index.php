<?php

    require_once 'Mobile_Detect.php';
    $detect = new Mobile_Detect;


    include_once "prefix.php";
    include_once "prefix2.php";
    $isMobile = 0;
    if ($detect->isMobile()) $isMobile = $detect->isMobile();
    if ($isMobile) {
        include_once "theme/mobile/config_format.php";
    }
    else {
        include_once "theme/desktop/config_format.php";
    }
    include_once "connection.php";
    include_once "connection2.php";
    include_once "jsmodulemanager.php";
    include_once "jsdomelement.php";
    include_once "jsmodalelement.php";
    include_once "jsform.php";
    include_once "jsdb.php";
    include_once "jsstorage.php";
    include_once "content_module.php";
    include_once "task.php";
    include_once "maintenance.php"; // TODO: thanhyen
    include_once "../../chat/jschat_card.php";

    include_once "data_module.php";
    include_once "menu.php";
    include_once "account.php";
    include_once "datatypes.php";
    include_once "boards.php";
    // include_once "statusgroups.php";
    // include_once "objects.php";
    include_once "chats.php";
    include_once "my_report.php";
    // include_once "category.php";
    include_once "cards.php";
    include_once "nations.php";
    include_once "cities.php";
    include_once "company.php";
    include_once "contact.php";
    include_once "company_class.php";
    include_once "master_board.php";
    include_once "account_group.php";
    include_once "knowledge_groups.php";
    include_once "knowledge.php";
    include_once "districts.php";
    include_once "my_calendar.php";
    include_once "activities.php";
    include_once "board_groups.php";
    include_once "report_groups.php";
    include_once "reminder.php";
    include_once "excel_module.php";

    ///
    session_start();
    if (!isset($_SESSION[$prefixhome."userid"])) {
        $add =  $_SERVER['REQUEST_URI'];
        $protocal =  isset($_SERVER['HTTPS'])? "https://":"http://";
        $temp = substr($add, 1);
        $temp2 = strpos($temp, "/");
        $x = $_SERVER['SERVER_NAME']."/".substr($temp, 0, $temp2)."?id=carddone&&language=VN";
        if (isset($_GET["username"])){
            $x.= "&&username=".$_GET["username"];
        }
        header("Location:".$protocal.$x);
        clearPrivilege();
        exit();
    }
    ?><!DOCTYPE html>
<html>
	<head>
        <?php
            ModuleManagerClass::write_script();
        ?>
		<meta charset="utf-8">
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'/>
		<link rel="icon" href="../images2/carddone_favicon.ico" type="image/x-icon">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
        <link rel="stylesheet" href="https://cdn.materialdesignicons.com/4.5.95/css/materialdesignicons.min.css">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
        <link rel="stylesheet" href="style_card.css">
        <script src="exceljs.js"></script>
        <script src="polyfill.js"></script>
        <script src="md5.min.js"></script>
        <script src="absol/absol_full.js?<?php  echo stat('absol/absol_full.js')['mtime'];?>"></script>
        <script src="languagemodule.js"></script>
        <script src="jsbutton_071218.js"></script>
        <script src="ckeditor/ckeditor.js"></script>
        <script src="maps_view.js"></script>
        <script async defer
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDYe7fnyvFCkU3q-mnZJfJIvadeWwWvytw&libraries=geometry&callback=initMap">
        </script>
        <?php
            DOMElementClass::write_script(FALSE);
            FormClass::write_script();
            ModalElementClass::write_script();
            ChatClass::write_script();
            StorageClass::write_script();
            write_config_format_style();
            write_task_home_script();
        ?>
        <title>Carddone</title>
        <script type="text/javascript">
        "use strict";
            function initMap(){

            };
            window.domain = window.location.href;
            window.domainUser_avatars = "../user_avatars/";
            window.domainGoup_avatars = "group_avatars/";
            window.domainCompany_logo = "../company_logo/";
            window.imageServiceInit = "../logo-card-15-11.png";
            window.imageCompanyInit = "../SoftA.png";
            window.isApp = false;
            window.mobilecheck = function() {
				var check = false;
				(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
				return check;
			};
            var carddone = {
                isMobile: <?php echo $isMobile?>,
                listTabChat: [],
                menu: {},
                account: {},
                datatypes: {},
                boards: {},
                chats: {},
                my_report: {},
                cards: {},
                nations: {},
                cities: {},
                company: {},
                contact: {},
                company_class: {},
                master_board: {},
                account_group: {},
                knowledge_groups: {},
                knowledge: {},
                districts: {},
                my_calendar: {},
                activities: {},
                board_groups: {},
                report_groups: {},
                reminder: {},
                excel_module: {}
            };
            var data_module = {};
            var theme = {};
            var systemconfig = {
                separateSign: ",",
                commaSign: ".",
                debugMode: false
            };
            var LanguageModule_v_languagesData;
            var LanguageModule_v_languageCode;
            var LanguageModule_v_defaultcode;
            //# sourceURL=card:///src/index.php.js?

        </script>
        <?php
        if ($detect->isMobile() ) {
            include_once "theme/mobile/main.php";
        }
        else {
            include_once "theme/desktop/main.php";
        }
         ?>
        <?php
        write_content_script();
        write_data_module_script();
        write_menu_script();
        write_account_script();
        write_datatypes_script();
        write_boards_script();
        // write_statusgroups_script();
        // write_objects_script();
        write_chats_script();
        write_my_report_script();
        // write_category_script();
        write_cards_script();
        write_nations_script();
        write_cities_script();
        write_company_script();
        write_contact_script();
        write_company_class_script();
        write_master_board_script();
        write_account_group_script();
        write_knowledge_groups_script();
        write_knowledge_script();
        write_districts_script();
        write_my_calendar_script();
        write_activities_script();
        write_board_groups_script();
        write_report_groups_script();
        write_reminder_script();
        write_excel_module_script();

        /// theme
        write_theme_script();
        ?>
        <script type="text/javascript">
            var initUI = function () {
                carddone.menu.init(window.holderMain);
                var host = window.domain;
                var x = host.indexOf("://");
                if (x >= 0) host = host.substr(x + 3);
                x = host.indexOf("/");
                host = host.substr(0, x);
                var x = window.domain.indexOf(host);
                var y = window.domain.indexOf("/carddone");
                var channel = window.domain.substr(x + host.length + 1, y - (x + host.length + 1));
                var connector = ChatClass.connect({
                    host: host,
                    channel: channel,
                    onMessage: function (message) {
                        if (message.content.type == "carddone_maintenance"){
                            window.location.href = window.location.href;
                        }
                    }
                });
            };

            var checkLogin = function() {
                FormClass.api_call({
                    url: "checklogin.php",
                    params: [],
                    func: function(success, message) {
                        if (success) {
                            setTimeout("checkLogin();", 1000 * 60 * 5);
                        }
                        else {
                            setTimeout("checkLogin();", 1000 * 60);
                        }
                    }
                });
            };

            var init = function () {
                window.backLayoutFunc = [];
                LanguageModule_load().then(function(values){
                    LanguageModule_v_languagesData = values.uitext;
                    LanguageModule_v_languageCode = values.uicode;
                    LanguageModule_v_defaultcode = systemconfig.language;
                    LanguageModule_writeJavascript(LanguageModule_v_defaultcode);
                    var userid = systemconfig.userid;
                    var available = systemconfig.available;
                    var expireddate = systemconfig.expireddate;
                    if (!ModalElement.isReady()) {
                        setTimeout('init();',  100);
                        return;
                    }
                    var protocal = "";
                    var indexTemp = window.location.href.indexOf("carddone");
                    protocal = window.location.href.substr(0, indexTemp);
                    if ((userid == 0) || (available == 0)){
                        ModalElement.alert({
                            message: LanguageModule.text("war_txt_no_permission"),
                            func: function(){
                                location.href = protocal;
                            }
                        });
                        return;
                    }

                    for (var i = 0; i < database.services.items.length; i++){
                        if (database.services.items[i].prefix == "carddone"){
                            for (var j = 0; j < database.register.items.length; j++){
                                if ((database.register.items[j].serviceid == database.services.items[i].id) && (database.register.items[j].companyid == database.company.id)){
                                    if (database.register.items[j].expireddate.getTime() < (new Date()).getTime()){
                                        ModalElement.alert({
                                            message: LanguageModule.text("war_txt_expiry_date"),
                                            func: function(){
                                                location.href = protocal;
                                            }
                                        });
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    data_module.penddingHeap();
                    initUI();
                    setTimeout("checkLogin();", 1000);
                });
            }

            var initDatabase = function(){
				ModuleManagerClass.register({
			        name: "init",
			        prerequisites: ["main"]
			    });
			};


//# sourceURL=card:///src/index.php.1.js?
</script>

    </head>
	<body onload="initDatabase();"></body>
</html>
