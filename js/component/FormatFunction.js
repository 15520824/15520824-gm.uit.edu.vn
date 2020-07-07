import R from '../R';
import Fcore from '../dom/Fcore';
import '../../css/FormatFunction.css';

var _ = Fcore._;
var $ = Fcore.$;

export function formatDate(date,isMinutes = false, isHours = false , isDay = true, isMonth = true, isYear = false) {
    if(typeof date == "object")
    var d = date;
    else
    var d = new Date(date); //time zone value from database
    //get the timezone offset from local time in minutes
    var tzDifference = -d.getTimezoneOffset();
    //convert the offset to milliseconds, add to targetTime, and make a new Date
    d = new Date(d.getTime() + tzDifference * 60 * 1000);

    var resultTime = [];
    var resultDayMonth =[];

    if(isHours)
    {
        var hour = '' + d.getHours();
        if (hour.length < 2) 
        hour = '0' + hour;
        resultTime.push(hour);
    }
    if(isMinutes)
    {
        var minute = '' + d.getMinutes();
        if (minute.length < 2) 
        minute = '0' + minute;
        resultTime.push(minute);

        var second = '' + d.getSeconds();
        if (second.length < 2) 
        second = '0' + second;
        resultTime.push(second);
    }

    if(isDay){
        var day = '' + d.getDate();
        if (day.length < 2) 
            day = '0' + day;
        resultDayMonth.push(day);
    }  
    if(isMonth)
    {
        var month = '' + (d.getMonth() + 1);
        if (month.length < 2) 
        month = '0' + month;
        resultDayMonth.push(month);
    }
        
    if(isYear)
        resultDayMonth.push('' + d.getFullYear());
    
    return resultTime.join(':')+" "+resultDayMonth.join('/');
}

export function formatNumber(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function reFormatNumber(n)
{
    return parseFloat(n.split(",").join(""));
}

export function formatFit(n)
{
    var arr = [];
    var per = 10;
    var check;
    while(n!=0)
    {
        check = n%per;
        arr.push(check);
        n = n - check;
        per*=10;
    }
    return arr;
}

export function getGMT(date,timezone = 0,onlyDay = false) {
    if(date==undefined)
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
    var resultDayMonth =[];
    if(onlyDay==false){
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
    if(onlyDay===false)
    return resultDayMonth.join('-')+" "+resultTime.join(':');
    else
    return resultDayMonth.join('-');
}

export function getIDCompair(string)
{
    return string.slice(string.lastIndexOf("_")+1);
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
        features:[]
    }

    areas.forEach(function(f) {
            if(f._area>(1.1368683772161603e-13)){
                var vertices = f.vertexlist;
                if(vertices!==undefined)
                {
                    var temp = [];
                    for(var i=0;i<vertices.length;i++)
                    {
                        temp.push([vertices[i].x,vertices[i].y]);
                    }
                    temp.push([vertices[0].x,vertices[0].y]);
                    temp = checkRule(temp);
                    multipolygon.features.push({
                        type: "Feature",
                        properties:{},
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

export function grayscale(src)
{
    return new Promise(function(resolve,reject){
    var image = new Image();
    image.src = src;
    image.style.visibility = "hidden";
    image.style.position = "absolute";
    image.style.top = 0;
    image.onload = function()
    {
        document.body.appendChild(image);
        var myCanvas=document.createElement("canvas");
        var myCanvasContext=myCanvas.getContext("2d");

        var imgWidth=image.width;
        var imgHeight=image.height;
        // You'll get some string error if you fail to specify the dimensions
        myCanvas.width = imgWidth;
        myCanvas.height = imgHeight;
        //  alert(imgWidth);
        myCanvasContext.drawImage(image,0,0);

        // This function cannot be called if the image is not rom the same domain.
        // You'll get security error if you do.
        var imgPixels=myCanvasContext.getImageData(0,0, imgWidth, imgHeight);
        document.body.removeChild(image);
        // This loop gets every pixels on the image and
        for(var y = 0; y < imgPixels.height; y++){
            for(var x = 0; x < imgPixels.width; x++){
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

export function consoleWKT(areas){
    var multipolygon = "MULTIPOLYGON("
    var polygon,isFirst,coordinates,isFirstPolygon="";
    areas.forEach(function(f) {
            if(f._area>(1.1368683772161603e-13)){
                var vertices = f.vertexlist;
                if(vertices!==undefined)
                {
                    polygon = "";
                    coordinates = ""
                    isFirst = "";
                    for(var i=0;i<vertices.length;i++)
                    {
                        coordinates +=isFirst+vertices[i].x+" "+vertices[i].y;
                        isFirst = ","
                    }
                    coordinates +=isFirst+vertices[0].x+" "+vertices[0].y;
                    coordinates = checkRuleWKT(coordinates);
                    polygon += "(("+coordinates+"))";
                }
                multipolygon+=isFirstPolygon+polygon;
                isFirstPolygon = ",";
            } 
    });
    multipolygon+=")";
    return multipolygon;
}
export function checkRule(poly)
{
    var sum = 0
    for (var i=0; i<poly.length-1; i++) {
        var cur = poly[i],
            next = poly[i+1]
        sum += (next[0] - cur[0]) * (next[1] + cur[1])
    }
    if(sum>0)
    return poly.reverse();
    return poly;
}

export function checkRuleWKT(poly)
{
    var sum = 0;
    var polygon = poly.split(",");
    for (var i=0; i<polygon.length-1; i++) {
        var cur = polygon[i].split(" "),
            next = polygon[i+1].split(" ");
        sum += (next[0] - cur[0]) * (parseFloat(next[1]) + parseFloat(cur[1]));
    }
    if(sum>0)
    return polygon.reverse().join();
    return poly;
}

export function loaddingWheel()
{
   var temp = _({
        tag:"div",
        class:"container-wheel",
        child:[
            {
                tag:"div",
                class:"lds-roller",
                child:[
                    {
                        tag:"div"
                    },
                    {
                        tag:"div"
                    },
                    {
                        tag:"div"
                    },
                    {
                        tag:"div"
                    },
                    {
                        tag:"div"
                    },
                    {
                        tag:"div"
                    },
                    {
                        tag:"div"
                    },
                    {
                        tag:"div"
                    },
                ]
            }
        ]
        
    })
    Object.assign(temp,loaddingWheel.prototype);
    document.body.appendChild(temp);
    document.body.style.pointerEvents = "none";
    return temp;
}

loaddingWheel.prototype.disable = function()
{
    document.body.style.pointerEvents = "";
    this.selfRemove();
}

export function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}