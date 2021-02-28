import R from '../R';
import Fcore from '../dom/Fcore';
import '../../css/FormatFunction.css';

var _ = Fcore._;
var $ = Fcore.$;

export function formatDate(date, isMinutes = false, isHours = false, isDay = true, isMonth = true, isYear = false) {
    if (typeof date == "object")
        var d = date;
    else
        var d = new Date(date); //time zone value from database
    //get the timezone offset from local time in minutes
    var tzDifference = -d.getTimezoneOffset();
    //convert the offset to milliseconds, add to targetTime, and make a new Date
    d = new Date(d.getTime() + tzDifference * 60 * 1000);

    var resultTime = [];
    var resultDayMonth = [];

    if (isHours) {
        var hour = '' + d.getHours();
        if (hour.length < 2)
            hour = '0' + hour;
        resultTime.push(hour);
    }
    if (isMinutes) {
        var minute = '' + d.getMinutes();
        if (minute.length < 2)
            minute = '0' + minute;
        resultTime.push(minute);

        var second = '' + d.getSeconds();
        if (second.length < 2)
            second = '0' + second;
        resultTime.push(second);
    }

    if (isDay) {
        var day = '' + d.getDate();
        if (day.length < 2)
            day = '0' + day;
        resultDayMonth.push(day);
    }
    if (isMonth) {
        var month = '' + (d.getMonth() + 1);
        if (month.length < 2)
            month = '0' + month;
        resultDayMonth.push(month);
    }

    if (isYear)
        resultDayMonth.push('' + d.getFullYear());

    return resultTime.join(':') + " " + resultDayMonth.join('/');
}

export function setAction(data) {
    var result = [];
    var isResult = false;
    if (data.properties !== undefined) {
        for (var i = 0; i < data.properties.length; i++) {
            result.push(setAction(data.properties[i]));
        }
        if (eval(result.join("&&"))) {
            data["action"] = 'const';
            isResult = true;
        }
    }
    if (data.items !== undefined) {
        if (getRealLength(data.items) <= 1) {
            data["action"] = 'const';
            return true;
        }
    } else {
        if (result == "")
            return true;
        else
        if (isResult) {
            return true;
        }
    }
    return false;
}

export function checkValueElement(element) {
    var input = element.getElementsByTagName("input");
    var textarea = element.getElementsByTagName("textarea");
    var selectmenu = element.getElementsByClassName("absol-selectmenu");
    var result = [];
    for (var i = 0; i < input.length; i++) {
        result.push(input[i].value);
    }
    for (var i = 0; i < textarea.length; i++) {
        result.push(textarea[i].value);
    }
    for (var i = 0; i < selectmenu.length; i++) {
        result.push(selectmenu[i].value);
    }
    return result;
}

export function checkManyArray(arrAll, arrChild) {
    for (var i = 0; i < arrAll.length; i++) {
        if (check2Array(arrAll[i], arrChild))
            return true;
    }
    return false;
}

export function check2Array(arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i])
            return false;
    }
    return true;
}

export function getRealLength(arr) {
    var check = [];
    var count = 0;
    var checkElement = [];
    for (var i = 0; i < arr.length; i++) {
        if (typeof arr[i] === 'object') {
            var item = arr[i];
            if (checkElement[item.element.innerHTML] !== undefined && checkManyArray(checkElement[item.element.innerHTML], checkValueElement(item.element))) {
                arr.splice(i, 1);
                i--;
                continue;
            }
            if (checkElement[item.element.innerHTML]) {
                checkElement[item.element.innerHTML][++checkElement[item.element.innerHTML].index] = checkValueElement(item.element);
            } else {
                checkElement[item.element.innerHTML] = [];
                checkElement[item.element.innerHTML].index = 0;
                checkElement[item.element.innerHTML][checkElement[item.element.innerHTML].index] = checkValueElement(item.element);
            }
        } else {
            if (check[arr[i]] !== undefined) {
                arr.splice(i, 1);
                i--;
                continue;
            }
            check[arr[i]] = 1;
        }
        count++;
    }
    return count;
}

