import Fcore from '../dom/Fcore';
import '../../css/ModuleView.css';
import '../../css/tablesort.css';
// import TabView from 'absol-acomp/js/TabView';
import { HashTable } from '../component/HashTable';
import { HashTableFilter } from '../component/HashTableFilter';
import {insertAfter} from './FormatFunction';

var _ = Fcore._;
var $ = Fcore.$;
var traceOutBoundingClientRect = Fcore.traceOutBoundingClientRect;

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

export function unit_Long(functionX = function () { }) {
    return _({
        tag: "selectmenu",
        class: "pizo-new-realty-dectruct-content-area-unit",
        on: {
            change: functionX
        },
        props: {
            items: [
                { text: "m", value: 1 },
                { text: "km", value: 1000 },
                { text: "in", value: 0.0254 }
            ]
        }
    });
}

export function unit_Zone(functionX = function () { }) {
    return _({
        tag: "selectmenu",
        class: "pizo-new-realty-dectruct-content-area-unit-size",
        on: {
            change: functionX
        },
        props: {
            items: [
                { text: "m²", value: 1 },
                { text: "km²", value: 1000000 },
                { text: "hecta", value: 10000 }
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

function moveAt(clone, pageX, pageY, shiftX, shiftY, trigger, functionCheckZone, bg, result) {
    var y = pageY - result.getBoundingClientRect().top;
    y -= shiftY;

    clone.style.top = y + 'px';

    var x = pageX - result.getBoundingClientRect().left;
    x -= shiftX;

    clone.style.left = x + 'px';
}

function onMouseMove(clone, event, shiftX, shiftY, trigger, functionCheckZone, bg, parent) {
    event.preventDefault();
    moveAt(clone, event.pageX, event.pageY, shiftX, shiftY, trigger, functionCheckZone, bg, parent);
}

function onMouseMoveFix(clone, event, shiftY, result) {
    event.preventDefault();
    moveAtFix(clone, event.pageY, shiftY, result);
}

function moveAtFix(clone, pageY, shiftY, result) {
    var y = pageY - result.getBoundingClientRect().top;
    y -= shiftY;
    var height = result.clientHeight;
    var tempx = height - 3 * clone.clientHeight / 4;
    var top = clone.clientHeight / 2;

    if (result.tagName !== "TABLE") {
        height += result.getHeightChild();
        tempx = height;
    } else {
        if (result.headerTable.offsetHeight === 0) {
            top = -clone.clientHeight / 4;
        }

    }

    if (y > tempx) {
        y = tempx;
        return;
    }

    if (y < top) {
        y = top;
        return;
    }

    clone.style.top = y + 'px';
}

function moveElement(event, me, result, index) {
    var scrollParent = me;

    while (scrollParent !== undefined && !scrollParent.classList.contains("absol-single-page-scroller")) {
        scrollParent = scrollParent.parentNode;
    }
    if (scrollParent === undefined)
        return;

    scrollParent.addEventListener("scroll", function (event) {
        bg.isMove = false;
        outFocus(clone, trigger, functionCheckZone, bg, result);
    })

    var trigger;
    var height = 112;
    if (result.height !== undefined)
        height = result.height;
    var clone = result.cloneColumn(index, height, undefined);
    var bg = result.backGround(height, function () {
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


    result.appendChild(bg);
    bg.appendChild(clone);
    let shiftX = clone.clientWidth / 2;
    let shiftY = clone.clientHeight / 2;
    moveAt(clone, event.pageX, event.pageY, shiftX, shiftY, trigger, functionCheckZone, bg, result);
    window.addEventListener('mousemove', trigger = function (event) { onMouseMove(clone, event, shiftX, shiftY, trigger, functionCheckZone, bg, result) });

    window.onmouseup = function () {
        bg.isMove = false;
        outFocus(clone, trigger, functionCheckZone, bg, result);
    };
}

function moveElementFix(event, me, result, index) {
    var trigger;
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
            if (AAYY(centerX, centerY, checkElement.getBoundingClientRect())) {
                if (!checkElement.classList.contains("focus-blast")) {
                    checkElement.classList.add("focus-blast");
                    break;
                }

            } else {
                if (checkElement.classList.contains("focus-blast"))
                    checkElement.classList.remove("focus-blast");
            }
            var removeList = document.getElementsByClassName("focus-blast")[0];
            if (removeList !== undefined)
                removeList.classList.remove("focus-blast");
        }

    }
    let shiftY = clone.clientHeight / 2;
    moveAtFix(clone, event.pageY, shiftY, result);
    scrollParent.addEventListener("scroll", function (event) {
        moveAtFix(clone, event.pageY, shiftY, result);
        bg.style.top = parseFloat(bg.style.realTop) - parseFloat(scrollParent.scrollTop) + "px";
    })
    window.addEventListener('mousemove', functionCheckZone);
    var trigger = function (event) {
        onMouseMoveFix(clone, event, shiftY, result);
    }
    var mouseUpFunction = function () {
        window.removeEventListener("mouseup", mouseUpFunction);
        var removeList = document.getElementsByClassName("focus-blast")[0];
        if (removeList !== undefined) {
            var row1 = removeList.row1;
            var row2 = removeList.row2;
            if (row1 === undefined && row2 === 0) {
                outFocus(clone, trigger, functionCheckZone, bg, result)
                return;
            }
            var element = me;
            while (element.tagName !== "TR" && element !== undefined) {
                element = element.parentNode;
            }
            if (element === removeList.elementReal) {
                outFocus(clone, trigger, functionCheckZone, bg, result)
                return;
            }
            result.bodyTable.insertBefore(element, removeList.elementReal);
            if (element.getElementChild !== undefined) {
                var elementChild = element.getElementChild();
                if (elementChild.length !== 0) {
                    for (var i = 0; i < elementChild.length; i++) {
                        result.bodyTable.insertBefore(elementChild[i], removeList.elementReal);
                    }
                }
            }
            if (result.data.child !== undefined) {
                result.data.child = changeIndex(result.data.child, index - 1, row1);
            }
            else
                result.data = changeIndex(result.data, index - 1, row1);
            result.childrenNodes = changeIndex(result.childrenNodes, index - 1, row1);
            var k = 0;
            for (var i = 0; i < result.clone.length; i++) {
                var checkValue = array_insertBefore(result.clone[i], element.childNodes[k], row2);
                if (checkValue === false)
                    continue;
                result.clone[i] = checkValue;
                k++;
            }
            if (result.checkSpan !== undefined)
                result.checkSpan = changeIndex(result.checkSpan, index - 1, row1);
        }

        outFocus(clone, trigger, functionCheckZone, bg, result);
    }
    window.addEventListener('mousemove', trigger);
    window.addEventListener("mouseup", mouseUpFunction)
}

function array_insertBefore(arr, data, new_index) {
    var old_index;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === data) {
            old_index = i;
            break;
        }
    }
    if (old_index === undefined)
        return false;
    // for testing
    return arr_change(arr, data, old_index, new_index)
};

function arr_change(arr, data, old_index, new_index) {
    if (new_index === undefined)
        new_index = arr.length + 1;
    if (old_index > new_index) {
        arr.splice(new_index, 0, data);
        arr.splice(old_index + 1, 1);
    }
    else {
        arr.splice(new_index, 0, data);
        arr.splice(old_index, 1);
    }

    return arr;
}

function changeIndex(arr, old_index, new_index) {
    var data = arr.splice(old_index, 1)[0];
    if (old_index < new_index)
        arr.splice(new_index - 1, 0, data);
    else
        arr.splice(new_index, 0, data);
    return arr;
}

function AABBYY(x, y, bound) {
    if (bound.x === 0 && bound.y === 0 && bound.width === 0 && bound.height === 0)
        return true;
    return x >= bound.x && y >= bound.y && x <= bound.x + bound.width && y <= bound.y + bound.height;
}

function AAYY(x, y, bound) {
    if (bound.x === 0 && bound.y === 0 && bound.width === 0 && bound.height === 0)
        return true;
    return y >= bound.y && y <= bound.y + bound.height;
}

function outFocus(clone, trigger, functionCheckZone, bg, parent) {
    window.removeEventListener('mousemove', functionCheckZone);
    window.removeEventListener('mousemove', trigger);
    window.onmouseup = null;
    setTimeout(function () {
        bg.selfRemove();
    }, 20)
    clone.selfRemove();
    var event = new CustomEvent('dragdrop');
    parent.bodyTable.parentNode.dispatchEvent(event);
}


function captureMousePosition(event) {
    window.xMousePos = event.pageX;
    window.yMousePos = event.pageY;
}


export function tableView(header = [], data = [], dragHorizontal, dragVertical, childIndex = 1, indexRow = 50) {
    if (window.mobilecheck())
        return tableViewMobile(header, data);

    var cell, row, value, check = [], bonus, style, dragElement;
    var checkSpan = [];
    var headerTable = _({
        tag: "thead",
    });
    var bodyTable = _({
        tag: "tbody"
    });

    var result = _({
        tag: "table",
        class: "sortTable",
        child: [
            headerTable,
            bodyTable
        ]
    });
    result.headerTable = headerTable;
    result.bodyTable = bodyTable;
    Object.assign(result, tableView.prototype);
    result.check = check;
    result.header = header;
    result.data = data;
    result.dragVertical = dragVertical;
    result.dragHorizontal = dragHorizontal;

    result.updatePagination = function (number = result.tempIndexRow) {
        result.tempIndexRow = number;
        if (result.paginationElement !== undefined) {
            result.updateTable(result.header, result.data, result.dragHorizontal, result.dragVertical);
            var pagination = result.pagination(result.tempIndexRow);
            result.paginationElement.parentNode.replaceChild(pagination, result.paginationElement);
        } else {
            var pagination = result.pagination(result.tempIndexRow);
            result.appendChild(pagination);
        }

        result.paginationElement = pagination;
    }
    result.updatePagination(indexRow);

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
            result.scrollParent = scrollParent;
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
    var toUpperCase = header.toUpperCase == true ? true : false;
    var toLowerCase = header.toLowerCase == true ? true : false;
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
            if (toUpperCase)
                value = value.toUpperCase();
            if (toLowerCase)
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
                    if (dragVertical)
                        check[i] = "dragzone";
                    else {
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
                functionClickSort = function (event, me, index, dataIndex, row, result) {
                    var last_sort = document.getElementsByClassName("downgrade");
                    last_sort = last_sort[0];
                    me = me.parentNode;
                    if (last_sort !== me && last_sort !== undefined) {
                        last_sort.classList.remove("downgrade");
                    }
                    var last_sort = document.getElementsByClassName("upgrade");
                    last_sort = last_sort[0];
                    if (last_sort !== me && last_sort !== undefined) {
                        last_sort.classList.remove("upgrade");
                    }
                    if (!me.classList.contains("downgrade")) {
                        sortArray(result.data, index);
                        me.classList.add("downgrade");
                        if (me.classList.contains("upgrade"))
                            me.classList.remove("upgrade");
                    }
                    else {
                        sortArray(result.data, index, false);
                        me.classList.add("upgrade");
                        if (me.classList.contains("downgrade"))
                            me.classList.remove("downgrade");
                    }
                    var event = new CustomEvent('sort',{bubbles:true,detail:{event:event,me: me,index: index,dataIndex: dataIndex,row: row,result:result}});
                    result.dispatchEvent(event);
                    if (result.paginationElement.noneValue !== true)
                        result.paginationElement.reActive();
                    else
                        result.updateTable(result.header, result.data, dragHorizontal, dragVertical);

                }
            }

            if (header[i].functionClick !== undefined)
                functionClick = header[i].functionClick;
            style = {};
            if (header[i].style !== undefined)
                style = header[i].style;
            dragElement = true;
            if (header[i].dragElement !== undefined && header[i].dragElement === false)
                dragElement = false;
            cell = _({
                tag: "th",
                attr: {
                    role: 'columnheader'
                },
                style: style,
                props: {
                    id: i
                },
                on: {
                    click: function (index, row, functionClick) {
                        return function (event) {
                            event.preventDefault();
                            if (functionClick !== undefined)
                                functionClick(event, this, index, row.data, row, result);
                        }
                    }(i, row, functionClick),
                    mousedown: (dragHorizontal && dragElement) ? function (index) {
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
                    dragstart: (dragHorizontal && dragElement) ? function () {
                        return false;
                    } : undefined,
                    mouseup: function () {
                        if (this.hold === false) {
                            this.hold = true;
                            // this.click();
                            clearTimeout(this.timeoutID);
                        }
                    },
                    mousemove: (dragHorizontal && dragElement) ? function (index) {
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
            if (functionClick !== undefined)
                cell.style.cursor = "pointer";
            var childUpDown = _({
                tag: "div",
                class: "sort-container",
                on: {
                    click: function (index, row, functionClickSort) {
                        return function (event) {
                            event.preventDefault();
                            if (functionClickSort !== undefined)
                                functionClickSort(event, this, index, row.data, row, result);
                        }
                    }(i, row, functionClickSort),
                },
                child: [
                    {
                        tag: "sort-up",
                        class: ["arrow_up"],
                    },
                    {
                        tag: "sort-down",
                        class: ["arrow_down"],
                    }
                ]
            })

            if (header[i].sort === true) {
                cell.classList.add("has-sort")
                var tempFunc = function (cellIndex, childUpDown) {
                    return function () {
                        var style2 = window.getComputedStyle(childUpDown);
                        if (cellIndex.style.minWidth == "")
                            cellIndex.style.minWidth = cellIndex.clientWidth + childUpDown.clientWidth + parseFloat(style2.borderLeftWidth) + parseFloat(style2.borderRightWidth) + 30 + "px";
                    }
                }(cell, childUpDown);
                _('attachhook').once('error', tempFunc);
            }

            if (header[i].element === undefined) {
                cell.addChild(_({ text: value }));
            } else {
                cell.appendChild(data[i][j].element);
            }

            if (bonus !== undefined) {
                cell.addChild(bonus);
                bonus = undefined;
            }
            cell.addChild(childUpDown);


            result.clone[k++].push(cell);

            row.addChild(cell);
        } else
            check[i] = "hidden";
    }
    result.parentMargin = 0;

    result.childIndex = childIndex;

    result.childrenNodes = [];
    result.getBodyTable(data);

    result.checkSpan = checkSpan;

    return result;
}

tableView.prototype.checkLongRow = function (index) {
    var result = this;
    var delta = [];
    for (var i = 0; i < result.clone.length; i++) {
        delta[i] = 0;
        if (result.checkSpan !== undefined) {
            for (var j = 0; j < index; j++) {
                if (result.checkSpan[j] !== undefined)
                    if (result.checkSpan[j][i] !== undefined)
                        delta[i]++;
            }
        }
    }
    return delta;
}

tableView.prototype.setArrayFix = function (num, isLeft) {
    var i;
    var length;

    if (isLeft) {
        i = 0;
        length = num;
    }
    else {
        i = this.clone.length - num;
        length = this.clone.length;
    }
    var isFirst = false;
    for (; i < length; i++) {
        for (var j = 0; j < this.clone[i].length; j++) {
            if (!this.clone[i][j].classList.contains("postionStickyCell"))
                this.clone[i][j].classList.add("postionStickyCell");
            this.clone[i][j].style.left = this.clone[i][j].offsetLeft + "px";
            if (isFirst && this.clone[i][j].parentNode.childrenNodes.length !== 0)
                this.clone[i][j].parentNode.setArrayFix(num, isLeft);
            isFirst = true;
        }
        isFirst = false;
        // 
    }
}

tableView.prototype.setArrayScroll = function (num, isLeft = true) {
    var self = this;
    _('attachhook').once('error', function () {
        setTimeout(function () {
            self.setArrayFix(num, isLeft);
        }, 10);
    })
}

tableView.prototype.addInputSearch = function (input) {
    var self = this;
    self.hashTable = new HashTable(self.data);
    input.onchange = function (event, needUpdate = false) {
        if (input.value !== input.lastInputSearch || needUpdate == true) {
            self.checkTableView(input.value);
            input.lastInputSearch = input.value;
            self.updatePagination();
        }
    }
    input.addEventListener("input", input.onchange);
    if (self.inputElement === undefined)
        self.inputElement = [];
    self.inputElement.push(input);
}

tableView.prototype.addFilter = function (input, index) {
    console.log(input)
    var self = this;
    self.hashTableFilter = new HashTableFilter(self.data);

    input.on("change", function (event, needUpdate = false) {
        self.checkTableViewFilter(input.value, index);
        self.updatePagination();
    })
    if (self.inputFilter === undefined)
        self.inputFilter = [];
    self.inputFilter.push([input,index]);
}

tableView.prototype.checkTableView = function (value) {
    var self = this;
    self.hashTable.getKey(value);
}

tableView.prototype.checkTableViewFilter = function (value, index) {
    var self = this;
    self.hashTableFilter.getKey(value, index);
}

tableView.prototype.updateHash = function (row) {
    var object = row.data;
    var value;
    if(this.inputElement!==undefined||this.inputFilter!==undefined){
        if(this.inputFilter!==undefined)
            for(var k = 0;k<this.inputFilter.length;k++)
                {
                    if(this.inputFilter[k][0].value==0)
                        continue;
                    if (object[this.inputFilter[k][1]].value !== undefined)
                        value = object[this.inputFilter[k][1]].value;
                    else if (typeof object[this.inputFilter[k][1]] === "string")
                        value = object[this.inputFilter[k][1]];
                    else
                        value = "";
                    if(this.inputFilter[k][0].value != data[this.inputFilter[k][1]])
                    {
                        row.classList.add("disPlayNone");
                        setTimeout(function(){
                            row.classList.remove("parent");
                        },10)
                            return false;
                    }
                }
        for(var i = 0;i<object.length;i++)
        {
            if (object[i].value !== undefined)
                value = object[i].value;
            else if (typeof object[i] === "string")
                value = object[i];
            else
                value = "";
            
            if(this.inputElement!==undefined)
                for(var k = 0;k<this.inputElement.length;k++)
                {
                    if(this.inputElement[k].value === "")
                        continue;
                    for(var j = 0;j<value.length;j++)
                    {
                        var checkCharacter = -1;
                        var current = this.inputElement[k].value.indexOf[value[j]];
                        if(current == -1||current<checkCharacter)
                        {
                            row.classList.add("disPlayNone");
                            setTimeout(function(){
                                row.classList.remove("parent");
                            },10)
                                return false;
                            
                        }else
                        checkCharacter = current;
                    }   
                }
        }
        
    }
    return true;
}

tableView.prototype.resetHash = function () {
    var self = this;
    if (self.hashTable !== undefined)
        self.hashTable = new HashTable(self.data);
    if (self.hashTableFilter !== undefined)
        self.hashTableFilter = new HashTableFilter(self.data);
}

tableView.prototype.setVisiableAll = function (arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i].confirm = true;
        if (arr[i].child !== undefined)
            this.setVisiableAll(arr[i].child);
    }
}

tableView.prototype.getBodyTable = function (data, index = 0) {
    var temp = this.bodyTable;
    var result = this, k, delta = [], row, cell;
    var arr = [];
    if (parent.checkSpan === undefined)
        result.checkSpan = [];
    if(result.indexRow == undefined||result.indexRow == this.tempIndexRow)
        result.indexRow = 0;
    for (var i = 0; (i < data.length && this.indexRow < this.tempIndexRow); i++) {
        if (data[i].child !== undefined)
            data[i].child.updateVisible = data.updateVisible;

        if (data.updateVisible === true) {
            var tempCheck = data[i].confirm;
            data[i].confirm = undefined;
            if (tempCheck !== true) {
                data[i].visiable = false;
                if (data[i].child !== undefined)
                    result.getBodyTable(data[i].child);
                continue;
            } else {
                data[i].visiable = undefined;
                if (data[i].child !== undefined)
                    result.setVisiableAll(data[i].child)
            }
        } else {
            if (data[i].visiable === false) {
                if (data[i].child !== undefined)
                    result.getBodyTable(data[i].child);
                continue;
            }
        }
        if(index !== 0)
        {
            index--;
            continue;
        }
        row = result.getRow(data[i]);
        temp.addChild(row);
        arr.push(row);
        for (var j = 0; j < temp.parentNode.clone.length; j++) {
            k = parseFloat(temp.parentNode.clone[j][0].id);
            if (delta[j] === undefined)
                delta[j] = 0;
            cell = result.getCell(data[i][k], this.indexRow, k, j, result.checkSpan, row);
            if (cell === 6 || cell === 2) {
                result.clone[j].splice(this.indexRow + 1 - delta[j], 1);
                delta[j] += 1;
                continue
            }
            if (cell === true) {
                continue;
            }
            cell.clone = result.clone;
            result.clone[j][this.indexRow + 1 - delta[j]] = cell;
            row.addChild(cell);
        }
        row.checkChild();
        this.indexRow++;
    }

    if(data.updateVisible)
        result.setConfirm(data, i);
    if (result.checkMargin !== undefined)
        result.checkMargin();

    data.updateVisible = undefined;
    result.childrenNodes = result.childrenNodes.concat(arr);
    this.indexRow = 0;
    return arr;
}

tableView.prototype.setConfirm = function (arr, i = 0) {
    for (i; i < arr.length; i++) {
        if(arr[i].confirm !== undefined)
        arr[i].visiable = arr[i].confirm;
        else
        arr[i].visiable = false;
        arr[i].confirm = undefined;
        if (arr[i].child !== undefined) {
            this.setConfirm(arr[i].child);
        }
    }
}

tableView.prototype.countRow = function () {
    var countRowVisiable = this.countRowChild(this.data);

    return countRowVisiable;
}

tableView.prototype.countRowChild = function (arr) {
    var countRowVisiable = 0
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].visiable != false)
            countRowVisiable++;
        if (arr[i].child !== undefined)
            countRowVisiable += this.countRowChild(arr[i].child);
    }
    return countRowVisiable;
}

tableView.prototype.pagination = function (number, functionClick) {
    var countPrecent = Math.ceil(this.countRow() / number);

    if (countPrecent <= 1) {
        var temp = _({
            tag: "div",
            style: {
                display: "none"
            }
        })
        temp.noneValue = true;
        return temp;
    }

    var self = this;
    var paginationLeftPos = "20px";
    var paginationOpacity = 0;
    var checkPaginationClick = 0;
    var arr = [];
    var overlay = _({
        tag: "div",
        class: "pagination-hover-overlay"
    })
    var container = _({
        tag: "div",
        class: "pagination-wrapper",
    })
    var temp = _({
        tag: "div",
        class: "pagination",
        child: [
            {
                tag: "div",
                class: "pagination-container",
                child: [
                    overlay,
                    {
                        tag: "div",
                        class: "pagination-prev",
                        on: {
                            click: function (event) {
                                var temp = $("a.active", container);

                                if (temp !== undefined)
                                    var prev = temp.previousSibling;
                                while (prev != null && prev.classList.contains("detail"))
                                    prev = prev.previousSibling;
                                if (prev !== null) {
                                    prev.click();
                                    temp.style.color = "";
                                }


                            }
                        },
                        props: {
                        },
                        child: [
                            {
                                tag: "span",
                                class: ["icon-pagination", "icon-pagination-prev"],
                                child: [
                                    {
                                        tag: "i",
                                        class: ["icon", "material-icons"],
                                        props: {
                                            innerHTML: "keyboard_arrow_left"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    container,
                    {
                        tag: "div",
                        class: "pagination-next",
                        on: {
                            click: function (event) {
                                var temp = $("a.active", container);

                                if (temp !== undefined)
                                    var next = temp.nextSibling;
                                while (next != null && next.classList.contains("detail"))
                                    next = next.nextSibling;
                                console.log(next)
                                if (next !== null) {
                                    next.click();
                                    temp.style.color = "";
                                }
                            }
                        },
                        child: [
                            {
                                tag: "span",
                                class: ["icon-pagination", "icon-pagination-next"],
                                child: [
                                    {
                                        tag: "i",
                                        class: ["icon", "material-icons"],
                                        props: {
                                            innerHTML: "keyboard_arrow_left"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    })

    for (var i = 0; i < countPrecent; i++) {
        if (i == 1) {
            temp.detailLeft = _({
                tag: "a",
                class: ["pagination-page-number", "detail"],
                props: {
                    innerHTML: "..."
                }
            });
            container.appendChild(temp.detailLeft);
        }

        if (i == countPrecent - 1) {
            temp.detailRight = _({
                tag: "a",
                class: ["pagination-page-number", "detail"],
                props: {
                    innerHTML: "..."
                }
            });
            container.appendChild(temp.detailRight);
        }
        var choiceSelect = _({
            tag: "a",
            class: "pagination-page-number",
            on: {
                click: function (i) {
                    return function (event) {
                        var active = $("a.active", container);
                        if (active !== undefined)
                            active.classList.remove("active");
                        this.classList.add("active");
                        temp.updateSize();
            
                        paginationOpacity = 1;
                        checkPaginationClick = 1;
                        overlay.style.backgroundColor = "#00178a";
                        overlay.style.opacity = paginationOpacity;
                        var x = this;
                        setTimeout(function(){
                            paginationLeftPos = x.offsetLeft + "px";
                            overlay.style.left = paginationLeftPos;
                  
                        },10)
                      
                        this.style.color = "#fff";

                        if (functionClick !== undefined)
                            functionClick(event, i);
                        self.updateTable(undefined, self.data, self.dragHorizontal, self.dragVertical, i * number);
                        if (self.scrollParent !== undefined)
                            self.scrollParent.scrollTop = 0;
                        if(self.changePageIndex!==undefined)
                            self.changePageIndex(i);
                    }
                }(i),
                mouseover: function (event) {
                    paginationOpacity = 1;
                    overlay.style.backgroundColor = "#00c1dd";
                    overlay.style.left = this.offsetLeft + "px";
                    overlay.style.opacity = paginationOpacity;
                    var active = $("a.active", container);

                    if (active !== undefined)
                        active.style.color = "#333d45";
                    this.style.color = "#fff";
                },
                mouseout: function (event) {
                    if (checkPaginationClick) {
                        paginationOpacity = 1;
                    } else {
                        paginationOpacity = 0;
                    }
                    overlay.style.backgroundColor = "#00178a";
                    overlay.style.opacity = paginationOpacity;
                    overlay.style.left = paginationLeftPos;

                    this.style.color = "#333d45";
                    var active = $("a.active", container);
                    if (active !== undefined)
                        active.style.color = "#fff";
                }
            },
            props: {
                innerHTML: i + 1
            }
        })

        arr.push(choiceSelect);
        container.appendChild(choiceSelect);
    }

    temp.resetChoice = function () {
        setTimeout(function () {
            arr[0].click();
        }, 10)
    }

    temp.resetOnlyView = function () {
        setTimeout(function () {
            if (arr.length == 0)
                return;
            var temp = $("a.active", container);
            if (temp !== undefined) {
                temp.classList.remove("active");
                temp.style.color = "";
            }

            arr[0].classList.add("active");
            paginationLeftPos = arr[0].offsetLeft + "px";
            paginationOpacity = 1;
            checkPaginationClick = 1;
            overlay.style.left = paginationLeftPos;
            overlay.style.backgroundColor = "#00178a";
            overlay.style.opacity = paginationOpacity;
            arr[0].style.color = "#fff";
        }, 10);
    }
    temp.reActive = function () {
        var temp = $("a.active", container);
        if (temp !== undefined)
            temp.click();
    }
    temp.resetOnlyView();
    var displayNone = [];
    temp.updateSize = function () {
        setTimeout(function(){
            temp.detailLeft.style.display = "";
            temp.detailRight.style.display = "";
            for (var i = 0; i < displayNone.length; i++) {
                displayNone[i].style.display = "";
            }
            var count = parseInt((self.offsetWidth-20) / 50) - 4;
            var i = 0;
            var active = $("a.active", container);
            displayNone = [active];
            var countTime = -99;
            if (count < arr.length) {
                var countTime = count;
            }
            var lastIndexPrev,lastIndexPrevBefore;
            var lastIndexNext,lastIndexNextBefore;
            var isLeft = false, isRight = false;
            if (active !== undefined) {
                var prev = active.previousSibling, next = active.nextSibling;
    
                while (i <= count && !(isLeft == true && isRight == true)) {
                    if (isRight == false && next != null) {
                        if (i == countTime) {
                            while (next == temp.detailRight || next == temp.detailLeft)
                                next = next.nextSibling;
    
                                isRight = true;
                                lastIndexNext.style.display = "";
                                lastIndexNextBefore.style.display = "";
    
                                temp.detailRight.style.display = "flex";
                                displayNone.push(container.lastChild);
                                container.lastChild.style.display = "flex";                        
                        } else {
                            while (next == temp.detailRight || next == temp.detailLeft)
                                next = next.nextSibling;
                            next.style.display = "flex";
    
                            lastIndexNextBefore = lastIndexNext;
                            lastIndexNext = next;
    
                            displayNone.push(next);
                            next = next.nextSibling;
                            i++;
                        }
                    } else {
                        isRight = true;
                    }
    
                    if (i > count)
                        break;
    
                    if (isLeft == false && prev != null) {
                        if (i == countTime) {
                            while (prev == temp.detailLeft || prev == temp.detailRight)
                            prev = prev.previousSibling;
    
                            isLeft = true;
                            lastIndexPrev.style.display = "";
                            lastIndexPrevBefore.style.display = "";
                            temp.detailLeft.style.display = "flex";
                            displayNone.push(container.firstChild);
                            container.firstChild.style.display = "flex";
                        } else {
                            while (prev == temp.detailLeft || prev == temp.detailRight)
                                prev = prev.previousSibling;
                            prev.style.display = "flex";
    
                            lastIndexPrevBefore = lastIndexPrev;
                            lastIndexPrev = prev;
    
                            displayNone.push(prev);
                            prev = prev.previousSibling;
                            i++;
                        }
                    } else {
                        isLeft = true;
                    }
                }
            }
        },10);
    }
        temp.updateSize();
    this.goto = function(index){
        arr[index-1].click();
    }
    return temp;
}

tableView.prototype.getRow = function (data) {
    var temp = _({
        tag: "tr",
    });
    var result = this;
    setTimeout(function () {
        temp.className = temp.className + " parent";
    }, 10);
    Object.assign(temp, tableView.prototype);
    temp.headerTable = result.headerTable;
    temp.bodyTable = result.bodyTable;
    temp.check = result.check;
    temp.header = result.header;
    temp.dragVertical = result.dragVertical;
    temp.dragHorizontal = result.dragHorizontal;
    temp.data = data;

    if (temp.data.child === undefined)
        temp.data.child = [];
    temp.childrenNodes = [];
    temp.clone = [];
    temp.parentMargin = result.parentMargin + 1;
    temp.childIndex = result.childIndex;
    temp.moreChild = temp.data.moreChild;
    temp.data.moreChild = undefined;
    temp.tempIndexRow = result.tempIndexRow;

    temp.checkLeft = function () {
        for (var i = 0; i < temp.childNodes.length; i++)
            temp.childNodes[i].checkLeft();
    }
    if (temp.data.marker !== undefined) {
        temp.id = temp.data.marker.toString();
    }
    temp.checkChild = function (data) {
        temp.checkClone();
        if (data !== undefined)
            temp.data = data;
        if (temp.data.child.length !== 0) {
            temp.checkIcon();
            temp.getBodyTable(temp.data.child);

        }
    }

    temp.checkClone = function () {
        if (temp.clone.length === 0) {
            temp.clone = [];
            var k = 0;
            for (var i = 0; i < temp.childNodes.length; i++) {
                temp.clone[k++] = [temp.childNodes[i]];
                if (temp.childNodes[i].colSpan !== 1) {
                    k++;
                }
            }
        }
    }

    temp.checkIcon = function () {
        var indexMore = 0;
        if (temp.childIndex !== undefined) {
            if (temp.childIndex === 0) {
                if (!result.headerTable.parentNode.classList.contains("padding-High-table"))
                    result.headerTable.parentNode.classList.add("padding-High-table");
            }

            indexMore = temp.childIndex;
        }

        temp.classList.add("more-child");
        var buttonClick = _({
            tag: "div",
            class: "more-icon-container",
            on: {
                click: function (event) {
                    temp.setDisPlay();
                }
            },
            child: [
                {
                    tag: "i",
                    class: ["material-icons", "more-button"],
                    props: {
                        innerHTML: "play_arrow"
                    },
                }
            ]
        });
        var x = temp.childNodes[indexMore].firstChild;
        while (x.classList !== undefined && x.classList.contains("margin-div-cell"))
            x = x.nextSibling;
        temp.childNodes[indexMore].insertBefore(buttonClick, x);
        this.buttonClick = buttonClick;
        result.checkMargin = function () {
            for (var i = 0; i < result.clone[indexMore].length; i++) {
                if (!result.clone[indexMore][i].classList.contains("margin-left-has-icon"))
                    result.clone[indexMore][i].classList.add("margin-left-has-icon");
            }
        }
        result.checkMargin();
        setTimeout(function () {
            if (temp.moreChild == false) {
                temp.setDisPlay();
                temp.moreChild = undefined;
            }
        }, 1)
    }


    temp.checkVisibleChild = function () {
        this.buttonClick.selfRemove();
        var parent = this.childNodes[0].getParentNode();
        if (parent.tagName === "TABLE") {
            for (var i = 0; i < parent.bodyTable.childNodes.length; i++) {
                if (parent.bodyTable.childNodes[i].childNodes[parent.childIndex].classList.contains("margin-left-has-icon"))
                    parent.bodyTable.childNodes[i].childNodes[parent.childIndex].classList.remove("margin-left-has-icon")
            }
        }
    }

    return temp;
}

tableView.prototype.setDisPlay = function () {
    if (!this.classList.contains("more-child")) {
        this.classList.add("more-child");
        var childrenNodes = this.childrenNodes;
        var arrFunction = [];
        for (var i = 0; i < childrenNodes.length; i++) {
            childrenNodes[i].classList.remove("disPlayNone");
            arrFunction.push(function (childrenNodes, i) {
                return function () {
                    childrenNodes[i].classList.add("parent");
                }
            }(childrenNodes, i));
            if (childrenNodes[i].childrenNodes.length !== 0)
                childrenNodes[i].setDisPlayVisable();
        }
        setTimeout(function () {
            for (var i = 0; i < arrFunction.length; i++)
                arrFunction[i]();
        }, 10);
    }
    else {
        this.classList.remove("more-child");
        this.setDisPlayNone();
    }
}

tableView.prototype.setDisPlayVisable = function () {
    if (this.classList.contains("more-child")) {
        var arrFunction = [];
        var childrenNodes = this.childrenNodes;
        for (var i = 0; i < childrenNodes.length; i++) {
            childrenNodes[i].classList.remove("disPlayNone");
            arrFunction.push(function (childrenNodes, i) {
                return function () {
                    childrenNodes[i].classList.add("parent");
                }
            }(childrenNodes, i));
            if (childrenNodes[i].childrenNodes.length !== 0)
                childrenNodes[i].setDisPlayVisable();
        }
        setTimeout(function () {
            for (var i = 0; i < arrFunction.length; i++)
                arrFunction[i]();
        }, 10);
    }
}

tableView.prototype.setDisPlayNone = function () {
    var childrenNodes = this.childrenNodes;
    for (var i = 0; i < childrenNodes.length; i++) {
        childrenNodes[i].classList.remove("parent");
        childrenNodes[i].classList.add("disPlayNone");
        if (childrenNodes[i].childrenNodes.length !== 0)
            childrenNodes[i].setDisPlayNone();
    }
}

tableView.prototype.getDivMargin = function () {
    return _({
        tag: "div",
        class: "margin-div-cell"
    })
}

tableView.prototype.getCell = function (dataOrigin, i, j, k, checkSpan = [], row) {
    var data = dataOrigin;
    var result = this, value, bonus, style, cell;
    if (checkSpan[i] !== undefined) {
        if (checkSpan[i][k] == 2)
            return 2;
        if (checkSpan[i][k] == 6)
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
            if (data.icon !== undefined) {
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
            } else {
                bonus = _({
                    tag: "i",
                    class: ["material-icons", "drag-icon-button"],
                    props: {
                        innerHTML: "drag_indicator"
                    },
                    on: {
                        mousedown: result.dragVertical ? function (event) {
                            var self = this;
                            return function (event, cellIndex, self) {
                                event.preventDefault();
                                var finalIndex = cellIndex.getParentNode().childrenNodes.indexOf(cellIndex.parentNode);
                                self.hold = false;
                                var dom = self;
                                self.default = event;
                                self.timeoutID = setTimeout(function () {
                                    dom.hold = true;
                                    moveElementFix(event, dom, cellIndex.getParentNode(), finalIndex + 1);
                                }, 200);
                            }(event, cell, self)
                        } : undefined,
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
                        mousemove: result.dragVertical ? function (event) {
                            var self = this;
                            return function (event, cellIndex, self) {
                                if (self.hold === false) {
                                    var finalIndex = cellIndex.getParentNode().childrenNodes.indexOf(cellIndex.parentNode);
                                    self.hold = false;
                                    var deltaX = self.default.clientX - event.clientX,
                                        deltaY = self.default.clientY - event.clientY;
                                    if ((Math.abs(deltaX) + Math.abs(deltaY)) > 10) {
                                        self.hold = true;
                                        moveElementFix(event, self, cellIndex.getParentNode(), finalIndex + 1);
                                        clearTimeout(self.timeoutID);
                                    }
                                }
                            }(event, cell, self)
                        } : undefined,
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
    var functionClick = undefined;
    if (data.functionClick !== undefined)
        functionClick = data.functionClick;
    else {
        if (result.header[j].functionClickAll !== undefined)
            functionClick = result.header[j].functionClickAll;
    }

    style = {};
    if (data.style !== undefined)
        style = data.style;

    cell = _({
        tag: "td",
        style: style,
        on: {
            click: function (event) {
                return function (event, row, functionClick) {
                    event.preventDefault();
                    if (functionClick !== undefined) {
                        if (cell.getParentNode().childrenNodes.length !== 0)
                            var finalIndex = cell.getParentNode().childrenNodes.indexOf(cell.parentNode);
                        else
                            var finalIndex = 0;
                        console.log(row,"asdasd")
                        functionClick(event, cell, finalIndex, cell.getParentNode(), row.data, row);
                    }

                }(event, row, functionClick)
            },
        }
    })

    if (functionClick !== undefined)
        cell.style.cursor = "pointer";
    var container = _({
        tag: "div",
        class: "container-view",
    })

    cell.checkLeft = function () {
        return function (cell, result, k) {

            var widthSize = 0;
            var step = 1.71428571429;
            var arr = cell.getElementsByClassName("margin-div-cell");
            for (var i = arr.length - 1; i >= 0; i--) {
                arr[i].selfRemove();
            }
            if (result.data.child !== undefined)
                if (k === result.childIndex) {
                    for (var i = 0; i < result.parentMargin - 1; i++) {
                        cell.insertBefore(result.getDivMargin(), cell.firstChild);
                        widthSize += step;
                    }
                }
            container.style.width = "calc(100% - " + widthSize + "rem)";
            if (widthSize !== 0)
                cell.classList.add("margin-left-has-icon");
        }(cell, row, k)
    }


    row.resetParentChild = function () {
        for (var i = 0; i < row.childrenNodes.length; i++) {
            row.childrenNodes[i].parentMargin = row.parentMargin + 1;
            row.childrenNodes[i].resetParentChild();
        }
    }
    cell.addChild(container);
    cell.checkLeft();


    if (data.element === undefined) {
        container.addChild(_({ text: value }))

    } else {
        container.appendChild(data.element);
    }

    if (bonus !== undefined) {
        container.addChild(bonus);
        bonus = undefined;
    }

    if (data.rowspan !== undefined) {
        cell.setAttribute("rowspan", data.rowspan);
        for (var l = i + 1; l < i + data.rowspan; l++) {
            if (checkSpan[l] === undefined)
                checkSpan[l] = [];
            checkSpan[l][k] = 2;
        }
    }
    if (data.colspan !== undefined) {
        cell.setAttribute("colspan", data.colspan);

        checkSpan[i] = []
        for (var l = k + 1; l < k + data.colspan; l++) {
            checkSpan[i][l] = 6;
        }
    }
    cell.getParentNode = function () {
        var parent = cell.clone[0][0];
        parent = parent;
        if (parent.tagName === "TH")
            return parent.parentNode.parentNode.parentNode;
        return parent.parentNode;
    }
    return cell;
}

tableView.prototype.updateTable = function (header, data = [], dragHorizontal, dragVertical, index = 0) {
    var checkSpan = [];
    var result = this;
    var temp = _({
        tag: "tbody"
    });
    temp.listCheckBox = [];
    if (dragHorizontal !== undefined)
        result.dragHorizontal = dragHorizontal;
    if (dragVertical !== undefined)
        result.dragVertical = dragVertical;
    if (this.bodyTable.listCheckBox !== undefined)
        temp.listCheckBox[0] = this.bodyTable.listCheckBox[0];

    for (var i = 0; i < result.clone.length; i++) {
        result.clone[i] = [result.clone[i].shift()];
    }

    this.replaceChild(temp, this.bodyTable);
    this.bodyTable = temp;
    result.childrenNodes = [];
    result.getBodyTable(data, index);

    this.checkSpan = checkSpan;
    this.data = data;
}

tableView.prototype.insertRow = function (data, checkMust = false) {
    var result = this, k, cell;
    if (result.isUpdate === false)
        return;
    var delta = [];
    var row = result.getRow(data);

    for (var i = 0; i < result.clone.length; i++) {
        delta[i] = 0;
        if (result.checkSpan !== undefined) {
            if (result.checkSpan[index] !== undefined) {
                if (result.checkSpan[index][i] === 6) {
                    result.checkSpan[index][i] = undefined;
                    result.clone[i].splice(index + 1, 0, {})
                }
            }
            for (var j = 0; j < index; j++) {
                if (result.checkSpan[j] !== undefined)
                    if (result.checkSpan[j][i] !== undefined)
                        delta[i]++;
            }
        }
    }

    var checkChild = false;


    if (result.tagName === "TABLE")
        result.bodyTable.addChild(row);
    else {
        checkChild = true;
        if (!result.classList.contains("more-child"))
            result.setDisPlay();
        result.bodyTable.insertBefore(row, result.clone[0][result.clone[0].length - 1].parentNode.nextSibling);
    }

    for (var i = 0; i < this.bodyTable.parentNode.clone.length; i++) {
        k = parseFloat(this.bodyTable.parentNode.clone[i][0].id);
        cell = result.getCell(data[k], index, k, i, result.checkSpan, row);
        if (cell === 6) {
            result.clone[k++].splice(index, 1);
            continue;
        }
        if (cell === 2) {
            k++;
            continue;
        }
        if (cell === true) {
            continue;
        }
        cell.clone = result.clone;
        if (result.clone[i] === undefined)
            result.clone[i] = [];
        result.clone[i][index + 1 - delta[i]] = cell;
        k++;
        row.addChild(cell);
    }
    var x, indexData;
    
    result.childrenNodes[index] = row;

    indexData = result.childrenNodes.length;
    
    if (result.tagName !== "TABLE") {
        if (indexData === result.data.child.length) {
            result.data.child.push(data);
            x = data;
        }
        else {
            x = Object.assign(result.data.child[indexData], data);
            result.data.child[indexData] = x;
        }
    }
    else {
        if (indexData === result.data.length) {
            result.data.push(data);
            x = data;
        }
        else {
            x = Object.assign(result.data[indexData], data);
            result.data[indexData] = x;
        }
    }

    row.data = x;
    if (temp !== undefined) {
        row.childrenNodes = temp.childrenNodes;
        row.clone = temp.clone;
        row.checkSpan = temp.checkSpan;
        if (row.clone !== undefined) {
            var k = 0, l = 0;
            var delta = 0;
            for (var i = 0; i < row.clone.length; i++) {
                if (row.clone[i][0] === temp.childNodes[k]) {

                    row.clone[i].shift();
                    k++;
                }

                if (delta > 0) {
                    delta--;
                    continue;
                }

                row.clone[i].unshift(row.childNodes[l]);
                if (row.childNodes[l].colSpan != 1) {
                    delta += row.childNodes[l].colSpan - 1;
                }

                l++;
            }
        }

    }
    if (checkChild === true || checkMust === true) {
        if (result.checkIcon !== undefined)
            result.checkIcon();
    }
    if (row.childrenNodes.length !== 0)
        row.checkIcon();
    else
        row.checkClone();
    if (result.checkMargin !== undefined)
        result.checkMargin();

    //    result.checkDataUpdate(row);
    result.bodyTable.parentNode.resetHash();
    result.bodyTable.parentNode.updateHash(row);
    return row;
}

tableView.prototype.updateRow = function (data, index, checkMust = false) {
    var result = this, k, cell;
    if (result.isUpdate === false)
        return;
    var delta = [];
    var row = result.getRow(data);

    for (var i = 0; i < result.clone.length; i++) {
        delta[i] = 0;
        if (result.checkSpan !== undefined) {
            if (result.checkSpan[index] !== undefined) {
                if (result.checkSpan[index][i] === 6) {
                    result.checkSpan[index][i] = undefined;
                    result.clone[i].splice(index + 1, 0, {})
                }
            }
            for (var j = 0; j < index; j++) {
                if (result.checkSpan[j] !== undefined)
                    if (result.checkSpan[j][i] !== undefined)
                        delta[i]++;
            }
        }
    }

    var checkChild = false;

    if (result.tagName !== "TABLE") {
    if(result.childrenNodes.length!=result.data.child.length)
    {
        var table = result.bodyTable.parentNode;
        table.updateTable(undefined,table.data);
        return;
    }
    }else
    if(result.childrenNodes.length!=result.data.length)
    {
        var table = result.bodyTable.parentNode;
        table.updateTable(undefined,table.data);
        return;
    }

    var temp;
    temp = result.childrenNodes[index];
    result.bodyTable.replaceChild(row, temp);
    row.classList.value = temp.classList.value;

    if (temp.childrenNodes !== undefined) {
        row.childrenNodes = temp.childrenNodes;
        row.clone = temp.clone;
    }

    for (var i = 0; i < this.bodyTable.parentNode.clone.length; i++) {
        k = parseFloat(this.bodyTable.parentNode.clone[i][0].id);
        cell = result.getCell(data[k], index, k, i, result.checkSpan, row);
        if (cell === 6) {
            result.clone[k++].splice(index, 1);
            continue;
        }
        if (cell === 2) {
            k++;
            continue;
        }
        if (cell === true) {
            continue;
        }
        cell.clone = result.clone;
        if (result.clone[i] === undefined)
            result.clone[i] = [];
        result.clone[i][index + 1 - delta[i]] = cell;
        k++;
        row.addChild(cell);
    }
    var x, indexData;
    
    if(result.childrenNodes[index]===undefined)
    indexData = result.childrenNodes.length;
    else
    indexData = index;
    result.childrenNodes[index] = row;
    
    if (result.tagName !== "TABLE") {
        x = Object.assign(result.data.child[indexData], data);
        result.data.child[indexData] = x;
    }
    else {
        x = Object.assign(result.data[indexData], data);
        result.data[indexData] = x;
    }
    row.data = x;
    if (temp !== undefined) {
        row.childrenNodes = temp.childrenNodes;
        row.clone = temp.clone;
        row.checkSpan = temp.checkSpan;
        if (row.clone !== undefined) {
            var k = 0, l = 0;
            var delta = 0;
            for (var i = 0; i < row.clone.length; i++) {
                if (row.clone[i][0] === temp.childNodes[k]) {

                    row.clone[i].shift();
                    k++;
                }

                if (delta > 0) {
                    delta--;
                    continue;
                }

                row.clone[i].unshift(row.childNodes[l]);
                if (row.childNodes[l].colSpan != 1) {
                    delta += row.childNodes[l].colSpan - 1;
                }

                l++;
            }
        }

    }
    if (checkChild === true || checkMust === true) {
        if (result.checkIcon !== undefined)
            result.checkIcon();
    }
    if (row.childrenNodes.length !== 0)
        row.checkIcon();
    else
        row.checkClone();
    if (result.checkMargin !== undefined)
        result.checkMargin();

    //    result.checkDataUpdate(row);
    result.bodyTable.parentNode.resetHash();
    result.bodyTable.parentNode.updateHash(row);
    return row;
}

tableView.prototype.dropRow = function (index) {
    var result = this, deltaX = [];
    var element = result.clone[0][index + 1].parentNode;
    return new Promise(function (resolve, reject) {
        if (result.isUpdate === false)
            return;
        var parent = element.childNodes[0].getParentNode();
        if (!element.classList.contains("hideTranslate"))
            element.classList.add("hideTranslate");
        if (element.childrenNodes.length !== 0)
            element.addHideAnimationChild();
        parent.isUpdate = false;
        var eventEnd = function () {
            parent.dropRowChild(element)
            var deltaY = 0;

            deltaX = parent.checkLongRow(index);
            for (var i = 0; i < element.childNodes.length; i++) {
                parent.clone[i + deltaY].splice(index + 1 - deltaX[i + deltaY], 1);
                if (parent.checkSpan !== undefined)
                    parent.checkSpan.splice(index, 1);
                if (element.childNodes[i].colSpan !== undefined)
                    deltaY += element.childNodes[i].colSpan - 1;
            }
            if (parent.childrenNodes.length !== 0) {
                if (parent.data.child !== undefined) {
                    var indexData = parent.data.child.indexOf(element.data);
                    if(indexData!==-1)
                    parent.data.child.splice(indexData, 1);
                }
                else {
                    var indexData = parent.data.indexOf(element.data);
                    if(indexData!==-1)
                    parent.data.splice(indexData, 1);
                }
                parent.childrenNodes.splice(parent.childrenNodes.indexOf(element), 1);
            }
            if (result.checkVisibleChild !== undefined && result.childrenNodes.length === 0)
                result.checkVisibleChild();
            parent.isUpdate = true;
            result.bodyTable.parentNode.resetHash();
            resolve();
        };
        // Code for Safari 3.1 to 6.0
        element.addEventListener("webkitTransitionEnd", eventEnd);

        // Standard syntax
        element.addEventListener("transitionend", eventEnd);
    })
}

tableView.prototype.changeParent = function (index, rowParent) {
    var result = this, deltaX = [];
    var element = result.clone[0][index + 1].parentNode;
    var parent = element.childNodes[0].getParentNode();


    var deltaY = 0;

    deltaX = parent.checkLongRow(index);
    parent.changeRowChild(element, rowParent);
    for (var i = 0; i < element.childNodes.length; i++) {
        rowParent.clone[i + deltaY].push(element.childNodes[i]);
        parent.clone[i + deltaY].splice(index + 1 - deltaX[i + deltaY], 1);
        if (parent.checkSpan !== undefined)
            parent.checkSpan.splice(index, 1);
        if (element.childNodes[i].colSpan !== undefined)
            deltaY += element.childNodes[i].colSpan - 1;
    }



    if (parent.childrenNodes.length !== 0) {
        var indexData = parent.childrenNodes.indexOf(element);
        var dataTemp;
        if(parent.tagName == "TABLE")
            dataTemp = parent.data[indexData];
        else
            dataTemp = parent.data.child[indexData];
        if(rowParent.tagName == "TABLE")
        rowParent.data.push(dataTemp);
        else
        rowParent.data.child.push(dataTemp);
        if (parent.data.child !== undefined)
            parent.data.child.splice(indexData, 1);
        else
            parent.data.splice(indexData, 1);

        rowParent.childrenNodes.push(element);
        parent.childrenNodes.splice(indexData, 1);
    }

    if (result.checkVisibleChild !== undefined && result.childrenNodes.length === 0)
        result.checkVisibleChild();
    return rowParent.childrenNodes.length - 1;
}

tableView.prototype.addHideAnimationChild = function () {
    for (var i = 0; i < this.childrenNodes.length; i++) {
        if (!this.childrenNodes[i].classList.contains("hideTranslate"))
            this.childrenNodes[i].classList.add("hideTranslate");
        if (this.childrenNodes[i].childrenNodes.length !== 0) {
            this.childrenNodes[i].addHideAnimationChild();
        }
    }
}

tableView.prototype.changeRowChild = function (element, parent) {
    var current;
    if (parent.tagName === "TABLE") {
        current = null;
        parent.bodyTable.addChild(element);
    }
    else {
        current = parent.clone[0][parent.clone[0].length - 1].parentNode;
        insertAfter(element, current);
    }
    element.parentMargin = parent.parentMargin + 1;
    element.resetParentChild();
    element.checkLeft();
    if (element.childrenNodes.length !== 0)
        element.changeRowChildElement(element);
}

tableView.prototype.changeRowChildElement = function (current) {
    for (var i = 0; i < this.childrenNodes.length; i++) {
        if (this.tagName === "TABLE"||current == null)
            this.bodyTable.addChild(this.childrenNodes[i]);
        else{
            insertAfter(this.childrenNodes[i], current);
        }
        this.childrenNodes[i].checkLeft();
        if (this.childrenNodes[i].childrenNodes.length !== 0) {
            this.childrenNodes[i].changeRowChildElement(this.childrenNodes[i]);
        }
    }
}

tableView.prototype.dropRowChild = function (element) {
    element.selfRemove();
    if (element.childrenNodes.length !== 0)
        element.dropRowChildElement()
}

tableView.prototype.dropRowChildElement = function () {
    for (var i = 0; i < this.childrenNodes.length; i++) {
        this.childrenNodes[i].selfRemove();
        if (this.childrenNodes[i].childrenNodes.length !== 0) {
            this.childrenNodes[i].dropRowChildElement();
        }
    }
}

tableView.prototype.backGroundFix = function (index) {
    var rect = this.getBoundingClientRect();
    var scrollParent = this;
    while (scrollParent !== undefined && !scrollParent.classList.contains("absol-single-page-scroller")) {
        scrollParent = scrollParent.parentNode;
    }
    if (scrollParent === undefined)
        return;
    var rectDistance = traceOutBoundingClientRect(this);

    var temp = _(
        {
            tag: "div",
            class: "background-opacity",
            style: {
                top: rect.y + 'px',
                left: rect.x + scrollParent.scrollLeft + 'px',
                backgroundColor: "#ffffff00",
                realTop: rect.y + scrollParent.scrollTop,
                width: rectDistance.width - 17 + "px"
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
    var rect = this.getBoundingClientRect();
    var scrollParent = this;
    var rectDistance = traceOutBoundingClientRect(this);
    while (scrollParent !== undefined && !scrollParent.classList.contains("absol-single-page-scroller")) {
        scrollParent = scrollParent.parentNode;
    }
    if (scrollParent === undefined)
        return;

    var temp = _({
        tag: "div",
        class: "background-opacity-1",
        style: {
            top: rect.y + 'px',
            left: rect.x - 17 + 'px',
            backgroundColor: "#ffffff00",
            realTop: rect.y + scrollParent.scrollTop,
            // width:rectDistance.width-17+"px"
        },
        child: [
            {
                tag: "div",
                class: "delete-zone",
                style: {
                    transform: "translateY(-" + height + "px)",
                    top: rect.y + 'px',
                    left: rectDistance.left + 'px',
                    backgroundColor: "#ffffff00",
                    height: height + "px",
                    width: rectDistance.width + "px"
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
    for (var i = 0; i < this.clone[index].length; i++) {
        this.clone[index][i].selfRemove();
    }
    this.clone.splice(index, 1);
    for (var i = 0; i < this.childrenNodes.length; i++) {
        if (this.childrenNodes[i].childrenNodes.length !== 0) {
            this.childrenNodes[i].deleteColumn(index);
        }
    }
}

tableView.prototype.cloneColumn = function (index, height, isFull = false) {
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
    if (isFull)
        this.cloneCellColumn(bodyTable, this.clone, index);
    var result = _({
        tag: "table",
        style: {
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

tableView.prototype.cloneCellColumn = function (bodyTable, cloneArray, index) {
    var clone, cell;
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
        cell.classList = cloneArray[index][i].parentNode.classList;
        if (cloneArray[index][i].colSpan !== undefined)
            clone.setAttribute("rowSpan", "")
        bodyTable.addChild(cell);
        if (cloneArray[index][i].parentNode.clone !== undefined) {
            var cloneArrayTemp = cloneArray[index][i].parentNode.clone;
            this.cloneCellColumn(bodyTable, cloneArrayTemp, index);
        }

    }
}

tableView.prototype.cloneRow = function (index, isFull = false) {
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
            opacity: 0.7
        },
        class: "sortTableClone",
        child: [
            headerTable,
            bodyTable
        ]
    });
    var row = _({
        tag: "tr",
    });
    if (index === 0)
        headerTable.addChild(row)
    else {
        bodyTable.addChild(row);
    }
    for (var i = 0; i < this.clone.length; i++) {
        if (this.clone[i][index] === undefined)
            continue;
        clone = this.clone[i][index].cloneNode(true);
        clone.style.width = this.clone[i][index].offsetWidth - window.getComputedStyle(this.clone[i][index], null).getPropertyValue('padding-left').replace("px", "") - window.getComputedStyle(this.clone[i][index], null).getPropertyValue('padding-right').replace("px", "") - window.getComputedStyle(this.clone[i][index], null).getPropertyValue('border-left-width').replace("px", "") - window.getComputedStyle(this.clone[i][index], null).getPropertyValue('border-right-width').replace("px", "") + 1 + 'px';
        clone.style.height = this.clone[i][index].offsetHeight - window.getComputedStyle(this.clone[i][index], null).getPropertyValue('padding-top').replace("px", "") - window.getComputedStyle(this.clone[i][index], null).getPropertyValue('padding-bottom').replace("px", "") - window.getComputedStyle(this.clone[i][index], null).getPropertyValue('border-top-width').replace("px", "") - window.getComputedStyle(this.clone[i][index], null).getPropertyValue('border-bottom-width').replace("px", "") + 'px';
        clone.setAttribute("colSpan", "")
        row.appendChild(clone);
    }
    return result;
}

tableView.prototype.getBound2Colum = function (colum1, colum2, index) {
    var self = this;
    var left, right;
    var isShow = true;
    if (colum1 !== undefined)
        left = (self.clone[colum1][0].offsetWidth) / 2 + parseFloat(window.getComputedStyle(self.clone[colum1][0]).webkitBorderHorizontalSpacing) / 2;
    else
        left = 20 + parseFloat(window.getComputedStyle(self).paddingLeft);
    if (colum2 !== undefined) {
        right = (self.clone[colum2][0].offsetWidth) / 2 + parseFloat(window.getComputedStyle(self.clone[colum2][0]).webkitBorderHorizontalSpacing) / 2;
        if (self.clone[colum2][0].classList.contains("postionStickyCell"))
            isShow = false;
    }
    else
        right = 20 + parseFloat(window.getComputedStyle(self).paddingRight);

    var center = _({
        tag: "div",
        class: "move-hover-zone-center",
    });

    if (!isShow) {
        center.style.display = "none";
    }
    var temp = _({
        tag: "div",
        class: "move-hover-zone",
        style: {
            height: self.offsetHeight + "px",
        },
        on: {
            mouseover: isShow ? function () {
                if (this.parentNode.isMove === false) {
                    self.moveColumn(self.clone, colum1, colum2, index)
                }
            } : undefined
        },
        child: [
            {
                tag: "div",
                class: "move-hover-zone-left",
                style: {
                    width: left + 'px',
                }
            },
            center,
            {
                tag: "div",
                class: "move-hover-zone-right",
                style: {
                    width: right + 'px',
                }
            }
        ]
    })
    return temp;
}

tableView.prototype.moveColumn = function (arrClone, colum1, colum2, index, i = 0) {
    var parent;
    // if(index==colum1)
    //     return;
    // if(index==colum2)
    //     return;
    var delta = 0, lastDelta;
    for (i; i < arrClone[index].length; i++) {
        parent = arrClone[index][i - delta].parentNode;
        if (colum2 !== undefined) {
            if (lastDelta > 0) {
                lastDelta--;
                continue;
            }
            parent.insertBefore(arrClone[index][i - delta], arrClone[colum2][i]);
        }
        else {
            parent.appendChild(arrClone[index][i]);
        }
        if (arrClone[index][i].rowSpan !== undefined) {
            delta += arrClone[index][i].rowSpan - 1;
            lastDelta = arrClone[index][i].rowSpan - 1;
        }
        if (arrClone[index][i - delta].parentNode.clone !== undefined) {
            this.moveColumn(arrClone[index][i - delta].parentNode.clone, colum1, colum2, index, 1);
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

tableView.prototype.getHeightChild = function () {
    var result = 0;
    var self = this;
    var tempClone = self.childrenNodes;
    if (tempClone !== undefined)
        for (var i = 0; i < tempClone.length; i++) {
            result += tempClone[i].offsetHeight;
            if (tempClone[i].offsetHeight !== 0)
                result += parseFloat(window.getComputedStyle(tempClone[i]).webkitBorderVerticalSpacing);
            if (tempClone[i].childrenNodes.length !== 0) {
                result += tempClone[i].getHeightChild();
            }
        }
    return result;
}

tableView.prototype.getElementChild = function () {
    var result = [];
    var self = this;
    var tempClone = self.childrenNodes;
    if (tempClone !== undefined)
        for (var i = 0; i < tempClone.length; i++) {
            result.push(tempClone[i]);
            if (tempClone[i].childrenNodes.length !== 0) {
                result = result.concat(tempClone[i].getElementChild());
            }
        }
    return result;
}

tableView.prototype.getBound2Row = function (row1, row2) {
    var self = this;
    var top, bottom, elementReal;
    if (self.clone[0][row1] !== undefined)
        var style1 = window.getComputedStyle(self.clone[0][row1]);
    if (self.clone[0][row2] !== undefined) {
        var style2 = window.getComputedStyle(self.clone[0][row2]);
        elementReal = self.clone[0][row2].parentNode;
    } else {
        if (self.tagName !== "TABLE") {
            if (self.clone[0][row1].parentNode.childrenNodes.length !== 0) {
                var x = self.clone[0][row1].parentNode.getElementChild();
                elementReal = x[x.length - 1].nextSibling;
            }
            else
                elementReal = self.clone[0][row1].parentNode.nextSibling;
        }
    }
    if (row1 !== undefined) {
        top = (self.clone[0][row1].offsetHeight) / 2 + parseFloat(style1.webkitBorderVerticalSpacing) / 2;
    }
    else
        top = parseFloat(window.getComputedStyle(self).paddingTop);
    if (row2 !== undefined) {
        if (self.clone[0][row2].parentNode.style.display === "none")
            return _({
                tag: "div"
            })
        bottom = (self.clone[0][row2].offsetHeight) / 2 + parseFloat(style2.webkitBorderVerticalSpacing) / 2;

        if (self.clone[0][row2].tagName !== "TH" && row1 === undefined)
            bottom = (self.clone[0][row2].offsetHeight) / 2

        if (row1 !== undefined && self.clone[0][row2].parentNode.childrenNodes.length !== 0) {
            bottom += self.clone[0][row2].parentNode.getHeightChild();
        }
    }
    else {
        bottom = parseFloat(window.getComputedStyle(self).paddingBottom) + (self.clone[0][row1].offsetHeight) / 2;
    }

    if (row1 === undefined) {
        row1 = row2;
        row2++;
        if (self.clone[0][row1 + 1] !== undefined)
            elementReal = self.clone[0][row1 + 1].parentNode;
    }

    var temp = _({
        tag: "div",
        class: "move-hover-zone-topbot",
        props: {
            row1: row1,
            row2: row2,
            elementReal: elementReal
        },
        style: {
            width: self.offsetWidth + "px",
            // backgroundColor:random_bg_color()
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
    Object.assign(result, tableView.prototype);
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
    var toUpperCase = header.toUpperCase == true ? true : false;
    var toLowerCase = header.toLowerCase == true ? true : false;
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
            if (toUpperCase)
                value = value.toUpperCase();
            if (toLowerCase)
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
                    if (dragVertical)
                        check[i] = "dragzone";
                    else {
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
                functionClickSort = function (event, me, index, result, dataIndex, row) {
                    var last_sort = document.getElementsByClassName("downgrade");
                    last_sort = last_sort[0];
                    me = me.parentNode;
                    if (last_sort !== me && last_sort !== undefined) {
                        last_sort.classList.remove("downgrade");
                    }
                    var last_sort = document.getElementsByClassName("upgrade");
                    last_sort = last_sort[0];
                    if (last_sort !== me && last_sort !== undefined) {
                        last_sort.classList.remove("upgrade");
                    }
                    if (!me.classList.contains("downgrade")) {
                        sortArray(result.data, index);
                        me.classList.add("downgrade");
                        if (me.classList.contains("upgrade"))
                            me.classList.remove("upgrade");
                    }
                    else {
                        sortArray(result.data, index, false);
                        me.classList.add("upgrade");
                        if (me.classList.contains("downgrade"))
                            me.classList.remove("downgrade");
                    }


                    if (result.paginationElement.noneValue !== true)
                        result.paginationElement.reActive();
                    else
                        result.updateTable(result.header, result.data, dragHorizontal, dragVertical);
                }
            }

            if (header[i].functionClick !== undefined)
                functionClick = header[i].functionClick;
            style = {};
            if (header[i].style !== undefined)
                style = header[i].style;
            cell = _({
                tag: "th",
                attr: {
                    role: 'columnheader'
                },
                style: style,
                props: {
                    id: i
                },
                on: {
                    click: function (index, row, functionClick) {
                        return function (event) {
                            event.preventDefault();
                            if (functionClick !== undefined)
                                functionClick(event, this, index, result, row.data, row);
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
            if (functionClick !== undefined)
                cell.style.cursor = "pointer";
            if (header[i].sort === true) {
                cell.classList.add("has-sort")
                setTimeout(function (cell, value) {
                    cell.style.minWidth = fakeInput(value, window.getComputedStyle(cell).fontSize) + 30 + "px";
                }(cell, value), 50);
            }

            if (header[i].element === undefined) {
                cell.addChild(_({ text: value }));
            } else {
                cell.appendChild(data[i][j].element);
            }

            if (bonus !== undefined) {
                cell.addChild(bonus);
                bonus = undefined;
            }
            cell.addChild(_({
                tag: "div",
                class: "sort-container",
                on: {
                    click: function (index, row, functionClickSort) {
                        return function (event) {
                            event.preventDefault();
                            if (functionClickSort !== undefined)
                                functionClickSort(event, this, index, row.data, row, result);
                        }
                    }(i, row, functionClickSort),
                },
                child: [
                    {
                        tag: "sort-up",
                        class: ["arrow_up"],
                    },
                    {
                        tag: "sort-down",
                        class: ["arrow_down"],
                    }
                ]
            }));


            result.clone[k++].push(cell);

            row.addChild(cell);
        } else
            check[i] = "hidden";
    }
    result.childrenNodes = [];
    result.getBodyTable(data);

    result.checkSpan = checkSpan;
    return result;
}

function sortArray(arr, index, increase = true) {
    if (increase) {
        arr.sort(function (a, b) {
            if (a.child !== undefined)
                sortArray(a.child, index, increase);
            var valueA = a[index].value;
            var valueB = b[index].value;
            if (valueA === undefined)
                valueA = a[index];
            if (valueB === undefined)
                valueB = b[index];
            if (typeof valueA === "string")
                valueA = valueA.toLowerCase();
            if (typeof valueB === "string")
                valueB = valueB.toLowerCase();
            if (valueA > valueB)
                return -1;
            if (valueA < valueB)
                return 1;
            return 0;
        })
        if (arr.length !== 0)
            if (arr[arr.length - 1].child !== undefined) {
                sortArray(arr[arr.length - 1].child, index, increase);
            }
    }
    else {
        arr.sort(function (a, b) {
            if (a.child !== undefined)
                sortArray(a.child, index, increase);
            var valueA = a[index].value;
            var valueB = b[index].value;
            if (valueA === undefined)
                valueA = a[index];
            if (valueB === undefined)
                valueB = b[index];
            if (typeof valueA === "string")
                valueA = valueA.toLowerCase();
            if (typeof valueB === "string")
                valueB = valueB.toLowerCase();
            if (valueA < valueB)
                return -1;
            if (valueA > valueB)
                return 1;
            return 0;
        })
        if (arr.length !== 0)
            if (arr[arr.length - 1].child !== undefined) {
                sortArray(arr[arr.length - 1].child, index, increase);
            }
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

export function allowNumbersOnly(e) {
    var code = (e.which) ? e.which : e.keyCode;

    if ((code > 122 || code < 97) && code != 45) {
        e.preventDefault();
    }
}

export function createAlias(string) {
    var value = ""
    string = string.toLowerCase();
    string = removeAccents(string);

    for (var i = 0; i < string.length; i++) {
        if (string[i] == " ") {
            value += "-";
            continue;
        }

        if ((string[i] > "z" || string[i] < "a") && string[i] != "-") {
            continue;
        }

        value += string[i];
    }
    return value.replace(/^\-+|\-+$/gm, '');;
}

export function removeAccents(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export function deleteQuestion(title, content, yes = "Có", no = "không") {
    var contentElement;
    if (typeof content !== "object") {
        contentElement = _(
            {
                tag: "span",
                class: "module-delete-header-content",
                props: {
                    innerHTML: content
                }
            }
        )
    } else {
        contentElement = content;
    }
    var temp;
    var promiseComfirm = new Promise(function (resolve, reject) {
        temp = _({
            tag: "modal",
            class: "modal-delete-module",
            child: [
                {
                    tag: "div",
                    class: "module-delete-container",
                    child: [
                        {
                            tag: "div",
                            class: "module-delete-header",
                            child: [
                                {
                                    tag: "span",
                                    class: "module-delete-header-title",
                                    props: {
                                        innerHTML: title
                                    }
                                },
                                {
                                    tag: "div",
                                    class: "module-delete-header-close-container",
                                    on: {
                                        click: function (event) {
                                            temp.selfRemove();
                                            reject();
                                        }
                                    },
                                    child: [
                                        {
                                            tag: "i",
                                            class: ["module-delete-header-close", "material-icons"],
                                            props: {
                                                innerHTML: "close"
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            tag: "div",
                            class: "module-delete-content",
                            child: [
                                contentElement
                            ]
                        },
                        {
                            tag: "div",
                            class: "module-delete-button",
                            child: [
                                {
                                    tag: "button",
                                    class: "module-delete-button-yes",
                                    on: {
                                        click: function (event) {
                                            temp.selfRemove();
                                            resolve();
                                        }
                                    },
                                    child: [
                                        {
                                            tag: "span",
                                            class: "module-delete-button-yes-label",
                                            props: {
                                                innerHTML: yes
                                            }
                                        }
                                    ]
                                },
                                {
                                    tag: "button",
                                    class: "module-delete-button-no",
                                    on: {
                                        click: function (event) {
                                            temp.selfRemove();
                                            reject();
                                        }
                                    },
                                    child: [
                                        {
                                            tag: "span",
                                            class: "module-delete-button-no-label",
                                            props: {
                                                innerHTML: no
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                    ]
                }
            ]
        })
    })

    temp.promiseComfirm = promiseComfirm;
    return temp;
}
