import Fcore from '../dom/Fcore';
import '../../css/ModuleView.css';
import '../../css/tablesort.css';
// import '../../css/CardDone.css';
// import TabView from 'absol-acomp/js/TabView';
import { HashTable } from '../component/HashTable';
import { HashTableFilter } from '../component/HashTableFilter';
import { insertAfter, isNumeric } from './FormatFunction';
import Svg from 'absol/src/HTML5/Svg';
import BrowserDetector from 'absol/src/Detector/BrowserDetector';

BrowserDetector.isMobile


Svg.ShareInstance._;
Svg.ShareInstance.$;


window.getTextSize = function getTextSize(text) {
    var svg = Svg.ShareInstance._({
        tag: 'svg',
        style: {
            position: 'fixed',
            zIndex: '10000',
            top: 0,
            left: 0,
            background: 'gray'
        },
        child: {
            child: {
                tag: 'text',
                attr: {
                    transform: 'rotate(45)',
                    x: 0,
                    y: 0
                },
                style: {
                    fill: 'green'
                },
                child: { text: text },
            }
        }

    }).addTo(document.body);
    var text = Svg.ShareInstance.$('g');
    var size = text.getBBox();
    svg.attr({
        width: size.width,
        height: size.height,
        viewBox: [size.x, size.y, size.width, size.height].join(' ')
    })
    return size;
}




import Slip from './slip.js';

var _ = Fcore._;
var $ = Fcore.$;
var traceOutBoundingClientRect = Fcore.traceOutBoundingClientRect;

export function ModuleView() {

}

