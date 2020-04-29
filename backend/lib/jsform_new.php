<?php
    include_once "jsencoding.php";
/*
php:
    function FormClass::write_script();
    function FormClass::getIndex($writeout);
    function FormClass::dataToString($data);
    function FormClass::stringToData($str);
    function FormClass::packedString($str);
    function FormClass::unpackString($str, &offset);
    function FormClass::enterDownloadMode($filename);
javascript:
    function FormClass.openUrlInNewTab(url);
    function FormClass.form_post_newtab(url, params);
    function FormClass.form_post(url, optional params, optional target);
    function FormClass.parseArray(str);
    function FormClass.api_call({
        url: "http://daithangminh.vn/login.php",
        params: [
                    {name: "email",
                     value: "ng_dan_thanh@yahoo.com"
                    },
                    {name: "password",
                     value: "123456"
                    }
                ],
        [optional] fileuploads: [
                        {name: "attachment1",
                         filename: "aa.png",
                         content: [ binary data ]
                        },
                    ],
        func: function(bool success, string message) {
        }
    });
    function FormClass.readFile(filehandle, callbackFunc);
    function FormClass.saveAsText(filename, text);
    function FormClass.saveAs(filename, bytesArray);
    function FormClass.saveAsRaw(filename, rawdata);
*/

$form_new_script_written = 0;
$form_maxIndex = 0;

class FormClass {
    public static function getIndex($writeout) {
        global $form_maxIndex;
        if ($writeout) echo $form_maxIndex;
        return $form_maxIndex++;
    }

