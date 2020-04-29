<?php
function write_content_script() {
    global $prefix, $prefixhome;
 ?>

<script type="text/javascript">
    var contentModule = {};

    contentModule.questionChange = function (params) {
        var message = params.message, title = params.title, h, func = params.onclick;
        if (message === undefined) message = "Dữ liệu chưa được lưu, bạn có muốn lưu lại trước khi tiếp tục hay không?";
        if (title === undefined) title = "Question";
        if (func === undefined) func = function () {
        };
        var data = [
            [{attrs: {style: {fontSize: "4px", height: "10px"}}}],
            [{
                attrs: {
                    align: "center",
                    style: {
                        border: "0",
                        minWidth: "300px",
                    }
                },
                text: message
            }]
        ];
        data.push([{
                attrs: {
                    style: {
                        border: "0",
                        fontSize: "4px",
                        height: "20px"
                    }
                }
            }],
            [{
                attrs: {
                    align: "center",
                    style: {
                        border: "0"
                    }
                },
                children: [DOMElement.table({
                    attrs: {
                        style: {
                            border: "0"
                        }
                    },
                    data: [[
                        {
                            attrs: {
                                align: "center",
                                style: {
                                    border: "0"
                                }
                            },
                            children: [pizo.button071218.showButton({
                                sym: DOMElement.i({
                                    attrs: {
                                        className: "material-icons"
                                    },
                                    text: "done",
                                }),
                                typebutton: 0,
                                onclick: function (func) {
                                    return function (event, me) {
                                        ModalElement.close();
                                        func(0);
                                    }
                                }(func),
                                text: "Có"
                            })]
                        },
                        {
                            attrs: {style: {width: "20px"}}
                        },
                        {
                            attrs: {
                                align: "center",
                                style: {
                                    border: "0"
                                }
                            },
                            children: [pizo.button071218.showButton({
                                sym: DOMElement.i({
                                    attrs: {
                                        className: "material-icons"
                                    },
                                    text: "clear",
                                }),
                                typebutton: 0,
                                onclick: function (func) {
                                    return function (event, me) {
                                        ModalElement.close();
                                        func(1);
                                    }
                                }(func),
                                text: "Không"
                            })]
                        },
                        {
                            attrs: {style: {width: "20px"}}
                        },
                        {
                            attrs: {
                                align: "center",
                                style: {
                                    border: "0"
                                }
                            },
                            children: [pizo.button071218.showButton({
                                sym: DOMElement.i({
                                    attrs: {
                                        className: "material-icons"
                                    },
                                    text: "clear",
                                }),
                                typebutton: 0,
                                onclick: function (func) {
                                    return function (event, me) {
                                        ModalElement.close();
                                        func(2);
                                    }
                                }(func),
                                text: "Hủy"
                            })]
                        }
                    ]]
                })]
            }]);
        h = DOMElement.table({data: data});
        ModalElement.showWindow({
            title: title,
            bodycontent: h
        });
    };

    contentModule.dateFormat = function(datetime){
        var year, month, date, minute,  hour, st;
        if (datetime == 0) return "";
        year = datetime.getFullYear();
        month = datetime.getMonth() + 1;
        date = datetime.getDate();
        hour = datetime.getHours();
        minute = datetime.getMinutes();
        second = datetime.getSeconds();
        if(month < 10) month = "0" + month;
        if(date < 10) date = "0" + date;
        if(hour < 10) hour = "0" + hour;
        if(minute < 10) minute = "0" + minute;
        st = date + "/" + month + "/" + year + " " + hour + ":" + minute;
        return st;
    }

    contentModule.dateFormat2 = function(datetime){
        var year, month, date, minute,  hour, st;
        if (datetime == 0) return "";
        year = datetime.getFullYear();
        month = datetime.getMonth() + 1;
        date = datetime.getDate();
        hour = datetime.getHours();
        minute = datetime.getMinutes();
        second = datetime.getSeconds();
        if(month < 10) month = "0" + month;
        if(date < 10) date = "0" + date;
        if(hour < 10) hour = "0" + hour;
        if(minute < 10) minute = "0" + minute;
        st = "" + year + month + date + "-" + hour + minute
        return st;
    }

    contentModule.nonAccentVietnamese = function (s) {
        return s.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
            .replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A")
            .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
            .replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E")
            .replace(/ì|í|ị|ỉ|ĩ/g, "i")
            .replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I")
            .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
            .replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O")
            .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
            .replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U")
            .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
            .replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "")
            .replace(/\u02C6|\u0306|\u031B/g, "");
    };

    contentModule.fromDouble = function (number, decpre) {
        var d, f, k, s;
        if (!EncodingClass.type.isNumber(number)) return "-";
        if (isNaN(number)) return "-";
		if (number < 0) return "-" + contentModule.fromDouble(-number, decpre);
        s = number.toFixed(decpre);
        k = s.indexOf(".");
        if (k != -1) {
            f = s.substr(k);
            s = s.substr(0, k);
        }
        else {
            f = "";
        }
        d = "";
        while (s.length > 3) {
            d = "," + s.substr(s.length - 3, 3) + d;
            s = s.substr(0, s.length - 3);
        }
        return s + d + f;
    }

    contentModule.generateRandom = function() {
        var res = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for ( var i = 0; i < 20; i++ ){
            res += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return res;
    };

    contentModule.rotageText = function(height, width, angle){
        var a, b, c, x, y;
        a = Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2)) / 2;
        b = Math.PI  - Math.atan(height / width);
        c = b - angle;
        x = a * Math.cos(c);
        y = a * Math.sin(c);
        return {
            height: x - height / 2,
            width: y - width / 2
        };
    }

    contentModule.getRDText = function(){
        var i, result = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for ( var i = 0; i < 20; i++ ){
            result += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return result;
    }
</script>

<?php } ?>