export function alignFormCss(element, elementDynamic, GroupElement = []) {
    var maxColumn = [],
        k, maxWidth, longElement = 0,
        check = [],
        countRow = [];
    for (var i = 0; i < element.length; i++) {
        k = 0;
        if (check.includes(element[i])) {
            element.splice(i, 1);
            i--;
            continue;
        } else {
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

                element[i].classList.forEach(function(result) {
                    value += "." + result;
                })
                value += ' ';
                element[i].childNodes[j].classList.forEach(function(result) {
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
                value += 'width: ' + (tempWidth - (padding + border + 1) / fontSizeHtml) + 'em; \n';
                value += '}\n';
                countRow[i] += tempWidth;
                resultcss += value;
            } else {
                Dynamic[i].push(j);
            }
        }
    }
    if (Dynamic.length !== 0) {
        Dynamic.forEach(function(result, index) {
            for (var i = 0; i < Dynamic[index].length; i++) {
                element[index].childNodes[Dynamic[index]]
                value = '';

                element[index].classList.forEach(function(result) {
                    value += "." + result;
                })
                value += ' ';
                element[index].childNodes[Dynamic[index]].classList.forEach(function(result) {
                    value += "." + result;
                })

                var el = element[index].childNodes[Dynamic[index]];
                var paddingLeft = window.getComputedStyle(el, null).getPropertyValue('padding-left');
                var paddingRight = window.getComputedStyle(el, null).getPropertyValue('padding-right');

                var border = window.getComputedStyle(el, null).getPropertyValue('border-width');
                border = parseFloat(border);
                var padding = parseFloat(paddingLeft) + parseFloat(paddingRight);

                value += '{\n';
                value += 'width: calc(' + 100 / Dynamic[index].length + '% - ' + (countRow[index] / Dynamic[index].length + (padding + border + 1) / fontSizeHtml) + 'em); \n';
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

    who.style.cssText = 'display:inline-block; padding:0; line-height:1; position:absolute; visibility:hidden; font-size:1em';

    who.appendChild(document.createTextNode('M'));
    pa.appendChild(who);
    var fs = [who.offsetWidth, who.offsetHeight];
    pa.removeChild(who);
    return fs;
}

export function selectElement(nameClass, elementDynamic) {
    var ElementStack = [],
        GroupElement = [];
    window.addEventListener("click", function(event) {
        var elementTarget = event.target;
        while (elementTarget.classList !== undefined && !elementTarget.classList.contains(nameClass))
            elementTarget = elementTarget.parentNode;
        if (elementTarget !== undefined && elementTarget !== document) {
            ElementStack.push(elementTarget);
        }
    })

    window.addEventListener("keydown", function(event) {
        if (event.keyCode === 27) {
            alignFormCss(ElementStack, elementDynamic, GroupElement)
        }
    })
}

export function unit_Long(functionX = function() {}) {
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

export function unit_Zone(functionX = function() {}) {
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
    var input = absol._({
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
            focus: function() {
                return (function(input) {
                    input.classList.add("isFocused");
                })(input);
            },
            blur: function() {
                return (function(input) {
                    input.classList.remove("isFocused");
                })(input);
            },
            input: function() {
                return (function() {
                    input.requestUpdateSize();
                    if (callback !== undefined)
                        callback(input.value);
                })();
            }
        }
    })
    input.getValue = function() {
        return input.value;
    };
    input.requestUpdateSize = function() {
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
    } else temp[0].style.fontSize = "1.7857em";
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

    if (result.tagName !== "DIV") {
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
    var scrollParent = result.realTable.parentNode;
    while (scrollParent) {
        var overflowStyle = window.getComputedStyle(scrollParent)['overflow'];
        if ((overflowStyle === 'auto' || overflowStyle === 'scroll' || scrollParent.tagName === 'HTML') && (scrollParent.clientHeight < scrollParent.scrollHeight || scrollParent.clientWidth < scrollParent.scrollWidth)) break;
        scrollParent = scrollParent.parentElement;
    }
    if (scrollParent)
        scrollParent.addEventListener("scroll", function(event) {
            bg.isMove = false;
            outFocus(clone, trigger, functionCheckZone, bg, result);
        })

    var trigger;
    var height = 112;
    if (result.height !== undefined)
        height = result.height;
    var clone = result.cloneColumn(index);
    var bg = result.backGround(height, function() {
        if (bg.noAction !== true)
            result.deleteColumn(index);
    }, index);



    var functionCheckZone = function(event) {
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
    let shiftX = clone.clientWidth / 2 - 15;
    let shiftY = clone.clientHeight / 2;
    moveAt(clone, event.pageX, event.pageY, shiftX, shiftY, trigger, functionCheckZone, bg, result);
    window.addEventListener('mousemove', trigger = function(event) { onMouseMove(clone, event, shiftX, shiftY, trigger, functionCheckZone, bg, result) });

    window.onmouseup = function() {
        bg.isMove = false;
        outFocus(clone, trigger, functionCheckZone, bg, result);
    };
}

function moveElementFix(event, me, result, index) {
    var trigger;
    var clone = result.cloneRow(index);
    var bg = result.backGroundFix(index);

    var scrollParent = result.realTable.parentNode;
    while (scrollParent) {
        var overflowStyle = window.getComputedStyle(scrollParent)['overflow'];
        if ((overflowStyle === 'auto' || overflowStyle === 'scroll' || scrollParent.tagName === 'HTML') && (scrollParent.clientHeight < scrollParent.scrollHeight || scrollParent.clientWidth < scrollParent.scrollWidth)) break;
        scrollParent = scrollParent.parentElement;
    }
    result.bodyTable.appendChild(bg);
    bg.appendChild(clone);
    var functionCheckZone = function(event) {
        var arrZone = bg.getZone();
        for (var i = 0; i < arrZone.length; i++) {
            var offset = clone.getBoundingClientRect();
            var centerX = offset.left + offset.width / 2; // [UPDATE] subtract to center
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
    if (scrollParent)
        scrollParent.addEventListener("scroll", function(event) {
            moveAtFix(clone, event.pageY, shiftY, result);
            bg.style.top = parseFloat(bg.style.realTop) - parseFloat(scrollParent.scrollTop) + "px";
        })
    window.addEventListener('mousemove', functionCheckZone);
    var trigger = function(event) {
        onMouseMoveFix(clone, event, shiftY, result);
    }
    var mouseUpFunction = function() {
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
            } else
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
    } else {
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
    setTimeout(function() {
        bg.selfRemove();
    }, 20)
    clone.selfRemove();
    var event = new CustomEvent('dragdrop');
    parent.realTable.parentNode.dispatchEvent(event);
}


function captureMousePosition(event) {
    window.xMousePos = event.pageX;
    window.yMousePos = event.pageY;
}


export function tableView(header = [], data = [], dragHorizontal = false, dragVertical = false, childIndex = 1, indexRow = 50) {
    var cell, row, check = [];
    var checkSpan = [];
    var headerTable = _({
        tag: "thead",
    });
    var bodyTable = _({
        tag: "tbody"
    });
    var realTable = _({
        tag: "table",
        class: "sortTable",
        child: [
            headerTable,
            bodyTable
        ]
    });
    var resolveAdd;
    var promiseAdd = new Promise(function(resolve, reject) {
        resolveAdd = resolve;
    })
    var result = _({
        tag: "div",
        class: "container-sortTable",
        child: [
            realTable,
            {
                tag: 'attachhook',
                on: {
                    error: function() {
                        resolveAdd();
                    }
                }
            }
        ]
    });
    data.checkVisiableCell = function(x, y) {
        if (typeof this[x][y] !== "object")
            return true;
        if (x > 0) {
            if (this[x - 1][y] === this[x][y])
                return false;
        }
        if (y > 0) {
            if (this[x][y - 1] === this[x][y])
                return false;
        }
        return true;
    }
    result.realTable = realTable;
    result.headerTable = headerTable;
    result.bodyTable = bodyTable;
    Object.assign(result, tableView.prototype);
    result.check = check;
    result.header = header;
    result.data = data;
    result.dragVertical = dragVertical;
    result.dragHorizontal = dragHorizontal;
    result.isSwipeLeft = false;
    result.isSwipeRight = false;
    result.sortArray = [];
    result.indexPageSum = Math.ceil(result.data.length / indexRow);


    if (window.scrollEvent === undefined) {
        window.xMousePos = 0;
        window.yMousePos = 0;
        window.lastScrolledLeft = 0;
        window.lastScrolledTop = 0;

        document.addEventListener("mousemove", function(event) {
            window.scrollEvent = captureMousePosition(event);
        })
        var scrollParent = result;
        promiseAdd.then(function() {
            while (scrollParent) {
                var overflowStyle = window.getComputedStyle(scrollParent)['overflow'];
                if ((overflowStyle === 'auto' || overflowStyle === 'scroll' || scrollParent.tagName === 'HTML') && (scrollParent.clientHeight < scrollParent.scrollHeight || scrollParent.clientWidth < scrollParent.scrollWidth)) break;
                scrollParent = scrollParent.parentElement;
            }
            if (scrollParent) {
                var lastScrollTime = new Date().getTime();
                var functionScrollTemp = function(event) {
                    var now = new Date().getTime();
                    if (now - lastScrollTime > 300) {
                        if (!result.isDescendantOf(scrollParent)) {
                            scrollParent.removeEventListener("scroll", functionScrollTemp);
                            return;
                        }
                    }
                    lastScrollTime = new Date().getTime();
                    if (result.lastScrolledLeft != scrollParent.scrollLeft) {
                        window.xMousePos -= result.lastScrolledLeft;
                        result.lastScrolledLeft = scrollParent.scrollLeft;
                        window.xMousePos += result.lastScrolledLeft;
                    }
                    if (result.lastScrolledTop != scrollParent.scrollTop) {
                        window.yMousePos -= result.lastScrolledTop;
                        result.lastScrolledTop = scrollParent.scrollTop;
                        window.yMousePos += result.lastScrolledTop;
                    }
                }
                scrollParent.addEventListener("scroll", functionScrollTemp);
            }
            if (BrowserDetector.isMobile) {
                var tempLimit = _({
                    tag: "div",
                    child: [{
                        tag: "span",
                        style: {
                            padding: "10px",
                            textAlign: "center",
                            display: "block",
                            fontSize: "16px",
                        },
                        props: {
                            innerHTML: "Để tìm kiếm các phần tử cũ hơn vui lòng sử dung Tìm kiếm"
                        }
                    }]
                })
                tempLimit.style.display = "none";
                result.appendChild(tempLimit);
                if (scrollParent)
                    scrollParent.addEventListener("scroll", function(event) {
                        if (result.currentIndex > indexRow * 10 && result.currentIndex !== result.data.length) {
                            if (tempLimit.style.display !== "block")
                                tempLimit.style.display = "block";
                            return;
                        } else {
                            if (tempLimit.style.display !== "none")
                                tempLimit.style.display = "none";
                        }
                        if (result.currentIndex === result.data.length)
                            return;
                        result.indexPage = result.currentIndex / 10 + 1;
                        if (this.scrollTop >= (this.scrollHeight - this.offsetHeight)) {
                            if (result.getBodyTable !== undefined) {
                                result.getBodyTable(result.data);
                                if (result.bodyTable.listCheckBox !== undefined && result.bodyTable.listCheckBox.length > 0) {
                                    result.bodyTable.listCheckBox[0].update();
                                }
                            }
                        }
                        result.setUpSwipe();
                    })
            }
        }.bind(this))
    }
    result.updatePagination = function(number = result.tempIndexRow, isRedraw = true) {
        if (BrowserDetector.isMobile) {
            result.tempIndexRow = indexRow;
            if (isRedraw) {
                result.updateTable(undefined, undefined, undefined, undefined, undefined, false);
                if (scrollParent)
                    scrollParent.emit("scroll");
            }
        } else {
            result.tempIndexRow = parseInt(number);
            if (result.paginationElement !== undefined) {
                if (isRedraw) {
                    result.updateTable();
                }
                var pagination = result.pagination(result.tempIndexRow);
                result.paginationElement.parentNode.replaceChild(pagination, result.paginationElement);
            } else {
                var pagination = result.pagination(result.tempIndexRow);
                result.appendChild(pagination);
            }

            result.paginationElement = pagination;
        }
    }

    result.updatePagination(indexRow, false);
    row = _({
        tag: "tr"
    });
    headerTable.addChild(row);
    result.clone = [];
    var k = 0;
    result.toUpperCase = header.toUpperCase == true ? true : false;
    result.toLowerCase = header.toLowerCase == true ? true : false;
    for (var i = 0; i < header.length; i++) {
        if (header[i].hidden === false || header[i].hidden === undefined) {
            result.clone[k] = [];

            cell = result.getCellHeader(header[i], i)

            result.clone[k++].push(cell);

            row.addChild(cell);
        } else
            check[i] = "hidden";
    }
    result.parentMargin = 0;

    result.childIndex = childIndex;

    result.childrenNodes = [];
    result.getBodyTable(data, undefined, true);

    result.checkSpan = checkSpan;
    if (dragVertical) {
        result.slip = new Slip(result.bodyTable);
        result.setUpSlip();
    }
    return result;
}

tableView.prototype.getElementNext = function(element) {
    if (element.childrenNodes.length > 0) {
        return this.getElementNext(element.childrenNodes[element.childrenNodes.length - 1]);
    }
    return element.nextSibling;
}

tableView.prototype.getElementNextVisiale = function(element) {
    element = element.nextSibling;
    if (element)
        while (element.nextSibling && element.nextSibling.classList.contains("displayNone")) {
            element = element.nextSibling;
        }
    return element;
}


tableView.prototype.getElementPrevVisiale = function(element) {
    element = element.previousSibling;
    if (element)
        while (element.previousSibling && element.previousSibling.classList.contains("displayNone")) {
            element = element.previousSibling;
        }
    return element;
}


tableView.prototype.setUpSwipe = function(isSwipeLeft, isSwipeRight) {
    setTimeout(function() {
        if (isSwipeLeft !== undefined) {
            this.isSwipeLeft = isSwipeLeft;
        }
        if (this.isSwipeLeft !== undefined) {
            for (var i = 0; i < this.bodyTable.childNodes.length; i++) {
                if (this.bodyTable.childNodes[i].hiddenButtonLeft !== undefined)
                    continue;
                var hiddenButton = _({
                    tag: "div",
                    class: "button-hidden-swipe-container-left",
                    child: [{
                        tag: "div",
                        class: "button-hidden-swipe-calcWidth"
                    }]
                })
                for (var j = 0; j < this.isSwipeLeft.length; j++) {
                    this.bodyTable.childNodes[i].appendChild(hiddenButton);
                    var icon;
                    if (typeof this.isSwipeLeft[j].icon == "string") {
                        icon = _({
                            tag: "i",
                            class: ["material-icons", "button-hidden-swipe-icon"],
                            style: this.isSwipeLeft[j].iconStyle,
                            props: {
                                innerHTML: this.isSwipeLeft[j].icon
                            }
                        });
                    } else
                        icon = this.isSwipeRight[j].icon.cloneNode(true);
                    var tempElement = _({
                        tag: "div",
                        class: "button-hidden-swipe",
                        on: {
                            click: function(index, indexEvent, e) {
                                if (this.isSwipeLeft[indexEvent].event !== undefined) {
                                    var me = this.bodyTable.childNodes[index];
                                    var index = me.originalIndex;
                                    var parent = me.elementParent;
                                    this.isSwipeLeft[indexEvent].event(e, me, index, me.data, me, parent)
                                }
                            }.bind(this, i, j)
                        },
                        style: {
                            width: 1 / this.isSwipeLeft.length * 100 + "%",
                            backgroundColor: this.isSwipeLeft[j].background,
                            maxWidth: this.bodyTable.childNodes[i].offsetHeight * 1.2 + "px",
                            zIndex: j
                        },
                        child: [{
                            tag: "div",
                            class: "button-hidden-swipe-detail",
                            style: {
                                width: this.bodyTable.childNodes[i].offsetHeight + "px",
                                height: this.bodyTable.childNodes[i].offsetHeight + "px",
                            },
                            child: [
                                icon
                            ]
                        }]
                    })
                    if (!(this.isSwipeLeft[j].text == "" || this.isSwipeLeft[j].text == undefined)) {
                        tempElement.childNodes[0].appendChild(
                            _({
                                tag: "span",
                                class: "button-hidden-swipe-text",
                                style: {
                                    color: this.isSwipeLeft[j].textcolor
                                },
                                props: {
                                    innerHTML: this.isSwipeLeft[j].text
                                }
                            })
                        );
                    }
                    if (j == this.isSwipeLeft.length - 1)
                        tempElement.classList.add("button-hidden-swipe-activeAll");
                    hiddenButton.childNodes[0].appendChild(tempElement)

                }
                this.bodyTable.childNodes[i].hiddenButtonLeft = hiddenButton;
            }
        }

        if (isSwipeRight !== undefined) {
            this.isSwipeRight = isSwipeRight;
        }

        if (this.isSwipeRight !== undefined) {
            for (var i = 0; i < this.bodyTable.childNodes.length; i++) {
                if (this.bodyTable.childNodes[i].hiddenButtonRight !== undefined)
                    continue;
                var hiddenButton = _({
                    tag: "div",
                    class: "button-hidden-swipe-container-right",
                    child: [{
                        tag: "div",
                        class: "button-hidden-swipe-calcWidth"
                    }]
                })
                for (var j = 0; j < this.isSwipeRight.length; j++) {
                    this.bodyTable.childNodes[i].appendChild(hiddenButton);
                    var icon;
                    if (typeof this.isSwipeRight[j].icon == "string") {
                        icon = _({
                            tag: "i",
                            class: ["material-icons", "button-hidden-swipe-icon"],
                            style: this.isSwipeRight[j].iconStyle,
                            props: {
                                innerHTML: this.isSwipeRight[j].icon
                            }
                        });
                    } else
                        icon = this.isSwipeRight[j].icon.cloneNode(true);
                    var tempElement = _({
                        tag: "div",
                        class: "button-hidden-swipe",
                        on: {
                            click: function(index, indexEvent, e) {
                                if (this.isSwipeRight[indexEvent].event !== undefined) {
                                    var me = this.bodyTable.childNodes[index];
                                    var index = me.originalIndex;
                                    var parent = me.elementParent;
                                    this.isSwipeRight[indexEvent].event(e, me, index, me.data, me, parent)
                                }
                            }.bind(this, i, j)
                        },
                        style: {
                            width: 1 / this.isSwipeRight.length * 100 + "%",
                            backgroundColor: this.isSwipeRight[j].background,
                            maxWidth: ((this.bodyTable.childNodes[i].offsetWidth * 3 / 4) / this.isSwipeRight.length) + "px",
                            zIndex: j
                        },
                        child: [{
                            tag: "div",
                            class: "button-hidden-swipe-detail",
                            child: [
                                icon,
                            ]
                        }]
                    })
                    if (!(this.isSwipeRight[j].text == "" || this.isSwipeRight[j].text == undefined)) {
                        tempElement.childNodes[0].appendChild(
                            _({
                                tag: "span",
                                class: "button-hidden-swipe-text",
                                style: {
                                    color: this.isSwipeRight[j].textcolor
                                },
                                props: {
                                    innerHTML: this.isSwipeRight[j].text
                                }
                            })
                        );
                    }
                    if (j == this.isSwipeRight.length - 1)
                        tempElement.classList.add("button-hidden-swipe-activeAll");
                    hiddenButton.childNodes[0].appendChild(tempElement)
                }
                this.bodyTable.childNodes[i].hiddenButtonRight = hiddenButton;
                setTimeout(function(hiddenButton) {
                    var container;
                    var max = 0;

                    for (var i = 0; i < hiddenButton.childNodes[0].childNodes.length; i++) {
                        container = hiddenButton.childNodes[0].childNodes[i].childNodes[0];
                        if (max < container.offsetWidth)
                            max = container.offsetWidth;
                    }
                    for (var i = 0; i < hiddenButton.childNodes[0].childNodes.length; i++) {
                        container = hiddenButton.childNodes[0].childNodes[i].childNodes[0];
                        container.style.minWidth = max + "px";
                    }
                }.bind(this, hiddenButton), 80)
            }
        }
        if (this.isSwipeLeft || this.isSwipeRight) {
            this.realTable.style.overflow = "hidden";
        }
    }.bind(this), 80)
}

tableView.prototype.addEvent = function() {

}

tableView.prototype.swipeCompleteLeft = function(e, me, index, data, row, parent) {
    parent.exactlyDeleteRow(index);
}

tableView.prototype.swipeCompleteRight = function(e, me, index, data, row, parent) {
    parent.exactlyDeleteRow(index);
}

tableView.prototype.swipeCancel = function() {

}

tableView.prototype.setUpSlip = function() {
    var self = this;
    this.bodyTable.addEventListener('slip:reorder', function(e) {
        var index = e.detail.originalIndex;
        var spliceIndex = e.detail.spliceIndex;
        self.changeRowIndex(index, spliceIndex);
    }, false);
    if (this.bodyTable.addEventComplete == true)
        return;
    this.bodyTable.addEventListener('slip:beforewait', function(e) {
        if (e.target.className.indexOf !== undefined && e.target.className.indexOf('drag-icon-button') > -1) e.preventDefault();
    }, false);
    this.bodyTable.addEventListener('slip:beforeswipe', function(e) {
        var startPoint = e.target;
        while (startPoint != null && startPoint.tagName != "TR")
            startPoint = startPoint.parentNode;
        startPoint = startPoint.startPositionAverage;

        if (self.isSwipeRight === false && e.detail.directionX === "left" && !(startPoint > 0))
            e.preventDefault();
        if (self.isSwipeLeft === false && e.detail.directionX === "right" && !(startPoint > 0))
            e.preventDefault();
        // else if(!startPoint>0)
        // this.slip.animateToZero();
    }.bind(this), false);
    this.bodyTable.addEventListener('slip:cancelswipe', function(e) {
        self.swipeCancel();
    }, false);
    this.bodyTable.addEventListener('slip:swipe', function(e) {
        // functionClick(event, this, index, row.data, row, result);
        var index = e.detail.originalIndex;
        var me = self.bodyTable.childNodes[index];
        var parent = me.elementParent;
        // var tempIndex = index;
        index = parent.childrenNodes.indexOf(me);
        if (e.detail.direction === "left")
            self.swipeCompleteLeft(e, me, index, me.data, me, parent);
        if (e.detail.direction === "right")
            self.swipeCompleteRight(e, me, index, me.data, me, parent);
    }, false);
    this.bodyTable.addEventComplete = true;
}

tableView.prototype.changeRowIndex = function(index, spliceIndex) {
    var self = this;
    var result = self;
    if (isNumeric(index) != true) {
        var me = index;
        index = -1;
        for (var i = 0; i < self.bodyTable.childNodes.length; i++) {
            if (self.bodyTable.childNodes[i] == me) {
                index = i;
                break;
            }
        }
    } else
        var me = self.bodyTable.childNodes[index];

    var tempIndex, tempSpliceIndex;

    var elementReal = me.elementParent.childrenNodes[spliceIndex];

    var element = me;
    if (elementReal === undefined)
        elementReal = self.getElementNext(me.elementParent.childrenNodes[me.elementParent.childrenNodes.length - 1]);

    result.bodyTable.insertBefore(element, elementReal);
    if (element.classList.contains("more-child")) {
        element.classList.remove("more-child");
    }
    if (element.getElementChild !== undefined) {
        var elementChild = element.getElementChild();
        if (elementChild.length !== 0) {
            for (var i = 0; i < elementChild.length; i++) {
                result.bodyTable.insertBefore(elementChild[i], elementReal);
            }
        }
    }

    self = element.elementParent;
    result = self;
    tempIndex = index;
    tempSpliceIndex = spliceIndex;

    if (result.data.child !== undefined) {
        index = self.childrenNodes.indexOf(element);
        spliceIndex = self.childrenNodes.indexOf(elementReal);
        if (spliceIndex === -1)
            spliceIndex = self.childrenNodes.length;
        result.data.child = changeIndex(result.data.child, index, spliceIndex);
    } else {
        result.data = changeIndex(result.data, index, spliceIndex);
    }

    result.childrenNodes = changeIndex(result.childrenNodes, index, spliceIndex);
    var k = 0;
    for (var i = 0; i < result.clone.length; i++) {
        var checkValue = array_insertBefore(result.clone[i], element.childNodes[k], spliceIndex + 1);
        if (checkValue === false)
            continue;
        result.clone[i] = checkValue;
        k++;
    }
    if (result.checkSpan !== undefined)
        result.checkSpan = changeIndex(result.checkSpan, index, spliceIndex);
    var event = new CustomEvent('dragdrop', { bubbles: true, detail: { event: event, me: me, index: tempIndex, spliceIndex: tempSpliceIndex, parent: self, dataSpliceIndex: spliceIndex, dataIndex: index, afterIndex: index = self.childrenNodes.indexOf(element) } });
    self.dispatchEvent(event);
}

tableView.prototype.getCellHeader = function(header, i) {
    var value, style, classList, dragElement, cell, bonus;
    var result = this;
    var dragHorizontal = result.dragHorizontal;
    var dragVertical = result.dragVertical;
    var check = result.check;
    var toUpperCase = result.toUpperCase;
    var toLowerCase = result.toLowerCase;
    var functionClickSort;
    if (header.value === undefined) {
        if (typeof header === "object")
            value = "";
        else
            value = header;
    } else
        value = header.value;
    if (toUpperCase)
        value = value.toUpperCase();
    if (toLowerCase)
        value = value.toLowerCase();
    var functionClick = undefined;
    switch (header.type) {
        case "check":
            check[i] = "check";
            bonus = _({
                tag: "checkboxbutton",
                class: "pizo-checkbox",
                style: {
                    display: "flex",
                    flexGrow: 2
                },
                on: {
                    change: function(event) {
                        for (var j = 1; j < result.bodyTable.listCheckBox.length; j++) {
                            result.bodyTable.listCheckBox[j].update(this.checked);
                        }
                    }
                }
            })
            bonus.update = function() {
                for (var j = 1; j < result.bodyTable.listCheckBox.length; j++) {
                    if (result.bodyTable.listCheckBox[j].checked === false) {
                        result.bodyTable.listCheckBox[0].checked = false;
                        return;
                    }
                }
                result.bodyTable.listCheckBox[0].checked = true;
            }
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
                return;
            }
            break;
        case "detail":
            check[i] = "detail";
            var icon = "more";
            if (header.icon !== undefined)
                icon = header.icon;
            bonus = _({
                tag: "i",
                class: "material-icons",
                style: {
                    fontSize: "1.4em",
                    cursor: "pointer",
                    verticalAlign: "bottom"
                },
                props: {
                    innerHTML: icon
                },
                on: {
                    click: function() {
                        document.body.appendChild(result.modalChoice());
                    }
                }
            })
            break;
    }
    if (header.sort === true || header.sort === undefined) {
        functionClickSort = function(event, me, index, dataIndex, row, result) {
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
            } else {
                sortArray(result.data, index, false);
                me.classList.add("upgrade");
                if (me.classList.contains("downgrade"))
                    me.classList.remove("downgrade");
            }
            var event = new CustomEvent('sort', { bubbles: true, detail: { event: event, me: me, index: index, dataIndex: dataIndex, row: row, result: result } });
            result.dispatchEvent(event);
            if (result.paginationElement !== undefined && result.paginationElement.noneValue !== true)
                result.paginationElement.reActive();
            else
                result.updateTable();

        }
    }


    if (header.functionClick !== undefined)
        functionClick = header.functionClick;
    style = {};
    if (header.style !== undefined)
        style = header.style;
    classList = [];
    if (header.classList !== undefined)
        classList = header.classList;
    dragElement = true;
    if (header.dragElement !== undefined && header.dragElement === false)
        dragElement = false;
    var container = _({
        tag: "div",
        class: "container-header"
    });

    var on = {
        click: function(index, functionClick) {
            return function(event) {
                // event.preventDefault();
                if (functionClick !== undefined) {
                    var row = cell.parentNode;
                    functionClick(event, this, index, row.data, row, result);
                }

            }
        }(i, functionClick),

        dragstart: (dragHorizontal && dragElement) ? function() {
            return false;
        } : undefined,
    };

    var mousedown = (dragHorizontal && dragElement) ? function(index) {
        return function(event) {
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
            this.timeoutID = setTimeout(function() {
                dom.hold = true;
                moveElement(event, dom, result, finalIndex);
            }, 200);
        }
    }(i) : undefined;
    var mouseup = function() {
        if (this.hold === false) {
            this.hold = true;
            // this.click();
            clearTimeout(this.timeoutID);
        }
    };

    var mousemove = (dragHorizontal && dragElement) ? function(index) {
        return function(event) {
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
    }(i) : undefined;

    if (BrowserDetector.isMobile) {
        on["touchstart"] = mousedown;
        on["touchend"] = mouseup;
        on["touchmove"] = mousemove;
    } else {
        on["mousedown"] = mousedown;
        on["mouseup"] = mouseup;
        on["mousemove"] = mousemove;
    }

    cell = _({
        tag: "th",
        attr: {
            role: 'columnheader'
        },
        style: style,
        class: classList,
        child: [
            container
        ],
        props: {
            id: i
        },
        on: on
    })

    cell.data = header;
    if (functionClick !== undefined)
        cell.style.cursor = "pointer";
    var childUpDown = _({
        tag: "div",
        class: "sort-container",
        on: {
            click: function(index, functionClickSort) {
                return function(event) {
                    // event.preventDefault();
                    if (functionClickSort !== undefined) {
                        var row = cell.parentNode;
                        functionClickSort(event, this, index, row.data, row, result);
                    }
                }
            }(i, functionClickSort),
        },
        child: [{
                tag: "sort-up",
                class: ["arrow_up"],
            },
            {
                tag: "sort-down",
                class: ["arrow_down"],
            }
        ]
    })

    result.sortArray[i] = childUpDown;

    result.exactlySort = function() {
        childUpDown.click();
    }
    if (header.sort === true) {
        cell.classList.add("has-sort")
    }

    if (header.element === undefined) {
        container.addChild(_({
            tag: "span",
            props: {
                innerHTML: value
            }
        }));
    } else {
        container.appendChild(data[i][j].element);
    }

    if (bonus !== undefined) {
        container.addChild(bonus);
        bonus = undefined;
    }
    container.addChild(childUpDown);
    return cell;
}

tableView.prototype.modalChoice = function() {
    var tempDiv = _({
        tag: "div",
        class: ""
    })
    var modal = _({
        tag: "modal",
        class: "",
        child: [
            tempDiv
        ]
    })
    var checked, value;
    for (var i = 0; i < this.header.length; i++) {
        if (this.header[i].type === "check") {
            continue;
        }
        if (this.header[i].hidden == true)
            checked = false;
        else
            checked = true;
        if (this.header[i].value !== undefined)
            value = this.header[i].value;
        else if (typeof this.header[i] === "string")
            value = this.header[i];
        else
            value = "";
        if (value == "")
            continue;
        tempDiv.addChild(_({
            tag: "checkbox",
            props: {
                checked: checked,
                text: value
            }
        }))
    }
    return modal;
}

tableView.prototype.sortTable = function(index, increase) {
    if (increase == -1) {

    }
}

tableView.prototype.checkLongRow = function(index) {
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

tableView.prototype.checkLongColumn = function(row, column) {
    var result = this;
    var delta = 0;

    if (result.checkSpan !== undefined) {
        for (var j = 0; j < column; j++) {
            if (result.checkSpan[row] !== undefined)
                if (result.checkSpan[row][j] !== undefined)
                    delta++;
        }
    }
    return delta;
}

tableView.prototype.setArrayFix = function(num, isLeft) {
    var x = setInterval(function() {
        if (this.clone[0][0].offsetWidth > 0) {
            clearInterval(x);
            var i;
            var length;

            if (isLeft) {
                i = 0;
                length = num;
            } else {
                i = this.clone.length - num;
                length = this.clone.length;
            }
            var isAdd = false;
            var arrWidth = [];
            for (; i < length; i++) {
                if (this.clone[i][0].tagName === "TH" && !this.clone[i][0].classList.contains("postionStickyCell")) {
                    this.clone[i][0].classList.add("postionStickyCell");
                    this.clone[i][0].style.zIndex = 6;
                    arrWidth[i] = this.clone[i][0].offsetWidth + "px";
                    isAdd = true;
                }
            }
            var ratio;
            if (i !== 0) {
                i = num;
                length = this.clone.length;
            } else {
                i = 0;
                length = num;
            }
            if (isAdd === true) {
                var sum = 0;
                var a = i;
                for (i = 0; i < length; i++) {
                    if (this.clone[i][0].style.maxWidth === "") {
                        sum += this.clone[i][0].offsetWidth;
                    }
                }
                ratio = this.realTable.offsetWidth / (sum);
                for (; a < length; a++) {
                    if (this.clone[a][0].style.maxWidth === "") {
                        arrWidth[a] = this.clone[a][0].offsetWidth * ratio + "px";
                    } else {
                        arrWidth[a] = this.clone[a][0].offsetWidth + "px";
                    }
                }
            } else
                ratio = 1;
            if (isAdd === true)
                for (var i = 0; i < this.clone.length; i++) {
                    this.clone[i][0].style.minWidth = arrWidth[i];
                    this.clone[i][0].style.width = arrWidth[i];
                    this.clone[i][0].style.maxWidth = arrWidth[i];
                    if (this.clone[i][0].classList.contains("postionStickyCell")) {
                        this.clone[i][0].style.left = this.clone[i][0].offsetLeft + "px";
                    }
                }
            for (var i = 0; i < this.clone.length; i++)
                for (var j = 0; j < this.clone[i].length; j++) {
                    if (this.clone[i][j].tagName !== "TH" && !this.clone[i][j].classList.contains("postionStickyCell") && this.clone[i][0].classList.contains("postionStickyCell")) {
                        this.clone[i][j].classList.add("postionStickyCell");
                        this.clone[i][j].style.left = this.clone[i][0].style.left;
                    }
                    if (this.clone[i][j].parentNode.childrenNodes && this.clone[i][j].parentNode.childrenNodes.length !== 0)
                        this.clone[i][j].parentNode.setArrayFix(num, isLeft);
                }
        }
    }.bind(this), 10)

}

tableView.prototype.setArrayScroll = function(num, isLeft = true) {
    var self = this;
    if (isLeft)
        this.numArrayFixLeft = num;
    else
        this.numArrayFixRight = num;
    _('attachhook').once('error', function() {
        setTimeout(function() {
            self.setArrayFix(num, isLeft);
        }, 10);
    })
}

tableView.prototype.addInputSearch = function(input, index) {
    var self = this;
    self.hashTable = new HashTable(self.data);
    input.onchange = function(event, needUpdate = false) {
        if (this.updateTimeOut !== undefined) {
            clearTimeout(this._updateTimeOut);
            this.updateTimeOut = undefined;
        }
        this.updateTimeOut = setTimeout(function() {
            if (input.value !== input.lastInputSearch || needUpdate == true) {
                self.checkTableView(input.value, index);
                input.lastInputSearch = input.value;
                self.updatePagination();
            }
        }.bind(this), 500);
    }
    input.oninput = input.onchange;
    if (self.inputElement === undefined)
        self.inputElement = [];
    self.inputElement.push(input);
}

tableView.prototype.addFilter = function(input, index, functionChange) {
    var self = this;
    self.hashTableFilter = new HashTableFilter(self.data);
    var functionFilter;
    if (functionChange === undefined) {
        functionFilter = function(event, needUpdate = false) {
            self.checkTableViewFilter(input.value, index);
            self.updatePagination();
        }
    } else {
        functionFilter = functionChange
    }
    input.on("change", functionFilter)
    if (self.inputFilter === undefined)
        self.inputFilter = [];
    self.inputFilter.push([input, index]);
}

tableView.prototype.checkTableView = function(value, index) {
    var self = this;
    self.hashTable.getKey(value, index);
    self.data.sort(function(a, b) {
        if (a.exactly === undefined) {
            if (b.exactly === undefined)
                return 0;
            return -1;
        }

        if (b.exactly === undefined)
            return 1;

        if (a.exactly < b.exactly) {
            return -1;
        }
        if (a.exactly > b.exactly) {
            return 1;
        }
        return 0;
    })
}

tableView.prototype.checkTableViewFilter = function(value, index) {
    var self = this;
    self.hashTableFilter.getKey(value, index);
}

tableView.prototype.updateHash = function(row) {
    var object = row.data;
    var value;
    if (this.inputElement !== undefined || this.inputFilter !== undefined) {
        if (this.inputFilter !== undefined)
            for (var k = 0; k < this.inputFilter.length; k++) {
                if (this.inputFilter[k][0].value == 0)
                    continue;
                if (object[this.inputFilter[k][1]].value !== undefined)
                    value = object[this.inputFilter[k][1]].value;
                else if (typeof object[this.inputFilter[k][1]] === "string")
                    value = object[this.inputFilter[k][1]];
                else
                    value = "";
                if (this.inputFilter[k][0].value != object[this.inputFilter[k][1]]) {
                    row.classList.add("disPlayNone");
                    setTimeout(function() {
                        row.classList.remove("parent");
                    }, 10)
                    return false;
                }
            }
        for (var i = 0; i < object.length; i++) {
            if (object[i].value !== undefined)
                value = object[i].value;
            else if (typeof object[i] === "string")
                value = object[i];
            else
                value = "";

            if (this.inputElement !== undefined)
                for (var k = 0; k < this.inputElement.length; k++) {
                    if (this.inputElement[k].value === "")
                        continue;
                    for (var j = 0; j < value.length; j++) {
                        var checkCharacter = -1;
                        var current = this.inputElement[k].value.indexOf[value[j]];
                        if (current == -1 || current < checkCharacter) {
                            row.classList.add("disPlayNone");
                            setTimeout(function() {
                                row.classList.remove("parent");
                            }, 10)
                            return false;

                        } else
                            checkCharacter = current;
                    }
                }
        }

    }
    return true;
}

tableView.prototype.resetHash = function() {
    var self = this;
    if (self.hashTable !== undefined)
        self.hashTable = new HashTable(self.data);
    if (self.hashTableFilter !== undefined)
        self.hashTableFilter = new HashTableFilter(self.data);
}

tableView.prototype.setVisiableFalse = function(arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i].visiable = false;
        if (arr[i].child !== undefined)
            this.setVisiableFalse(arr[i].child);
    }
}

tableView.prototype.setVisiableAll = function(arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i].confirm = true;
        if (arr[i].child !== undefined)
            this.setVisiableAll(arr[i].child);
    }
}

tableView.prototype.setVisiableAllNoneUpdate = function(arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i].visiable = true;
    }
}

tableView.prototype.getBodyTable = function(data, index, isFirst = false, nodeBefore) {
    var temp = this.bodyTable;
    var result = this,
        k, delta = [],
        row, cell;
    var arr = [];
    var i = 0;
    var isCheckChild;
    if (this.startIndex == undefined)
        this.startIndex = 0;
    var startIndexCell;
    if (index == undefined) {
        index = 0;
        startIndexCell = this.startIndex
    } else
        startIndexCell = index;

    if (this.currentIndex !== undefined) {
        i = this.currentIndex;
    } else {
        this.currentIndex = i;
    }
    var deltaLong = -1;
    var isFlag = false;
    result.checkSpan = [];
    if (result.indexRow == undefined || result.indexRow >= this.tempIndexRow)
        result.indexRow = 0;
    var indexIncrease = { a: this.indexRow + startIndexCell };

    Loop: for (;
        (i < data.length && this.indexRow <= this.tempIndexRow + deltaLong); i++) {
        isCheckChild = false;
        if (data[i].child !== undefined) {
            data[i].child.updateVisible = data.updateVisible;
            data[i].child.ortherFilter = data.ortherFilter;
        }
        if (data[i].oldIndex === undefined)
            data[i].oldIndex = i;
        if (data.updateVisible === true) {
            var tempCheck = data[i].confirm;
            data[i].confirm = undefined;
            data[i].exactly = undefined;
            data[i].isComplete = undefined;
            if (tempCheck !== true) {
                data[i].visiable = false;
                if (data[i].child !== undefined)
                    result.setVisiableFalse(data[i].child)
                    // if (data[i].child !== undefined) {
                    //     result.getBodyTable(data[i].child);
                    // }
                continue;
            } else {
                data[i].visiable = undefined;
                data[i].updateVisible = undefined;
                isCheckChild = true;
                // if (data[i].child !== undefined)
                //     result.setVisiableAll(data[i].child)
            }
        } else {

            if (data[i].visiable === false) {
                // if (data[i].child !== undefined)
                //     result.getBodyTable(data[i].child);
                continue;
            } else if (data[i].visiable === true) {
                data[i].visiable = undefined;
                // if (data[i].child !== undefined)
                //     result.setVisiableAllNoneUpdate(data[i].child)
            } else if (data.ortherFilter === true) {
                if (data[i].visiable === undefined) {
                    // if (data[i].child !== undefined)
                    //     result.getBodyTable(data[i].child);
                    continue;
                }
            }
        }
        if (index !== 0) {
            index--;
            isFlag = true;
            continue;
        }

        if (isFlag == true) {
            if (index === 0) {
                if (data[i].getRowMerge && data[i].getRowMerge.length > 1) {
                    var indexDataRow = data[i].getRowMerge.indexOf(data[i]);
                    if (indexDataRow > 0) {
                        i -= indexDataRow;
                        deltaLong += indexDataRow;
                    }
                }
            }
            isFlag = false;
        }

        row = result.getRow(data[i]);
        if (isCheckChild === true)
            _('attachhook').once('error', function(rowAfter) {
                if (rowAfter.childrenNodes && rowAfter.childrenNodes.length == 0 && rowAfter.classList.contains("more-child")) {
                    rowAfter.classList.remove("more-child");
                }
            }.bind(this, row))
        if (nodeBefore) {
            temp.insertBefore(row, nodeBefore);
        } else
            temp.addChild(row);
        arr.push(row);
        var tempX = { a: this.tempIndexRow - this.indexRow + deltaLong };

        for (var j = 0; j < result.realTable.parentNode.clone.length; j++) {
            k = parseFloat(result.realTable.parentNode.clone[j][0].id);
            if (delta[j] === undefined)
                delta[j] = 0;

            cell = result.getCell(data[i], indexIncrease, k, j, result.checkSpan, row, tempX);
            if (this.tempIndexRow - this.indexRow + deltaLong < tempX.a) {
                deltaLong -= tempX.a;
                row.selfRemove();
            }
            if (cell === 6 || cell === 2) {
                result.clone[j].splice(this.indexRow + 1 - delta[j], 1);
                delta[j] += 1;
                continue;
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
        indexIncrease.a++;
    }
    this.currentIndex = i;
    this.startIndex = indexIncrease.a;
    if (data.updateVisible)
        result.setConfirm(data, i);
    if (isFirst == true)
        result.setMergeCell(data, result.checkSpan, i - 1)
    if (result.checkMargin !== undefined)
        result.checkMargin();

    data.ortherFilter = undefined;
    data.updateVisible = undefined;
    result.childrenNodes = result.childrenNodes.concat(arr);
    result.lastRowElement();
    // this.indexRow = 0;
    return arr;
}

tableView.prototype.checkVisiableCell = function(x, y) {
    if (typeof this.data[x][y] !== "object")
        return true;
    if (x > 0) {
        if (this.data[x - 1][y] === this.data[x][y])
            return false;
    }
    if (y > 0) {
        if (this.data[x][y - 1] === this.data[x][y])
            return false;
    }
    return true;
}

tableView.prototype.setMergeCell = function(arr, checkSpan, i = 0) {
    var data;
    var rowMergeData;
    if (i === -1) {
        return;
    }
    for (i; i < arr.length; i++) {
        rowMergeData = arr[i].getRowMerge;
        if (rowMergeData === undefined) {
            rowMergeData = [arr[i]];
            Object.defineProperty(arr[i], "getRowMerge", {
                get: function(rowMergeData) {
                    return function() {
                        return rowMergeData;
                    }
                }(rowMergeData),

                set: function(rowMergeData) {
                    return function(value) {
                        rowMergeData = value;
                    }
                }(rowMergeData),

                configurable: true
            });
        }
        for (var j = 0; j < arr[i].length; j++) {
            data = arr[i][j];
            if (checkSpan[i] !== undefined) {
                if (checkSpan[i][j] == 2) {
                    var rowMerge = arr[i - 1].getRowMerge;
                    if (rowMerge.indexOf(arr[i]) === -1) {
                        rowMerge.push(arr[i]);
                    }
                    Object.defineProperty(arr[i], "getRowMerge", {
                        get: function(rowMerge) {
                            return function() {
                                return rowMerge;
                            }
                        }(rowMerge),

                        set: function(rowMerge) {
                            return function(value) {
                                rowMerge = value;
                            }
                        }(rowMerge),

                        configurable: true
                    });
                    var define = arr[i - 1][j];
                    Object.defineProperty(arr[i], j, {
                        get: function(define) {
                            return function() {
                                return define;
                            }
                        }(define),

                        set: function(define) {
                            return function(value) {
                                define = value;
                            }
                        }
                    });
                }

                if (checkSpan[i][j] == 6) {
                    var define = arr[i][j - 1];
                    Object.defineProperty(arr[i], j, {
                        get: function(define) {
                            return function() {
                                return define;
                            }
                        }(define),

                        set: function(define) {
                            return function() {
                                define = value;
                            }
                        }(define),

                    });
                }
            }
            var isCheckRow = 0;
            if (data.rowspan !== undefined) {
                for (var l = i + 1; l < i + data.rowspan; l++) {
                    if (checkSpan[l] === undefined)
                        checkSpan[l] = [];
                    checkSpan[l][j] = 2;
                }
                isCheckRow = data.rowspan - 1;
                data.rowspan = undefined;
            }
            if (data.colspan !== undefined) {
                for (var l = j + 1; l < j + data.colspan; l++) {
                    for (var x = 0; x <= isCheckRow; x++) {
                        if (checkSpan[i + x] === undefined)
                            checkSpan[i + x] = [];
                        checkSpan[i + x][l] = 6;
                    }
                }
                data.colspan = undefined;
            }
        }
        if (arr[i].child !== undefined) {
            this.setMergeCell(arr[i].child, checkSpan);
        }
    }
}

tableView.prototype.setConfirm = function(arr, i = 0) {
    for (i; i < arr.length; i++) {
        if (arr[i].oldIndex === undefined)
            arr[i].oldIndex = i;
        if (arr[i].confirm !== undefined)
            arr[i].visiable = arr[i].confirm;
        else
            arr[i].visiable = false;
        arr[i].confirm = undefined;
        arr[i].exactly = undefined;
        arr[i].isComplete = undefined;
        if (arr[i].child !== undefined) {
            this.setConfirm(arr[i].child);
        }
    }
}

tableView.prototype.countRow = function() {
    var countRowVisiable = this.countRowChild(this.data);

    return countRowVisiable;
}

tableView.prototype.countRowChild = function(arr) {
    var countRowVisiable = 0
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].visiable != false)
            countRowVisiable++;
        // if (arr[i].child !== undefined)
        //     countRowVisiable += this.countRowChild(arr[i].child);
    }
    return countRowVisiable;
}

tableView.prototype.pagination = function(number, functionClick) {
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
    var paginationWidthPos = "40px";
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
    var realTemp = _({
        tag: "div",
        class: "pagination",
        child: [{
            tag: "div",
            class: "pagination-container",
            child: [
                overlay,
                {
                    tag: "div",
                    class: "pagination-prev",
                    on: {
                        click: function(event) {
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
                    props: {},
                    child: [{
                        tag: "span",
                        class: ["icon-pagination", "icon-pagination-prev"],
                        child: [{
                            tag: "i",
                            class: ["icon", "material-icons"],
                            props: {
                                innerHTML: "keyboard_arrow_left"
                            }
                        }]
                    }]
                },
                container,
                {
                    tag: "div",
                    class: "pagination-next",
                    on: {
                        click: function(event) {
                            var temp = $("a.active", container);

                            if (temp !== undefined)
                                var next = temp.nextSibling;
                            while (next != null && next.classList.contains("detail"))
                                next = next.nextSibling;
                            if (next !== null) {
                                next.click();
                                temp.style.color = "";
                            }
                        }
                    },
                    child: [{
                        tag: "span",
                        class: ["icon-pagination", "icon-pagination-next"],
                        child: [{
                            tag: "i",
                            class: ["icon", "material-icons"],
                            props: {
                                innerHTML: "keyboard_arrow_left"
                            }
                        }]
                    }]
                }
            ]
        }]
    })
    var temp = realTemp;

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
                click: function(i) {
                    return function(event) {
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
                        setTimeout(function() {
                            paginationLeftPos = x.offsetLeft + "px";
                            overlay.style.left = paginationLeftPos;
                            paginationWidthPos = x.offsetWidth + "px";
                            overlay.style.width = paginationWidthPos;
                        }, 10)

                        this.style.color = "#fff";

                        if (functionClick !== undefined)
                            functionClick(event, i);
                        self.indexRow = 0;
                        self.updateTable(undefined, undefined, undefined, undefined, i * number);
                        if (self.scrollParent !== undefined)
                            self.scrollParent.scrollTop = 0;
                        if (self.changePageIndex !== undefined)
                            self.changePageIndex(i);
                    }
                }(i),
                mouseover: function(event) {
                    paginationOpacity = 1;
                    overlay.style.backgroundColor = "#00c1dd";
                    overlay.style.left = this.offsetLeft + "px";
                    overlay.style.width = this.offsetWidth + "px";
                    overlay.style.opacity = paginationOpacity;
                    var active = $("a.active", container);

                    if (active !== undefined)
                        active.style.color = "#333d45";
                    this.style.color = "#fff";
                },
                mouseout: function(event) {
                    if (checkPaginationClick) {
                        paginationOpacity = 1;
                    } else {
                        paginationOpacity = 0;
                    }
                    overlay.style.backgroundColor = "#00178a";
                    overlay.style.opacity = paginationOpacity;
                    overlay.style.left = paginationLeftPos;
                    overlay.style.width = paginationWidthPos;
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
        choiceSelect.index = i + 1;
        arr.push(choiceSelect);
        container.appendChild(choiceSelect);
    }

    temp.resetChoice = function() {
        setTimeout(function() {
            arr[0].click();
        }, 10)
    }

    temp.resetOnlyView = function() {
        setTimeout(function() {
            if (arr.length == 0)
                return;
            var temp = $("a.active", container);
            if (temp !== undefined) {
                temp.classList.remove("active");
                temp.style.color = "";
            }

            arr[0].classList.add("active");
            paginationLeftPos = arr[0].offsetLeft + "px";
            paginationWidthPos = arr[0].offsetWidth + "px";
            paginationOpacity = 1;
            checkPaginationClick = 1;
            overlay.style.left = paginationLeftPos;
            overlay.style.width = paginationWidthPos;
            overlay.style.backgroundColor = "#00178a";
            overlay.style.opacity = paginationOpacity;
            arr[0].style.color = "#fff";
        }, 10);
    }
    temp.reActive = function() {
        var temp = $("a.active", container);
        if (temp !== undefined)
            temp.click();
    }
    temp.resetOnlyView();
    var displayNone = [];
    temp.updateSize = function() {
        setTimeout(function() {

            temp.detailLeft.style.display = "";
            temp.detailRight.style.display = "";
            for (var i = 0; i < displayNone.length; i++) {
                displayNone[i].style.display = "";
            }

            var i = 0;
            var active = $("a.active", container);
            displayNone = [active];

            var lastIndexPrev, lastIndexPrevBefore;
            var lastIndexNext, lastIndexNextBefore;
            var isLeft = false,
                isRight = false;
            if (active !== undefined) {
                var prev = active.previousSibling,
                    next = active.nextSibling;

                while (container.offsetWidth <= self.realTable.offsetWidth - 160 && !(isLeft == true && isRight == true)) {
                    if (isRight == false && next != null) {

                        while (next == temp.detailRight || next == temp.detailLeft)
                            next = next.nextSibling;
                        next.style.display = "flex";

                        lastIndexNextBefore = lastIndexNext;
                        lastIndexNext = next;

                        displayNone.push(next);
                        next = next.nextSibling;
                        i++;
                    } else {
                        isRight = true;
                    }
                    if (container.offsetWidth > self.realTable.offsetWidth - 160)
                        break;
                    if (isLeft == false && prev != null) {
                        while (prev == temp.detailLeft || prev == temp.detailRight)
                            prev = prev.previousSibling;
                        prev.style.display = "flex";

                        lastIndexPrevBefore = lastIndexPrev;
                        lastIndexPrev = prev;

                        displayNone.push(prev);
                        prev = prev.previousSibling;
                        i++;
                    } else {
                        isLeft = true;
                    }
                }
                if (isRight == false && lastIndexNext !== undefined && lastIndexNext.nextSibling !== null) {
                    lastIndexNext.style.display = "";
                    lastIndexNextBefore.style.display = "";

                    temp.detailRight.style.display = "flex";
                    displayNone.push(container.lastChild);
                    container.lastChild.style.display = "flex";
                }

                if (isLeft == false && lastIndexPrev !== undefined && lastIndexPrev.previousSibling !== null) {
                    lastIndexPrev.style.display = "";
                    lastIndexPrevBefore.style.display = "";

                    temp.detailLeft.style.display = "flex";
                    displayNone.push(container.firstChild);
                    container.firstChild.style.display = "flex";
                }
            }
        }, 10);
    }
    temp.updateSize();
    this.goto = function(index) {
        var active = $("a.active", container);
        if (active !== undefined)
            active.style.color = "#333d45";
        arr[index - 1].click();
    }

    this.getPaginationIndex = function() {
        var active = $("a.active", container);
        if (active !== undefined)
            return active.index;
        else
            return 1;
    }

    this.getPaginationLength = function() {
        return countPrecent;
    }

    return temp;
}

tableView.prototype.getRow = function(data) {
    var temp = _({
        tag: "tr",
    });
    var result = this;
    setTimeout(function() {
        temp.classList.add("parent");
    }, 10);
    var rowMerge = data.getRowMerge;
    if (rowMerge === undefined) {
        rowMerge = [data];
    }
    Object.defineProperty(data, "getRowMerge", {
        get() {
            return rowMerge;
        },

        set(value) {
            rowMerge = value;
        },

        configurable: true
    });
    Object.assign(temp, tableView.prototype);
    temp.realTable = result.realTable;
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

    temp.checkLeft = function() {
        for (var i = 0; i < temp.childNodes.length; i++)
            temp.childNodes[i].checkLeft();
    }
    if (temp.data.marker !== undefined) {
        temp.id = temp.data.marker.toString();
    }
    temp.checkChild = function(data) {
        temp.checkClone();
        if (data !== undefined)
            temp.data = data;
        if (temp.data.child.length !== 0) {
            temp.checkIcon();
            temp.getBodyTable(temp.data.child, undefined, undefined, temp.getElementNext(temp));
        }
    }

    temp.checkClone = function() {
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

    temp.checkIcon = function() {
        var indexMore = 0;
        if (temp.childIndex !== undefined) {
            if (temp.childIndex === 0) {
                if (!result.realTable.parentNode.classList.contains("padding-High-table"))
                    result.realTable.parentNode.classList.add("padding-High-table");
            }

            indexMore = temp.childIndex;
        }

        temp.classList.add("more-child");
        var buttonClick = _({
            tag: "div",
            class: "more-icon-container",
            on: {
                click: function(event) {
                    temp.setDisPlay();
                }
            },
            child: [{
                tag: "i",
                class: ["material-icons", "more-button"],
                props: {
                    innerHTML: "play_arrow"
                },
            }]
        });
        var x = temp.childNodes[indexMore].firstChild;
        while (x.classList !== undefined && x.classList.contains("margin-div-cell"))
            x = x.nextSibling;
        temp.childNodes[indexMore].insertBefore(buttonClick, x);
        this.buttonClick = buttonClick;
        result.checkMargin = function() {
            for (var i = 0; i < result.clone[indexMore].length; i++) {
                if (!result.clone[indexMore][i].classList.contains("margin-left-has-icon"))
                    result.clone[indexMore][i].classList.add("margin-left-has-icon");
            }
        }
        result.checkMargin();
        setTimeout(function() {
            if (temp.moreChild == false) {
                temp.setDisPlay();
                temp.moreChild = undefined;
            }
        }, 1)
    }


    temp.checkVisibleChild = function() {
        this.buttonClick.selfRemove();
        var parent = this.childNodes[0].getParentNode();
        if (parent.tagName === "DIV") {
            for (var i = 0; i < parent.bodyTable.childNodes.length; i++) {
                if (parent.bodyTable.childNodes[i].childNodes[parent.childIndex].classList.contains("margin-left-has-icon"))
                    parent.bodyTable.childNodes[i].childNodes[parent.childIndex].classList.remove("margin-left-has-icon")
            }
        }
    }

    temp.updateCurrentRow = function(data) {
        var parent = temp.childNodes[0].getParentNode();
        var index = parent.childrenNodes.indexOf(this);
        if (index == -1)
            return;
        return parent.updateRow(data, index);
    }

    return temp;
}

tableView.prototype.setDisPlay = function() {
    if (!this.classList.contains("more-child") && this.data.child && this.data.child.length !== this.childrenNodes.length) {
        this.data.updateVisible = undefined;
        for (var i = 0; i < this.childrenNodes.length; i++) {
            this.childrenNodes[i].selfRemove();
        }
        this.childrenNodes = [];
        this.currentIndex = 0;
        this.setVisiableAllNoneUpdate(this.data.child);
        this.getBodyTable(this.data.child, undefined, undefined, this.getElementNext(this));
    }
    if (!this.classList.contains("more-child")) {
        this.classList.add("more-child");
        this.setMoreChild(this.childrenNodes);
    } else {
        this.classList.remove("more-child");
        this.setDisPlayNone();
    }
}

tableView.prototype.setMoreChild = function(childrenNodes) {
    for (var i = 0; i < childrenNodes.length; i++) {
        childrenNodes[i].classList.remove("disPlayNone");
        childrenNodes[i].classList.add("parent");
        _('attachhook').once('error', function(rowAfter) {
            if (rowAfter.childrenNodes && rowAfter.childrenNodes.length == 0 && rowAfter.classList.contains("more-child")) {
                rowAfter.classList.remove("more-child");
            }
        }.bind(this, childrenNodes[i]))
        if (childrenNodes[i].classList.contains("more-child")) {
            if (childrenNodes[i].childrenNodes && childrenNodes[i].childrenNodes.length > 0) {
                childrenNodes[i].setMoreChild(childrenNodes[i].childrenNodes);
            } else
                childrenNodes[i].setDisPlayNone();
        } else {
            childrenNodes[i].setDisPlayNone();
        }
    }
}

tableView.prototype.setDisPlayVisable = function() {
    if (this.classList.contains("more-child")) {
        var childrenNodes = this.childrenNodes;
        for (var i = 0; i < childrenNodes.length; i++) {
            childrenNodes[i].classList.remove("disPlayNone");
            childrenNodes[i].classList.add("parent");
            if (childrenNodes[i].childrenNodes.length !== 0)
                childrenNodes[i].setDisPlayVisable();
        }
    }
}

tableView.prototype.setDisPlayNone = function() {
    var childrenNodes = this.childrenNodes;
    for (var i = 0; i < childrenNodes.length; i++) {
        childrenNodes[i].classList.remove("parent");
        childrenNodes[i].classList.add("disPlayNone");
        if (childrenNodes[i].childrenNodes.length !== 0)
            childrenNodes[i].setDisPlayNone();
    }
}

tableView.prototype.getDivMargin = function() {
    return _({
        tag: "div",
        class: "margin-div-cell"
    })
}

tableView.prototype.getTrueCheckBox = function() {
    var indexCheckBox = -1;
    for (var i = 0; i < this.header.length; i++) {
        if (this.header[i].type == "check") {
            indexCheckBox = i;
            break;
        }
    }
    if (indexCheckBox === -1)
        return [];
    return this.checkChildCheckBox(this.data, indexCheckBox);
}

tableView.prototype.checkChildCheckBox = function(data, indexCheckBox) {
    var arr = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i][indexCheckBox] == true) {
            data[i][indexCheckBox] = false;
            arr.push(data[i]);
        }
        if (data[i][indexCheckBox]["value"] == true) {
            data[i][indexCheckBox]["value"] = false;
            arr.push(data[i]);
        }
        if (data[i].child.length > 0)
            arr.concat(this.checkChildCheckBox(data[i].child, indexCheckBox));
    }
    return arr;
}

tableView.prototype.getCell = function(dataOrigin, i, j, k, checkSpan = [], row, orther) {
    var dataOld = dataOrigin;
    dataOrigin = dataOrigin[j];
    var data = dataOrigin;
    var result = this,
        value, bonus, style, classList, cell;
    if (typeof i === "object") {
        var objectRealIndex = i;
        var realIndex = objectRealIndex.a;
    } else {
        var realIndex = i;
    }
    var localData;
    if (result.tagName === "DIV") {
        localData = result.data;
    } else {
        localData = result.data.child;
    }
    i = localData.indexOf(dataOld);
    if (i === -1) {
        i = realIndex;
    }
    if (checkSpan[i] !== undefined) {
        if (checkSpan[i][j] == 2) {
            var rowMerge = localData[i - 1].getRowMerge;
            if (rowMerge.indexOf(localData[i]) === -1) {
                rowMerge.push(localData[i]);
            }
            Object.defineProperty(localData[i], "getRowMerge", {
                get() {
                    return rowMerge;
                },

                set(value) {
                    rowMerge = value;
                },

                configurable: true
            });
            var define = localData[i - 1][j];
            Object.defineProperty(dataOld, j, {
                get() {
                    return define;
                },

                set(value) {
                    define = value;
                }
            });
            if (this.check[j] === "increase")
                if (typeof objectRealIndex === "object") {
                    objectRealIndex.a--;
                }
            return 2;
        }
        if (checkSpan[i][j] == 6) {
            var define = dataOld[j - 1];
            Object.defineProperty(dataOld, j, {
                get() {
                    return define;
                },

                set(value) {
                    define = value;
                },

            });
            return 6;
        }
    }

    if (data.value === undefined) {
        if (typeof data === "object")
            value = "";
        else
            value = data.toString();
    } else
        value = data.value;

    switch (this.check[j]) {
        case "hidden":
            return true;
        case "increase":
            if (value === "")
                value += (realIndex + 1);
            break;
        case "dragzone":
            if (realIndex !== -1) {
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
                            // mousedown: result.dragVertical ? function (event) {
                            //     var self = this;
                            //     return function (event, cellIndex, self) {
                            //         event.preventDefault();
                            //         var finalIndex = cellIndex.getParentNode().childrenNodes.indexOf(cellIndex.parentNode);
                            //         self.hold = false;
                            //         var dom = self;
                            //         self.default = event;
                            //         self.timeoutID = setTimeout(function () {
                            //             dom.hold = true;
                            //             moveElementFix(event, dom, cellIndex.getParentNode(), finalIndex + 1);
                            //         }, 200);
                            //     }(event, cell, self)
                            // } : undefined,
                            // dragstart: result.dragVertical ? function () {
                            //     return false;
                            // } : undefined,
                            // mouseup: function () {
                            //     if (this.hold === false) {
                            //         this.hold = true;
                            //         // this.click();
                            //         clearTimeout(this.timeoutID);
                            //     }
                            // },
                            // mousemove: result.dragVertical ? function (event) {
                            //     var self = this;
                            //     return function (event, cellIndex, self) {
                            //         if (self.hold === false) {
                            //             var finalIndex = cellIndex.getParentNode().childrenNodes.indexOf(cellIndex.parentNode);
                            //             self.hold = false;
                            //             var deltaX = self.default.clientX - event.clientX,
                            //                 deltaY = self.default.clientY - event.clientY;
                            //             if ((Math.abs(deltaX) + Math.abs(deltaY)) > 10) {
                            //                 self.hold = true;
                            //                 moveElementFix(event, self, cellIndex.getParentNode(), finalIndex + 1);
                            //                 clearTimeout(self.timeoutID);
                            //             }
                            //         }
                            //     }(event, cell, self)
                            // } : undefined,
                        }
                    })
                }
            }
            break;
        case "check":
            if (realIndex !== -1) {
                bonus = _({
                    tag: "checkboxbutton",
                    class: "pizo-checkbox",
                    on: {
                        change: function(event) {
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
                                this.update();
                            }
                        }
                    }
                });
                bonus.update = function(checked) {
                    if (checked == undefined)
                        dataOrigin.value = this.checked;
                    else {
                        dataOrigin.value = checked;
                        if (this.checked != checked) {
                            this.checked = checked;
                            this.emit("change");
                        }
                    }
                }
                if (dataOrigin.value === true)
                    bonus.checked = dataOrigin.value;
                if (result.bodyTable.listCheckBox !== undefined)
                    result.bodyTable.listCheckBox.push(bonus);
            }
            break;
        case "detail":
            if (realIndex !== -1) {
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
            }
            break;

    }
    var functionClick = undefined;
    if (data.functionClick !== undefined)
        functionClick = data.functionClick;
    else {
        if (result.header[j].functionClickAll !== undefined)
            functionClick = result.header[j].functionClickAll;
    }

    var functionChange = undefined;
    if (data.functionChange !== undefined)
        functionChange = data.functionChange;
    else {
        if (result.header[j].functionChangeAll !== undefined)
            functionChange = result.header[j].functionChangeAll;
    }

    style = {};
    if (data.style !== undefined)
        style = data.style;
    classList = [];
    if (data.classList !== undefined)
        classList = data.classList;

    var on = {
        click: function(event) {
            return function(event, row, functionClick) {
                // event.preventDefault();
                if (functionClick !== undefined) {
                    if (cell.getParentNode().childrenNodes.length !== 0)
                        var finalIndex = cell.getParentNode().childrenNodes.indexOf(cell.parentNode);
                    else
                        var finalIndex = 0;
                    functionClick(event, cell, finalIndex, cell.getParentNode(), row.data, row);
                }

            }(event, row, functionClick)
        },
        change: function(event) {
            return function(event, row, functionChange) {
                // event.preventDefault();
                if (functionChange !== undefined) {
                    if (cell.getParentNode().childrenNodes.length !== 0)
                        var finalIndex = cell.getParentNode().childrenNodes.indexOf(cell.parentNode);
                    else
                        var finalIndex = 0;
                    functionChange(event, cell, finalIndex, cell.getParentNode(), row.data, row);
                }

            }(event, row, functionChange)
        }
    }
    var mousedown = result.dragVertical ? function(event) {
        return function(event, cellIndex, self) {
            var finalIndex = cellIndex.getParentNode().childrenNodes.indexOf(cellIndex.parentNode);
            var element = cellIndex.parentNode;

            element.finalIndex = finalIndex;
            element.elementParent = self;

        }(event, cell, result)
    } : undefined;

    var mouseup = result.dragVertical ? function(event) {
        return function(event, cellIndex, self) {
            var element = cellIndex.getParentNode();
            delete element.finalIndex;
            delete element.elementParent
        }(event, cell, result)
    } : undefined;
    if (BrowserDetector.isMobile) {
        on["touchstart"] = mousedown;
        on["touchend"] = mouseup;
    } else {
        on["mousedown"] = mousedown;
        on["mouseup"] = mouseup;
    }

    cell = _({
        tag: "td",
        style: style,
        class: classList,
        on: on
    })


    if (functionClick !== undefined)
        cell.style.cursor = "pointer";
    var container = _({
        tag: "div",
        class: "container-view",
    })

    cell.checkLeft = function() {
        return function(cell, result, k) {
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
            container.style.width = "calc(100% - " + widthSize + "em)";
            if (widthSize !== 0)
                cell.classList.add("margin-left-has-icon");
        }(cell, row, k)
    }


    row.resetParentChild = function() {
        for (var i = 0; i < row.childrenNodes.length; i++) {
            row.childrenNodes[i].parentMargin = row.parentMargin + 1;
            row.childrenNodes[i].resetParentChild();
        }
    }
    cell.addChild(container);
    cell.checkLeft();

    if (data.element !== undefined) {
        container.appendChild(data.element);
    } else if (data.adapter !== undefined) {
        var tempAdapter = data.adapter();
        container.appendChild(tempAdapter);
        data.element = tempAdapter;
    } else {
        if (this.check[j] !== "dragzone" && this.check[j] !== "check" && this.check[j] !== "deltail")
            container.addChild(_({ text: value }))
    }

    if (bonus !== undefined) {
        container.addChild(bonus);
        bonus = undefined;
    }

    var isCheckRow = 0;
    if (data.rowspan !== undefined) {
        cell.setAttribute("rowspan", data.rowspan);
        isCheckRow = data.rowspan - 1;
        var isComplete = false;
        if (orther)
            if (orther.a < data.rowspan - 1) {
                orther.a += data.rowspan;
                isComplete = true;
            }
        if (isComplete === false) {
            for (var l = i + 1; l < i + data.rowspan; l++) {
                if (checkSpan[l] === undefined)
                    checkSpan[l] = [];
                checkSpan[l][j] = 2;

            }
            data.rowspan = undefined;
        }
    } else
    if (realIndex !== -1) {
        if (typeof localData[i + 1] === "object" && ((typeof localData[i][j] === "object") && (typeof localData[i + 1][j] === "object"))) {
            var index = 1;
            for (var l = i + 1; l < localData.length; l++) {
                if (localData[i][j] === localData[l][j]) {
                    if (checkSpan[l] === undefined)
                        checkSpan[l] = [];
                    checkSpan[l][j] = 2;
                    index++;
                } else
                    break;
            }
            if (index > 1) {
                isCheckRow = index - 1;
                cell.setAttribute("rowspan", index);
                if (orther)
                    if (orther.a < index - 1)
                        orther.a += index - 1;
            }
        }
    }
    if (data.colspan !== undefined) {
        cell.setAttribute("colspan", data.colspan);
        for (var l = j + 1; l < j + data.colspan; l++) {
            for (var x = 0; x <= isCheckRow; x++) {
                if (checkSpan[i + x] === undefined)
                    checkSpan[i + x] = [];
                checkSpan[i + x][l] = 6;
            }
        }
        data.colspan = undefined;
    } else
    // if (realIndex !== -1)
    if ((typeof dataOld[j] === "object") && (typeof dataOld[j + 1] === "object")) {
        var index = 1;
        for (var l = j + 1; l < dataOld.length; l++) {
            if (dataOld[j] === dataOld[l]) {
                for (var x = 0; x <= isCheckRow; x++) {
                    if (checkSpan[i + x] === undefined)
                        checkSpan[i + x] = [];
                    checkSpan[i + x][l] = 6;
                }
                index++;
            } else
                break;
        }
        if (index > 1) {
            cell.setAttribute("colspan", index);
        }
    }
    cell.getParentNode = function() {
        var parent = cell.clone[0][0];
        parent = parent;
        if (parent.tagName === "TH")
            return parent.parentNode.parentNode.parentNode.parentNode;
        return parent.parentNode;
    }
    return cell;
}

