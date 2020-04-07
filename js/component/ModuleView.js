import Fcore from '../dom/Fcore';
import '../../css/ModuleView.css';
import '../../css/tablesort.css'

var _ = Fcore._;
var $ = Fcore.$;
export function ModuleView() {

}

export function alignFormCss(element, elementDynamic, GroupElement = []) {
    var maxColumn = [], k, maxWidth, longElement = 0, check = [], countRow = [];
    for (var i = 0; i < element.length; i++) {
        k = 0;
        if (check.includes(element[i])) {
            element.splice(i, 1);
            i--;
            continue;
        }
        else {
            check.push(element[i])
        }
        for (var j = 0; j < element[i].childNodes.length; j++) {
            if (GroupElement[i] === j && GroupElement[i][0] === j) {
                longElement = GroupElement[i][1];
                maxWidth += element[i].childNodes[j].offsetWidth;
                longElement--;
                continue;
            } else {
                if (longElement > 0) {
                    maxWidth += element[i].childNodes[j].offsetWidth;
                    longElement--;
                    continue;
                } else
                    maxWidth = element[i].childNodes[j].offsetWidth;
            }
            if (maxWidth > maxColumn[k] || maxColumn[k] === undefined) {
                maxColumn[k] = element[i].childNodes[j].offsetWidth;
            }
            k++;
            maxWidth = 0;
        }
    }
    var resultcss = '';
    var value;
    var Dynamic = [];
    var fontSizeHtml = getDefaultFontSize()[1];
    for (var i = 0; i < element.length; i++) {
        countRow[i] = 0;
        Dynamic[i] = [];
        for (var j = 0; j < element[i].childNodes.length; j++) {
            if (elementDynamic !== j || (Array.isArray(elementDynamic) && elementDynamic.includes(j))) {
                value = '';

                element[i].classList.forEach(function (result) {
                    value += "." + result;
                })
                value += ' ';
                element[i].childNodes[j].classList.forEach(function (result) {
                    value += "." + result;
                })
                var marginYes = 0;
                if (element[i].childNodes[j].tagName === "SPAN")
                    marginYes = 10;
                var tempWidth = (maxColumn[j] + marginYes) / fontSizeHtml;


                var el = element[i].childNodes[j];
                var paddingLeft = window.getComputedStyle(el, null).getPropertyValue('padding-left');
                var paddingRight = window.getComputedStyle(el, null).getPropertyValue('padding-right');
                var padding = parseFloat(paddingLeft) + parseFloat(paddingRight);
                var border = window.getComputedStyle(el, null).getPropertyValue('border-width');
                border = parseFloat(border);

                value += '{\n';
                value += 'width: ' + (tempWidth - (padding + border + 1) / fontSizeHtml) + 'rem; \n';
                value += '}\n';
                countRow[i] += tempWidth;
                resultcss += value;
            } else {
                Dynamic[i].push(j);
            }
        }
    }
    if (Dynamic.length !== 0) {
        Dynamic.forEach(function (result, index) {
            for (var i = 0; i < Dynamic[index].length; i++) {
                element[index].childNodes[Dynamic[index]]
                value = '';

                element[index].classList.forEach(function (result) {
                    value += "." + result;
                })
                value += ' ';
                element[index].childNodes[Dynamic[index]].classList.forEach(function (result) {
                    value += "." + result;
                })

                var el = element[index].childNodes[Dynamic[index]];
                var paddingLeft = window.getComputedStyle(el, null).getPropertyValue('padding-left');
                var paddingRight = window.getComputedStyle(el, null).getPropertyValue('padding-right');

                var border = window.getComputedStyle(el, null).getPropertyValue('border-width');
                border = parseFloat(border);
                var padding = parseFloat(paddingLeft) + parseFloat(paddingRight);

                value += '{\n';
                value += 'width: calc(' + 100 / Dynamic[index].length + '% - ' + (countRow[index] / Dynamic[index].length + (padding + border + 1) / fontSizeHtml) + 'rem); \n';
                value += '}\n';
                resultcss += value;
            }
        })
    }
    var blob = new Blob([resultcss], { type: 'text/css;charset=utf-8' });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = "style_alignFormCss.css";
    link.click();
}

function getDefaultFontSize(pa) {
    pa = pa || document.body;
    var who = document.createElement('div');

    who.style.cssText = 'display:inline-block; padding:0; line-height:1; position:absolute; visibility:hidden; font-size:1rem';

    who.appendChild(document.createTextNode('M'));
    pa.appendChild(who);
    var fs = [who.offsetWidth, who.offsetHeight];
    pa.removeChild(who);
    return fs;
}

export function selectElement(nameClass, elementDynamic) {
    var ElementStack = [], GroupElement = [];
    window.addEventListener("click", function (event) {
        var elementTarget = event.target;
        while (elementTarget.classList !== undefined && !elementTarget.classList.contains(nameClass))
            elementTarget = elementTarget.parentNode;
        if (elementTarget !== undefined && elementTarget !== document) {
            ElementStack.push(elementTarget);
        }
    })

    window.addEventListener("keydown", function (event) {
        if (event.keyCode === 27) {
            alignFormCss(ElementStack, elementDynamic, GroupElement)
        }
    })
}

export function unit_Long() {
    return _({
        tag: "selectmenu",
        class: "pizo-new-realty-dectruct-content-area-unit",
        props: {
            items: [
                { text: "m", value: 1 },
                { text: "km", value: 1000 },
                { text: "in", value: 0.0254 }
            ]
        }
    });
}

export function unit_Zone() {
    return _({
        tag: "selectmenu",
        class: "pizo-new-realty-dectruct-content-area-unit-size",
        props: {
            items: [
                { text: "m²", value: 1 },
                { text: "km²", value: 10000 },
                { text: "hecta", value: 100 }
            ]
        }
    });
}

export function input_choicenumber(point, callback) {
    var input = absol._(
        {
            tag: "input",
            class: "quantumWizTextinputPaperinputInput",
            props: {
                type: "number",
                autocomplete: "off",
                min: 0,
                max: 999999,
                step: 1,
                dir: "auto",
                badinput: false,
                value: point
            },
            on: {
                focus: function () {
                    return (function (input) {
                        input.classList.add("isFocused");
                    })(input);
                },
                blur: function () {
                    return (function (input) {
                        input.classList.remove("isFocused");
                    })(input);
                },
                input: function () {
                    return (function () {
                        input.requestUpdateSize();
                        if (callback !== undefined)
                            callback(input.value);
                    })();
                }
            }
        })
    input.getValue = function () {
        return input.value;
    };
    input.requestUpdateSize = function () {
        input.style.width = fakeInput(input.value, 14) + 15 + "px";
    };
    input.requestUpdateSize();
    return input;
}

export function fakeInput(text, size) {
    var temp = document.getElementsByClassName("fake-text");
    if (temp.length === 0)
        document.body.appendChild(
            absol._({
                tag: "span",
                class: "fake-text",
                props: {
                    innerHTML: text
                }
            })
        );
    else temp[0].innerHTML = text + "-";
    if (size !== undefined) {
        temp[0].style.fontSize = size + "px";
    } else temp[0].style.fontSize = "1.7857rem";
    return temp[0].offsetWidth;
}

function moveAt(clone, pageX, pageY, shiftX, shiftY, trigger, functionCheckZone, bg, parent) {
    var left = pageX - shiftX;
    var top = pageY - shiftY;
    if (left <= -20 || top <= 0) {
        bg.noAction = true;
        outFocus(clone, trigger, functionCheckZone, bg, parent);
    }

    clone.style.left = left + 'px';
    clone.style.top = top + 'px';
}

function onMouseMove(clone, event, shiftX, shiftY, trigger, functionCheckZone, bg, parent) {
    event.preventDefault();
    moveAt(clone, event.pageX, event.pageY, shiftX, shiftY, trigger, functionCheckZone, bg, parent);
}

