<?php
    include_once "common.php";
    include_once "jsbutton.php";
    include_once "jsform_new.php";
/*
php:
    function write_form_script();
    function api_getIndex($writeout);
javascript:
    function inputvalue(str);
    function openUrlInNewTab(url);
    function form_post_newtab(url, params);
    function form_post(url, optional params, optional target);
    function api_call(index, url, params, fileuploads = [], function(bool success, string message));
    function jsonp_call(index, url, params, function(bool success, string message));
    function safeLogin(url, username, password, othervalues [fieldname, fieldtype], function(int errorcode, string message), optional key);
    function safe_CreateAccount(url, username, password, privilege, defaultvalues [fieldname, fieldtype, fieldvalue], function(int errorcode, string message), optional key)
    function safeLogout(url, function(int errorcode, string message));
*/

$form_script_written = 0;

    function api_getIndex($writeout) {
        return FormClass::getIndex($writeout);
    }

    function write_form_script() {
        global $form_script_written;
        buttonClass::write_script();
        FormClass::write_script();
        write_common_script();
        if ($form_script_written == 1) return 0;
    ?>
    <script type="text/javascript">

        function openUrlInNewTab(url) {     // must exec in "onclick" event
            FormClass.openUrlInNewTab(url);
        }

        function form_post_newtab(url, params) {
            FormClass.form_post_newtab(url, params);
        }

        function form_post(url, params, target) {
            FormClass.form_post(url, params, target);
        }

        function api_call(index, url, params, fileuploads, func) {
            var i;
            var xparams = [], xfiles = [];
            if (func === undefined) {
                func = fileuploads;
                fileuploads = [];
            }
            for (i = 0; i < params.length; i++) {
                xparams.push({
                    name: params[i][0],
                    value: params[i][1]
                });
            }
            for (i = 0; i < fileuploads.length; i++) {
                xfiles.push({
                    name: fileuploads[i][0],
                    filename: fileuploads[i][1],
                    content: fileuploads[i][2]
                });
            }
            FormClass.api_call({
                index: index,
                url: url,
                params: xparams,
                fileuploads: xfiles,
                func: func
            });
        }

        function qapi_call(queue, url, params, fileuploads, func) {
            var i;
            var xparams = [], xfiles = [];
            if (func === undefined) {
                func = fileuploads;
                fileuploads = [];
            }
            for (i = 0; i < params.length; i++) {
                xparams.push({
                    name: params[i][0],
                    value: params[i][1]
                });
            }
            for (i = 0; i < fileuploads.length; i++) {
                xfiles.push({
                    name: fileuploads[i][0],
                    filename: fileuploads[i][1],
                    content: fileuploads[i][2]
                });
            }
            queue.call({
                url: url,
                params: xparams,
                fileuploads: xfiles,
                func: func
            });
        }

        var safeLogin_callback_func;
        var safeLogin_url;
        var safeLogin_username;
        var safeLogin_password;
        var safeLogin_default_values;

        function safeLogin_response(errcode, message) {
            safeLogin_url = "";
            safeLogin_username = "";
            safeLogin_password = "";
            safeLogin_callback_func(errcode, message);
        }

        function safeLogin_x(key) {
            var i;
            var p = [["logincmd", "2"]];
            p.push(["username", safeLogin_username]);
            p.push(["encryptedpassword", md5(safeLogin_username + "." + safeLogin_password + "." + key)]);
            for (i = 0; i < safeLogin_default_values.length; i++) {
                p.push(["safe_login_header_" + safeLogin_default_values[i][0].toLowerCase(), safeLogin_default_values[0][1]]);
            }
            api_call(<?php api_getIndex(1); ?>, safeLogin_url, p, function(success, message) {
                if (success) {
                    if (message.substr(0, 2) == 'ok') {
                        safeLogin_response(0, "login ok");
                    }
                    else if (message.substr(0, 6) == 'failed') {
                        safeLogin_response(-1, "invalid username or password" + message.substr(6));
                    }
                    else if (message.substr(0, 6) == 'logged') {
                        safeLogin_response(-2, "you must log out current account first");
                    }
                    else if (message.substr(0, 7) == 'blocked') {
                        safeLogin_response(-3, "account was deactivated");
                    }
                    else {
                        safeLogin_response(-101, message);
                    }
                }
                else {
                    safeLogin_response(-101, message);
                }
            });
        }

        function safeLogin(url, username, password, othervalues, func, key) {
            var i;
            if (key === undefined) key = "000000";
            safeLogin_default_values = [];
            for (i = 0; i < othervalues.length; i++)
                safeLogin_default_values.push(othervalues[i]);

            password = md5(password + "safe.Login.via.normal.HTTP" + key);
            safeLogin_url = url;
            safeLogin_callback_func = func;
            safeLogin_username = username.toLowerCase();
            safeLogin_password = password;
            api_call(<?php api_getIndex(1); ?>, safeLogin_url, [["logincmd", "1"]], function(success, message) {
                var t, k;
                if (success) {
                    if (message.substr(0, 2) == 'ok') {
                        t = message.substr(2);
                        k = t.indexOf("\n");
                        if (k != -1) t = t.substr(0, k);
                        safeLogin_x(t);
                    }
                    else {
                        safeLogin_response(-101, message);
                    }
                }
                else {
                    safeLogin_response(-101, message);
                }
            });
        }

        var safeCreateAccount_func;

        function safe_CreateAccount(url, username, password, privilege, defaultvalues, func, key) {
            var i;
            var safeCreateAccount_values;
            if (key === undefined) key = "000000";
            safeCreateAccount_func = func;
            safeCreateAccount_values = [["logincmd", "4"]];
            safeCreateAccount_values.push(["username", username]);
            safeCreateAccount_values.push(["encryptedpassword", md5(password + "safe.Login.via.normal.HTTP" + key)]);
            safeCreateAccount_values.push(["privilege", privilege]);
            for (i = 0; i < defaultvalues.length; i++) {
                safeCreateAccount_values.push(["safe_login_header_" + i, defaultvalues[i][0]]);
                safeCreateAccount_values.push(["safe_login_value_" + i, defaultvalues[i][1] + defaultvalues[i][2]]);
            }
            api_call(<?php api_getIndex(1); ?>, url, safeCreateAccount_values, function(success, message) {
                if (success) {
                    if (message.substr(0, 2) == 'ok') {
                        safeCreateAccount_func(0, message);
                    }
                    else {
                        safeCreateAccount_func(-1, message);
                    }
                }
                else {
                    safeCreateAccount_func(-2, message);
                }
            });
        }

        var safeLogout_func;

        function safeLogout(url, func) {
            safeLogout_func = func;
            api_call(<?php api_getIndex(1); ?>, url, [["logincmd", "3"]], function(success, message) {
                if (success) {
                    if (message.substr(0, 2) == 'ok') {
                        safeLogout_func(0, message);
                    }
                    else {
                        safeLogout_func(-1, message);
                    }
                }
                else {
                    safeLogout_func(-2, message);
                }
            });
        }

        var safeUserChangePassword_func, safeUserChangePassword_oldpass, safeUserChangePassword_newpass, safeUserChangePassword_url;

        function safeUserChangePassword_x(key) {
            var s1 = md5(safeUserChangePassword_oldpass + key);
            var s2 = "";
            var checksum = "";
            var i, k;
            <?php
                if (isset($prefix)) {
                    if (isset($_SESSION[$prefixhome."username"])) {
                        echo "checksum = md5(".$_SESSION[$prefixhome."username"]." + "." + safeUserChangePassword_newpass + "." + key);";
                    }
                }
            ?>
            for (i = 0; i < 32; i++) {
                k = parseInt(s1.substr(i, 1), 16) ^ parseInt(safeUserChangePassword_newpass.substr(i, 1), 16);
                if (k < 10) {
                    s2 += k;
                }
                else {
                    s2 += String.fromCharCode(k - 10 + 97);
                }
            }
            var p = [["logincmd", 5], ["newencryptedpassword", s2], ["checksum", checksum]];
            api_call(<?php api_getIndex(1); ?>, safeUserChangePassword_url, p, function(success, message) {
                if (success) {
                    if (message.substr(0, 2) == 'ok') {
                        safeUserChangePassword_func(0, "ok");
                    }
                    else {
                        safeUserChangePassword_func(-1, message);
                    }
                }
                else {
                    safeUserChangePassword_func(-2, message);
                }
            });
        }

        function safeUserChangePassword(url, oldpassword, newpassword, func, key) {
            safeUserChangePassword_func = func;
            if (key === undefined) key = "000000";
            safeUserChangePassword_oldpass = md5(oldpassword + "safe.Login.via.normal.HTTP" + key);
            safeUserChangePassword_newpass = md5(newpassword + "safe.Login.via.normal.HTTP" + key);
            safeUserChangePassword_url = url

            api_call(<?php api_getIndex(1); ?>, url, [["logincmd", "1"]], function(success, message) {
                var t, k;
                if (success) {
                    if (message.substr(0, 2) == 'ok') {
                        t = message.substr(2);
                        k = t.indexOf("\n");
                        if (k != -1) t = t.substr(0, k);
                        safeUserChangePassword_x(t);
                    }
                    else {
                        safeUserChangePassword_func(-101, message);
                    }
                }
                else {
                    safeUserChangePassword_func(-101, message);
                }
            });
        }

        function safeAdminChangePassword() {

        }
    </script>
    <?php
    $form_script_written = 1;
    return 1;
  }

 ?>