export function generalOperator(data, WHERE) {
    var stringResult = operator(data, WHERE);
    if (stringResult == "()")
        return true;
    return eval(stringResult);
}

export function operator(data, WHERE) {
    var stringResult = "(";
    for (var i = 0; i < WHERE.length; i++) {
        stringResult += equal(data, WHERE[i]);
    }
    return stringResult + ")";
}

export function equal(data, WHERE) {
    var stringResult = "";
    if (typeof WHERE === "string") {
        return WHERE;
    } else
    if (typeof WHERE === "object") {
        if (Array.isArray(WHERE)) {
            stringResult += operator(data, WHERE);
        } else {
            for (var param in WHERE) {
                if (WHERE[param] !== null) {
                    if (typeof WHERE[param] === "object") {
                        var tempTime = WHERE[param].value;
                        var tempTime1 = data[param];
                        if (typeof WHERE[param].value.getMonth === 'function') {
                            tempTime = WHERE[param].value.getTime();
                            tempTime1 = new Date(data[param]);
                            tempTime1 = tempTime1.getTime();
                        }
                        if (typeof data[param].getMonth === 'function') {
                            tempTime = data[param].getTime();
                            tempTime1 = new Date(WHERE[param].value);
                            tempTime1 = tempTime1.getTime();
                        }
                        if (typeof tempTime == "string" && !isNaN(Date.parse(tempTime))) {
                            tempTime = new Date(tempTime);
                            tempTime = tempTime.getTime();
                        }
                        if (typeof tempTime1 == "string" && !isNaN(Date.parse(tempTime1))) {
                            tempTime1 = new Date(tempTime1);
                            tempTime1 = tempTime1.getTime();
                        }
                        if (eval(tempTime1 + WHERE[param].operator + tempTime))
                            stringResult += true;
                        else
                            stringResult += false;
                    } else {
                        var tempTime = WHERE[param];
                        var tempTime1 = data[param];
                        if (typeof WHERE[param] === 'object' && typeof WHERE[param].getMonth === 'function') {
                            tempTime = WHERE[param].getTime();
                            tempTime1 = new Date(data[param]);
                            tempTime1 = tempTime1.getTime();
                        }
                        if (data[param] !== null && typeof data[param] === 'object' && typeof data[param].getMonth === 'function') {
                            tempTime = data[param].getTime();
                            tempTime1 = new Date(WHERE[param]);
                            tempTime1 = tempTime1.getTime();
                        }
                        if (typeof tempTime == "string" && !isNaN(Date.parse(tempTime))) {
                            tempTime = new Date(tempTime);
                            tempTime = tempTime.getTime();
                        }
                        if (typeof tempTime1 == "string" && !isNaN(Date.parse(tempTime1))) {
                            tempTime1 = new Date(tempTime1);
                            tempTime1 = tempTime1.getTime();
                        }
                        if (tempTime1 == tempTime1)
                            stringResult += true;
                        else
                            stringResult += false;
                    }
                } else {
                    stringResult += true;
                }
            }
        }
    }
    return stringResult;
}