function onMouseMoveFix(clone, event,shiftY, result) {
    event.preventDefault();
    moveAtFix(clone,event.pageY,shiftY,result);
}

function moveAtFix(clone,pageY,shiftY,result)
{
    var y = pageY - result.getBoundingClientRect().top;
    y-= shiftY;
    var height = result.clientHeight;
    if(result.clone[0]!==undefined&&result.tagName!=="TABLE")
    {
        for(var i = 0;i<result.clone[0].length;i++)
        {
            height+=result.clone[0][i].clientHeight;
        }
    }
    if(y>height-clone.clientHeight){
        y = result.clientHeight;
        return;
    }
    
    if(y<clone.clientHeight/2){
        y = clone.clientHeight/2;
        return;
    }

    clone.style.top = y+ 'px';
}

function moveElement(event, me, result, index) {
    var parent = me;

    while (parent !== undefined && !parent.parentNode.classList.contains("absol-single-page-scroller-viewport")) {
        parent = parent.parentNode;
    }
    if (parent === undefined)
        return;

    var scrollParent = me;

    while (scrollParent !== undefined && !scrollParent.classList.contains("absol-single-page-scroller")) {
        scrollParent = scrollParent.parentNode;
    }
    if (scrollParent === undefined)
        return;

    scrollParent.addEventListener("scroll", function (event) {
        bg.isMove = false;
        outFocus(clone, trigger, functionCheckZone, bg, parent);
    })

    var trigger;

    var clone = result.cloneColumn(index);
    var bg = result.backGround(112, function () {
        if (bg.noAction !== true)
            result.deleteColumn(index);
    }, index);



    var functionCheckZone = function (event) {
        if (AABBYY(window.xMousePos, window.yMousePos, bg.getDeleteZone().getBoundingClientRect())) {
            if (!bg.classList.contains("focus-blast"))
                bg.classList.add("focus-blast");
        } else {
            if (bg.classList.contains("focus-blast"))
                bg.classList.remove("focus-blast");
        }
        var arrZone = bg.getZone();
        for (var i = 0; i < arrZone.length; i++) {

            var checkElement = arrZone[i];
            if (AABBYY(window.xMousePos, window.yMousePos, checkElement.getBoundingClientRect())) {
                if (!checkElement.classList.contains("focus-blast"))
                    checkElement.classList.add("focus-blast");
            } else {
                if (checkElement.classList.contains("focus-blast"))
                    checkElement.classList.remove("focus-blast");
            }
        }

    }

    window.addEventListener("mousemove", functionCheckZone)

    bg.isMove = true;
    let shiftX = event.clientX - me.getBoundingClientRect().left + parent.getBoundingClientRect().left;
    let shiftY = event.clientY - me.getBoundingClientRect().top + parent.getBoundingClientRect().top;
    parent.appendChild(bg);
    parent.appendChild(clone);
    moveAt(clone, event.pageX, event.pageY, shiftX, shiftY, parent);

    window.addEventListener('mousemove', trigger = function (event) { onMouseMove(clone, event, shiftX, shiftY, trigger, functionCheckZone, bg, parent) });
    clone.onmouseup = function () {
        bg.isMove = false;
        outFocus(clone, trigger, functionCheckZone, bg, parent);
    };
}

function moveElementFix(event, me, result, index) {
    var trigger;
    console.log(result)
    var clone = result.cloneRow(index);
    var bg = result.backGroundFix(index);
   
    var scrollParent = me;

    while (scrollParent !== undefined && !scrollParent.classList.contains("absol-single-page-scroller")) {
        scrollParent = scrollParent.parentNode;
    }
    if (scrollParent === undefined)
        return;


    result.bodyTable.appendChild(bg);
    bg.appendChild(clone);
    var functionCheckZone = function (event) {
        var arrZone = bg.getZone();
        for (var i = 0; i < arrZone.length; i++) {
            var offset = clone.getBoundingClientRect();
            var centerX = offset.left + offset.width / 2;    // [UPDATE] subtract to center
            var centerY = offset.top + offset.height / 2;
            var checkElement = arrZone[i];
            if (AABBYY(centerX, centerY, checkElement.getBoundingClientRect())) {
                if (!checkElement.classList.contains("focus-blast")){
                    checkElement.classList.add("focus-blast");
                    break;
                }
                    
            } else {
                if (checkElement.classList.contains("focus-blast"))
                    checkElement.classList.remove("focus-blast");
            }
            var removeList = document.getElementsByClassName("focus-blast")[0];
            if(removeList!==undefined)
            removeList.classList.remove("focus-blast");
        }

    }
    let shiftY = clone.clientHeight/2;
    moveAtFix(clone, event.pageY, shiftY ,result);
    scrollParent.addEventListener("scroll", function (event) {
        moveAtFix(clone, event.pageY, shiftY ,result);
        console.log(parseFloat(bg.style.realTop) - parseFloat(scrollParent.scrollTop))
        bg.style.top = parseFloat(bg.style.realTop) - parseFloat(scrollParent.scrollTop)+"px";
    })
    window.addEventListener('mousemove',functionCheckZone);
    var trigger = function(event)
    {
        onMouseMoveFix(clone,event,shiftY,result);
    }
    var mouseUpFunction = function(){
        window.removeEventListener("mouseup",mouseUpFunction);
        var removeList = document.getElementsByClassName("focus-blast")[0];
        if(removeList!==undefined)
        {
            var row1 = removeList.row1;
            var row2 = removeList.row2;
            if(row1===undefined&&row2===0)
            return;
            var element = me;
            while(element.tagName !== "TR"&&element!==undefined)
            {
                element = element.parentNode;
            }
            this.console.log(element,removeList.elementReal)
            result.bodyTable.insertBefore(element,removeList.elementReal);
            if(element.clone!==undefined)
            {
                for(var i=1;i<element.clone[0].length;i++)
                {
                    result.bodyTable.insertBefore(element.clone[0][i].parentNode,removeList.elementReal);
                }
            }
        
            if(result.data.child!==undefined)
            result.data.child = changeIndex(result.data.child,index-1,row1);
            else
            result.data = changeIndex(result.data,index-1,row1);
            var k = 0;
            for(var i = 0;i<result.clone.length;i++)
            {
                var checkValue = array_insertBefore(result.clone[i],element.childNodes[k],row2);
                if(checkValue===false)
                continue;
                result.clone[i] = checkValue; 
                k++;
            }
            result.checkSpan = changeIndex(result.checkSpan,index-1,row1);
        }
        
        outFocus(clone,trigger,functionCheckZone,bg,result.bodyTable)
    }
    window.addEventListener('mousemove',trigger);
    window.addEventListener("mouseup",mouseUpFunction)
}

function array_insertBefore(arr, data, new_index) {
    var old_index;
    for(var i = 0;i<arr.length;i++)
    {
        if(arr[i]===data)
        {
            old_index = i;
            break;
        }
    }
    if(old_index===undefined)
        return false;
     // for testing
     return arr_change(arr,data,old_index,new_index)
};

function arr_change(arr,data,old_index,new_index)
{
    if(new_index === undefined)
    new_index = arr.length+1;
    if(old_index>new_index){
        arr.splice(new_index,0,data);
        arr.splice(old_index+1,1);
    }
    else{
        arr.splice(new_index,0,data);
        arr.splice(old_index,1);
    }
    
    return arr;
}

function changeIndex(arr,old_index,new_index)
{
    var data = arr.splice(old_index,1)[0];
    if(old_index<new_index)
    arr.splice(new_index-1,0,data);
    else
    arr.splice(new_index,0,data);
    return arr;
}

tableView.prototype.checkLongRow = function(index)
{
    var result = this;
    var delta = [];
    for(var i = 0;i<result.clone.length;i++)
    {
        delta[i] = 0;
        if(result.checkSpan!==undefined){
            for(var j = 0;j<index;j++)
            {
                if(result.checkSpan[j]!==undefined)
                    if(result.checkSpan[j][i]!==undefined)
                    delta[i]++;
            }
        }
    }
    return delta;
}