    public static function write_script() {
        global $form_new_script_written;
        EncodingClass::write_script();
        if ($form_new_script_written == 1) return 0;
        ?>
        <script type="text/javascript">

            'use strict'

            var FormClass = {
                openUrlInNewTab: function (url) {     // must exec in "onclick" event
                    window.open(url, "_blank");
                },

                form_post_newtab : function (url, params) {
                    form_post(url, params, "_blank");
                },

                form_post : function (url, params, target) {
                    var form = document.createElement("form");
                    if (params === undefined) {
                        params = [];
                        target = null;
                    }
                    else if (target === undefined) {
                        target = null;
                    }
                    var hiddenField;
                    var i;

                    form.setAttribute("method", "post");
                    form.setAttribute("action", url);
                    if (target != null) form.setAttribute("target", target);

                    for (i = 0; i < params.length; i++) {
                        hiddenField = document.createElement("input");
                        hiddenField.setAttribute("type", "hidden");
                        hiddenField.setAttribute("name", params[i][0]);
                        hiddenField.setAttribute("value", params[i][1]);
                        form.appendChild(hiddenField);
                    }
                    document.body.appendChild(form);
                    form.submit();
                },

                unpackString : function (params) {
                    var xlen, hlen, data;
                    if (params.offset === undefined) params.offset = 0;
                    xlen = parseInt(param.text.substr(params.offset, 1), 16);
                    params.offset += 1;
                    hlen = parseInt(param.text.substr(params.offset, xlen), 16);
                    params.offset += xlen;
                    data = param.text.substr(params.offset, hlen);
                    params.offset += hlen;
                    return data;
                },

                parseArray_o : function (params) {
                    var i, len, code, data;
                    code = params.text.substr(params.offset, 1);
                    params.offset += 1;
                    if (code == "v") {
                        return EncodingClass.utf8.decode(FormClass.unpackString(params));
                    }
                    if (code == "a") {
                        len = parseInt(FormClass.unpackString(params), 10);
                        data = [];
                        for (i = 0; i < len; i++) {
                            data.push(FormClass.parseArray_o(params));
                        }
                        return data;
                    }
                    return null;
                },

                parseArray : function (str) {
                    return parseArray_o({text: str, offset: 0});
                },

                urlencode : function (str) {

                    str = (str + '');

                    return encodeURIComponent(str)
                    .replace(/!/g, '%21')
                    .replace(/'/g, '%27')
                    .replace(/\(/g, '%28')
                    .replace(/\)/g, '%29')
                    .replace(/\*/g, '%2A')
                    .replace(/%20/g, '+');
                },

                queue: function (n) {
                    var r, i, x = [];
                    for (i = 0; i < n; i++) x.push(null);
                    r = {
                        list: [],
                        buffer: x,
                    }
                    r.call = function (r) {
                        return function (tparams) {
                            r.list.push(tparams);
                        }
                    }(r);
                    r.release = function (r) {
                        return function () {
                            r.list = null;
                            r.buffer = null;
                        };
                    }(r);
                    r.thread = function(r) {
                        return function () {
                            var i, j, c, x;
                            if ((r.buffer != null) && (r.list != null)) {
                                if (r.list.length > 0) {
                                    c = 0;
                                    for (i = 0; i < r.buffer.length; i++) {
                                        if (r.buffer[i] == null) {
                                            c = 1;
                                            break;
                                        }
                                    }
                                    if (c > 0) {
                                        for (i = 0; i < r.buffer.length; i++) {
                                            if (r.buffer[i] == null) {
                                                r.buffer[i] = r.list[0].func;
                                                r.list[0].func = function(i) {
                                                    return function (success, message) {
                                                        var t;
                                                        if (r.buffer != null) {
                                                            t = r.buffer[i];
                                                            r.buffer[i] = null;
                                                            if (t != null) t(success, message);
                                                        }
                                                    }
                                                }(i);
                                                FormClass.api_call(r.list[0]);
                                                x = [];
                                                for (j = 1; j < r.list.length; j++) x.push(r.list[j]);
                                                r.list = x;
                                                if (x.length == 0) break;
                                            }
                                        }
                                    }
                                }
                                setTimeout(function() {r.thread();}, 10);
                            }
                        }
                    }(r);
                    setTimeout(function() {r.thread();}, 10);
                    return r;
                },

                api_call : function (calldata) {
                    var st;
                    var i, k;
                    var boundary;
                    var index, url, params, fileuploads, func;
                    var x = {
                        req: null,
                        func: calldata.func
                    };

                    url = calldata.url;
                    params = calldata.params;
                    if (calldata.fileuploads !== undefined) {
                        fileuploads = calldata.fileuploads;
                    }
                    else {
                        fileuploads = [];
                    }
                    try {
                        x.req = new XMLHttpRequest();
                    } catch (e) {
                        try {
                            x.req = new ActiveXObject("Msxml2.XMLHTTP");
                        } catch (e) {
                            try {
                                x.req = new ActiveXObject("Microsoft.XMLHTTP");
                            } catch (oc) {
                                alert("No AJAX Support");
                                return;
                            }
                        }
                    }

                    x.req.onreadystatechange = function (x) {
                        return function () {
                            if (x.req.readyState == 4) {
                                if (x.req.status == 200) {
                                    x.func(true, x.req.responseText);
                                }
                                else if (x.req.statusText != "") {
                                    x.func(false, "Response Code: " + x.req.status + " / " + x.req.statusText);
                                }
                                else {
                                    x.func(false, "Response Code: " + x.req.status);
                                }
                            }
                        }
                    }(x);

                    if ((params.length > 0) || (fileuploads.length > 0)) {
                        x.req.open("POST", url, true);
                        i = ((new Date()).getTime());
                        boundary = i + EncodingClass.md5.encode(i);
                        x.req.setRequestHeader("Content-type", "multipart/form-data; boundary=" + boundary);
                        st = "";
                        for (i = 0; i < params.length; i++) {
                            st += "--" + boundary + "\r\n";
                            st += "Content-Disposition: form-data; ";
                            st += "name=\"" + EncodingClass.utf8.encode(params[i].name) + "\"\r\n\r\n";
                            st += EncodingClass.utf8.encode(params[i].value) + "\r\n";
                        }
                        for (i = 0; i < fileuploads.length; i++) {
                            st += "--" + boundary + "\r\n";
                            st += "Content-Disposition: form-data; ";
                            st += "name=\"" + EncodingClass.utf8.encode(fileuploads[i].name) + "\"; filename=\"" + EncodingClass.utf8.encode(fileuploads[i].filename) + "\"\r\n\r\n";
                            st += fileuploads[i].content + "\r\n";
                        }
                        st += "--" + boundary + "--\r\n";
                        var nBytes = st.length, ui8Data = new Uint8Array(nBytes);
                        for (var nIdx = 0; nIdx < nBytes; nIdx++) {
                            ui8Data[nIdx] = st.charCodeAt(nIdx) & 0xff;
                        }
                        x.req.send(ui8Data);
                    }
                    else {
                        x.req.open("GET", url, true);
                        x.req.send(null);
                    }
                },

                saveAsText: function (filename, textcontent) {
                    var st = EncodingClass.utf8.encode(textcontent);
                    var nBytes = st.length;
                    var x = new ArrayBuffer(nBytes);
                    var ui8Data = new Uint8Array(x);
                    for (var nIdx = 0; nIdx < nBytes; nIdx++) {
                        ui8Data[nIdx] = st.charCodeAt(nIdx) & 0xff;
                    }
                    return FormClass.saveAsRaw(filename, [new DataView(x)]);
                },

                saveAs: function (filename, content) {
                    var nBytes = content.length;
                    var x = new ArrayBuffer(nBytes);
                    var ui8Data = new Uint8Array(x);
                    for (var nIdx = 0; nIdx < nBytes; nIdx++) {
                        ui8Data[nIdx] = content[nIdx] & 0xff;
                    }
                    return FormClass.saveAsRaw(filename, [new DataView(x)]);
                },

                saveAsRaw: function (filename, content) {
                    var xurl = window.URL || window.webkitURL;
                    if (xurl == null) return false;
                    var blob = new Blob(content, {type: 'application/octet-binary'});
                    if (blob == null) return false;
                    var element = document.createElement('a');
                    if (element == null) return false;
                    element.setAttribute('href', xurl.createObjectURL(blob));
                    element.setAttribute('download', filename);
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                    return true;
                },

                readFile: function (filehandle, callbackFunc) {
                    var f = new FileReader();
                    f.onload = function (callbackFunc, filehandle) {
                        return function (e) {
                            callbackFunc([{
                                name: filehandle.name,
                                type: filehandle.type,
                                size: filehandle.size,
                                lastModified: new Date(filehandle.lastModified),
                                content: e.target.result
                            }]);
                        };
                    } (callbackFunc, filehandle);
                    f.readAsBinaryString(filehandle);
                },

                readFileFromInput: function (inputElement, callbackFunc) {
                    var rv, i, f;
                    if (inputElement.files.length == 0) {
                        callbackFunc([]);
                        return;
                    }
                    if (inputElement.files.length == 1) {
                        FormClass.readFile(inputElement.files[0], callbackFunc);
                    }
                    else {
                        rv = [];
                        for (i = 0; i < inputElement.files.length; i++) {
                            rv.push(undefined);
                        }
                        for (i = 0; i < inputElement.files.length; i++) {
                            FormClass.readFile(inputElement.files[i], function (rv, index, callbackFunc) {
                                return function (retval) {
                                    var i;
                                    rv[index] = retval[0];
                                    for (i = 0; i < rv.length; i++) {
                                        if (rv[i] === undefined) return;
                                    }
                                    callbackFunc(rv);
                                }
                            } (rv, i, callbackFunc));
                        }
                    }
                },

                readSingleFile: function (callbackFunc, accept) {
                    if (accept === undefined) accept = null;
                    var fi = DOMElement.input({
                        attrs: {
                            type: "file",
                            style: {display: "none"},
                            accept: accept
                        }
                    });
                    var x = function (element, callbackFunc) {
                        return function (retval) {
                            DOMElement.bodyElement.removeChild(element);
                            return callbackFunc(retval);
                        }
                    } (fi, callbackFunc);
                    fi.onchange = function (callbackFunc) {
                        return function (event) {
                            FormClass.readFileFromInput(this, callbackFunc);
                        }
                    } (x);
                    DOMElement.bodyElement.appendChild(fi);
                    fi.click();
                },

                readMultipleFiles: function (callbackFunc, accept) {
                    if (accept === undefined) accept = null;
                    var fi = DOMElement.input({
                        attrs: {
                            type: "file",
                            style: {display: "none"},
                            accept: accept,
                            multiple: true
                        }
                    });
                    var x = function (element, callbackFunc) {
                        return function (retval) {
                            DOMElement.bodyElement.removeChild(element);
                            return callbackFunc(retval);
                        }
                    } (fi, callbackFunc);
                    fi.onchange = function (callbackFunc) {
                        return function (event) {
                            FormClass.readFileFromInput(this, callbackFunc);
                        }
                    } (x);
                    DOMElement.bodyElement.appendChild(fi);
                    fi.click();
                }
            };

        </script>
        <?php
        $form_new_script_written = 1;
        return 1;
    }

    public static function packedString($str) {
        $str = $str."";
        $slen = strlen($str);
        $xlen = sprintf("%x", $slen);
        $hlen = substr(sprintf("%x", strlen($xlen)), 0, 1);
        return $hlen.$xlen.$slen;
    }

    public static function dataToString($data) {
        if (is_array($data[$i])) {
            $len = sizeof($data, 0);
            $st = "a".FormClass::packedString($len);
            for ($i = 0; $i < $len; $i++) {
                $st .= FormClass::dataToString($data[$i]);
            }
        }
        else {
            $st = "v".FormClass::packedString($data);
        }
        return $st;
    }

    public static function unpackString($str, &$offset) {
		$xlen = hexdec(substr($str, $offset, 1));
		$offset += 1;
        $hlen = hexdec(substr($str, $offset, $xlen));
        $offset += $xlen;
        $data = substr($str, $offset, $hlen);
        $offset += $hlen;
		return $data;
	}

    public static function stringToData_o ($str, &$offset) {
        $code = substr($str, $offset, 1);
        $offset++;
        if ($code == "v") {
            return FormClass::unpackString($str, $offset);
        }
        if ($code == "a") {
            $len = intval(FormClass::unpackString($str, $offset));
            for ($i = 0; $i < $len; $i++) {
                $data[$i] = FormClass::stringToData_o($str, $offset);
            }
            return $data;
        }
        return null;
    }

    public static function stringToData($str) {
        $offset = 0;
        return FormClass::stringToData_o($str, $offset);
    }

    public static function enterDownloadMode($filename) {
        header("Content-type: text/plain");
        header("Content-Disposition: attachment; filename=".$filename);
    }
};

 ?>