export function formatNumber(n) {
    if (n == "")
        return "";
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function reFormatNumber(n) {
    if (n == "")
        return "";
    return parseFloat(n.split(",").join(""));
}

export function formatFit(n) {
    var arr = [];
    var per = 10;
    var check;
    while (n != 0) {
        check = n % per;
        arr.push(check);
        n = n - check;
        per *= 10;
    }
    return arr;
}

export function getGMT(date, timezone = 0, onlyDay = false) {
    if (date == undefined)
        var d = new Date();
    else
        var d = new Date(date);
    //time zone value from database

    var timeZoneFromDB = timezone; //time zone value from database
    //get the timezone offset from local time in minutes
    var tzDifference = timeZoneFromDB * 60 + d.getTimezoneOffset();
    //convert the offset to milliseconds, add to targetTime, and make a new Date
    d = new Date(d.getTime() + tzDifference * 60 * 1000);



    var resultTime = [];
    var resultDayMonth = [];
    if (onlyDay == false) {
        var hour = '' + d.getHours();
        if (hour.length < 2)
            hour = '0' + hour;
        resultTime.push(hour);

        var minute = '' + d.getMinutes();
        if (minute.length < 2)
            minute = '0' + minute;
        resultTime.push(minute);

        var second = '' + d.getSeconds();
        if (second.length < 2)
            second = '0' + second;
        resultTime.push(second);
    }

    resultDayMonth.push('' + d.getFullYear());

    var month = '' + (d.getMonth() + 1);
    if (month.length < 2)
        month = '0' + month;
    resultDayMonth.push(month);

    var day = '' + d.getDate();
    if (day.length < 2)
        day = '0' + day;
    resultDayMonth.push(day);
    if (onlyDay === false)
        return resultDayMonth.join('-') + " " + resultTime.join(':');
    else
        return resultDayMonth.join('-');
}

export function getIDCompair(string) {
    if (string == 0)
        return 0;
    return parseInt(string.slice(string.lastIndexOf("_") + 1));
}

export function getNameCompair(string) {
    if (string == 0)
        return "";
    return string.slice(0, string.lastIndexOf("_"));
}

export function removeAccents(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export function promiseState(promise, callback) {
    // Symbols and RegExps are never content-equal
    var uniqueValue = window['Symbol'] ? Symbol('unique') : /unique/

    function notifyPendingOrResolved(value) {
        if (value === uniqueValue) {
            return callback('pending')
        } else {
            return callback('fulfilled')
        }
    }

    function notifyRejected(reason) {
        return callback('rejected')
    }

    var race = [promise, Promise.resolve(uniqueValue)]
    Promise.race(race).then(notifyPendingOrResolved, notifyRejected)
}

export function consoleArea(areas) {
    var result = []
    var multipolygon = {
        type: "FeatureCollection",
        features: []
    }

    areas.forEach(function(f) {
        if (f._area > (1.1368683772161603e-13)) {
            var vertices = f.vertexlist;
            if (vertices !== undefined) {
                var temp = [];
                for (var i = 0; i < vertices.length; i++) {
                    temp.push([vertices[i].x, vertices[i].y]);
                }
                temp.push([vertices[0].x, vertices[0].y]);
                temp = checkRule(temp);
                multipolygon.features.push({
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: 'Polygon',
                        coordinates: [temp],
                    }
                })
            }
        }
    });
    return result;
}

export function grayscale(src) {
    return new Promise(function(resolve, reject) {
        var image = new Image();
        image.src = src;
        image.style.visibility = "hidden";
        image.style.position = "absolute";
        image.style.top = 0;
        image.onload = function() {
            document.body.appendChild(image);
            var myCanvas = document.createElement("canvas");
            var myCanvasContext = myCanvas.getContext("2d");

            var imgWidth = image.width;
            var imgHeight = image.height;
            // You'll get some string error if you fail to specify the dimensions
            myCanvas.width = imgWidth;
            myCanvas.height = imgHeight;
            //  alert(imgWidth);
            myCanvasContext.drawImage(image, 0, 0);

            // This function cannot be called if the image is not rom the same domain.
            // You'll get security error if you do.
            var imgPixels = myCanvasContext.getImageData(0, 0, imgWidth, imgHeight);
            document.body.removeChild(image);
            // This loop gets every pixels on the image and
            for (var y = 0; y < imgPixels.height; y++) {
                for (var x = 0; x < imgPixels.width; x++) {
                    var i = (y * 4) * imgPixels.width + x * 4;
                    var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                    imgPixels.data[i] = avg;
                    imgPixels.data[i + 1] = avg;
                    imgPixels.data[i + 2] = avg;
                }
            }
            myCanvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
            resolve(myCanvas.toDataURL());
        }
    })
}

function toBase64(arr) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return btoa(
        arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
}

export function consoleWKT(areas) {
    var multipolygon = "MULTIPOLYGON("
    var polygon, isFirst, coordinates, isFirstPolygon = "";
    areas.forEach(function(f) {
        if (f._area > (1.1368683772161603e-13)) {
            var vertices = f.vertexlist;
            if (vertices !== undefined) {
                polygon = "";
                coordinates = ""
                isFirst = "";
                for (var i = 0; i < vertices.length; i++) {
                    coordinates += isFirst + vertices[i].x + " " + vertices[i].y;
                    isFirst = ","
                }
                coordinates += isFirst + vertices[0].x + " " + vertices[0].y;
                coordinates = checkRuleWKT(coordinates);
                polygon += "((" + coordinates + "))";
            }
            multipolygon += isFirstPolygon + polygon;
            isFirstPolygon = ",";
        }
    });
    multipolygon += ")";
    return multipolygon;
}


export function consoleWKTLine(lines) {
    var isFirstLines = "";
    var multilines = "MultiLineString("
    lines.forEach(function(f) {
        multilines += isFirstLines + "(" + f.origin.x + " " + f.origin.y;
        multilines += ", " + f.twin.origin.x + " " + f.twin.origin.y + ")";
        isFirstLines = ","
    });
    multilines += ")";
    if (multilines == "MultiLineString()")
        return -1;
    return multilines;
}

export function checkRule(poly) {
    var sum = 0
    for (var i = 0; i < poly.length - 1; i++) {
        var cur = poly[i],
            next = poly[i + 1]
        sum += (next[0] - cur[0]) * (next[1] + cur[1])
    }
    if (sum > 0)
        return poly.reverse();
    return poly;
}

export function checkRuleWKT(poly) {
    var sum = 0;
    var polygon = poly.split(",");
    for (var i = 0; i < polygon.length - 1; i++) {
        var cur = polygon[i].split(" "),
            next = polygon[i + 1].split(" ");
        sum += (next[0] - cur[0]) * (parseFloat(next[1]) + parseFloat(cur[1]));
    }
    if (sum > 0)
        return polygon.reverse().join();
    return poly;
}

export function loadingWheel() {
    var temp = _({
        tag: "div",
        class: "container-wheel",
        child: [{
            tag: "div",
            class: "lds-roller",
            child: [{
                    tag: "div"
                },
                {
                    tag: "div"
                },
                {
                    tag: "div"
                },
                {
                    tag: "div"
                },
                {
                    tag: "div"
                },
                {
                    tag: "div"
                },
                {
                    tag: "div"
                },
                {
                    tag: "div"
                },
            ]
        }]

    })
    Object.assign(temp, loadingWheel.prototype);
    document.body.appendChild(temp);
    document.body.style.pointerEvents = "none";
    return temp;
}

loadingWheel.prototype.disable = function() {
    document.body.style.pointerEvents = "";
    this.selfRemove();
}

export function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}