function AABBYY(x, y, bound) {
    if (bound.x === 0 && bound.y === 0 && bound.width === 0 && bound.height === 0)
        return true;
    return x >= bound.x && y >= bound.y && x <= bound.x + bound.width && y <= bound.y + bound.height;
}

function outFocus(clone, trigger, functionCheckZone, bg, parent) {
        window.removeEventListener('mousemove', functionCheckZone);
        window.removeEventListener('mousemove', trigger);
        clone.onmouseup = null;
        setTimeout(function () {
            bg.selfRemove();
        }, 20)
        clone.selfRemove();
}


function captureMousePosition(event) {
    window.xMousePos = event.pageX;
    window.yMousePos = event.pageY;
}


export function tableView(header = [], data = [], dragHorizontal, dragVertical) {
    if (window.mobilecheck())
        return tableViewMobile(header,data);

    var cell, row, value, check = [], bonus, style;
    var checkSpan = [];
    var headerTable = _({
        tag: "thead",
    });
    var bodyTable = _({
        tag: "tbody"
    });

    var result = _({
        tag: "table",
        style: {
            fontSize: "0.7857rem"
        },
        class: "sortTable",
        child: [
            headerTable,
            bodyTable
        ]
    });

    result.headerTable = headerTable;
    result.bodyTable = bodyTable;
    Object.assign(result,tableView.prototype);
    result.check = check;
    result.header = header;
    result.data = data;
    result.dragVertical = dragVertical;
    result.dragHorizontal = dragHorizontal;

    setTimeout(function () {
        if (window.scrollEvent === undefined) {
            window.xMousePos = 0;
            window.yMousePos = 0;
            window.lastScrolledLeft = 0;
            window.lastScrolledTop = 0;

            document.addEventListener("mousemove", function (event) {
                window.scrollEvent = captureMousePosition(event);
            })
            var scrollParent = result;

            while (scrollParent !== undefined && !scrollParent.classList.contains("absol-single-page-scroller")) {
                scrollParent = scrollParent.parentNode;
            }
            if (scrollParent === undefined)
                return;

            scrollParent.addEventListener("scroll", function (event) {
                if (window.lastScrolledLeft != scrollParent.scrollLeft) {
                    window.xMousePos -= window.lastScrolledLeft;
                    window.lastScrolledLeft = scrollParent.scrollLeft;
                    window.xMousePos += window.lastScrolledLeft;
                }
                if (lastScrolledTop != scrollParent.scrollTop) {
                    window.yMousePos -= window.lastScrolledTop;
                    window.lastScrolledTop = scrollParent.scrollTop;
                    window.yMousePos += window.lastScrolledTop;
                }
            })
        }
    }, 10)

    row = _({
        tag: "tr"
    });
    headerTable.addChild(row);
    result.clone = [];
    var k = 0;
    var toUpperCase = header.toUpperCase==true?true:false;
    var toLowerCase = header.toLowerCase==true?true:false;
    var functionClickSort;
    for (var i = 0; i < header.length; i++) {
        if (header[i].hidden === false || header[i].hidden === undefined) {
            result.clone[k] = [];
            if (header[i].value === undefined) {
                if (typeof header[i] === "object")
                    value = "";
                else
                    value = header[i];
            }
            else
                value = header[i].value;
            if(toUpperCase)
                value = value.toUpperCase();
            if(toLowerCase)
                value = value.toLowerCase();
            var functionClick = undefined;
            switch (header[i].type) {
                case "check":
                    check[i] = "check";
                    bonus = _({
                        tag: "checkboxbutton",
                        class: "pizo-checkbox",
                        on: {
                            click: function (event) {
                                for (var j = 1; j < result.bodyTable.listCheckBox.length; j++) {
                                    result.bodyTable.listCheckBox[j].checked = this.checked;
                                }
                            }
                        }
                    })
                    result.bodyTable.listCheckBox = [bonus];
                    break;
                case "increase":
                    check[i] = "increase";
                    break;
                case "dragzone":
                    if(dragVertical)
                    check[i] = "dragzone";
                    else{
                        check[i] = "hidden";
                        continue;
                    }
                    break;
                case "detail":
                    check[i] = "detail";
                    var icon = "more";
                    if (header[i].icon !== undefined)
                        icon = header[i].icon;
                    bonus = _({
                        tag: "i",
                        class: "material-icons",
                        style: {
                            fontSize: "1.4rem",
                            cursor: "pointer"
                        },
                        props: {
                            innerHTML: icon
                        }
                    })
                    break;
            }
            if (header[i].sort === true || header[i].sort === undefined) {
                functionClickSort = function (event, me, index, dataIndex, row,result) {
                    var last_sort = document.getElementsByClassName("downgrade");
                    last_sort = last_sort[0];
                    me = me.parentNode;
                    if(last_sort!==me&&last_sort!==undefined)
                    {
                        last_sort.classList.remove("downgrade");
                    }
                    var last_sort = document.getElementsByClassName("upgrade");
                    last_sort = last_sort[0];
                    if(last_sort!==me&&last_sort!==undefined)
                    {
                        last_sort.classList.remove("upgrade");
                    }
                    if(!me.classList.contains("downgrade"))
                    {
                        sortArray(result.data,index);
                        me.classList.add("downgrade");
                        if(me.classList.contains("upgrade"))
                        me.classList.remove("upgrade");
                    }
                    else{
                        sortArray(result.data,index,false);
                        me.classList.add("upgrade");
                        if(me.classList.contains("downgrade"))
                        me.classList.remove("downgrade");
                    }
                        
                    result.updateTable(header, result.data, dragHorizontal, dragVertical);
                }
            }

            if (header[i].functionClick !== undefined)
                functionClick = header[i].functionClick;
            style = {};
            if(header[i].style!==undefined)
                style = header[i].style;
            cell = _({
                tag: "th",
                attr: {
                    role: 'columnheader'
                },
                style:style,
                props: {
                    id: i
                },
                on: {
                    click: function (index, row, functionClick) {
                        return function (event) {
                            event.preventDefault();
                            if (functionClick !== undefined)
                                functionClick(event, this, index, data[index], row,result);
                        }
                    }(i, row, functionClick),
                    mousedown: dragHorizontal ? function (index) {
                        return function (event) {
                            event.preventDefault();
                            var finalIndex;
                            for (var i = 0; i < result.clone.length; i++) {
                                if (result.clone[i][0].id == index) {
                                    finalIndex = i;
                                    break;
                                }
                            }
                            this.hold = false;
                            var dom = this;
                            this.default = event;
                            this.timeoutID = setTimeout(function () {
                                dom.hold = true;
                                moveElement(event, dom, result, finalIndex);
                            }, 200);
                        }
                    }(i) : undefined,
                    dragstart: dragHorizontal ? function () {
                        return false;
                    } : undefined,
                    mouseup: function () {
                        if (this.hold === false) {
                            this.hold = true;
                            // this.click();
                            clearTimeout(this.timeoutID);
                        }
                    },
                    mousemove: dragHorizontal ? function (index) {
                        return function (event) {
                            if (this.hold === false) {
                                var finalIndex;
                                for (var i = 0; i < result.clone.length; i++) {
                                    if (result.clone[i][0].id == index) {
                                        finalIndex = i;
                                        break;
                                    }
                                }
                                this.hold = false;
                                var deltaX = this.default.clientX - event.clientX,
                                    deltaY = this.default.clientY - event.clientY;
                                if ((Math.abs(deltaX) + Math.abs(deltaY)) > 10) {
                                    this.hold = true;
                                    moveElement(event, this, result, finalIndex);
                                    clearTimeout(this.timeoutID);
                                }
                            }
                        }
                    }(i) : undefined,
                }
            })
            if (header[i].sort === true) {
                cell.classList.add("has-sort")
            }

            if(header[i].element===undefined)
            {
                cell.addChild( _({text: value})) ;
            }else
            {
                cell.appendChild(data[i][j].element);
            }

            if (bonus !== undefined) {
                cell.addChild(bonus);
                bonus = undefined;
            }
            cell.addChild(_({
                tag:"div",
                class:"sort-container",
                on:{
                    click: function (index, row, functionClickSort) {
                        return function (event) {
                            event.preventDefault();
                            if (functionClickSort !== undefined)
                            functionClickSort(event, this, index, data[index], row,result);
                        }
                    }(i, row, functionClickSort),
                },
                child:[
                    {
                        tag:"sort-up",
                        class: ["arrow_up"],
                    },
                    {
                        tag:"sort-down",
                        class: ["arrow_down"],
                    }
                ]
            }));
            result.clone[k++].push(cell);
            
            row.addChild(cell);
        } else
            check[i] = "hidden";
    }
    result.getBodyTable(data);
   
    result.checkSpan  = checkSpan;
    return result;
}