tableView.prototype.updateTable = function(header, data, dragHorizontal, dragVertical, index = 0, isUpdate = true) {
    this.checkSpan = [];
    var result = this;
    var temp = _({
        tag: "tbody"
    });
    var isFirst = false;
    if (data !== undefined) {
        data.checkVisiableCell = function(x, y) {
            if (typeof this[x][y] !== "object")
                return true;
            if (x > 0) {
                if (this[x - 1][y] === this[x][y])
                    return false;
            }
            if (y > 0) {
                if (this[x][y - 1] === this[x][y])
                    return false;
            }
            return true;
        }
        this.data = data;
        isFirst = true;
        result.indexPageSum = Math.ceil(result.data.length / result.indexRow);
    }
    if (isUpdate == true)
        result.indexRow = 0;
    temp.listCheckBox = [];
    if (dragHorizontal !== undefined)
        result.dragHorizontal = dragHorizontal;
    if (dragVertical !== undefined)
        result.dragVertical = dragVertical;

    if (this.bodyTable.listCheckBox !== undefined && this.bodyTable.listCheckBox.length > 0)
        temp.listCheckBox[0] = this.bodyTable.listCheckBox[0];

    for (var i = 0; i < result.clone.length; i++) {
        result.clone[i] = [result.clone[i].shift()];
    }

    this.realTable.replaceChild(temp, this.bodyTable);
    this.bodyTable = temp;
    result.childrenNodes = [];
    this.currentIndex = undefined;
    result.getBodyTable(this.data, index, isFirst);
    if (temp.listCheckBox[0] !== undefined) {
        temp.listCheckBox[0].update();
    }


    if (result.dragVertical) {
        result.setUpSlip();
        if (result.isSwipeLeft || result.isSwipeRight)
            this.setUpSwipe();
        result.slip = new Slip(result.bodyTable);
    }
    if (data !== undefined) {
        if (result.paginationElement !== undefined && result.paginationElement.reActive)
            result.paginationElement.reActive();
        result.realTable.parentNode.resetHash();
    }
    if (result.numArrayFixLeft) {
        result.setArrayFix(result.numArrayFixLeft, true);
    }
    if (result.numArrayFixRight) {
        result.setArrayFix(result.numArrayFixRight, false);
    }
}