export function isEqual(value, other) {

    // Get the value type
    var type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    // Compare the length of the length of the two items
    var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    // Compare two items
    var compare = function(item1, item2) {

        // Get the object type
        var itemType = Object.prototype.toString.call(item1);

        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) return false;
        }

        // Otherwise, do a simple comparison
        else {

            // If the two items are not the same type, return false
            if (itemType !== Object.prototype.toString.call(item2)) return false;

            // Else if it's a function, convert to a string and compare
            // Otherwise, just compare
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else {
                if (item1 !== item2) return false;
            }

        }
    };

    // Compare properties
    if (type === '[object Array]') {
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }

    // If nothing failed, return true
    return true;

};


export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
export function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function isVisiableColumn(dataAll, dataRow, current) {
    var isComplete = ["isFilter", "isSearch", "isRange"];
    for (var i = 0; i < isComplete.length; i++) {
        if (isComplete[i] == current)
            continue;
        if ((dataAll[isComplete[i]] == true && dataRow[isComplete[i]]) ||
            (dataAll[isComplete[i]] == undefined && dataRow[isComplete[i]] == undefined))
            continue;
        return false;
    }
    return true;
}

export function isQueryMap(stackObject, query, dataStack) {
    // var isStack = ["isStatus","isTimeCreate","isPriceRange"];
    stackObject[dataStack] = query;
    var result = [];
    for (var param in stackObject) {
        if (result.length > 0) {
            result.push("&&");
        }
        result.push(stackObject[param]);
    }
    return result;
}