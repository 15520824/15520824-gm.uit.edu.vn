<?php
    include_once "jsencoding.php";
/*
php:
        function write_common_script();
        function getAutoIndex();
        function writeAutoIndex();
        function ordutf8($string, &$offset);
        function inputvalue($str);
    	function hextext($value, $count);
        function echo_x($str);
        function moneyFormat($num);
        function vn_uppercase($st);
        function vn_lowercase($st);
        function safeSQL_enc($st);
        function safeSQL_dec($st);
        function quickDecrypt($sx);
        function enterDownloadMode($filename);
        function writeResult($str);
        function xFloatVal($v);
        function xIntVal($v);
javascript:
        string Base64.encode(string str);
        string Base64.decode(string str);
        function textshow(string str);
        string inputvalue(string str);
        string[] getSearchKeywords(string str);
        void printContent(string str, function finished_print());
        void sort(buffer[], startIndex = 0, stopIndex = length - 1, function cmp(a, b) = default_compare_function(a, b));
        [] function removedArrayValue(array[], value)
        [] function removedArrayIndex(array[], index)
        string datetostring(date);
        function isDifferent(value1, value2, tolerance);
        function moneyFormat(num, minF, maxF);
        function num3(num);
        function num0(num);
        function num1(num);
        function num2(num);
        function hex4(num);
        function hex8(num);
        function hex16(num);
        function hex32(num);
        function md5(str);
        function redirect(url);
        function xparseFloat(v);
        function duplicateArray(arrayInput);
        function strlen(str);
        function intpart(st);
        function base64_decode(st);
        function base16_encode(st);
        function utf8EncodedString(sx);
        function decodeUTF8String(sx);
        function quickEncrypt(sx);
        function quickDecrypt(sx);
        function windowSize(); return {width, height};
*/
	$currentAutoIndex = 0;

	function getAutoIndex() {
		global $currentAutoIndex;
		return $currentAutoIndex++;
	}

	function writeAutoIndex() {
		$k = getAutoIndex();
		echo $k;
		return $k;
	}

    $common_body_written = 0;
    $common_script_written = 0;

    function write_common_body() {
        global $common_body_written;
        if ($common_body_written != 0) return 0;
		$common_body_written = 1;
        ?>
        <object ID='WB' WIDTH=0 HEIGHT=0 CLASSID='CLSID:8856F961-340A-11D0-A96B-00C04FD705A2'></object>
        <?php
    }


	function write_common_script() {
		global $common_script_written;
        EncodingClass::write_script();
		if ($common_script_written != 0) return 0;
		$common_script_written = 1;
		?>
        <style>
            .style-reset {
                animation : none;
                animation-delay : 0;
                animation-direction : normal;
                animation-duration : 0;
                animation-fill-mode : none;
                animation-iteration-count : 1;
                animation-name : none;
                animation-play-state : running;
                animation-timing-function : ease;
                backface-visibility : visible;
                background : 0;
                background-attachment : scroll;
                background-clip : border-box;
                background-color : transparent;
                background-image : none;
                background-origin : padding-box;
                background-position : 0 0;
                background-position-x : 0;
                background-position-y : 0;
                background-repeat : repeat;
                background-size : auto auto;
                border : 0;
                border-style : none;
                border-width : medium;
                border-color : inherit;
                border-bottom : 0;
                border-bottom-color : inherit;
                border-bottom-left-radius : 0;
                border-bottom-right-radius : 0;
                border-bottom-style : none;
                border-bottom-width : medium;
                border-collapse : separate;
                border-image : none;
                border-left : 0;
                border-left-color : inherit;
                border-left-style : none;
                border-left-width : medium;
                border-radius : 0;
                border-right : 0;
                border-right-color : inherit;
                border-right-style : none;
                border-right-width : medium;
                border-spacing : 0;
                border-top : 0;
                border-top-color : inherit;
                border-top-left-radius : 0;
                border-top-right-radius : 0;
                border-top-style : none;
                border-top-width : medium;
                bottom : auto;
                box-shadow : none;
                box-sizing : content-box;
                caption-side : top;
                clear : none;
                clip : auto;
                color : inherit;
                columns : auto;
                column-count : auto;
                column-fill : balance;
                column-gap : normal;
                column-rule : medium none currentColor;
                column-rule-color : currentColor;
                column-rule-style : none;
                column-rule-width : none;
                column-span : 1;
                column-width : auto;
                content : normal;
                counter-increment : none;
                counter-reset : none;
                cursor : auto;
                direction : ltr;
                display : inline;
                empty-cells : show;
                float : none;
                font : normal;
                font-family : inherit;
                font-size : medium;
                font-style : normal;
                font-variant : normal;
                font-weight : normal;
                height : auto;
                hyphens : none;
                left : auto;
                letter-spacing : normal;
                line-height : normal;
                list-style : none;
                list-style-image : none;
                list-style-position : outside;
                list-style-type : disc;
                margin : 0;
                margin-bottom : 0;
                margin-left : 0;
                margin-right : 0;
                margin-top : 0;
                max-height : none;
                max-width : none;
                min-height : 0;
                min-width : 0;
                opacity : 1;
                orphans : 0;
                outline : 0;
                outline-color : invert;
                outline-style : none;
                outline-width : medium;
                overflow : visible;
                overflow-x : visible;
                overflow-y : visible;
                padding : 0;
                padding-bottom : 0;
                padding-left : 0;
                padding-right : 0;
                padding-top : 0;
                page-break-after : auto;
                page-break-before : auto;
                page-break-inside : auto;
                perspective : none;
                perspective-origin : 50% 50%;
                position : static;
                /* May need to alter quotes for different locales (e.g fr) */
                quotes : '\201C' '\201D' '\2018' '\2019';
                right : auto;
                tab-size : 8;
                table-layout : auto;
                text-align : inherit;
                text-align-last : auto;
                text-decoration : none;
                text-decoration-color : inherit;
                text-decoration-line : none;
                text-decoration-style : solid;
                text-indent : 0;
                text-shadow : none;
                text-transform : none;
                top : auto;
                transform : none;
                transform-style : flat;
                transition : none;
                transition-delay : 0s;
                transition-duration : 0s;
                transition-property : none;
                transition-timing-function : ease;
                unicode-bidi : normal;
                vertical-align : baseline;
                visibility : visible;
                white-space : normal;
                widows : 0;
                width : auto;
                word-spacing : normal;
                z-index : auto;
            }
			.tableclass {
			}
			.tableclass	table {
					border-top: 1px solid #ddd;
                    border-left: 1px solid #ddd;
                    border-spacing: 0;
                    border-collapse: collapse;
				}

			.tableclass td {
					border-right: 1px solid #ddd;
					border-bottom: 1px solid #ddd;
                    padding-top: 5px;
                    padding-bottom: 5px;
                    padding-left: 15px;
                    padding-right: 15px;
				}

            .tableclass th {
					border-right: 1px solid #ddd;
					border-bottom: 1px solid #ddd;
                    padding-top: 5px;
                    padding-bottom: 5px;
                    padding-left: 15px;
                    padding-right: 15px;
                    background-color: #61BC45;
                    color: white;
				}

			.tableclass	tr:hover {
				background-color: #BFBFBF;
			}

            .simpletableclass {

            }

			.simpletableclass	table {
				border-top: 1px solid #ddd;
                border-left: 1px solid #ddd;
                border-spacing: 0;
                border-collapse: collapse;
            }

            .simpletableclass th {
				border-right: 1px solid #ddd;
				border-bottom: 1px solid #ddd;
                padding-top: 5px;
                padding-bottom: 5px;
                padding-left: 15px;
                padding-right: 15px;
                background-color: #61BC45;
                color: white;
				}

			.simpletableclass td {
				border-right: 1px solid #ddd;
				border-bottom: 1px solid #ddd;
                padding-top: 5px;
                padding-bottom: 5px;
                padding-left: 15px;
                padding-right: 15px;
			}

            .simpletableclass-nopadding {

            }

			.simpletableclass-nopadding	table {
				border-top: 1px solid #ddd;
                border-left: 1px solid #ddd;
                border-spacing: 0;
                border-collapse: collapse;
            }

            .simpletableclass-nopadding th {
				border-right: 1px solid #ddd;
				border-bottom: 1px solid #ddd;
                background-color: #61BC45;
                color: white;
			}

			.simpletableclass-nopadding td {
				border-right: 1px solid #ddd;
				border-bottom: 1px solid #ddd;
			}

            .tooltip {
                position: relative;
                display: inline-block;
            }

            .tooltip .tooltiptext {
                visibility: hidden;
                background-color: #eee;
                border-radius: 6px;
                padding: 5px 0;
                position: absolute;
                z-index: 1;
                top: 100%;
                left: 50%;
                margin-left: -50%; /* Use half of the width (120/2 = 60), to center the tooltip */
                opacity: 0;
                transition: opacity 1s;

            }

            .tooltip:hover .tooltiptext {
                visibility: visible;
                opacity: 1;
            }
        </style>
        <script language='VBScript'>
        Sub Print()
               OLECMDID_PRINT = 6
               OLECMDEXECOPT_DONTPROMPTUSER = 2
               OLECMDEXECOPT_PROMPTUSER = 1
               call WB.ExecWB(OLECMDID_PRINT, OLECMDEXECOPT_DONTPROMPTUSER,1)
        End Sub
        </script>
		<script type="text/javascript">
        'use strict';
		var Base64 = {
            encode: function(e) {
                return EncodingClass.base64.encode(EncodingClass.utf8.encode(e));
            },
            decode: function(e) {
                return EncodingClass.utf8.decode(EncodingClass.base64.decode(e));
            },
        }
        var IsFileReaderSupported = (window.FormData !== undefined);
        function base16_encode(st) {
            var keyStr = "0123456789abcdef";
            var i, x, sx, v, t1, t2;
            sx = "";
            x = st.length;
            for (i = 0; i < x; i++) {
                v = st.charCodeAt(i) & 255;
                t1 = v >> 4;
                t2 = v & 15;
                sx += keyStr.substr(t1, 1) + keyStr.substr(t2, 1);
            }
            return sx;
        }

        function base64_encode(st) {
            return EncodingClass.base64.encode(st);
        }

        function base64_decode(st) {
            return EncodingClass.base64.decode(st);
        }

		function inputvalue(str) {
            return EncodingClass.inputvalue(str);
    	}

        function textshow(str) {
            return EncodingClass.textshow(str);
        }

        function xparseFloat(v) {
            v = "" + v;
            if (v.trim() == "") return 0;
            v = parseFloat(v);
            if (v == NaN) return 0;
            return v;
        }

        var finished_print_func;

        function printContent(st, finished_print) {
           var frame1 = document.createElement('iframe');
           frame1.name = "asdfgframe1";
           frame1.style.position = "absolute";
           frame1.style.top = "-1000000px";
           document.body.appendChild(frame1);
           var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
           frameDoc.document.open();
           frameDoc.document.write('<html><head><title></title>');
           frameDoc.document.write('</head><body>');
           frameDoc.document.write(st);
           frameDoc.document.write('</body></html>');
           frameDoc.document.close();
           if (finished_print === undefined) {
               setTimeout(function () {
                  window.frames["asdfgframe1"].focus();
                  window.frames["asdfgframe1"].print();
                  document.body.removeChild(frame1);
              }, 500);
           }
           else {
               finished_print_func = finished_print;
               setTimeout(function () {
                  window.frames["asdfgframe1"].focus();
                  window.frames["asdfgframe1"].print();
                  document.body.removeChild(frame1);
                  finished_print_func();
              }, 500);
           }
        }

        function default_compare_function(a, b) {
            return (a == b)? 0 : ((a < b)? -1 : 1);
        }

        function sort(buffer, startIndex, stopIndex, cmp) {
            var l, r, m, t, k1, k2;
            if (startIndex === undefined) {
                cmp = default_compare_function;
                startIndex = 0;
                stopIndex = buffer.length - 1;
            }
            if (stopIndex === undefined) {
                cmp = startIndex;
                startIndex = 0;
                stopIndex = buffer.length - 1;
            }
            if (cmp == undefined) {
                cmp = stopIndex;
                stopIndex = buffer.length - 1 - startIndex;
            }
            if (startIndex >= stopIndex) return;
            l = startIndex;
            r = stopIndex;
            m = buffer[(l + r) >> 1];
            while (l <= r) {
                while (1) {
                        if (l > stopIndex) {
                            k1 = 0;
                            break;
                        }
                        if ((k1=cmp(buffer[l], m)) < 0) l++; else break;
                }
                while (1) {
                    if (r < startIndex) {
                        k2 = 0;
                        break;
                    }
                    if ((k2=cmp(buffer[r], m)) > 0) r--; else break;
                }
                if ((k1 == 0) && (k2 == 0)) {
                    l++;
                    r--;
                }
                else if (l < r) {
                    t = buffer[l];
                    buffer[l] = buffer[r];
                    buffer[r] = t;
                }
            }
            sort(buffer, startIndex, r, cmp);
            sort(buffer, l, stopIndex, cmp);
        }

        function moneyFormat2(num, minF, maxF) {
            var s = moneyFormat(num, minF, maxF);
            s = s.replace(",", "#a#").replace(".", "#b#");
            s = s.replace("#a#", systemconfig.separateSign).replace("#b#", systemconfig.commaSign);
            return s;
        }

        function getValueFromMoneyFormat(value) {
            var s = value.split(systemconfig.separateSign).join("").split(systemconfig.commaSign).join(".");
            return parseFloat(s);
        }

        function moneyFormat(num, minF, maxF) {
            var i, k, x;
            var st = "";
            if (minF === undefined) {
                minF = 0;
                maxF = -1;
            }
            if (maxF === undefined) {
                maxF = -1;
            }
            num = parseFloat(num);
            if (num < 0) return "-" + moneyFormat(-num, minF, maxF);
            if (maxF != -1) {
                x = 0.01;
                k = maxF;
                for (i = 0; i <= k; i++) {
                    x /= 10;
                }
            }
            else {
                x = 0;
            }
            num = "" + (num + x);
            if (num.length == 0) {
                if (minF > 0) {
                    st = ".";
                    for (i = 0; i < minF; i++) st += "0";
                }
                return "0" + st;
            }
            if (num.substr(0, 1) == ".") num = "0" + num;
            k = num.indexOf(".");
            if (k != -1) {
                x = num.substr(0, k);
                num = num.substr(k+1);
                for (k = x.length; k > 3; k -= 3) {
                    if (st != "") {
                        st = x.substr(k - 3) + "," + st;
                    }
                    else {
                        st = x.substr(k - 3);
                    }
                    x = x.substr(0, k - 3);
                }
                if (st != "") {
                    st = x + "," + st;
                }
                else {
                    st = x;
                }
                k = strlen(num);
                if ((maxF != -1) && (maxF < k)) k = maxF;
                if (k > 0) {
                    st += ".";
                    for (i = 0; i < k; i++) st += num.substr(i, 1);
                }
                return st;
            }

            for (k = num.length; k > 3; k -= 3) {
                st = num.substr(k - 3) + "," + st;
                num = num.substr(0, k - 3);
            }
            st = num + "," + st;
            return st.substr(0, st.length - 1);
        }

        function num3(num) {
            var i, j, xnum, t, st;
            if (num < 0) return "-" + num3(-num);
            xnum = ~~num;
            t = (num - xnum)*10000;
            t = ~~t;
            if (t % 10 >= 5) {
                while (t % 10 != 0) t++;
                if (t == 10000) {
                    xnum++;
                    t = 0;
                }
            }
            else {
                while (t % 10 != 0) t--;
            }
            t /= 10;
            st = moneyFormat(xnum) + ".";
            for (i = 0; i < 3; i++) {
                st += ~~(t / 100);
                t = (t % 100) * 10;
            }
            return st;
        }

        function num2(num) {
            var i, j, xnum, t, st;
            if (num < 0) return "-" + num3(-num);
            xnum = ~~num;
            t = (num - xnum)*10000;
            t = ~~t;
            if (t % 10 >= 5) {
                while (t % 10 != 0) t++;
                if (t == 10000) {
                    xnum++;
                    t = 0;
                }
            }
            else {
                while (t % 10 != 0) t--;
            }
            t /= 10;
            st = moneyFormat(xnum) + ".";
            for (i = 0; i < 2; i++) {
                st += ~~(t / 100);
                t = (t % 100) * 10;
            }
            return st;
        }

        function num1(num) {
            var i, j, xnum, t, st;
            if (num < 0) return "-" + num1(-num);
            xnum = ~~num;
            t = (num - xnum)*10000;
            t = ~~t;
            if (t % 10 >= 5) {
                while (t % 10 != 0) t++;
                if (t == 10000) {
                    xnum++;
                    t = 0;
                }
            }
            else {
                while (t % 10 != 0) t--;
            }
            t /= 10;
            st = moneyFormat(xnum) + ".";
            for (i = 0; i < 1; i++) {
                st += ~~(t / 100);
                t = (t % 100) * 10;
            }
            return st;
        }

        function num0(num) {
            var i, j, xnum, t;
            if (num < 0) {
                t = num0(-num);
                if (t != "0") return "-" + t;
                return "0";
            }
            xnum = ~~num;
            t = (num - xnum)*10;
            t = ~~t;
            if (t >= 5) xnum++;
            return moneyFormat(xnum);
        }

        function hex4(num) {
            num = (~~num) % 16;
            if (num == 0) return "0";
            if (num == 1) return "1";
            if (num == 2) return "2";
            if (num == 3) return "3";
            if (num == 4) return "4";
            if (num == 5) return "5";
            if (num == 6) return "6";
            if (num == 7) return "7";
            if (num == 8) return "8";
            if (num == 9) return "9";
            if (num == 10) return "A";
            if (num == 11) return "B";
            if (num == 12) return "C";
            if (num == 13) return "D";
            if (num == 14) return "E";
            if (num == 15) return "F";
            return "";
        }

        function hex8(num) {
            var m;
            num = (~~num) % 256;
            m = num % 16;
            return hex4((num - m) / 16) + hex4(m);
        }

        function hex16(num) {
            var m;
            num = (~~num) % 65536;
            m = num % 256;
            return hex8((num - m) / 256) + hex8(m);
        }

        function hex32(num) {
            var i, m, s;
            s = "";
            for (i = 0; i < 4; i++) {
                num = ~~num;
                m = num % 256;
                s = hex8(m) + s;
                num = (num - m) / 256;
            }
            return s;
        }

        function md5 (str) {
            return EncodingClass.md5.encode(str);
        }

        function findPos(obj) {
            var curtop = 0;
            if (obj.offsetParent) {
                do {
                    curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
            return [curtop];
            }
        }
        function getSearchKeywords(str) {
            var i, j, k, h, z;
            var wordlist = [];
            var owordlist = [];
            var st;
            var xst;
            var value = str.trim();
            while (true) {
                i = value.indexOf('"');
                if (i >= 0) {
                    k = value.substr(i+1).indexOf('"');
                    if (k >= 0) {
                        st = value.substr(i+1).substr(0, k).trim();
                        if (st.length > 0) {
                            z = 1;
                            xst = st.toLowerCase();
                            for (j = 0; j < wordlist.length; j++)
                                if (wordlist[j] == xst) {
                                    z = 0;
                                    break;
                                }
                            if (z) {
                                wordlist.push(xst);
                                owordlist.push(st);
                            }
                        }
                        value = value.substr(0, i-1) + value.substr(i+k+2);
                    }
                    else {
                        value = value.substr(0, i-1) + " " + value.substr(i + 1);
                        break;
                    }
                }
                else
                    break;
            }
            while (true) {
                i = value.indexOf(" ");
                if (i >= 0) {
                    st = value.substr(0, i).trim();
                    value = value.substr(i).trim();
                    if (st.length > 0) {
                        z = 1;
                        xst = st.toLowerCase();
                        for (j = 0; j < wordlist.length; j++)
                            if (wordlist[j] == xst) {
                                z = 0;
                                break;
                            }
                        if (z) {
                            wordlist.push(xst);
                            owordlist.push(st);
                        }
                    }
                }
                else
                    break;
            }
            if (value.length > 0) {
                st = value;
                z = 1;
                xst = st.toLowerCase();
                for (j = 0; j < wordlist.length; j++)
                    if (wordlist[j] == xst) {
                        z = 0;
                        break;
                    }
                if (z) {
                    wordlist.push(xst);
                    owordlist.push(st);
                }
            }
            return owordlist;
        }


        function redirect(url) {
            //window.location = url;
            window.location.assign(url);
        }

        function duplicateArray(arrayInput) {
            return arrayInput.slice(0);
        }

        function strlen(str) {
            return str.length;
        }

        function intpart(st) {
            var i, k, v, x;
            st = (st + " ").trim();
            if (st.substr(0, 1) == "-") {
                return -intpart(st.substr(1));
            }
            k = strlen(st);
            for (i = v = 0; i < k; i++) {
                x = st.substr(i, 1);
                switch (x) {
                    case "0":
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                    case "5":
                    case "6":
                    case "7":
                    case "8":
                    case "9":
                        x = parseInt(x, 10);
                        v = v * 10 + x;
                        break;
                    default:
                        k = 0;
                        break;
                }
            }
            return v;
        }

        function strcmp ( str1, str2 ) {
            return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
        }
        function stricmp ( str1, str2 ) {
            var a1, a2, l1, l2;
            l1 = strlen(str1);
            l2 = strlen(str2);
            if ((l1 == 0) && (l2 == 0)) return 0;
            if (l1 == 0) return -1;
            if (l2 == 0) return 1;
            a1 = str1;
            a2 = str2;
            return strcmp(a1.toUpperCase(), a2.toUpperCase());
        }

        function getTickCount() {
            return (new Date()).getTime();
        }

        function utf8EncodedString(sx) {
            return EncodingClass.utf8.encode(sx);
        }

        function decodeUTF8String(sx) {
            return EncodingClass.utf8.decode(sx);
        }

        function quickEncrypt(sx) {
            return EncodingClass.quickEncrypt(sx);
        }

        function quickDecrypt(sx) {
            return EncodingClass.quickDecrypt(sx);
        }

        function windowSize() {
            var w = 0, h = 0;
                //IE
            if (!window.innerWidth) {
                if(!(document.documentElement.clientWidth == 0)) {
                    //strict mode
                    w = document.documentElement.clientWidth;
                    h = document.documentElement.clientHeight;
                }
                else {
                    //quirks mode
                    w = document.body.clientWidth;
                    h = document.body.clientHeight;
                }
            }
            else {
                //w3c
                w = window.innerWidth;
                h = window.innerHeight;
            }
            return {width:w,height:h};
        }

        function removedArrayValue(array, value) {
            var i, x;
            x = [];
            for (i = 0; i < array.length; i++) {
                if (array[i] != value) x.push(array[i]);
            }
            return x;
        }

        function removedArrayIndex(array, index) {
            var i, x;
            x = [];
            for (i = 0; i < array.length; i++) {
                if (i != index) x.push(array[i]);
            }
            return x;
        }

        function datetostring(d) {
            var s;
            s = "" + (d.getMonth()+1);
            if (s.length < 2) s = "0" + s;
            s = d.getDate() + "/" + s;
            if (s.length < 5) s = "0" + s;
            return s + "/" + d.getFullYear();
        }

        function makeOptions(value, selected, label) {
            var st = "<option value=\"" + value + "\"";
            if (selected == value) st += " selected";
            return st + ">" + inputvalue(label) + "</option>";
        }

        function printf(st, values) {
            var sx, sc, i, j, k;
            sx = "";
            k = st.length;
            for (i = 0; i < k; i++) {
                sc = st.substr(i, 1);
                if (sc == "\\") {
                    sx += st.substr(++i, 1);
                }
                else if (sc == "%") {
                    j = 0;
                    while (true) {
                        if ((i+1) == k) break;
                        sc = st.charCodeAt(i+1);
                        if ((48 <= sc) && (sc <= 57)) {
                            j = j * 10 + sc - 48;
                            i++;
                        }
                        else {
                            break;
                        }
                    }
                    sx += "" + values[j];
                }
                else
                    sx += sc;
            }
            return sx;
        }

        function isDifferent(value1, value2, tolerance) {
            var x;
            if (value1 < value2) {
                x = value2 - value1;
            }
            else {
                x = value1 - value2;
            }
            if (tolerance === undefined) {
                tolerance = 0.001;
            }
            if (tolerance < 0) tolerance = -tolerance;
            if (x < tolerance) return false;
            return true;
        }

        function setComboboxIndexByValue(element, value) {
            DOMClass.comboboxSetValue(element, value);
        }
        </script>
	<?php
	}

    function echo_x($str) {
        EncodingClass::echo_x($str);
    }

    function moneyFormat($num) {
        $st = "";
        $num = "".$num;
        if (strlen($num) == 0) return "0";
        if ($num[0] == '-') return "-".moneyFormat(substr($num, 1));
        if ($num[0] == '.') return moneyFormat(substr($num, 1));
        $k = strpos($num, ".");
        if ($k != false) return moneyFormat(substr($num, 0, k-1)).substr($num, k);
        for ($k = strlen($num); $k > 3; $k -= 3) {
            $st = substr($num, $k - 3).",".$st;
            $num = substr($num, 0, $k - 3);
        }
        $st = $num.",".$st;
        return substr($st, 0, strlen($st) - 1);
    }

	function ordutf8($string, &$offset) {
        return EncodingClass::ordutf8($str, $offset);
	}

	function inputvalue($str) {
        return EncodingClass::inputvalue($str);
	}

	function hextext($value, $count) {
		if ($value < 0) return "-".hextext(-$value, $count);
		if (($value < 16) && ($value >= 0) && ($count == 1)) {
			switch ($value) {
				case 0:
					return "0";
				case 1:
					return "1";
				case 2:
					return "2";
				case 3:
					return "3";
				case 4:
					return "4";
				case 5:
					return "5";
				case 6:
					return "6";
				case 7:
					return "7";
				case 8:
					return "8";
				case 9:
					return "9";
				case 10:
					return "A";
				case 11:
					return "B";
				case 12:
					return "C";
				case 13:
					return "D";
				case 14:
					return "E";
				case 15:
					return "F";
			}
		}
		$m = $value & 0xf;
		$value = ($value - $m) / 16;
        if ($count == 1) return hextext($m, 1);
        if ($count <= 0) {
            if ($value == 0) return hextext($m, 1);
            return hextext($value, 0).hextext($m, 1);
        }
        else {
            $s = hextext($m, 1);
            for ($i = 0; $i < $count; $i++) {
                $m = $value & 0xf;
        		$value = ($value - $m) / 16;
                $s = hextext($m, 1).$s;
            }
            return $s;
        }
	}

    function safe_utf8($st) {
        $l = strlen($st);
        for ($i = 0; $i < $l; ) {
            $k = ord($st[$i]);
            if ($k < 194) {
                $i++;
            }
            else if ($k < 224) {
                if ($i + 1 < $l) {
                    $i += 2;
                }
                else {
                    return substr($st, 0, $i);
                }
            }
            else if ($k < 240) {
                if ($i + 2 < $l) {
                    $i += 3;
                }
                else {
                    return substr($st, 0, $i);
                }
            }
            else {
                if ($i + 3 < $l) {
                    $i += 4;
                }
                else {
                    return substr($st, 0, $i);
                }
            }
        }
        return $st;
    }

	function safeSQL_enc($st) {
		$sx = "";
        $st = safe_utf8($st);
		$k = strlen($st);
		for ($i = 0; $i < $k; $i++) {
			$x = substr($st, $i, 1);
			$h = ord($x);
			switch ($h) {
				case 39:	// "'"
				case 34:	// """"
				case 61:	//  '='
					$sx .= "=";
					$sx .= hextext($h + 256, 2);
					break;
				default:
					$sx .= $x;
					break;
			}
		}
		return $sx;
	}

	function safeSQL_dec($st) {
		$sx = "";
		$k = strlen($st);
		for ($i = 0; $i < $k; $i++) {
			$x = substr($st, $i, 1);
			if ($x == '=') {
				$h = intval("0x".substr($st, $i+1, 2), 0);
				$i += 2;
				$sx .= chr($h);
			}
			else {
				$sx .= $x;
			}
		}
		return safe_utf8($sx);
	}

    function vn_uppercase($st) {
        return  mb_strtoupper($st, "UTF-8");
    }

    function vn_lowercase($st) {
        return  mb_strtolower($st, "UTF-8");
    }

    function stricmp($s1, $s2) {
        return strcasecmp($s1, $s2);
    }

    function quickDecrypt($sx) {
        $k = strlen($sx);
        $st = "";
        for ($i = 0; $i < $k; $i++) {
            $x = ord($sx[$i++]) - 65;
            $y = ord($sx[$i]) - 65;
            $st .= chr(($y << 4) + $x);
        }
        return $st;
    }

    function enterDownloadMode($filename) {
        header("Content-type: text/plain");
        header("Content-Disposition: attachment; filename=".$filename);
    }

    function get_client_ip_address() {
        foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key){
            if (array_key_exists($key, $_SERVER) === true){
                foreach (explode(',', $_SERVER[$key]) as $ip){
                    $ip = trim($ip); // just to be safe

                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false){
                        return $ip;
                    }
                }
            }
        }
        return "";
    }

    function writeResult($str) {
        $str = $str."";
        $slen = strlen($str);
        $xlen = hextext($slen, 0);
        $hlen = hextext(strlen($xlen.""), 1);
        echo $hlen.$xlen;
        if ($slen < 200) echo $str; else echo_x($str);
    }

    function xFloatVal($v) {
        $x = trim($v."");
        if ($x == "") return 0;
        return floatval($x);
    }

    function xIntVal($v) {
        $x = trim($v."");
        if ($x == "") return 0;
        return intval($x);
    }
?>
