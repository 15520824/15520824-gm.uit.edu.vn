import R from '../R';
import Fcore from '../dom/Fcore';
import '../../css/FormatFunction.css';

var _ = Fcore._;
var $ = Fcore.$;

export function formatDate(date,isMinutes = false, isHours = false , isDay = true, isMonth = true, isYear = false) {
    var d = new Date(date);
    
    var resultTime = [];
    var resultDayMonth =[];

    if(isHours)
        resultTime.push('' + d.getHours());
    if(isMinutes)
        resultTime.push('' + d.getMinutes());

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

export function consoleArea(areas) {
    var result = {
        type: "FeatureCollection",
        features:[]
    }
    var k=0;
    areas.forEach(function(f) {
            if(f._area>(1.1368683772161603e-13)){
                var vertices = f.vertexlist;
                if(vertices!==undefined)
                {
                    var temp = [];
                    var sum = 0;
                    for(var i=0;i<vertices.length;i++)
                    {
                        temp.push([vertices[i].x,vertices[i].y]);
                    }
                    temp.push([vertices[0].x,vertices[0].y]);
                    temp = checkRule(temp);
                    result.features.push({
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