tableView.prototype.addInputSearch = function(input)
{
    var self = this;
    input.onchange = function(event){
        for(var i = 0;i<self.bodyTable.childNodes.length;i++)
        {
            if(checkValueIs(self.bodyTable.childNodes[i].data,input.value))
            {
                if(!self.bodyTable.childNodes[i].classList.contains("parent"))
                self.bodyTable.childNodes[i].classList.add("parent");
                if(self.bodyTable.childNodes[i].classList.contains("disPLayNone"))
                self.bodyTable.childNodes[i].classList.remove("disPLayNone");
                if(self.bodyTable.childNodes[i].childNodes[0].parentTree!==undefined)
                {
                    if(!self.bodyTable.childNodes[i].childNodes[0].parentTree.classList.contains("parent"))
                    self.bodyTable.childNodes[i].childNodes[0].parentTree.classList.add("parent");
                    if(self.bodyTable.childNodes[i].childNodes[0].parentTree.classList.contains("disPLayNone"))
                    self.bodyTable.childNodes[i].childNodes[0].parentTree.classList.remove("disPLayNone");
                }
            }else
            {
                if(self.bodyTable.childNodes[i].classList.contains("parent"))
                self.bodyTable.childNodes[i].classList.remove("parent");
                if(!self.bodyTable.childNodes[i].classList.contains("disPLayNone"))
                self.bodyTable.childNodes[i].classList.add("disPLayNone");
            }
        }
    }
    input.addEventListener("input",input.onchange)
    self.inputElement = input;
}

function checkValueIs(data,text)
{
    var value;
    for(var i = 0 ;i<data.length;i++)
    {
        value = "";
        if(data[i].value!==undefined)
        value = data[i].value;
        else
        value = data[i];
        if(value.toString().toLowerCase().indexOf(text.toLowerCase())!==-1)
        return true;
    }
    return false;
}

tableView.prototype.getBodyTable = function(data,parentContent)
{
    var temp  = this.bodyTable;
    var result = this, k, delta = [],row,cell;
    var parent = this;
    var arr = [];
   
    if(parentContent!==undefined)
        parent = parentContent;
    if(parent.checkSpan===undefined)
        parent.checkSpan = [];
    for (var i = 0; i < data.length; i++) {
        row = result.getRow(data[i]);
        temp.addChild(row);
        arr.push(row);
        for (var j = 0; j < result.clone.length; j++) {
            k = parseFloat(result.clone[j][0].id);
            if(delta[j]===undefined)
                delta[j] = 0;

            cell = result.getCell(data[i][k],i,k,j,parent.checkSpan,row);
            if(cell === 6  || cell === 2)
            {
                parent.clone[j].splice(i+1 - delta[j],1);
                delta[j]+=1;
                continue
            }
            if(cell === true)
            {
                continue;
            }
            cell.clone = parent.clone;
            parent.clone[j][i+1 - delta[j]] = cell;
            cell.parentTree = parent;
            row.addChild(cell);
        }
        row.checkChild();
    }
    return arr;
}

tableView.prototype.getRow = function(data)
{
    var temp = _({
        tag: "tr",
        class:"parent"
    });
    var result = this;
    temp.data = data;
    temp.checkChild = function(data)
    {
        if(data!==undefined)
        temp.data =  data;
        if(temp.data.child!==undefined)
        {
            if(temp.data.child.index!==undefined){
                temp.classList.add("more-child");
                var buttonClick = _({
                    tag:"i",
                    on:{
                        click:function(event){
                            if(!temp.classList.contains("more-child"))
                            {
                                temp.classList.add("more-child");
                                var childrenNodes = temp.childrenNodes;
                                for(var i=0;i<childrenNodes.length;i++)
                                {
                                    childrenNodes[i].classList.add("parent");
                                    childrenNodes[i].classList.remove("disPLayNone");
                                } 
                            }
                            else{
                                temp.classList.remove("more-child");
                                var childrenNodes = temp.childrenNodes;
                                for(var i=0;i<childrenNodes.length;i++)
                                {
                                    childrenNodes[i].classList.remove("parent");
                                    childrenNodes[i].classList.add("disPLayNone");
                                } 
                            }   
                        }
                    },
                    class: ["material-icons","more-button"],
                    props:{
                        innerHTML:"play_arrow"
                    },
                });
                temp.childNodes[temp.data.child.index].insertBefore(buttonClick, temp.childNodes[temp.data.child.index].firstChild);
                temp.clone = [];
                var k = 0;
                for(var i = 0;i<temp.childNodes.length;i++)
                {
                    temp.clone[k++] = [temp.childNodes[i]];
                    if(temp.childNodes[i].colSpan!==1)
                    {
                        k++;
                    }
                }
                temp.childrenNodes = result.getBodyTable(temp.data.child,temp);
                Object.assign(temp,tableView.prototype);
                temp.headerTable = result.headerTable;
                temp.bodyTable = result.bodyTable;
                temp.check = result.check;
                temp.header = result.header;
                temp.dragVertical = result.dragVertical;
                temp.dragHorizontal = result.dragHorizontal;
            }
        }
    }
    
    return temp;
}