tableView.prototype.getLastElement = function(element) {
    if (element.childrenNodes !== undefined && element.childrenNodes.length !== 0) {
        return this.getLastElement(element.childrenNodes[element.childrenNodes.length - 1]);
    }
    return element;
}

tableView.prototype.insertRow = function(data, checkMust = false) {
    var result = this,
        k, cell;
    var delta = [];
    var index = result.childrenNodes.length;
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


    if (result.tagName === "DIV")
        result.bodyTable.addChild(row);
    else {
        checkChild = true;
        if (!result.classList.contains("more-child"))
            result.setDisPlay();
        var tempElement = result.getLastElement(result.clone[0][result.clone[0].length - 1].parentNode);

        result.bodyTable.insertBefore(row, tempElement.nextSibling);
    }

    for (var i = 0; i < this.realTable.parentNode.clone.length; i++) {
        k = parseFloat(this.realTable.parentNode.clone[i][0].id);
        cell = result.getCell(data, index, k, i, result.checkSpan, row);
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
    var x;

    result.childrenNodes[index] = row;

    if (result.tagName !== "DIV") {
        result.data.child.splice(index, 0, data);
        x = data;
    } else {
        result.data.splice(index, 0, data);
        x = data;
    }


    row.data = x;
    var temp;
    if (temp !== undefined) {
        row.childrenNodes = temp.childrenNodes;
        row.clone = temp.clone;
        row.checkSpan = temp.checkSpan;
        if (row.clone !== undefined) {
            var k = 0,
                l = 0;
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
    result.realTable.parentNode.resetHash();
    // result.realTable.parentNode.updateHash(row);
    this.setUpSwipe();
    if (result.realTable.parentNode.numArrayFixLeft) {
        result.setArrayFix(result.realTable.parentNode.numArrayFixLeft, true);
    }
    if (result.realTable.parentNode.numArrayFixRight) {
        result.setArrayFix(result.realTable.parentNode.numArrayFixRight, false);
    }
    result.indexPageSum++;
    result.indexPage++;
    return row;
}

tableView.prototype.insertLastRow = function(functionLast) {
    this.functionLast = functionLast;
    this.lastRowElement();
}

tableView.prototype.getPaginationIndex = function() {
    if (this.indexPage === undefined)
        return 1;
    return this.indexPage;
}

tableView.prototype.getPaginationLength = function() {
    if (this.indexPageSum === undefined)
        return 1;
    return this.indexPageSum;
}

tableView.prototype.lastRowElement = function() {
    if (this.functionLast) {
        if (this.tagName === "DIV") {
            var tempDataLast = [];
            for (var i = 0; i < this.childrenNodes.length; i++) {
                tempDataLast.push(this.childrenNodes[i].data);
            }
            var tempLast = this.functionLast(tempDataLast, this.childrenNodes, this.getPaginationIndex());
            if (tempLast === undefined)
                return;
            var row = this.getRow(tempLast);
            if (this.lastElement === undefined || (this.lastElement && this.lastElement.parentNode && this.lastElement.parentNode.parentNode))
                this.bodyTable.addChild(row);
            else {
                this.bodyTable.addChild(this.lastElement);
                this.bodyTable.replaceChild(row, this.lastElement);
            }

            for (var j = 0; j < this.realTable.parentNode.clone.length; j++) {
                var k = parseFloat(this.realTable.parentNode.clone[j][0].id);

                var cell = this.getCell(tempLast, -1, k, j, this.checkSpan, row);
                if (cell === 6 || cell === 2) {
                    continue;
                }
                if (cell === true) {
                    continue;
                }
                row.addChild(cell);
            }
            this.lastElement = row;
        }
    }
}

tableView.prototype.updateRow = function(data, index, checkMust = false) {
    var result = this,
        k, cell;
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

    var temp;
    temp = result.childrenNodes[index];

    result.bodyTable.replaceChild(row, temp);
    row.classList.value = temp.classList.value;

    if (temp.childrenNodes !== undefined) {
        row.childrenNodes = temp.childrenNodes;
        row.clone = temp.clone;
    }
    for (var i = 0; i < this.realTable.parentNode.clone.length; i++) {
        k = parseFloat(this.realTable.parentNode.clone[i][0].id);
        cell = result.getCell(data, index, k, i, result.checkSpan, row);
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
    var x;

    result.childrenNodes[index] = row;

    if (result.tagName !== "DIV") {
        x = Object.assign(temp.data, data);
    } else {
        x = Object.assign(temp.data, data);
    }
    row.data = temp.data;
    if (temp !== undefined) {
        row.childrenNodes = temp.childrenNodes;
        row.clone = temp.clone;
        row.checkSpan = temp.checkSpan;
        if (row.clone !== undefined) {
            var k = 0,
                l = 0;
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
    if (temp.classList.contains("more-child")) {
        row.classList.add("more-child");
    } else {
        row.classList.remove("more-child");
    }
    result.realTable.parentNode.resetHash();
    // result.realTable.parentNode.updateHash(row);
    return row;
}

tableView.prototype.dropRow = function(index) {
    var result = this;
    var element = result.clone[0][index + 1].parentNode;
    return new Promise(function(resolve, reject) {
        if (!element.classList.contains("hideTranslate"))
            element.classList.add("hideTranslate");
        if (element.childrenNodes.length !== 0)
            element.addHideAnimationChild();
        result.bodyTable.parentNode.style.pointerEvents = "none";
        var eventEnd = function() {
            result.exactlyDeleteRow(index);
            result.bodyTable.parentNode.style.pointerEvents = "";
            resolve();
        };
        // Code for Safari 3.1 to 6.0
        element.addEventListener("webkitTransitionEnd", eventEnd);

        // Standard syntax
        element.addEventListener("transitionend", eventEnd);
    })
}

tableView.prototype.exactlyDeleteRow = function(index) {
    var parent = this,
        deltaX = [];
    var element = parent.childrenNodes[index];
    parent.dropRowChild(element);
    var deltaY = 0;
    deltaX = parent.checkLongRow(index);
    for (var i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].tagName !== "TD")
            continue;
        parent.clone[i + deltaY].splice(index + 1 - deltaX[i + deltaY], 1);
        if (parent.checkSpan !== undefined)
            parent.checkSpan.splice(index, 1);
        if (element.childNodes[i].colSpan !== undefined)
            deltaY += element.childNodes[i].colSpan - 1;
    }
    if (parent.childrenNodes.length !== 0) {
        parent.childrenNodes.splice(parent.childrenNodes.indexOf(element), 1);
    }
    if (parent.tagName !== "DIV") {
        var indexData = parent.data.child.indexOf(element.data);
        if (indexData !== -1)
            parent.data.child.splice(indexData, 1);
    } else {
        var indexData = parent.data.indexOf(element.data);
        if (indexData !== -1)
            parent.data.splice(indexData, 1);
    }
    if (parent.checkVisibleChild !== undefined && parent.childrenNodes.length === 0)
        parent.checkVisibleChild();
    parent.realTable.parentNode.resetHash();
    if (parent.tagName == "DIV") {
        if (parent.childrenNodes.length == 0) {
            parent.updatePagination();
        }
    }
    parent.indexPageSum--;
    parent.indexPage--;
}

tableView.prototype.insertColumn = function(index, insertBefore = -1) {
    var current = [];
    var cell, cellHeader;
    delete this.header[index].hidden;
    this.check[index] = this.header[index].type;
    cellHeader = this.getCellHeader(this.header[index], index);

    var currentClone;
    if (insertBefore === -1) {
        this.headerTable.childNodes[0].appendChild(cellHeader);
        current.push(cellHeader);
        this.clone.push(current);
    } else {
        if (this.clone.length < insertBefore) {
            console.log("index insert > current index");
            return;
        } else
            currentClone = this.clone[insertBefore];

        this.headerTable.childNodes[0].insertBefore(cellHeader, this.clone[insertBefore][0]);
        current.push(cellHeader);
        this.clone.splice(insertBefore, 0, current);
    }
    var k = 1;
    for (var i = 0; i < this.childrenNodes.length; i++) {
        cell = this.getCell(this.childrenNodes[i].data, i, index, this.clone[this.clone.length - 1][0].id + 1, this.checkSpan, this.childrenNodes[i]);
        current.push(cell);
        cell.clone = this.clone;
        if (insertBefore === -1)
            this.childrenNodes[i].appendChild(cell);
        else {
            if (this.childrenNodes[i] === currentClone[k].parentNode) {
                this.childrenNodes[i].insertBefore(cell, currentClone[k]);
            } else {
                var tempIndexRow = insertBefore - this.checkLongColumn(i, insertBefore);
                if (this.childrenNodes[i].childNodes[tempIndexRow] !== undefined)
                    this.childrenNodes[i].insertBefore(cell, this.childrenNodes[i].childNodes[tempIndexRow]);
                else
                    this.childrenNodes[i].appendChild(cell);
                k--;
            }
        }
        if (this.childrenNodes[i].childrenNodes.length !== 0) {
            this.childrenNodes[i].insertColumn(index, insertBefore);
        }
        k++;
    }
}

tableView.prototype.changeParent = function(index, rowParent) {
    var result = this,
        deltaX = [];
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
        if (parent.tagName == "DIV")
            dataTemp = parent.data[indexData];
        else
            dataTemp = parent.data.child[indexData];
        if (rowParent.tagName == "DIV")
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
    result.indexPageSum++;
    result.indexPage++;
    rowParent.indexPageSum--;
    result.indexPage++;
    return rowParent.childrenNodes.length - 1;
}

tableView.prototype.addHideAnimationChild = function() {
    for (var i = 0; i < this.childrenNodes.length; i++) {
        if (!this.childrenNodes[i].classList.contains("hideTranslate"))
            this.childrenNodes[i].classList.add("hideTranslate");
        if (this.childrenNodes[i].childrenNodes.length !== 0) {
            this.childrenNodes[i].addHideAnimationChild();
        }
    }
}

tableView.prototype.changeRowChild = function(element, parent) {
    var current;
    if (parent.tagName === "DIV") {
        current = null;
        parent.bodyTable.addChild(element);
    } else {
        current = parent.clone[0][parent.clone[0].length - 1].parentNode;
        insertAfter(element, current);
    }
    element.parentMargin = parent.parentMargin + 1;
    element.resetParentChild();
    element.checkLeft();
    if (element.childrenNodes.length !== 0)
        element.changeRowChildElement(element);
}

tableView.prototype.changeRowChildElement = function(current) {
    for (var i = 0; i < this.childrenNodes.length; i++) {
        if (this.tagName === "DIV" || current == null)
            this.bodyTable.addChild(this.childrenNodes[i]);
        else {
            insertAfter(this.childrenNodes[i], current);
        }
        this.childrenNodes[i].checkLeft();
        if (this.childrenNodes[i].childrenNodes.length !== 0) {
            this.childrenNodes[i].changeRowChildElement(this.childrenNodes[i]);
        }
    }
}

tableView.prototype.dropRowChild = function(element) {
    if (element !== undefined && element.parentNode !== undefined)
        element.parentNode.removeChild(element);
    if (element.childrenNodes.length !== 0)
        element.dropRowChildElement()
}

tableView.prototype.dropRowChildElement = function() {
    for (var i = 0; i < this.childrenNodes.length; i++) {
        this.childrenNodes[i].selfRemove();
        if (this.childrenNodes[i].childrenNodes.length !== 0) {
            this.childrenNodes[i].dropRowChildElement();
        }
    }
}

tableView.prototype.backGroundFix = function(index) {
    var rect = this.getBoundingClientRect();
    var scrollParent = this.realTable.parentNode;
    while (scrollParent) {
        var overflowStyle = window.getComputedStyle(scrollParent)['overflow'];
        if ((overflowStyle === 'auto' || overflowStyle === 'scroll' || scrollParent.tagName === 'HTML') && (scrollParent.clientHeight < scrollParent.scrollHeight || scrollParent.clientWidth < scrollParent.scrollWidth)) break;
        scrollParent = scrollParent.parentElement;
    }
    var scrollLeft = scrollTop = 0;
    if (scrollParent) {
        scrollLeft = scrollParent.scrollLeft;
        scrollTop = scrollParent.scrollTop;
    }
    var rectDistance = traceOutBoundingClientRect(this);

    var temp = _({
        tag: "div",
        class: "background-opacity",
        style: {
            top: rect.y + 'px',
            left: rect.x + scrollLeft + 'px',
            backgroundColor: "#ffffff00",
            realTop: rect.y + scrollTop,
            width: rectDistance.width - 17 + "px"
        },
        child: []
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

    temp.getZone = function() {
        return arrZone;
    }

    return temp;
}

tableView.prototype.backGround = function(height, callback, index) {
    var rect = this.getBoundingClientRect();
    var scrollParent = this.realTable.parentNode;
    while (scrollParent) {
        var overflowStyle = window.getComputedStyle(scrollParent)['overflow'];
        if ((overflowStyle === 'auto' || overflowStyle === 'scroll' || scrollParent.tagName === 'HTML') && (scrollParent.clientHeight < scrollParent.scrollHeight || scrollParent.clientWidth < scrollParent.scrollWidth)) break;
        scrollParent = scrollParent.parentElement;
    }
    var rectDistance = traceOutBoundingClientRect(this);
    var scrollTop = 0;
    if (scrollParent)
        scrollTop = scrollParent.scrollTop;
    var temp = _({
        tag: "div",
        class: "background-opacity-1",
        style: {
            top: rect.y + 'px',
            left: rect.x - 17 + 'px',
            backgroundColor: "#ffffff00",
            realTop: rect.y + scrollTop,
            // width:rectDistance.width-17+"px"
        },
        child: [{
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
            child: [{
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
                mouseover: function(event) {
                    if (callback !== undefined && temp.isMove == false)
                        callback(event);
                },
            }
        }]
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

    temp.getDeleteZone = function() {
        return temp.childNodes[0];
    }
    temp.getZone = function() {
        return arrZone;
    }
    return temp;
}


tableView.prototype.deleteColumn = function(index) {
    this.header[index].hidden = true;
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

tableView.prototype.cloneColumn = function(index, isFull = false) {
    var clone = this.clone[index][0].cloneNode(true);
    clone.style.width = this.clone[index][0].offsetWidth - window.getComputedStyle(this.clone[index][0], null).getPropertyValue('padding-left').replace("px", "") - window.getComputedStyle(this.clone[index][0], null).getPropertyValue('padding-right').replace("px", "") - window.getComputedStyle(this.clone[index][0], null).getPropertyValue('border-left-width').replace("px", "") - window.getComputedStyle(this.clone[index][0], null).getPropertyValue('border-right-width').replace("px", "") + 'px';
    clone.style.height = this.clone[index][0].offsetHeight - window.getComputedStyle(this.clone[index][0], null).getPropertyValue('padding-top').replace("px", "") - window.getComputedStyle(this.clone[index][0], null).getPropertyValue('padding-bottom').replace("px", "") - window.getComputedStyle(this.clone[index][0], null).getPropertyValue('border-top-width').replace("px", "") - window.getComputedStyle(this.clone[index][0], null).getPropertyValue('border-bottom-width').replace("px", "") + 'px';
    var headerTable = _({
        tag: "thead"
    });
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

tableView.prototype.cloneCellColumn = function(bodyTable, cloneArray, index) {
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
            clone.setAttribute("rowspan", "")
        bodyTable.addChild(cell);
        if (cloneArray[index][i].parentNode.clone !== undefined) {
            var cloneArrayTemp = cloneArray[index][i].parentNode.clone;
            this.cloneCellColumn(bodyTable, cloneArrayTemp, index);
        }

    }
}

tableView.prototype.cloneRow = function(index, isFull = false) {
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
        clone.setAttribute("colspan", "")
        row.appendChild(clone);
    }
    return result;
}

tableView.prototype.getBound2Colum = function(colum1, colum2, index) {
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
    } else
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
            mouseover: isShow ? function() {
                if (this.parentNode.isMove === false) {
                    self.moveColumn(self.clone, colum1, colum2, index)
                }
            } : undefined
        },
        child: [{
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

tableView.prototype.moveColumn = function(arrClone, colum1, colum2, index, i = 0) {
    var parent;
    // if(index==colum1)
    //     return;
    // if(index==colum2)
    //     return;
    var delta = 0,
        lastDelta;
    for (i; i < arrClone[index].length; i++) {
        parent = arrClone[index][i - delta].parentNode;
        if (colum2 !== undefined) {
            if (lastDelta > 0) {
                lastDelta--;
                continue;
            }
            parent.insertBefore(arrClone[index][i - delta], arrClone[colum2][i]);
        } else {
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

tableView.prototype.getHeightChild = function() {
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

tableView.prototype.getElementChild = function() {
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

tableView.prototype.getBound2Row = function(row1, row2) {
    var self = this;
    var top, bottom, elementReal;
    if (self.clone[0][row1] !== undefined)
        var style1 = window.getComputedStyle(self.clone[0][row1]);
    if (self.clone[0][row2] !== undefined) {
        var style2 = window.getComputedStyle(self.clone[0][row2]);
        elementReal = self.clone[0][row2].parentNode;
    } else {
        if (self.tagName !== "DIV") {
            if (self.clone[0][row1].parentNode.childrenNodes.length !== 0) {
                var x = self.clone[0][row1].parentNode.getElementChild();
                elementReal = x[x.length - 1].nextSibling;
            } else
                elementReal = self.clone[0][row1].parentNode.nextSibling;
        }
    }
    if (row1 !== undefined) {
        top = (self.clone[0][row1].offsetHeight) / 2 + parseFloat(style1.webkitBorderVerticalSpacing) / 2;
    } else
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
    } else {
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
            mouseover: function() {}
        },
        child: [{
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

function compareIncrease(valueA, valueB) {
    if (typeof valueA === "string")
        valueA = valueA.toLowerCase();
    if (typeof valueB === "string")
        valueB = valueB.toLowerCase();
    if (valueA > valueB)
        return -1;
    if (valueA < valueB)
        return 1;
    return 0;
}

function sortArray(arr, index, increase = true) {
    var check = [];
    var result = [];
    var indexLength;

    if (arr.length === 0)
        return [];
    for (var i = 0; i < arr.length; i++) {
        var object = arr[i].getRowMerge;
        if (check[JSON.stringify(JSON.stringify(object))])
            continue;
        indexLength = object.length;
        for (var j = 0; j < object.length; j++) {
            if (check[JSON.stringify(object[j])]) {
                indexLength--;
                continue;
            }
            check[JSON.stringify(object[j])] = object[j];
        }
        if (indexLength > 0) {
            check[JSON.stringify(object)] = object;
            result.push(object);
        }
    }
    if (increase) {
        result.sort(function(prev, next) {
            var a = prev[0];
            var b = next[0];
            if (prev.length === 1)
                if (a.child !== undefined) {
                    sortArray(a.child, index, increase);
                }
            var valueA = a[index].value;
            var valueB = b[index].value;
            if (valueA === undefined)
                valueA = a[index];
            if (valueB === undefined)
                valueB = b[index];
            return compareIncrease(valueA, valueB);
        })
        if (result.length !== 0)
            if (result[result.length - 1].length === 1) {
                if (result[result.length - 1][0].child !== undefined)
                    sortArray(result[result.length - 1][0].child, index, increase);
            }
    } else {
        result.sort(function(prev, next) {
            var a = prev[0];
            var b = next[0];
            if (prev.length === 1)
                if (a.child !== undefined)
                    sortArray(a.child, index, increase);
            var valueA = a[index].value;
            var valueB = b[index].value;
            if (valueA === undefined)
                valueA = a[index];
            if (valueB === undefined)
                valueB = b[index];
            return compareIncrease(valueB, valueA);
        })
        if (result.length !== 0)
            if (result[result.length - 1].length === 1) {
                if (result[result.length - 1][0].child !== undefined)
                    sortArray(result[result.length - 1][0].child, index, increase);
            }
    }
    arr.splice(0, arr.length);
    for (var param in result) {
        for (var i = 0; i < result[param].length; i++) {
            result[param][i].oldIndex = i;
            arr.push(result[param][i]);
        }
    }
    return arr;
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
        contentElement = _({
            tag: "span",
            class: "module-delete-header-content",
            props: {
                innerHTML: content
            }
        })
    } else {
        contentElement = content;
    }
    var temp;
    var promiseComfirm = new Promise(function(resolve, reject) {
        temp = _({
            tag: "modal",
            class: "modal-delete-module",
            child: [{
                tag: "div",
                class: "module-delete-container",
                child: [{
                        tag: "div",
                        class: "module-delete-header",
                        child: [{
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
                                    click: function(event) {
                                        temp.selfRemove();
                                        reject();
                                    }
                                },
                                child: [{
                                    tag: "i",
                                    class: ["module-delete-header-close", "material-icons"],
                                    props: {
                                        innerHTML: "close"
                                    }
                                }]
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
                        child: [{
                                tag: "button",
                                class: "module-delete-button-yes",
                                on: {
                                    click: function(event) {
                                        temp.selfRemove();
                                        setTimeout(function() {
                                            resolve();
                                        }, 60);
                                    }
                                },
                                child: [{
                                    tag: "span",
                                    class: "module-delete-button-yes-label",
                                    props: {
                                        innerHTML: yes
                                    }
                                }]
                            },
                            {
                                tag: "button",
                                class: "module-delete-button-no",
                                on: {
                                    click: function(event) {
                                        temp.selfRemove();
                                        reject();
                                    }
                                },
                                child: [{
                                    tag: "span",
                                    class: "module-delete-button-no-label",
                                    props: {
                                        innerHTML: no
                                    }
                                }]
                            }
                        ]
                    },
                ]
            }]
        })
    })

    temp.promiseComfirm = promiseComfirm;
    return temp;
}


export function confirmQuestion(title, content, yes = "OK") {
    var contentElement;
    if (typeof content !== "object") {
        contentElement = _({
            tag: "span",
            class: "module-delete-header-content",
            props: {
                innerHTML: content
            }
        })
    } else {
        contentElement = content;
    }
    var temp;
    var promiseComfirm = new Promise(function(resolve, reject) {
        temp = _({
            tag: "modal",
            class: "modal-delete-module",
            child: [{
                tag: "div",
                class: "module-delete-container",
                child: [{
                        tag: "div",
                        class: "module-delete-header",
                        child: [{
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
                                    click: function(event) {
                                        temp.selfRemove();
                                        reject();
                                    }
                                },
                                child: [{
                                    tag: "i",
                                    class: ["module-delete-header-close", "material-icons"],
                                    props: {
                                        innerHTML: "close"
                                    }
                                }]
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
                        child: [{
                            tag: "button",
                            class: "module-delete-button-yes",
                            on: {
                                click: function(event) {
                                    temp.selfRemove();
                                    resolve();
                                }
                            },
                            child: [{
                                tag: "span",
                                class: "module-delete-button-yes-label",
                                props: {
                                    innerHTML: yes
                                }
                            }]
                        }]
                    },
                ]
            }]
        })
    })

    temp.promiseComfirm = promiseComfirm;
    return temp;
}