tableView.prototype.getCell = function(dataOrigin,i,j,k,checkSpan,row)
{
    var data = dataOrigin;
    var result = this,value,bonus,style,cell;
    if(checkSpan[i]!==undefined){
        if(checkSpan[i][k]==2)
        return 2;
        if(checkSpan[i][k]==6)
        return 6;
    }
        
    if (data.value === undefined) {
        if (typeof data === "object")
            value = "";
        else
            value = data.toString();
    }
    else
        value = data.value;

    switch (this.check[j]) {
        case "hidden":
            return true;
        case "increase":
            value += (i + 1);
            break;
        case "dragzone":
            if (data.icon !== undefined)
            {
                icon = data.icon;
                bonus = _({
                    tag: "i",
                    class: ["material-icons"],
                    style: {
                        fontSize: "20px",
                        cursor: "pointer"
                    },
                    props: {
                        innerHTML: icon
                    }
                })
            }else
            {
                bonus = _({
                    tag:"i",
                    class: ["material-icons"],
                    props:{
                        innerHTML:"drag_indicator"
                    },
                    on:{
                        mousedown: result.dragVertical ? function (index) {
                            return function (event) {
                                event.preventDefault();
                                var finalIndex;
                                for (var i = 1; i < cell.clone[0].length; i++) {
                                    if (cell.clone[0][i].idRow == index) {
                                        finalIndex = i;
                                        break;
                                    }
                                }
                                this.hold = false;
                                var dom = this;
                                this.default = event;
                                this.timeoutID = setTimeout(function () {
                                    dom.hold = true;
                                    moveElementFix(event, dom, cell.parentTree, finalIndex);
                                }, 200);
                            }
                        }(i) : undefined,
                        dragstart: result.dragVertical ? function () {
                            return false;
                        } : undefined,
                        mouseup: function () {
                            if (this.hold === false) {
                                this.hold = true;
                                // this.click();
                                clearTimeout(this.timeoutID);
                            }
                        },
                        mousemove: result.dragVertical ? function (index) {
                            return function (event) {
                                if (this.hold === false) {
                                    var finalIndex;
                                    for (var i = 0; i < cell.clone[0].length; i++) {
                                        if (cell.clone[0][i].idRow == index) {
                                            finalIndex = i;
                                            break;
                                        }
                                    }
                                    this.hold = false;
                                    var deltaX = this.default.clientX - event.clientX,
                                        deltaY = this.default.clientY - event.clientY;
                                    if ((Math.abs(deltaX) + Math.abs(deltaY)) > 10) {
                                        this.hold = true;
                                        moveElementFix(event, this, cell.parentTree, finalIndex);
                                        clearTimeout(this.timeoutID);
                                    }
                                }
                            }
                        }(i) : undefined,
                    }
                })
            }
            break;
        case "check":
            bonus = _({
                tag: "checkboxbutton",
                class: "pizo-checkbox",
                on: {
                    click: function (event) {
                        if (result.bodyTable.listCheckBox !== undefined) {
                            if (this.checked === false)
                            result.bodyTable.listCheckBox[0].checked = false;
                            else {
                                if (result.bodyTable.listCheckBox[0].checked === false)
                                    for (var j = 1; j < result.bodyTable.listCheckBox.length; j++) {
                                        if (result.bodyTable.listCheckBox[j].checked === false) {
                                            j--;
                                            break;
                                        }
                                    }
                                if (j === result.bodyTable.listCheckBox.length) {
                                    result.bodyTable.listCheckBox[0].checked = true;
                                }
                            }
                        }
                    }
                }
            })
            if (result.bodyTable.listCheckBox !== undefined)
            result.bodyTable.listCheckBox.push(bonus);
            break;
        case "detail":
            var icon = "more_vert";
            if (data.icon !== undefined)
                icon = data.icon;
            bonus = _({
                tag: "i",
                class: "material-icons",
                style: {
                    fontSize: "20px",
                    cursor: "pointer"
                },
                props: {
                    innerHTML: icon
                }
            })
            break;

    }
    var functionClick=undefined;
    if (data.functionClick !== undefined)
        functionClick = data.functionClick;
    else {
        if (result.header[j].functionClickAll !== undefined)
            functionClick = result.header[j].functionClickAll;
    }

    style = {};
    if(data.style!==undefined)
        style = data.style;

    cell = _({
        tag: "td",
        style:style,
        props:{
            idRow:i
        },
        on: {
            click: function (index, row, functionClick) {
                return function (event) {
                    event.preventDefault();
                    if (functionClick !== undefined){
                        for (var i = 1; i < cell.clone[0].length; i++) {
                            if (cell.clone[0][i].idRow == index) {
                                var dataIndex;
                                if(cell.parentTree.data.child!==undefined)
                                dataIndex = cell.parentTree.data.child[i];
                                else
                                dataIndex = cell.parentTree.data[i];
                                functionClick(event, cell, i-1, cell.parentTree, cell.parentTree.data[i], row);
                                break;
                            }
                        }
                    }
                        
                }
            }(i, row, functionClick),
        }
    })
    

    if(data.element===undefined)
    {
        cell.addChild(_({text:value}))
    }else
    {
        cell.appendChild(data.element);
    }

    if (bonus !== undefined) {
        cell.addChild(bonus);
        bonus = undefined;
    }

    if(data.rowspan!==undefined){
        cell.setAttribute("rowspan",data.rowspan);
        for(var l = i+1;l<i+data.rowspan;l++)
        {
            if(checkSpan[l]===undefined)
                checkSpan[l] = [];
            checkSpan[l][k]=2;
        }
    }
    if(data.colspan!==undefined){
        cell.setAttribute("colspan",data.colspan);
        
        checkSpan[i]=[]
        for(var l = k+1;l<k+data.colspan;l++)
        {
            checkSpan[i][l]=6;
        }
    }
    return cell;
}

tableView.prototype.updateTable = function (header, data, dragHorizontal, dragVertical) {
    var temp = _({
        tag: "tbody"
    });
    var row, cell,k;
    var checkSpan = [];
    temp.listCheckBox = [];
    var result = this;
    if(dragHorizontal!==undefined)
    result.dragHorizontal = dragHorizontal;
    if(dragVertical!==undefined)
    result.dragVertical = dragVertical;
    if(this.bodyTable.listCheckBox!==undefined)
    temp.listCheckBox[0] = this.bodyTable.listCheckBox[0];
    this.replaceChild(temp, this.bodyTable);
    this.bodyTable = temp;

    var delta = [];
    for (var i = 0; i < data.length; i++) {
        row = result.getRow(data[i]);
        temp.addChild(row);
        
        for (var j = 0; j < this.clone.length; j++) {
            k = parseFloat(this.clone[j][0].id);
            if(delta[j]===undefined)
                delta[j] = 0;

            cell = result.getCell(data[i][k],i,k,j,checkSpan,row);
            if(cell === 6  || cell === 2)
            {
                this.clone[j].splice(i+1 - delta[j],1);
                delta[j]+=1;
                continue
            }
            if(cell === true)
            {
                continue;
            }
            cell.clone = this.clone;
            this.clone[j][i+1 - delta[j]] = cell;
            cell.parentTree = this;
            row.addChild(cell);
        }
        row.checkChild();
    }
    this.checkSpan  = checkSpan;
    this.data = data;
    if(this.inputElement!==undefined)
    this.inputElement.onchange();
}

tableView.prototype.insertRow = function(data)
{
    this.updateRow(data,this.data.length)
}

tableView.prototype.updateRow = function(data,index)
{
    var result = this,k,cell;
    var delta = [];
    var row = result.getRow(data);
    for(var i = 0;i<result.clone.length;i++)
    {
        delta[i] = 0;
        if(result.checkSpan!==undefined){
            if(result.checkSpan[index]!==undefined){
                if(result.checkSpan[index][i]===6){
                    result.checkSpan[index][i] = undefined;
                    result.clone[i].splice(index+1,0,{})
                }
            }
            for(var j = 0;j<index;j++)
            {
                if(result.checkSpan[j]!==undefined)
                    if(result.checkSpan[j][i]!==undefined)
                    delta[i]++;
            }
        }
    }

    if(result.childrenNodes!==undefined&&result.childrenNodes.length===index){
        result.bodyTable.insertBefore(row, result.childrenNodes[result.childrenNodes.length-1].nextSibling);
    }else if(index===result.data.length&&result.childrenNodes===undefined)
    {
        result.bodyTable.addChild(row);
    }
    else{
        var temp;
        console.log(result)
        if(result.childrenNodes!==undefined)
        {
            temp = result.childrenNodes[index];
        }
        else
        temp = result.clone[0][index+1].parentNode;
        console.log(temp)
        if(temp.childrenNodes!==undefined)
            temp.childrenNodes.forEach(function(value){
                value.selfRemove();
        })
        result.bodyTable.replaceChild(row,temp);
    }

    for(var i = 0;i<this.bodyTable.parentNode.clone.length;i++)
    {
        k = parseFloat(this.bodyTable.parentNode.clone[i][0].id);
        cell = result.getCell(data[k],index,k,i,result.checkSpan,row);
        if(cell  === 6)
        {
            result.clone[k++].splice(index,1);
            continue;
        }
        if(cell === 2)
        {
            k++;
            continue;
        }
        if(cell === true)
        {
            continue;
        }
        cell.clone = result.clone;
        result.clone[i][index+1-delta[i]] = cell;
        k++;
        row.addChild(cell);
    }
    
    
   if(result.data.child!==undefined)
    result.data.child[index]=data;
   else
    result.data[index]=data;
    row.checkChild();
    if(this.inputElement!==undefined)
    this.inputElement.onchange();
}

tableView.prototype.dropRow = function(index)
{
    var result=this,deltaX=[];
    var element = result.clone[0][index+1].parentNode;
    
    var parent = element.childNodes[0].parentTree;
    if(!element.classList.contains("hideTranslate"))
        element.classList.add("hideTranslate");

    console.log(element);
    
    var eventEnd = function(){
        if(parent.data.child)
        parent.data.child.splice(parseFloat(element.childNodes[0].idRow),1);
        else
        parent.data.splice(parseFloat(element.childNodes[0].idRow),1);
        element.selfRemove();
        var deltaY = 0;

        deltaX = parent.checkLongRow(index);
        for(var i = 0;i<element.childNodes.length;i++)
        { 
                parent.clone[i+deltaY].splice(index+1-deltaX[i+deltaY],1); 
                parent.checkSpan.splice(index,1); 
                if(element.childNodes[i].colSpan!==undefined)
                    deltaY+=element.childNodes[i].colSpan-1;
        }
    };
    // Code for Safari 3.1 to 6.0
    element.addEventListener("webkitTransitionEnd", eventEnd);

    // Standard syntax
    element.addEventListener("transitionend", eventEnd);
}

tableView.prototype.backGroundFix = function (index) {
    var rect = this.getBoundingClientRect();
    var scrollParent = this;

    while (scrollParent !== undefined && !scrollParent.classList.contains("absol-single-page-scroller")) {
        scrollParent = scrollParent.parentNode;
    }
    if (scrollParent === undefined)
        return;
    console.log(rect.y-scrollParent.scrollTop)
    var temp = _({
        tag: "div",
        class: "background-opacity",
        style:{
            top:rect.y+'px',
            left:rect.x+'px',
            backgroundColor: "#ffffff00",
            realTop:rect.y+scrollParent.scrollTop
        },
        child: [
        ]
    })
    var arrZone = [];
    var tempElement = this.getBound2Row(undefined, 0, index);
    arrZone.push(tempElement);
    temp.appendChild(tempElement);

    for (var i = 0; i < this.clone[0].length - 1; i++) {
        tempElement = this.getBound2Row(i, i + 1, index);
        arrZone.push(tempElement);
        temp.appendChild(tempElement);
    }

    tempElement = this.getBound2Row(this.clone[0].length - 1, undefined, index);
    tempElement.childNodes[0].style.height = parseFloat(tempElement.childNodes[0].style.height) - 2 + "px";
    arrZone.push(tempElement);
    temp.appendChild(tempElement);

    temp.getZone = function () {
        return arrZone;
    }
    return temp;
}

tableView.prototype.backGround = function (height, callback, index) {
    var temp = _({
        tag: "div",
        class: "background-opacity-1",
        child:[
            {
                tag: "div",
                class: "delete-zone",
                style: {
                    height: height + "px",
                },
                child: [
                    {
                        tag: "i",
                        class: ["delete-zone-icon", "material-icons"],
                        style: {
                            marginTop: height / 2 - 30 + "px"
                        },
                        props: {
                            innerHTML: "delete_forever"
                        }
                    },
                    {
                        tag: "span",
                        class: ["detele-zone-label"],
                        style: {
                            marginTop: height / 2 - 15 + "px"
                        },
                        props: {
                            innerHTML: "Delete"
                        }
                    }
                ],
                on: {
                    mouseover: function (event) {
                        if (callback !== undefined && temp.isMove == false)
                            callback(event);
                    },
                }
            }
        ]
    })
    var arrZone = [];
    var tempElement = this.getBound2Colum(undefined, 0, index);
    arrZone.push(tempElement);
    temp.appendChild(tempElement);

    for (var i = 0; i < this.clone.length - 1; i++) {
        tempElement = this.getBound2Colum(i, i + 1, index);
        arrZone.push(tempElement);
        temp.appendChild(tempElement);
    }

    tempElement = this.getBound2Colum(this.clone.length - 1, undefined, index);
    tempElement.childNodes[2].style.width = parseFloat(tempElement.childNodes[2].style.width) - 8 + "px";
    arrZone.push(tempElement);
    temp.appendChild(tempElement);

    temp.getDeleteZone = function () {
        return temp.childNodes[0];
    }
    temp.getZone = function () {
        return arrZone;
    }
    return temp;
}


tableView.prototype.deleteColumn = function (index) {
    for (var i = 0; this.clone[index].length; i++) {
        this.clone[index][i].parentNode.removeChild(this.clone[index][i]);
        this.clone[index].splice(i, 1);
        i--;
    }
    this.clone.splice(index, 1);
}

tableView.prototype.cloneColumn = function (index) {
    var clone = this.clone[index][0].cloneNode(true);
    clone.style.width = this.clone[index][0].offsetWidth - window.getComputedStyle(this.clone[index][0], null).getPropertyValue('padding-left').replace("px", "") - window.getComputedStyle(this.clone[index][0], null).getPropertyValue('padding-right').replace("px", "") - window.getComputedStyle(this.clone[index][0], null).getPropertyValue('border-left-width').replace("px", "") - window.getComputedStyle(this.clone[index][0], null).getPropertyValue('border-right-width').replace("px", "") + 'px';
    clone.style.height = this.clone[index][0].offsetHeight - window.getComputedStyle(this.clone[index][0], null).getPropertyValue('padding-top').replace("px", "") - window.getComputedStyle(this.clone[index][0], null).getPropertyValue('padding-bottom').replace("px", "") - window.getComputedStyle(this.clone[index][0], null).getPropertyValue('border-top-width').replace("px", "") - window.getComputedStyle(this.clone[index][0], null).getPropertyValue('border-bottom-width').replace("px", "") + 'px';
    var headerTable = _({
        tag: "thead"
    });
    var cell;
    headerTable.addChild(_({
        tag: "tr",
        child: [
            clone
        ]
    }))
    var bodyTable = _({
        tag: "tbody"
    });
    tableView.prototype.cloneCellColumn(bodyTable,this.clone,index)
    var result = _({
        tag: "table",
        style: {
            fontSize: "0.7857rem",
            position: "absolute",
            zIndex: 1000,
            cursor: "move",
        },
        class: "sortTableClone",
        child: [
            headerTable,
            bodyTable
        ]
    });
    
    return result;
}

tableView.prototype.cloneCellColumn = function(bodyTable,cloneArray,index)
{
    var clone,cell;
    for (var i = 1; i < cloneArray[index].length; i++) {
        clone = cloneArray[index][i].cloneNode(true);
        clone.style.width = cloneArray[index][i].offsetWidth - window.getComputedStyle(cloneArray[index][i], null).getPropertyValue('padding-left').replace("px", "") - window.getComputedStyle(cloneArray[index][i], null).getPropertyValue('padding-right').replace("px", "") - window.getComputedStyle(cloneArray[index][i], null).getPropertyValue('border-left-width').replace("px", "") - window.getComputedStyle(cloneArray[index][i], null).getPropertyValue('border-right-width').replace("px", "") + 'px';
        clone.style.height = cloneArray[index][i].offsetHeight - window.getComputedStyle(cloneArray[index][i], null).getPropertyValue('padding-top').replace("px", "") - window.getComputedStyle(cloneArray[index][i], null).getPropertyValue('padding-bottom').replace("px", "") - window.getComputedStyle(cloneArray[index][i], null).getPropertyValue('border-top-width').replace("px", "") - window.getComputedStyle(cloneArray[index][i], null).getPropertyValue('border-bottom-width').replace("px", "") + 'px';
        cell = _({
            tag: "tr",
            child: [
                clone
            ]
        })
        console.log(cell)
        cell.classList = cloneArray[index][i].parentNode.classList;
        if(cloneArray[index][i].colSpan!==undefined)
        clone.setAttribute("rowSpan","")
        bodyTable.addChild(cell);
        if(cloneArray[index][i].parentNode.clone!==undefined)
        {
            var cloneArrayTemp = cloneArray[index][i].parentNode.clone;
            tableView.prototype.cloneCellColumn(bodyTable,cloneArrayTemp,index)
        }
        
    }
}

tableView.prototype.cloneRow = function (index) {
    var clone;
    var headerTable = _({
        tag: "thead"
    });
    var bodyTable = _({
        tag: "tbody"
    });

    var result = _({
        tag: "table",
        style: {
            fontSize: "0.7857rem",
            position: "absolute",
            zIndex: 1000,
            opacity:0.7
        },
        class: "sortTableClone",
        child: [
            headerTable,
            bodyTable
        ]
    });
    var row =_({
        tag: "tr",
    });
    if (index === 0)
        headerTable.addChild(row)
    else{
        bodyTable.addChild(row);
    }
    console.log(this.clone)
    for (var i = 0; i < this.clone.length; i++) {
        if(this.clone[i][index]===undefined)
        continue;
        clone = this.clone[i][index].cloneNode(true);
        clone.style.width = this.clone[i][index].offsetWidth - window.getComputedStyle(this.clone[i][index], null).getPropertyValue('padding-left').replace("px", "") - window.getComputedStyle(this.clone[i][index], null).getPropertyValue('padding-right').replace("px", "") - window.getComputedStyle(this.clone[i][index], null).getPropertyValue('border-left-width').replace("px", "") - window.getComputedStyle(this.clone[i][index], null).getPropertyValue('border-right-width').replace("px", "")+1 + 'px';
        clone.style.height = this.clone[i][index].offsetHeight - window.getComputedStyle(this.clone[i][index], null).getPropertyValue('padding-top').replace("px", "") - window.getComputedStyle(this.clone[i][index], null).getPropertyValue('padding-bottom').replace("px", "") - window.getComputedStyle(this.clone[i][index], null).getPropertyValue('border-top-width').replace("px", "") - window.getComputedStyle(this.clone[i][index], null).getPropertyValue('border-bottom-width').replace("px", "") + 'px';
        clone.setAttribute("colSpan","")
        row.appendChild(clone);
    }
    return result;
}

tableView.prototype.getBound2Colum = function (colum1, colum2, index) {
    var self = this;
    var left, right;
    if (colum1 !== undefined)
        left = (self.clone[colum1][0].offsetWidth) / 2 + parseFloat(window.getComputedStyle(self.clone[colum1][0]).webkitBorderHorizontalSpacing)/2;
    else
        left = 20 + parseFloat(window.getComputedStyle(self).paddingLeft);
    if (colum2 !== undefined)
        right = (self.clone[colum2][0].offsetWidth) / 2 + parseFloat(window.getComputedStyle(self.clone[colum2][0]).webkitBorderHorizontalSpacing)/2;
    else
        right = 20 + parseFloat(window.getComputedStyle(self).paddingRight);
    return _({
        tag: "div",
        class: "move-hover-zone",
        style: {
            height: self.offsetHeight + "px",
        },
        on: {
            mouseover: function () {

                if (this.parentNode.isMove === false) {
                    tableView.prototype.moveColumn(self.clone,colum1,colum2,index)
                }
            }
        },
        child: [
            {
                tag: "div",
                class: "move-hover-zone-left",
                style: {
                    width: left + 'px',
                }
            },
            {
                tag: "div",
                class: "move-hover-zone-center",
            },
            {
                tag: "div",
                class: "move-hover-zone-right",
                style: {
                    width: right + 'px',
                }
            }
        ]
    })
}

tableView.prototype.moveColumn = function(arrClone,colum1,colum2,index,i=0)
{
    var parent;
    // if(index==colum1)
    //     return;
    // if(index==colum2)
    //     return;
    var delta = 0,lastDelta;
    for (i; i < arrClone[index].length; i++) {
        parent = arrClone[index][i-delta].parentNode;
        if (colum2 !== undefined) {
            if(lastDelta>0)
            {
                lastDelta--;
                continue;
            }
            parent.insertBefore(arrClone[index][i-delta], arrClone[colum2][i]);
        }
        else {
            parent.appendChild(arrClone[index][i]);
        }
        if(arrClone[index][i].rowSpan!==undefined){
            delta+=arrClone[index][i].rowSpan-1;
            lastDelta=arrClone[index][i].rowSpan-1;
        }
        if(arrClone[index][i-delta].parentNode.clone!==undefined)
        {
            tableView.prototype.moveColumn(arrClone[index][i-delta].parentNode.clone,colum1,colum2,index,1);
        }
    }
    if (colum1 > index) {
        if (colum2 === undefined)
            arrClone.push(arrClone[index]);
        else
            arrClone.splice(colum2, 0, arrClone[index]);
            arrClone.splice(index, 1);
    }
    if (colum2 < index) {
        var tempElement = arrClone[index];

        arrClone.splice(index, 1);
        if (colum2 === undefined)
            arrClone.push(tempElement);
        else
            arrClone.splice(colum2, 0, tempElement);
    }
}

tableView.prototype.getBound2Row = function (row1, row2) {
    var self = this;
    var top, bottom,elementReal;
    if(self.clone[0][row1]!==undefined)
    var style1 = window.getComputedStyle(self.clone[0][row1]);
    if(self.clone[0][row2]!==undefined){
        var style2 = window.getComputedStyle(self.clone[0][row2]);
        elementReal = self.clone[0][row2].parentNode;
    }
    if (row1 !== undefined){
        top = (self.clone[0][row1].offsetHeight) / 2 + parseFloat(style1.webkitBorderVerticalSpacing)/2;
    }
    else
        top = parseFloat(window.getComputedStyle(self).paddingTop);
    if (row2 !== undefined&&self.clone[0][row2].offsetHeight!==0){
        if(self.clone[0][row2].parentNode.style.display==="none")
        return _({
            tag:"div"
        })
        bottom = (self.clone[0][row2].offsetHeight) / 2 + parseFloat(style2.webkitBorderVerticalSpacing)/2;
        if(row1!==undefined&&self.clone[0][row2].parentNode.clone!==undefined)
        {
            var tempClone = self.clone[0][row2].parentNode.clone[0];
            for(var i=1;i<tempClone.length;i++)
            {
                bottom+= tempClone[i].offsetHeight;
            }
        }
    }
    else
        bottom = parseFloat(window.getComputedStyle(self).paddingBottom)+(self.clone[0][row1].offsetHeight)/2;
    var temp =  _({
        tag: "div",
        class: "move-hover-zone-topbot",
        props:{
            row1:row1,
            row2:row2,
            elementReal:elementReal
        },
        style: {
            width: self.offsetWidth + "px",
        },
        on: {
            mouseover: function () {
            }
        },
        child: [
            {
                tag: "div",
                class: "move-hover-zone-top",
                style: {
                    height: top - 4 + 'px',
                }
            },
            {
                tag: "div",
                class: "move-hover-zone-middle",
            },
            {
                tag: "div",
                class: "move-hover-zone-bottom",
                style: {
                    height: bottom + 4 + 'px',
                }
            }
        ]
    })
    return temp;
}

export function tableViewMobile(header = [], data = []) {
    var cell, row, value, check = [], bonus, style;
    var dragVertical = false;
    var dragHorizontal = false;
    var checkSpan = [];
    var headerTable = _({
        tag: "thead",
    });
    var bodyTable = _({
        tag: "tbody"
    });

    var result = _({
        tag: "table",
        style: {
            fontSize: "0.7857rem"
        },
        class: "sortTable",
        child: [
            headerTable,
            bodyTable
        ]
    });

    result.headerTable = headerTable;
    result.bodyTable = bodyTable;
    Object.assign(result,tableView.prototype);
    console.log(result)
    result.check = check;
    result.header = header;
    result.data = data;
    result.dragVertical = dragVertical;
    result.dragHorizontal = dragHorizontal;

    setTimeout(function () {
        if (window.scrollEvent === undefined) {
            window.xMousePos = 0;
            window.yMousePos = 0;
            window.lastScrolledLeft = 0;
            window.lastScrolledTop = 0;

            document.addEventListener("mousemove", function (event) {
                window.scrollEvent = captureMousePosition(event);
            })
            var scrollParent = result;

            while (scrollParent !== undefined && !scrollParent.classList.contains("absol-single-page-scroller")) {
                scrollParent = scrollParent.parentNode;
            }
            if (scrollParent === undefined)
                return;

            scrollParent.addEventListener("scroll", function (event) {
                if (window.lastScrolledLeft != scrollParent.scrollLeft) {
                    window.xMousePos -= window.lastScrolledLeft;
                    window.lastScrolledLeft = scrollParent.scrollLeft;
                    window.xMousePos += window.lastScrolledLeft;
                }
                if (lastScrolledTop != scrollParent.scrollTop) {
                    window.yMousePos -= window.lastScrolledTop;
                    window.lastScrolledTop = scrollParent.scrollTop;
                    window.yMousePos += window.lastScrolledTop;
                }
            })
        }
    }, 10)

    row = _({
        tag: "tr"
    });
    headerTable.addChild(row);
    result.clone = [];
    var k = 0;
    var toUpperCase = header.toUpperCase==true?true:false;
    var toLowerCase = header.toLowerCase==true?true:false;
    var functionClickSort;
    for (var i = 0; i < header.length; i++) {
        if (header[i].hidden === false || header[i].hidden === undefined) {
            result.clone[k] = [];
            if (header[i].value === undefined) {
                if (typeof header[i] === "object")
                    value = "";
                else
                    value = header[i];
            }
            else
                value = header[i].value;
            if(toUpperCase)
                value = value.toUpperCase();
            if(toLowerCase)
                value = value.toLowerCase();
            var functionClick = undefined;
            switch (header[i].type) {
                case "check":
                    check[i] = "check";
                    bonus = _({
                        tag: "checkboxbutton",
                        class: "pizo-checkbox",
                        on: {
                            click: function (event) {
                                for (var j = 1; j < result.bodyTable.listCheckBox.length; j++) {
                                    result.bodyTable.listCheckBox[j].checked = this.checked;
                                }
                            }
                        }
                    })
                    result.bodyTable.listCheckBox = [bonus];
                    break;
                case "increase":
                    check[i] = "increase";
                    break;
                case "dragzone":
                    if(dragVertical)
                    check[i] = "dragzone";
                    else{
                        check[i] = "hidden";
                        continue;
                    }
                    break;
                case "detail":
                    check[i] = "detail";
                    var icon = "more";
                    if (header[i].icon !== undefined)
                        icon = header[i].icon;
                    bonus = _({
                        tag: "i",
                        class: "material-icons",
                        style: {
                            fontSize: "1.4rem",
                            cursor: "pointer"
                        },
                        props: {
                            innerHTML: icon
                        }
                    })
                    break;
            }
            if (header[i].sort === true || header[i].sort === undefined) {
                functionClickSort = function (event, me, index , result, dataIndex, row) {
                    var last_sort = document.getElementsByClassName("downgrade");
                    last_sort = last_sort[0];
                    me = me.parentNode;
                    if(last_sort!==me&&last_sort!==undefined)
                    {
                        last_sort.classList.remove("downgrade");
                    }
                    var last_sort = document.getElementsByClassName("upgrade");
                    last_sort = last_sort[0];
                    if(last_sort!==me&&last_sort!==undefined)
                    {
                        last_sort.classList.remove("upgrade");
                    }
                    if(!me.classList.contains("downgrade"))
                    {
                        sortArray(result.data,index);
                        me.classList.add("downgrade");
                        if(me.classList.contains("upgrade"))
                        me.classList.remove("upgrade");
                    }
                    else{
                        sortArray(result.data,index,false);
                        me.classList.add("upgrade");
                        if(me.classList.contains("downgrade"))
                        me.classList.remove("downgrade");
                    }
                        
                    result.updateTable(header, result.data, dragHorizontal, dragVertical);
                }
            }

            if (header[i].functionClick !== undefined)
                functionClick = header[i].functionClick;
            style = {};
            if(header[i].style!==undefined)
                style = header[i].style;
            cell = _({
                tag: "th",
                attr: {
                    role: 'columnheader'
                },
                style:style,
                props: {
                    id: i
                },
                on: {
                    click: function (index, row, functionClick) {
                        return function (event) {
                            event.preventDefault();
                            if (functionClick !== undefined)
                                functionClick(event, this, index, result, data[index], row);
                        }
                    }(i, row, functionClick),
                    mousedown: dragHorizontal ? function (index) {
                        return function (event) {
                            event.preventDefault();
                            var finalIndex;
                            for (var i = 0; i < result.clone.length; i++) {
                                if (result.clone[i][0].id == index) {
                                    finalIndex = i;
                                    break;
                                }
                            }
                            this.hold = false;
                            var dom = this;
                            this.default = event;
                            this.timeoutID = setTimeout(function () {
                                dom.hold = true;
                                moveElement(event, dom, result, finalIndex);
                            }, 200);
                        }
                    }(i) : undefined,
                    dragstart: dragHorizontal ? function () {
                        return false;
                    } : undefined,
                    mouseup: function () {
                        if (this.hold === false) {
                            this.hold = true;
                            // this.click();
                            clearTimeout(this.timeoutID);
                        }
                    },
                    mousemove: dragHorizontal ? function (index) {
                        return function (event) {
                            if (this.hold === false) {
                                var finalIndex;
                                for (var i = 0; i < result.clone.length; i++) {
                                    if (result.clone[i][0].id == index) {
                                        finalIndex = i;
                                        break;
                                    }
                                }
                                this.hold = false;
                                var deltaX = this.default.clientX - event.clientX,
                                    deltaY = this.default.clientY - event.clientY;
                                if ((Math.abs(deltaX) + Math.abs(deltaY)) > 10) {
                                    this.hold = true;
                                    moveElement(event, this, result, finalIndex);
                                    clearTimeout(this.timeoutID);
                                }
                            }
                        }
                    }(i) : undefined,
                }
            })
            if (header[i].sort === true) {
                cell.classList.add("has-sort")
            }

            if(header[i].element===undefined)
            {
                cell.addChild( _({text: value})) ;
            }else
            {
                cell.appendChild(data[i][j].element);
            }

            if (bonus !== undefined) {
                cell.addChild(bonus);
                bonus = undefined;
            }
            cell.addChild(_({
                tag:"div",
                class:"sort-container",
                on:{
                    click: function (index, row, functionClickSort) {
                        return function (event) {
                            event.preventDefault();
                            if (functionClickSort !== undefined)
                            functionClickSort(event, this, index, data[index], row,result);
                        }
                    }(i, row, functionClickSort),
                },
                child:[
                    {
                        tag:"sort-up",
                        class: ["arrow_up"],
                    },
                    {
                        tag:"sort-down",
                        class: ["arrow_down"],
                    }
                ]
            }));
            result.clone[k++].push(cell);
            
            row.addChild(cell);
        } else
            check[i] = "hidden";
    }
    result.getBodyTable(data);
   
    result.checkSpan  = checkSpan;
    return result;
}

function sortArray(arr,index,increase=true)
{
    if(increase){
        arr.sort(function (a, b) {
            if(a.child!==undefined)
            sortArray(a.child,index,increase);
            var valueA = a[index].value;
            var valueB = b[index].value;
            if(valueA===undefined)
                valueA = a[index];
            if(valueB===undefined)
                valueB = b[index];
            if (valueA > valueB)
                return -1;
            if ( valueA < valueB)
                return 1;
              return 0;
        })
    }
    else{
        arr.sort(function (a, b) {
            if(a.child!==undefined)
            sortArray(a.child,index,increase);
            var valueA = a[index].value;
            var valueB = b[index].value;
            if(valueA===undefined)
                valueA = a[index];
            if(valueB===undefined)
                valueB = b[index];
            if (valueA < valueB)
                return -1;
            if ( valueA > valueB)
                return 1;
              return 0;
        })
    }
    
}

export function getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    return today;
}

function random_bg_color() {
    var x = Math.floor(Math.random() * 256);
    var y = Math.floor(Math.random() * 256);
    var z = Math.floor(Math.random() * 256);
    var bgColor = "rgb(" + x + "," + y + "," + z + ")";
    return bgColor;
}