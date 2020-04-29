<?php
include_once    "jsstorage.php";
include_once    "jsencoding.php";
/*
php:
    DOMClass::write_script();
javascript:
    DOMClass.divString({
        [optional] elementid: "",
        [optional] class: "",
        [optional] attribute: "",
        [optional] width: 0,
        [optional] height: 0,
        [optional] style: "",
        [optional] innerHTML: "",
        [optional] text: ""
    });
    DOMClass.text ({
                text: "sampletext",
        [optional] style: "italic",
        [optional] size: "14px",
        [optional] weight: "bold",
        [optional] nowrap: false,
        [optional] align: "center",
        [optional] valign: "text-top",
        [optional] decoration: "underline",
        [optional] color: "black",
        [optional] backgroundcolor: "white"
    });
    DOMClass.inputTextString({
        [optional] elementid: "sampleInputTextInput",
        [optional] password: false,
        [optional] width: 150,
        [optional] height: 22,
        [optional] size: 30,
        [optional] style: "",
        [optional] align: "left",
        [optional] disabled: false,
        [optional] placeholder: "",
        [optional] attribute: "",
        [optional] value: "",
        [optional] onkeypressCmd: "",
        [optional] onchangeCmd: ""
    });
    DOMClass.textareaString({
        [optional] elementid: "sampleInputTextInput",
        [optional] text: "abcd",
        [optional] width: 450,
        [optional] height: 300
    });
    DOMClass.checkboxString({
        [optional] elementid: "sampleCheckboxInput",
        [optional] checked: true,
        [optional] onchangeCmd: "alert('changed')",
        [optional] text: "checkbox text",
        [optional] textcolor: "black"
    });
    DOMClass.comboboxString({
        [optional] elementid: "sampleComboboxInput",
        [optional] list: [ {value: 1, text: "Một"}, {value: 2, text: "Hai"} ],
        [optional] selectedvalue: 1,
        [optional] width: 150,
        [optional] onchangeCmd: "alert('changed')",
    });
    DOMClass.linkString({
        [optional] textcolor: "red",
        [optional] content: content,
        [optional] link: link,
        [optional] onclickCmd: ""
    });
    DOMClass.imageString({
                    image: "../images/sampleimage.png",
        [optional] image2: "../images/sampleimage_hover.png",
        [optional] elementid: "sampleImage",
        [optional] class: "classname",
        [optional] style: "",
        [optional] width: 150,
        [optional] height: 150,
    });
    DOMClass.imagelinkString({
                    image: "../images/sampleimage.png",
        [optional] image2: "../images/sampleimage_hover.png",
        [optional] class: "classname",
        [optional] style: "",
        [optional] width: 150,
        [optional] height: 150,
        [optional] link: link,
        [optional] onclickCmd: ""
    });
    DOMClass.tooltipString({
        [optional] elementid: "",
        [optional] color: "black",
        [optional] backgroundcolor: "white",
        [optional] width: 250,
        [optional] height: 100,
        [optional] hpos: 0,
        [optional] vpos: 1,
        [optional] isarrow: true,
        [optional] class: "",
        [optional] style: "",
        [optional] innerHTML: "",
        [optional] text: "",
        [optional] tooltipInnerHTML: "",
        [optional] tooltiptext: ""
    });
    DOMClass.table.generate({
        [optional] elementid: "sampleTable",
        [optional] prefixid: "samplePrefixId",
        [optional] class: "",
        [optional] backgroundcolor: "white",
        [optional] backgroundcolor2: "#dddddd",
        [optional] backgroundcolor3: "#afafaf",
        [optional] style: "",
        [optional] noborder: true,
        [optional] width: "",
        [optional] header: [{
                                [optional] elementid: "",
                                [optional] style: "",
                                [optional] class: "",
                                [optional] onclickCmd: "",
                                [optional] colspan: 1,
                                [optional] text: "col1",
                                [optional] innerHTML: ""
                            }],
        data: [{
            [optional] elementid: "",
            [optional] style: "",
            [optional] class: "",
            [optional] onclickCmd: "",
            cells: [{
                [optional] elementid: "",
                [optional] style: "",
                [optional] nowrap: false,
                [optional] class: "",
                [optional] colspan: 1,
                [optional] rowspan: 1,
                [optional] align: "left",
                [optional] valign: "top",
                [optional] onclickCmd: "",
                [optional] text: ""
                [optional] innerHTML: ""
            }]
        }]
    });
    DOMClass.table.cell(text);
    DOMClass.table.quickrow(textarray);
    DOMClass.treetable.generate({
        [optional] elementid: "sampleTreeTable",
        [optional] class: "",
        [optional] backgroundcolor: "white",
        [optional] backgroundcolor2: "#dddddd",
        [optional] backgroundcolor3: "#7F7F7F",
        [optional] image1: "nicons/ico-uncollapsed.png",
        [optional] image2: "nicons/ico-collapsed.png",
        [optional] isScrolled: false,
        [optional] header: [{
                                [optional] elementid: "",
                                [optional] style: "",
                                [optional] class: "",
                                [optional] onclickCmd: "",
                                [optional] colspan: 1,
                                [optional] text: "col1",
                                [optional] width: 0,
                                [optional] innerHTML: ""
                            }],
        data: [{
            cells:[{
                [optional] elementid: "",
                [optional] style: "",
                [optional] class: "",
                [optional] colspan: 1,
                [optional] rowspan: 1,
                [optional] text: "",
                [optional] innerHTML: ""
            }],
            children: [{cells, children}]
        }]
    });
    DOMClass.dropdownbox.generate({
        [optional] elementid,
        [optional] width: 0,
        [optional] height: 0,
        [optional] nowrap: false,
        [optional] class: "",
        [optional] style: "",
        [optional] hpos: 1,
        [optional] vpos: 1,
        [optional] innerHTML: "",
        [optional] text: ""
    });
    DOMClass.dropdownbox.choiceListString({
        [optional] elementid,
        [optional] width: 0,
        [optional] height: 0,
        [optional] buttonimage: "",
        [optional] buttonimage2: "",
        [optional] buttonwidth: 16,
        [optional] buttonheight: 16,
        [optional] image: "",
        [optional] image2: "",
        [optional] symbol: "&#9734",
        [optional] symbol2: "&#9733",
        [optional] imagewidth: 16,
        [optional] imageheight: 16,
        [optional] nowrap: false,
        [optional] class: "",
        [optional] style: "",
        [optional] hpos: 1,
        [optional] vpos: 1,
        [optional] innerHTML: "",
        [optional] text: "",
        list : [{
            [optional] image: "",
            [optional] image2: "",
            [optional] symbol: "&#9734",
            [optional] symbol2: "&#9733",
            [optional] width: 16,
            [optional] height: 16,
            [optional] color: "",
            [optional] color2: "",
            text: "",
            onclickCmd: ""
        }]
    });
    DOMClass.radio.getvalue(name);
    DOMClass.radio.generate({
        [optional] elementid,
        [optional] name: "quantity",
        [optional] value: 1,
        [optional] checked: false,
        [optional] onchangeCmd,
        [optional] text: "Một",
        [optional] textcolor: "black",
    });
    DOMClass.progressbar({
        width: 150,
        height: 16,
        [optional] color: "green",
        [optional] color2: "#afafaf",
        [optional] bordercolor: "#afafaf",
        progress: 0.7
    });
    DOMClass.escapedString(str);
    DOMClass.onloadString(cmd);
    DOMClass.onloadFuncString(func);
    DOMClass.comboboxSetValue(element, value);
    DOMClass.loadImage(imagepath);  // preload image
    DOMClass.loadImages(imagepaths[]);  // preload images
    DOMClass.addClass(element, classname);
    DOMClass.removeClass(element, classname);
    DOMClass.containClass(element, classname); // return true / false
    DOMClass.getContentSize(htmlContent); // return {width, height} of htmlContent
    DOMClass.getTextSize(text); // return {width, height} of text

    function DOMElement.head();
    function DOMElement.body();
    function DOMElement.loadCSS(text);
    function DOMElement.textNode(text);
    function DOMElement.create({
        type: "div",
        [option 1] attrs: [ {name: "id", value: "testid"} ],
        [option 2] attrs: {
            id: "testid",
            size: 5
        },
        [option 1] children: [ DOMElement ],
        [option 2] innerHTML: "asdf",
        [option 3] text:
    });
*/
$DOM_script_written = 0;

class DOMClass {
    public static function write_script() {
        global $DOM_script_written;
        if ($DOM_script_written == 1) return;
        $DOM_script_written = 1;
        StorageClass::write_script();
        EncodingClass::write_script();
        ?>
        <style>
            .domclass_dropbtn {
                border: none;
                cursor: pointer;
            }
            .domclass_dropdownholder {
                position: relative;
                display: inline-block;
            }
            .domclass_dropdowncontent {
                display: none;
                overflow: visible;
                box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            }
            .domclass_dropdown_show {display:block;}

            .domclass_tooltip {
                position: relative;
                display: inline-block;
            }

            .domclass_tooltip .domclass_tooltiptext {
                visibility: hidden;
                border-radius: 6px;
                border: 1px solid #555;
                padding: 5px;
                position: absolute;
                opacity: 0;
                transition: opacity 2s;
            }

            .domclass_tooltip:hover .domclass_tooltiptext {
                visibility: visible;
                opacity: 1;
            }

            .domclass_tooltip .domclass_tooltiptextarrowup {
                visibility: hidden;
                border-radius: 6px;
                border: 1px solid #555;
                padding: 5px;
                position: absolute;
                opacity: 0;
                transition: opacity 2s;
            }

            .domclass_tooltip:hover .domclass_tooltiptextarrowup {
                visibility: visible;
                opacity: 1;
            }

            .tooltip .domclass_tooltiptextarrowup::after {
                content: "";
                position: absolute;
                bottom: 100%;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: transparent transparent #555 transparent;
            }

            .domclass_tooltip .domclass_tooltiptextarrowdown {
                visibility: hidden;
                border-radius: 6px;
                border: 1px solid #555;
                padding: 5px;
                position: absolute;
                opacity: 0;
                transition: opacity 2s;
            }

            .domclass_tooltip:hover .domclass_tooltiptextarrowdown {
                visibility: visible;
                opacity: 1;
            }

            .tooltip .domclass_tooltiptextarrowdown::after {
                content: "";
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: #555 transparent transparent transparent;
            }

        </style>
        <script type="text/javascript">

            'use strict';

            var DOMClass = {
                curid : 0,
                getid : function () {
                    return "DOOMClass_autoid_" + (DOMClass.curid++);
                },
                text : function (params) {
                    var st, sx = "";
                    st = "<text";
                    if (params.style !== undefined) sx += "font-style: " + params.style + ";";
                    if (params.size !== undefined) sx += "font-size: " + params.size + ";";
                    if (params.weight !== undefined) sx += "font-weight: " + params.weight + ";";
                    if (params.nowrap !== undefined) if (params.nowrap == true) sx += "white-space: nowrap;";
                    if (params.align !== undefined) sx += "text-align: " + params.align + ";";
                    if (params.valign !== undefined) sx += "vertical-align: " + params.valign + ";";
                    if (params.decoration !== undefined) sx += "text-decoration: " + params.decoration + ";";
                    if (params.color !== undefined) sx += "color: " + params.color + ";";
                    if (params.backgroundcolor !== undefined) sx += "background-color: " + params.backgroundcolor + ";";
                    if (sx != "") st += " style=\"" + sx + "\"";
                    st += ">";
                    st += EncodingClass.inputvalue(params.text) + "</text>";
                    return st;
                },
                divString : function (params) {
                    var st, xstyle = "";
                    st = "<div";
                    if (params.elementid !== undefined) st += " id=\"" + params.elementid + "\"";
                    if (params.class !== undefined) st += " class=\"" + params.class + "\"";
                    if (params.attribute !== undefined) st += " " + params.attribute;
                    if (params.width !== undefined) xstyle += "width: " + params.width + "px; ";
                    if (params.height !== undefined) xstyle += "height: " + params.height + "px; ";
                    if (params.style !== undefined) {
                        st += " style=\"" + xstyle + params.style + "\"";
                    }
                    else if (xstyle != "") {
                        st += " style=\"" + xstyle + "\"";
                    }
                    st += ">";
                    if (params.innerHTML !== undefined) {
                        st += params.innerHTML;
                    }
                    else if (params.text !== undefined) {
                        st += EncodingClass.textshow(params.text);
                    }
                    st += "</div>";
                    return st;
                },
                tooltipString : function (params) {
                    var st, t = {};
                    if (params.color === undefined) params.color = "black";
                    if (params.backgroundcolor === undefined) params.backgroundcolor = "white";
                    if (params.hpos === undefined) params.hpos = 0;
                    if (params.vpos === undefined) params.vpos = 1;
                    if (params.isarrow === undefined) params.isarrow = false;
                    t.class = "domclass_tooltip";
                    if (params.class !== undefined) t.class += " " + params.class;
                    if (params.style !== undefined) t.style = params.style;
                    if (params.elementid !== undefined) t.elementid = params.elementid;
                    if (params.innerHTML !== undefined) {
                        st = params.innerHTML;
                    }
                    else if (params.text !== undefined) st = EncodingClass.textshow(params.text);
                    st += "<span class=\"";
                    if (params.isarrow) {
                        if (params.vpos >= 0) {
                            st += "domclass_tooltiptextarrowup";
                        }
                        else {
                            st += "domclass_tooltiptextarrowdown";
                        }
                    }
                    else {
                        st += "domclass_tooltiptext";
                    }
                    st += "\" style=\"";
                    if (params.width !== undefined) st += " width: " + params.width + "px;";
                    if (params.height !== undefined) st += " height: " + params.height + "px;";
                    if (params.hpos >= 0) {
                        st += " left: " + (~~(50 + params.hpos * 50)) + "%;";
                    }
                    else {
                        st += " right: " + (~~(50 - params.hpos * 50)) + "%;";
                    }
                    if (params.vpos >= 0) {
                        st += " top: " + (~~(50 + params.vpos * 50)) + "%;";
                    }
                    else {
                        st += " bottom: " + (~~(50 - params.vpos * 50)) + "%;";
                    }
                    st += "color: " + params.color + "; background-color: " + params.backgroundcolor + ";\">";
                    if (params.tooltipInnerHTML !== undefined) {
                        st += params.tooltipInnerHTML;
                    }
                    else if (params.tooltiptext !== undefined) st += EncodingClass.textshow(params.tooltiptext);
                    st += "</span>";
                    t.innerHTML = st;
                    return DOMClass.divString(t);
                },
                dropdownbox : {
                    generate : function (params) {
                        var id, width = 0, height = 0, nowrap = false, style = "", px = 0, py = 0;
                        var st;
                        if (params.elementid !== undefined) {
                            id = params.elementid;
                        }
                        else {
                            id = DOMClass.getid();
                        }
                        if (params.width !== undefined) width = params.width;
                        if (params.height !== undefined) height = params.height;
                        if (params.nowrap !== undefined) nowrap = params.nowrap;
                        if (params.style !== undefined) style = params.style;
                        if (params.hpos !== undefined) px = ~~((1-params.hpos)*100);
                        if (params.vpos !== undefined) py = ~~((1-params.vpos)*100);
                        st = "<div class=\"domclass_dropdownholder\" style=\"z-index: 10000;\">";
                        st += "<div id=\"" + id + "\" class=\"domclass_dropdowncontent";
                        if (params.class !== undefined) st += " " + params.class;
                        st += "\" style=\"position: absolute;";
                        if ((width > 0) && (height > 0)) {
                            st += "width: " + width + "px; height: " + height + "px;";
                        }
                        else if ((width > 0) && (height == 0)) {
                            st += "width: " + width + "px;";
                        }
                        else if ((width == 0) && (height > 0)) {
                            st += "height: " + height + "px; white-space: nowrap; word-space: nowrap;";
                        }
                        else if (nowrap == true) {
                            st += "white-space: nowrap; word-space: nowrap;";
                        }
                        if (px > 0) st += " right: " + px + "%;";
                        if (py > 0) st += " bottom: " + py + "%;";
                        if (style != "") st += " " + style;
                        st += "\">";
                        if (params.innerHTML !== undefined) {
                            st += params.innerHTML;
                        }
                        else if (params.text !== undefined) {
                            st += EncodingClass.textshow(params.text);
                        }
                        st += "</div></div>";
                        return st;
                    },
                    choiceListString : function (params) {
                        var id, t, i, k, k2, st, sx, bc1 = "white", bc2 = "#f1f1f1", c1, c2, image, image2, symbol, symbol2, w, h;
                        if (params.elementid !== undefined) {
                            id = params.elementid;
                        }
                        else {
                            id = DOMClass.getid();
                        }
                        if (params.buttonimage !== undefined) {
                            t = {
                                image: params.buttonimage,
                                width: 16,
                                height: 16,
                                class: "domclass_dropbtn",
                                onclickCmd: "DOMClass.dropdownbox.toggle('" + id + "');"
                            };
                            if (params.buttonimage2 !== undefined) t.image2 = params.buttonimage2;
                            if (params.buttonwidth !== undefined) t.width = params.buttonwidth;
                            if (params.buttonheight !== undefined) t.height = params.buttonheight;
                            sx = DOMClass.imagelinkString(t);
                        }
                        else {
                            sx = "";
                        }

                        st = "<table border=\"0\" style=\"border: 0px; border-spacing: 0px; border-collapse: separate;\">";
                            for (i = 0; i < params.list.length; i++) {
                                image = "";
                                if (params.image !== undefined) image = params.image;
                                image2 = image;
                                if (params.list[i].image !== undefined) image = params.list[i].image;
                                if (params.image2 !== undefined) image2 = params.image2;
                                if (params.list[i].image2 !== undefined) image2 = params.list[i].image2;
                                if (image2 == "") image2 = image;
                                w = h = 16;
                                if (params.imagewidth !== undefined) w = params.imagewidth;
                                if (params.imageheight !== undefined) h = params.imageheight;
                                if (params.list[i].width !== undefined) w = params.list[i].width;
                                if (params.list[i].height !== undefined) h = params.list[i].height;
                                c1 = "black";
                                if (params.color !== undefined) c1 = params.color;
                                if (params.list[i].color !== undefined) c1 = params.list[i].color;
                                c2 = c1;
                                if (params.color2 !== undefined) c2 = params.color2;
                                if (params.list[i].color2 !== undefined) c2 = params.list[i].color2;
                                symbol = "";
                                symbol2 = "";
                                if (params.symbol !== undefined) symbol = params.symbol;
                                if (params.list[i].symbol !== undefined) symbol = params.list[i].symbol;
                                if (params.symbol2 !== undefined) symbol2 = params.symbol2;
                                if (params.list[i].symbol2 !== undefined) symbol2 = params.list[i].symbol2;
                                if (symbol == "") symbol = "&#9734";
                                if (symbol2 == "") {
                                    if (symbol != "&#9734") {
                                        symbol2 = symbol;
                                    }
                                    else {
                                        symbol2 = "&#9733";
                                    }
                                }
                                k = DOMClass.getid();
                                if (image !== "") {
                                    if (image2 !== "") {
                                        k2 = DOMClass.getid();
                                        st += "<tr style=\"border: 0px; background-color: " + bc1 + ";\"";
                                        st += " onmouseover=\"this.style.backgroundColor='" + bc2 + "'; document.getElementById('" + k + "').src='" + image2 + "'; document.getElementById('" + k2 + "').style.color='" + c2 + "';\"";
                                        st += " onmouseout=\"this.style.backgroundColor='" + bc1 + "'; document.getElementById('" + k + "').src='" + image + "'; document.getElementById('" + k2 + "').style.color='" + c1 + "';\"";
                                        st += " onclick=\"DOMClass.dropdownbox.toggle('" + id + "'); " + params.list[i].onclickCmd + "; event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\">";
                                        st += "<td style=\"border: 0px; cursor: pointer; padding: 12px 15px 12px 12px;\">";
                                        st += "<img id=\"" + k + "\" src='" + image + "' width=\"" + w + "\" height=\"" + h + "\"/></td>";
                                        st += "<td id=\"" + k2 + "\" style=\"border: 0px; cursor: pointer; padding: 12px 40px 12px 10px; text-align: left; color: " + c1 + "\">";
                                        st += EncodingClass.textshow(params.list[i].text) + "</td>";
                                    }
                                    else {
                                        st += "<tr style=\"border: 0px; background-color: " + bc1 + ";\"";
                                        st += " onmouseover=\"this.style.backgroundColor='" + bc2 + "'; document.getElementById('" + k + "').style.color='" + c2 + "';\"";
                                        st += " onmouseout=\"this.style.backgroundColor='" + bc1 + "'; document.getElementById('" + k + "').style.color='" + c1 + "';\"";
                                        st += " onclick=\"DOMClass.dropdownbox.toggle('" + id + "'); " + params.list[i].onclickCmd + "; event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\">";
                                        st += "<td style=\"border: 0px; cursor: pointer; padding: 12px 15px 12px 12px;\">";
                                        st += "<img src='" + image + "' width=\"" + w + "\" height=\"" + h + "\"/></td>";
                                        st += "<td id=\"" + k + "\" style=\"border: 0px; cursor: pointer; padding: 12px 40px 12px 10px; text-align: left; color: " + c1 + "\">";
                                        st += EncodingClass.textshow(params.list[i].text) + "</td>";
                                    }
                                }
                                else {
                                    k2 = DOMClass.getid();
                                    if (symbol != symbol2) {
                                        st += "<tr style=\"border: 0px; background-color: " + bc1 + ";\"";
                                        st += " onmouseover=\"this.style.backgroundColor='" + bc2 + "'; document.getElementById('" + k + "').innerHTML='" + symbol2 + "'; document.getElementById('" + k + "').style.color='" + c2 + "'; document.getElementById('" + k2 + "').style.color='" + c2 + "';\"";
                                        st += " onmouseout=\"this.style.backgroundColor='" + bc1 + "'; document.getElementById('" + k + "').innerHTML='" + symbol + "'; document.getElementById('" + k + "').style.color='" + c1 + "'; document.getElementById('" + k2 + "').style.color='" + c1 + "';\"";
                                        st += " onclick=\"DOMClass.dropdownbox.toggle('" + id + "'); " + params.list[i].onclickCmd + "; event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\">";
                                        st += "<td id=\"" + k + "\" style=\"border: 0px; cursor: pointer; padding: 12px 15px 12px 12px; text-align: center; color: " + c1 + ";\">" + symbol + "</td>";
                                        st += "<td id=\"" + k2 + "\" style=\"border: 0px; cursor: pointer; padding: 12px 40px 12px 10px; text-align: left; color: " + c1 + ";\">";
                                        st += EncodingClass.textshow(params.list[i].text) + "</td>";
                                    }
                                    else {
                                        st += "<tr style=\"border: 0px; background-color: " + bc1 + ";\"";
                                        st += " onmouseover=\"this.style.backgroundColor='" + bc2 + "'; document.getElementById('" + k + "').style.color='" + c2 + "'; document.getElementById('" + k2 + "').style.color='" + c2 + "';\"";
                                        st += " onmouseout=\"this.style.backgroundColor='" + bc1 + "'; document.getElementById('" + k + "').style.color='" + c1 + "'; document.getElementById('" + k2 + "').style.color='" + c1 + "';\"";
                                        st += " onclick=\"DOMClass.dropdownbox.toggle('" + id + "'); " + params.list[i].onclickCmd + "; event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\">";
                                        st += "<td id=\"" + k + "\" style=\"border: 0px; cursor: pointer; padding: 12px 15px 12px 12px; text-align: center; color: " + c1 + ";\">" + symbol + "</td>";
                                        st += "<td id=\"" + k2 + "\" style=\"border: 0px; cursor: pointer; padding: 12px 40px 12px 10px; text-align: left; color: " + c1 + ";\">";
                                        st += EncodingClass.textshow(params.list[i].text) + "</td>";
                                    }
                                }
                                st += "</tr>";
                            }
                        st += "</table>";
                        t = {elementid: id, innerHTML: st};
                        if (params.width !== undefined) t.width = params.width;
                        if (params.height !== undefined) t.height = params.height;
                        if (params.nowrap !== undefined) t.nowrap = params.nowrap;
                        if (params.style !== undefined) t.style = params.style;
                        if (params.hpos !== undefined) t.hpos = params.hpos;
                        if (params.vpos !== undefined) t.vpos = params.vpos;
                        if (params.class !== undefined) t.class = params.class;
                        return sx + DOMClass.dropdownbox.generate(t);
                    },
                    toggle : function (element) {
                        var parentList = [], x;
                        var i, j, k;
                        var dropdowns, openDropdown;
                        if (element === undefined) return;
                        if (element.parentElement === undefined) {
                            element = document.getElementById(element);
                            if (element == null) return;
                        }
                        if (element.parentElement === undefined) return;
                        x = element.parentElement;
                        while (x != null) {
                            k = 0;
                            if (DOMClass.containClass(x, 'domclass_dropdownholder')) k = 1;
                            if (k == 1) parentList.push(x);
                            x = x.parentElement;
                        }
                        if (element.classList.contains('domclass_dropdowncontent')) {
                            element.classList.toggle("domclass_dropdown_show");
                            if (DOMClass.containClass(element, 'domclass_dropdown_show')) DOMClass.dropdownbox.lastshown = element;
                        }
                        else {
                            dropdowns = document.getElementsByClassName("domclass_dropdowncontent");
                            for (i = 0; i < dropdowns.length; i++) {
                                openDropdown = dropdowns[i];
                                for (j = k = 0; j < parentList.length; j++) {
                                    if (openDropdown == parentList[j]) {
                                        k = 1;
                                        break;
                                    }
                                }
                                if (k == 0) if (openDropdown.classList.contains('domclass_dropdown_show')) openDropdown.classList.remove('domclass_dropdown_show');
                            }
                            element.classList.toggle("domclass_dropdown_show");
                        }
                    },
                    onclickeventFunction : function (event) {
                        var i, x = event.target, ok = 0;
                        var dropdowns, openDropdown;
                        while (x != null) {
                            if (DOMClass.containClass(x, 'domclass_dropbtn')) {
                                ok = 1;
                                break;
                            }
                            if (DOMClass.containClass(x, 'domclass_dropdowncontent')) {
                                ok = 1;
                                break;
                            }
                            if (x.parentElement != null) {
                                x = x.parentElement;
                            }
                            else {
                                if (x.nodeName.toLowerCase() != "html") ok = 1;
                                x = null;
                            }
                        }
                        if (ok == 0) {
                            dropdowns = document.getElementsByClassName("domclass_dropdowncontent");
                            for (i = 0; i < dropdowns.length; i++) {
                                openDropdown = dropdowns[i];
                                if (openDropdown.classList.contains("domclass_dropdown_show")) openDropdown.classList.remove("domclass_dropdown_show");
                            }
                        }
                        else if (DOMClass.containClass(event.target, 'domclass_dropbtn')) {
                            dropdowns = document.getElementsByClassName("domclass_dropdowncontent");
                            for (i = 0; i < dropdowns.length; i++) {
                                openDropdown = dropdowns[i];
                                if (openDropdown.classList.contains("domclass_dropdown_show")) {
                                    x = openDropdown;
                                    ok = 0;
                                    while (x != null) {
                                        if (x == DOMClass.dropdownbox.lastshown) {
                                            ok = 1;
                                            break;
                                        }
                                        x = x.parentElement;
                                    }
                                    if (ok == 0) openDropdown.classList.remove("domclass_dropdown_show");
                                };
                            }
                        }
                    },
                    lastshown: null
                },
                escapedString : function (str) {
                    return str.replace(/"/g, "\\\"");
                },
                textareaString: function (params) {
                    var st, w, h;
                    st = "<textarea";
                    if (params.elementid !== undefined) st += " id=\"" + params.elementid + "\"";
                    if (params.width !== undefined) w = params.width; else w = -1;
                    if (params.height !== undefined) h = params.height; else h = -1;
                    if ((w != -1) || (h != -1)) {
                        st += " style=\"";
                        if (w != -1) st += " width: " + w + "px;";
                        if (h != -1) st += " height: " + h + "px;";
                        st += "\"";
                    }
                    st += ">";
                    if (params.text !== undefined) st += inputvalue(params.text);
                    st += "</textarea>";
                    return st;
                },
                inputTextString : function (params) {
                    var id, st, sx, p = 0, tf;
                    if (params.elementid !== undefined) {
                        id = params.elementid;
                    }
                    else {
                        id = DOMClass.getid();
                    }
                    st = "<input ";
                    if (params.password !== undefined) {
                        if (params.password == true) p = 1;
                    }
                    if (p == 1) {
                        st += "type=\"password\"";
                    }
                    else {
                        st += "type=\"text\"";
                    }
                    if (params.placeholder !== undefined) st += " placeholder=\"" + EncodingClass.inputvalue(params.placeholder) + "\"";
                    if (params.size !== undefined) st += " size=\"" + params.size + "\"";
                    if (params.attribute !== undefined) st += " " + params.attribute;
                    st += " id=\"" + id + "\" style=\"border-radius:4px; border: 1px solid; padding-left: 5px; padding-right: 5px;";
                    if (params.height !== undefined) {
                        st += " height: " + params.height + "px;"
                    }
                    else {
                        st += " height: 22px;";
                    }
                    if (params.width !== undefined) {
                        st += " width: " + params.width + "px;"
                    }
                    else {
                        st += " width: 150px;";
                    }
                    if (params.align !== undefined) st += " text-align: " + params.align + ";"
                    if (params.style !== undefined) st += " " + params.style;
                    st += "\"";
                    if ((params.onchangeFunc === undefined) && (params.onchangeCmd !== undefined)) {
                        st += " onchange=\"" + params.onchangeCmd + ";\"";
                        st += " onkeyup=\"" + params.onchangeCmd + ";\"";
                        st += " onpaste=\"" + params.onchangeCmd + ";\"";
                    }
                    if (params.onkeypressCmd !== undefined) {
                        st += " onkeypress=\"" + params.onkeypressCmd + ";\"";
                    }
                    if (params.value !== undefined) st += " value=\"" + EncodingClass.inputvalue(params.value) + "\"";
                    if (params.disabled !== undefined) {
                        if (params.disabled == true) st += " disabled";
                    }
                    st += "/>";
                    if (params.onchangeFunc !== undefined) {
                        tf = function (id, func) {
                            return function () {
                                var e = document.getElementById(id);
                                e.onchange = func;
                                e.onpaste = func;
                                e.onkeyup = func;
                            };
                        } (id, params.onchangeFunc);
                        st += DOMClass.onloadFuncString(tf);
                    }
                    return st;
                },

                checkboxString : function (params) {
                    var id, st;
                    if (params.elementid !== undefined) {
                        id = params.elementid;
                    }
                    else {
                        id = DOMClass.getid();
                    }
                    st = "<input type=\"checkbox\" id=\"" + id + "\"";
                    if (params.checked !== undefined) {
                        if (params.checked) st += " checked";
                    }
                    if (params.onchangeCmd !== undefined) {
                        if (params.onchangeCmd != "") {
                            st += " onchange=\"" + params.onchangeCmd + "\"";
                        }
                    }
                    st += ">";
                    if (params.text !== undefined) {
                        if (params.text != "") {
                            st += "<a href=\"#\" style=\"text-decoration: none; ";
                            if (params.textcolor !== undefined) {
                                st += "color: " + params.textcolor + ";\"";
                            }
                            else {
                                st += "color: black;\"";
                            }
                            st += " onclick=\"document.getElementById('" + id + "').click(); event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\">";
                            st += params.text + " </a>";
                        }
                    }
                    st += "</input>";
                    return st;
                },

                table : {
                    cell : function (text) {
                        return {
                            text: text
                        };
                    },
                    quickrow : function (texts) {
                        var i, t = [];
                        for (i = 0; i < texts.length; i++) t.push(DOMClass.table.cell(texts[i]));
                        return {
                            cells: t
                        };
                    },
                    generate : function (params) {
                        var st = "", sx, id, prefixid, bc1, bc2, bc3;
                        var i, j;
                        if (params.elementid !== undefined) {
                            id = params.elementid;
                        }
                        else {
                            id = DOMClass.getid();
                        }
                        if (params.prefixid !== undefined) {
                            prefixid = params.prefixid + "_";
                        }
                        else {
                            prefixid = id + "_";
                        }
                        bc1 = "";
                        bc3 = "";
                        if (params.backgroundcolor !== undefined) {
                            bc1 = params.backgroundcolor;
                            if (params.backgroundcolor2 !== undefined) {
                                bc2 = params.backgroundcolor2;
                            }
                            else {
                                bc2 = bc1;
                            }
                        }
                        if (params.backgroundcolor3 !== undefined) bc3 = params.backgroundcolor3;
                        if (params.class !== undefined) st += "<div class=\"" + params.class + "\">";
                        st += "<table id=\"" + id + "\"";
                        if (params.noborder == undefined) params.noborder = true;
                        if (params.noborder == true) st += " noborder";
                        if (params.width !== undefined) st += " width=\"" + params.width + "\"";
                        if (params.style !== undefined) st += " style=\"" + params.style + "\"";
                        st += ">";
                        if (params.header !== undefined) {
                            st += "<tr id=\"" + prefixid + "_header_row\">";
                            for (i = 0; i < params.header.length; i++) {
                                st += "<th ";
                                if (params.header[i].elementid !== undefined) {
                                    st += "id=\"" + params.header[i].elementid + "\"";
                                }
                                else {
                                    st += "id=\"" + prefixid + "_header_cel_" + i + "\"";
                                }
                                if (params.header[i].style !== undefined) {
                                    st += " style=\"" + params.header[i].style + " white-space: nowrap;\"";
                                }
                                else {
                                    st += " style=\"white-space: nowrap;\"";
                                }
                                if (params.header[i].class !== undefined) st += " class=\"" + params.header[i].class + "\"";
                                if (params.header[i].colspan !== undefined) st += " colspan=\"" + params.header[i].colspan + "\"";
                                if (params.header[i].onclickCmd !== undefined) st += " onclick=\"" + params.header[i].onclickCmd + "; event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\"";
                                st += ">";
                                if (params.header[i].innerHTML !== undefined) {
                                    st += params.header[i].innerHTML;
                                }
                                else if (params.header[i].text !== undefined) {
                                    st += EncodingClass.inputvalue(params.header[i].text);
                                }
                                else {
                                    st += "&nbsp;";
                                }
                                st += "</th>";
                            }
                            st += "</tr>";
                        }
                        if (params.data !== undefined) {
                            for (i = 0; i < params.data.length; i++) {
                                if (params.data[i].elementid !== undefined) {
                                    st += "<tr id=\"" + params.data[i].elementid + "\"";
                                }
                                else {
                                    st += "<tr id=\"" + prefixid + "_row_" + i + "\"";
                                }
                                if (params.data[i].class !== undefined) st += " class=\"" + params.data[i].class + "\"";
                                if (params.data[i].style !== undefined) st += " style=\"" + params.data[i].style + ";\"";
                                if (bc1 != "") {
                                    if ((i & 1) == 0) {
                                        st += " bgcolor=\"" + bc1 + "\"";
                                        if (bc3 != "") st += " onmouseover=\"this.style.backgroundColor='" + bc3 + "';\" onmouseout=\"this.style.backgroundColor='" + bc1 + "';\"";
                                    }
                                    else {
                                        st += " bgcolor=\"" + bc2 + "\"";
                                        if (bc3 != "") st += " onmouseover=\"this.style.backgroundColor='" + bc3 + "';\" onmouseout=\"this.style.backgroundColor='" + bc2 + "'\"";
                                    }
                                }
                                if (params.data[i].onclickCmd !== undefined) st += "onclick=\"" + params.data[i].onclickCmd + "; event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\"";
                                st += ">";
                                for (j = 0; j < params.data[i].cells.length; j++) {
                                    st += "<td ";
                                    if (params.data[i].cells[j].elementid !== undefined) {
                                        st += "id=\"" + params.data[i].cells[j].elementid + "\"";
                                    }
                                    else {
                                        st += "id=\"" + prefixid + "_cell_" + i + "_" + j + "\"";
                                    }
                                    if (params.data[i].cells[j].style !== undefined) st += " style=\"" + params.data[i].cells[j].style + "\"";
                                    if (params.data[i].cells[j].class !== undefined) st += " class=\"" + params.data[i].cells[j].class + "\"";
                                    if (params.data[i].cells[j].onclickCmd !== undefined) st += " onclick=\"" + params.data[i].cells[j].onclickCmd + "; event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\"";
                                    if (params.data[i].cells[j].colspan !== undefined) st += " colspan=\"" + params.data[i].cells[j].colspan + "\"";
                                    if (params.data[i].cells[j].rowspan !== undefined) st += " rowspan=\"" + params.data[i].cells[j].rowspan + "\"";
                                    if (params.data[i].cells[j].align !== undefined) st += " align=\"" + params.data[i].cells[j].align + "\"";
                                    if (params.data[i].cells[j].valign !== undefined) st += " valign=\"" + params.data[i].cells[j].valign + "\"";
                                    if (params.data[i].cells[j].nowrap !== undefined) {
                                        if (params.data[i].cells[j].nowrap) st += " nowrap";
                                    }
                                    st += ">";
                                    if (params.data[i].cells[j].innerHTML !== undefined) {
                                        st += params.data[i].cells[j].innerHTML;
                                    }
                                    else if (params.data[i].cells[j].text !== undefined) {
                                        st += EncodingClass.inputvalue(params.data[i].cells[j].text);
                                    }
                                    else {
                                        st += "&nbsp;";
                                    }
                                    st += "</td>";
                                }
                                st += "</tr>";
                            }
                        }
                        st += "</table>";
                        if (params.class !== undefined) st += "</div>";
                        return st;
                    },
                },

                treetable : {
                    generate : function (params) {
                        var sx, st, t = {}, stacks = [], n = 0, m = 0, innerId;
                        var i, j, k, x, tf, img1, img2, id, buffer = [], z = [], bc1, bc2, bc3;
                        id = DOMClass.getid();
                        if (params.elementid !== undefined) {
                            t.elementid = params.elementid;
                        }
                        else {
                            t.elementid = DOMClass.getid();
                        }
                        if (params.header !== undefined) t.header = params.header;
                        if (params.height !== undefined) t.height = params.height;
                        innerId = t.elementid;
                        if (params.backgroundcolor !== undefined) {
                            bc1 = t.backgroundcolor = params.backgroundcolor;
                        }
                        else {
                            bc1 = t.backgroundcolor = "white";
                        }
                        if (params.image1 !== undefined) {
                            img1 = params.image1;
                        }
                        else {
                            img1 = "nicons/ico-uncollapsed.png";
                        }
                        if (params.image2 !== undefined) {
                            img2 = params.image2;
                        }
                        else {
                            img2 = "nicons/ico-collapsed.png";
                        }
                        if (params.backgroundcolor2 !== undefined) {
                            bc2 = t.backgroundcolor2 = params.backgroundcolor2;
                        }
                        else {
                            bc2 = t.backgroundcolor2 = "#EFEFEF";
                        }
                        if (params.backgroundcolor3 !== undefined) {
                            bc3 = t.backgroundcolor3 = params.backgroundcolor3;
                        }
                        else {
                            bc3 = t.backgroundcolor3 = "#BFBFBF";
                        }
                        for (i = params.data.length - 1; i >= 0; i--) {
                            stacks.push({
                                level: 0,
                                content: params.data[i]
                            });
                            n++;
                        }
                        t.data = [];
                        while (n > 0) {
                            n--;
                            x = stacks[n];
                            buffer.push({
                                level: x.level,
                                content: x.content.cells
                            });
                            if (x.content.children !== undefined) {
                                for (i = x.content.children.length-1; i >= 0; i--) {
                                    k = {
                                        level: x.level + 1,
                                        content: x.content.children[i]
                                    }
                                    if (n == stacks.length) {
                                        stacks.push(k);
                                        n++;
                                    }
                                    else {
                                        stacks[n++] = k;
                                    }
                                }
                            }
                        }
                        for (i = 0;  i < buffer.length; i++) {
                            sx = "<table border=\"0\" style=\"border: 0px; cellspacing: 0px; cellpadding: 0px; padding: 0px;\">";
                            sx += "<tr style=\"border: 0px;\"><td style=\"border: 0px; width: " + (buffer[i].level+1)*16 + "px; text-align: right; padding: 0px;\" valign=\"middle\">";
                            if (i < buffer.length -1) {
                                if (buffer[i].level < buffer[i+1].level) {
                                    sx += "<a style=\"cursor: pointer;\" onclick=\"DOMClass.treetable.toggle('" + id + "', " + i + "); event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\">";
                                    sx += "<img id=\"" + id + "_imgline_" + i + "\" src=\"" + img1 + "\" width=\"16\" height=\"16\"/></a>";
                                }
                            }
                            sx += "</td>";
                            sx += "<td";
                            if (buffer[i].content[0].elementid !== undefined) st += " id=\"" + buffer[i].content[0].elementid + "\"";
                            if (buffer[i].content[0].style !== undefined) {
                                sx += " style=\"cursor: pointer; border: 0px; padding: 0px 0px 0px 6px; " + buffer[i].content[0].style + "\"";
                            }
                            else {
                                sx += " style=\"cursor: pointer; border: 0px; padding: 0px 0px 0px 6px;\"";
                            }
                            if (buffer[i].content[0].class !== undefined) sx += " class=\"" + buffer[i].content[0].class + "\"";
                            if (i < buffer.length -1) {
                                if (buffer[i].level < buffer[i+1].level) {
                                    sx += " style=\"cursor: pointer;\" onclick=\"DOMClass.treetable.toggle('" + id + "', " + i + "); event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\"";
                                }
                            }
                            sx += ">";
                            if (buffer[i].content[0].innerHTML !== undefined) {
                                sx += buffer[i].content[0].innerHTML;
                            }
                            else if (buffer[i].content[0].text !== undefined) {
                                sx += EncodingClass.inputvalue(buffer[i].content[0].text);
                            }
                            else {
                                sx += "&nbsp;";
                            }
                            sx += "</td></tr></table>";
                            k = [{
                                innerHTML: sx
                            }];
                            if (buffer[i].content[0].colspan !== undefined) k[0].colspan = buffer[i].content[0].colspan;
                            if (buffer[i].content[0].rowspan !== undefined) k[0].rowspan = buffer[i].content[0].rowspan;
                            for (j = 1; j < buffer[i].content.length; j++) {
                                k.push(buffer[i].content[j]);
                            }
                            z.push({
                                cells: k
                            });
                        }
                        t.data = z;
                        st = "<div id=\"" + id + "\"";
                        if (params.class !== undefined) {
                            if (params.class.trim() != "") st += " class=\"" + params.class.trim() + "\"";
                        }
                        if (params.isScrolled !== undefined) {
                            if (params.isScrolled == true) {
                                st += ">" + DOMClass.scrolltable.generate(t);
                            }
                            else {
                                st += ">" + DOMClass.table.generate(t);
                            }
                        }
                        else {
                            st += ">" + DOMClass.table.generate(t);
                        }
                        tf = function(id, buffer, innerId, img1, img2, bc1, bc2, bc3) {
                                return function () {
                                    var x = document.getElementById(id), t = [];
                                    var i, k, z, ss = [];
                                    for (i = 0; i < buffer.length; i++) {
                                        k = 0;
                                        ss.push(true);
                                        if (i < buffer.length -1) {
                                            if (buffer[i].level < buffer[i+1].level) k = 1;
                                        }
                                        if (k == 1) {
                                            z = {
                                                expanded: true,
                                                isparent: true,
                                                level: buffer[i].level,
                                                parentindex: -1
                                            }
                                        }
                                        else {
                                            z = {
                                                expanded: false,
                                                isparent: false,
                                                level: buffer[i].level,
                                                parentindex: -1
                                            }
                                        }
                                        if ((t.length > 0) && (z.level > 0)) {
                                            for (k = t.length - 1; k >= 0; k--) {
                                                if (t[k].level == z.level-1) {
                                                    z.parentindex = k;
                                                    break;
                                                }
                                            }
                                        }
                                        t.push(z);
                                    }
                                    if (x != null) {
                                        x.treetablestatus = {
                                            image1: img1,
                                            image2: img2,
                                            innerId: innerId,
                                            backgroundcolor: bc1,
                                            backgroundcolor2: bc2,
                                            backgroundcolor3: bc3,
                                            content: t,
                                            searchfilter: ss
                                        };
                                    }
                                };
                            } (id, buffer, innerId, img1, img2, bc1, bc2, bc3);
                        st += DOMClass.onloadFuncString(tf);
                        st += "</div>";
                        return st;
                    },

                    searchFunction: function(query, elementid) {
                        var e = document.getElementById(elementid);
                        var i, j, k, n, m, s, x, t;
                        if (e == null) return;
                        x = e.parentElement;
                        if (x == null) return;
                        while (e.childNodes[0].tagName.toUpperCase() != "TR") {
                            e = e.childNodes[0];
                            if (e === undefined) return;
                        }
                        n = e.childNodes.length;
                        if (query.trim() == "") {
                            for (i = 0; i < n; i++) {
                                x.treetablestatus.searchfilter[i] = true;
                            }
                        }
                        else {
                            query = query.toLowerCase();
                            for (i = 0; i < n; i++) {
                                m = e.childNodes[i].childNodes.length;
                                t = false;
                                for (j = 0; j < m; j++) {
                                    s = EncodingClass.string.innerHTML2Text(e.childNodes[i].childNodes[j].innerHTML).toLowerCase();
                                    if (s != "") {
                                        if (s.indexOf(query) >= 0) {
                                            t = true;
                                            break;
                                        }
                                    }
                                }
                                x.treetablestatus.searchfilter[i] = t;
                                k = i;
                                if (t) {
                                    while (x.treetablestatus.content[k].parentindex >= 0) {
                                        k = x.treetablestatus.content[k].parentindex;
                                        if (x.treetablestatus.searchfilter[k]) break;
                                        x.treetablestatus.searchfilter[k] = true;
                                    }
                                }
                            }
                        }
                        DOMClass.treetable.refreshView(x);
                    },

                    attachSearchTextbox: function (searchid, hostid) {
                        var x, y;
                        x = document.getElementById(searchid);
                        y = document.getElementById(hostid);
                        if ((x == null) || (y == null)) {
                            setTimeout("attachSearchTextbox('" + searchid + "', '" + hostid + "');", 10);
                            return;
                        }
                        var f = function (x, hostid) {
                            return function () {
                                DOMClass.treetable.searchFunction(x.value, hostid)
                            }
                        } (x, hostid);
                        x.onpaste = f;
                        x.onchange = f;
                        x.onkeyup = f;
                    },

                    refreshView: function (x) {
                        var levellock = [0];
                        var i, k, m = 0;
                        var imgsrc;
                        for (i = 0; i < x.treetablestatus.content.length; i++) {
                            imgsrc = document.getElementById(x.treetablestatus.innerId + "__row_" + i);
                            k = x.treetablestatus.content[i].level + 1;
                            while (levellock.length < k) levellock.push(0);
                            if (x.treetablestatus.content[i].expanded) {
                                levellock[k] = levellock[k-1];
                            }
                            else {
                                levellock[k] = 1;
                            }
                            if ((levellock[k-1] == 1) || (!x.treetablestatus.searchfilter[i])) {
                                imgsrc.style.display = "none";
                            }
                            else {
                                imgsrc.style.display = "table-row";
                                if ((m & 1) == 0) {
                                    imgsrc.style.backgroundColor = x.treetablestatus.backgroundcolor;
                                    imgsrc.onmouseout = function (s, color) {
                                        return function () {s.style.backgroundColor = color;};
                                    } (imgsrc, x.treetablestatus.backgroundcolor) ;
                                }
                                else {
                                    imgsrc.style.backgroundColor = x.treetablestatus.backgroundcolor2;
                                    imgsrc.onmouseout = function (s, color) {
                                        return function () {s.style.backgroundColor = color;};
                                    } (imgsrc, x.treetablestatus.backgroundcolor2) ;
                                }
                                m++;
                            }
                        }
                    },

                    toggle : function (id, line) {
                        var x = document.getElementById(id);
                        var imgid = id + "_imgline_" + line;
                        var imgsrc = document.getElementById(imgid);
                        if (x == null) return;
                        if (imgsrc == null) return;
                        if (x.treetablestatus === undefined) return;
                        if (x.treetablestatus.content[line].isparent == false) return;
                        if (x.treetablestatus.content[line].expanded == true) {
                            x.treetablestatus.content[line].expanded = false;
                            imgsrc.src = x.treetablestatus.image2;
                        }
                        else {
                            x.treetablestatus.content[line].expanded = true;
                            imgsrc.src = x.treetablestatus.image1;
                        }
                        DOMClass.treetable.refreshView(x);
                    }
                },

                scrolltable : {
                    generate : function (params) {
                        var id, elementid, img1, img2, bc1, bc2, bc3;
                        var buffer = [];
                        var i, j, k, z, w, st, sx, xstyle, headerid, prefixid;
                        if (params.elementid !== undefined) {
                            elementid = params.elementid;
                        }
                        else {
                            elementid = DOMClass.getid();
                        }
                        if (params.prefixid !== undefined) {
                            prefixid = params.prefixid + "_";
                        }
                        else {
                            prefixid = elementid + "_";
                        }
                        bc1 = "";
                        bc3 = "";
                        if (params.backgroundcolor !== undefined) {
                            bc1 = params.backgroundcolor;
                            if (params.backgroundcolor2 !== undefined) {
                                bc2 = params.backgroundcolor2;
                            }
                            else {
                                bc2 = bc1;
                            }
                        }
                        if (params.backgroundcolor3 !== undefined) bc3 = params.backgroundcolor3;
                        if (params.header === undefined) {
                            return DOMClass.table.generate(params);
                        }
                        if (!EncodingClass.type.isArray(params.header)) {
                            console.log("[scrolltable] Invalid header value!");
                            return "";
                        }
                        st = "<table";
                        if (params.width !== undefined) st += " width=\"" + params.width + "\"";
                        st += "><tr style=\"position: absolute; z-index: 2; white-space: nowrap;\" id=\"" + prefixid + "_header_row\">";
                        sx = "";
                        for (i = w = 0; i < params.header.length; i++) {
                            if (params.header[i].width === undefined) {
                                console.log("[scrolltable] Header " + i + "'s width is missing!");
                                return DOMClass.table.generate(params);
                            }
                            w += params.header[i].width;
                            if (params.header[i].style !== undefined) {
                                sx += "<th style=\"width: " + params.header[i].width + "px; " + params.header[i].style + "\"";
                                st += "<th style=\"width: " + params.header[i].width + "px; " + params.header[i].style + "\"";
                            }
                            else {
                                sx += "<th style=\"width: " + params.header[i].width + "px;\"";
                                st += "<th style=\"width: " + params.header[i].width + "px;\"";
                            }
                            if (params.header[i].elementid !== undefined) {
                                headerid = params.header[i].elementid;
                            }
                            else {
                                headerid = prefixid + "_header_cel_" + i;
                            }
                            st += " id=\"" + headerid + "\"";
                            if (params.header[i].colspan !== undefined) {
                                sx += " colspan=\"" + params.header[i].colspan + "\"";
                                st += " colspan=\"" + params.header[i].colspan + "\"";
                            }
                            if (params.header[i].align !== undefined) {
                                sx += " align=\"" + params.header[i].align + "\"";
                                st += " align=\"" + params.header[i].align + "\"";
                            }
                            if (params.header[i].valign !== undefined) {
                                sx += " valign=\"" + params.header[i].valign + "\"";
                                st += " valign=\"" + params.header[i].valign + "\"";
                            }
                            if (params.header[i].attribute !== undefined) {
                                sx += " " + params.header[i].attribute;
                                st += " " + params.header[i].attribute;
                            }
                            sx += ">";
                            st += ">";
                            if (params.header[i].innerHTML !== undefined) {
                                sx += params.header[i].innerHTML;
                                st += params.header[i].innerHTML;
                            }
                            else if (params.header[i].text !== undefined) {
                                sx += EncodingClass.inputvalue(params.header[i].text);
                                st += EncodingClass.inputvalue(params.header[i].text);
                            }
                            st += "</th>";
                            sx += DOMClass.onloadString("DOMClass.scrolltable.bgheader('" + headerid + "');") + "</th>";
                        }
                        st += "</tr><tr style=\"z-index: 1; white-space: nowrap;\">" + sx + "</tr>";
                        if (params.data !== undefined) {
                            for (i = 0; i < params.data.length; i++) {
                                if (params.data[i].cells !== undefined) {
                                    st += "<tr";
                                    if (params.data[i].elementid !== undefined) {
                                        st += " id=\"" + params.data[i].elementid + "\">";
                                    }
                                    else {
                                        st += " id=\"" + prefixid + "_row_" + i + "\"";
                                    }
                                    if (params.data[i].style !== undefined) st += " style=\"" + params.data[i].style + "\">";
                                    if (params.data[i].class !== undefined) st += " class=\"" + params.data[i].class + "\">";
                                    if (params.data[i].onclickCmd !== undefined) st += " onclick=\"" + params.data[i].onclickCmd + "; event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\">";
                                    if (params.data[i].onmouseover !== undefined) st += " onmouseover=\"" + params.data[i].onmouseover + "\">";
                                    if (params.data[i].onmouseout !== undefined) st += " onmouseout=\"" + params.data[i].onmouseout + "\">";
                                    if (bc1 != "") {
                                        if ((i & 1) == 0) {
                                            st += " bgcolor=\"" + bc1 + "\"";
                                            if (bc3 != "") st += " onmouseover=\"this.style.backgroundColor='" + bc3 + "';\" onmouseout=\"this.style.backgroundColor='" + bc1 + "';\"";
                                        }
                                        else {
                                            st += " bgcolor=\"" + bc2 + "\"";
                                            if (bc3 != "") st += " onmouseover=\"this.style.backgroundColor='" + bc3 + "';\" onmouseout=\"this.style.backgroundColor='" + bc2 + "'\"";
                                        }
                                    }
                                    if (params.data[i].attribute !== undefined) st += " " + params.data[i].attribute;
                                    st += ">";
                                    for (j = 0; j < params.data[i].cells.length; j++) {
                                        st += "<td"
                                        if (params.data[i].cells[j].elementid !== undefined) {
                                            st += " id=\"" + params.data[i].cells[j].elementid + "\"";
                                        }
                                        else {
                                            st += " id=\"" + prefixid + "_cell_" + i + "_" + j + "\"";
                                        }
                                        if (params.data[i].cells[j].class !== undefined) st += " class=\"" + params.data[i].cells[j].class + "\"";
                                        if (params.data[i].cells[j].style !== undefined) st += " style=\"" + params.data[i].cells[j].style + "\"";
                                        if (params.data[i].cells[j].colspan !== undefined) st += " colspan=\"" + params.data[i].cells[j].colspan + "\"";
                                        if (params.data[i].cells[j].rowspan !== undefined) st += " rowspan=\"" + params.data[i].cells[j].rowspan + "\"";
                                        if (params.data[i].cells[j].align !== undefined) st += " align=\"" + params.data[i].cells[j].align + "\"";
                                        if (params.data[i].cells[j].valign !== undefined) st += " valign=\"" + params.data[i].cells[j].valign + "\"";
                                        if (params.data[i].cells[j].nowrap !== undefined) {
                                            if (params.data[i].cells[j].nowrap) st += " nowrap style=\"white-space: nowrap;\"";
                                        }
                                        if (params.data[i].cells[j].onclickCmd !== undefined) st += " onclick=\"" + params.data[i].cells[j].onclickCmd + "; event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;\">";
                                        if (params.data[i].cells[j].onmouseover !== undefined) st += " onmouseover=\"" + params.data[i].cells[j].onmouseover + "\">";
                                        if (params.data[i].cells[j].onmouseout !== undefined) st += " onmouseout=\"" + params.data[i].cells[j].onmouseout + "\">";
                                        if (params.data[i].cells[j].attribute !== undefined) st += " " + params.data[i].cells[j].attribute;
                                        st += ">";
                                        if (params.data[i].cells[j].innerHTML !== undefined) {
                                            st += params.data[i].cells[j].innerHTML;
                                        }
                                        else if (params.data[i].cells[j].text !== undefined) {
                                            st += EncodingClass.inputvalue(params.data[i].cells[j].text);
                                        }
                                        st += "</td>";
                                    }
                                    st += "</tr>";
                                }
                                else
                                {
                                    console.log("[scrolltable] Data line " + i + " doesn't have cells info!");
                                }
                            }
                        }
                        st += "</table>";
                        sx = "<div";
                        if (params.class !== undefined) {
                            if (!EncodingClass.type.isString(params.class)) {
                                sx += " class=\"" + params.class + "\"";
                            }
                            else {
                                console.log("[scrolltable] Invalid class field!");
                                return "";
                            }
                        }
                        w += 25;
                        sx += " style=\"width: " + w + "px; height: " + params.height + "px; overflow-x: visible; overflow-y: scroll;\"";

                        sx += ">" + st + "</div>";
                        return sx;
                    },

                    bgheader : function (eid) {
                        var x = document.getElementById(eid), t;
                        if (x != null) {
                            t = EncodingClass.color.nameToHex(x.style.backgroundColor);
                            t = EncodingClass.color.hex2rgb(t);
                            x.style.backgroundColor = "rgba(" + t.r + ", " + t.g + ", " + t.b + ", 1)";
                        }
                    }
                },

                radio : {
                    getvalue : function (name) {
                        var i, e = document.getElementsByName(name);
                        for (i = 0; i < e.length; i++) {
                            if (e[i].checked) return e[i].value;
                        }
                        return null;
                    },
                    generate : function (params) {
                        var id, st, textcolor;
                        st = "<input type=\"radio\"";
                        if (params.elementid !== undefined) id = params.elementid; else id = DOMClass.getid();
                        if (params.name !== undefined) st += " name=\"" + params.name + "\"";
                        st += " id=\"" + id + "\"";
                        if (params.value !== undefined) st += " value=\"" + params.value + "\"";
                        if (params.checked !== undefined) if (params.checked == true) st += " checked";
                        if (params.onchangeCmd !== undefined) st += " onchange=\"" + params.onchangeCmd + "\"";
                        st += ">";
                        if (params.text !== undefined) {
                            if (params.textcolor !== undefined) textcolor = params.textcolor; else textcolor = "black";
                            return DOMClass.table.generate({
                                style: "border: 0px; padding: 0px; background-color: rgba(255,255,255,0)",
                                data: [
                                    {
                                        style: "border: 0px; padding: 0px; background-color: rgba(255,255,255,0)",
                                        cells:[
                                        {
                                            style: "border: 0px; padding: 0px; background-color: rgba(255,255,255,0); width: 25px;",
                                            innerHTML: st
                                        },
                                        {
                                            style: "border: 0px; padding: 0px; background-color: rgba(255,255,255,0); width: 25px; white-space: nowrap;",
                                            nowrap: true,
                                            innerHTML: DOMClass.linkString({
                                                textcolor: "black",
                                                content: params.text,
                                                onclickCmd: "document.getElementById('" + id + "').click();"
                                            })
                                        }
                                        ]
                                }]});
                        }
                        return st;
                    }
                },

                progressbar : function(params) {
                    var st, twidth, tcells = [], h2, hx2;
                    if (params.width !== undefined) {
                        params.width = parseInt(params.width + "", 10);
                    }
                    else {
                        params.width = 150;
                    }
                    if (params.width < 64) params.width = 64;
                    if (params.height !== undefined) {
                        params.height = parseInt(params.height + "", 10);
                    }
                    else {
                        params.height = 8;
                    }
                    if (params.height < 8) params.height = 8;
                    h2 = ~~(params.height / 2);
                    if (params.color === undefined) params.color = "green";
                    if (params.color2 === undefined) params.color2 = "#afafaf";
                    if (params.bordercolor === undefined) params.bordercolor = params.color2;
                    params.progress = parseFloat(params.progress + "");
                    if (params.progress < 0) params.progress = 0;
                    if (params.progress > 1) params.progress = 1;
                    twidth = (params.progress * (params.width - params.height - 4));
                    twidth = 2 + ~~twidth;
                    tcells.push({
                        style: "border: 0px; padding: 0px; cell-spacing: 0px; width: " + h2 + "px; height: " + params.height + "px; font: 4px arial, sans-serif;"
                            + " border-radius: " + h2 + "px 0px 0px " + h2 + "px;"
                            /*
                            + " border-left: 1px solid " + params.bordercolor + ";"
                            + " border-top: 1px solid " + params.bordercolor + ";"
                            + " border-bottom: 1px solid " + params.bordercolor + ";"
                            + " border-right: 0px;"
                            */
                            + " background-color: " + params.color + ";"
                    });
                    tcells.push({
                        style: "padding: 0px; cell-spacing: 0px; width: " + twidth + "px; height: " + params.height + "px; font: 4px arial, sans-serif;"
                            + " border-top: 1px solid " + params.bordercolor + ";"
                            + " border-bottom: 1px solid " + params.bordercolor + ";"
                            + " border-right: 0px;"
                            + " background-color: " + params.color + ";"
                    });
                    if (params.progress < 1) {
                        tcells.push({
                            style: "padding: 0px; cell-spacing: 0px; width: " + (params.width - twidth - params.height) + "px; height: " + params.height + "px; font: 4px arial, sans-serif;"
                            + " border-top: 1px solid " + params.bordercolor + ";"
                            + " border-bottom: 1px solid " + params.bordercolor + ";"
                            + " border-right: 0px;"
                            + " background-color: " + params.color2 + ";"
                        });
                        tcells.push({
                            style: "border: 0px; padding: 0px; cell-spacing: 0px; width: " + h2 + "px; height: " + params.height + "px; font: 4px arial, sans-serif;"
                            + " border-radius: 0px " + h2 + "px " + h2 + "px 0px;"
                            /*
                            + " border-left: 0px;"
                            + " border-top: 1px solid " + params.bordercolor + ";"
                            + " border-bottom: 1px solid " + params.bordercolor + ";"
                            + " border-right: 1px solid " + params.bordercolor + ";"
                            */
                            + " background-color: " + params.color2 + ";"
                        });
                    }
                    else {
                        tcells.push({
                            style: "padding: 0px; cell-spacing: 0px; width: " + (params.width - twidth - params.height) + "px; height: " + params.height + "px; font: 4px arial, sans-serif;"
                            + " border-top: 1px solid " + params.bordercolor + ";"
                            + " border-bottom: 1px solid " + params.bordercolor + ";"
                            + " border-right: 0px;"
                            + " background-color: " + params.color + ";"
                        });
                        tcells.push({
                            style: "border: 0px; padding: 0px; cell-spacing: 0px; width: " + h2 + "px; height: " + params.height + "px; font: 4px arial, sans-serif;"
                            + " border-radius: 0px " + h2 + "px " + h2 + "px 0px;"
                            /*
                            + " border-left: 0px;"
                            + " border-top: 1px solid " + params.bordercolor + ";"
                            + " border-bottom: 1px solid " + params.bordercolor + ";"
                            + " border-right: 1px solid " + params.bordercolor + ";"
                            */
                            + " background-color: " + params.color + ";"
                        });
                    }
                    return DOMClass.table.generate({
                        style: "border: 0px; padding: 0px; cell-spacing: 0px; background-color: rgba(255, 255, 255, 0); font: 4px arial, sans-serif;",
                        data: [{
                            style: "border: 0px; padding: 0px; cell-spacing: 0px; background-color: rgba(255, 255, 255, 0);",
                            cells: tcells
                        }
                    ]
                    })
                },

                comboboxString : function (params) {
                    var st = "<select";
                    var i, id;
                    if (params.elementid !== undefined) {
                        if (params.elementid != "") st += " id=\"" + params.elementid + "\"";
                    }
                    if (params.onchangeCmd !== undefined) {
                        if (params.onchangeCmd != "") {
                            st += " onchange=\"" + params.onchangeCmd + "\"";
                        }
                    }
                    if (params.width !== undefined) {
                        st += " style=\"width: " + params.width + "px;\"";
                    }
                    st += ">";
                    if (params.list !== undefined) {
                        for (i = 0; i < params.list.length; i++) {
                            st += "<option value=\"" + params.list[i].value + "\"";
                            if (params.selectedvalue !== undefined) {
                                if ((params.selectedvalue + "") == (params.list[i].value + "")) st += " selected";
                            }
                            st += ">";
                            if (params.list[i].text !== undefined) {
                                st += EncodingClass.inputvalue(params.list[i].text);
                            }
                            else {
                                st += EncodingClass.inputvalue(params.list[i].value + "");
                            }
                            st += "</option>";
                        }
                    }
                    st += "</select>";
                    return st;
                },
                comboboxSetValue : function (element, value) {
                    var i, st;
                    value = value + "";
                    for (i = 0; i < element.options.length; i++) {
                        st = element.options[i].value + "";
                        if (st == value) {
                            element.selectedIndex = i;
                            element.value = element.options[i].value;
                            return;
                        }
                    }
                    element.selectedIndex = -1;
                },
                loadImage : function (imagepath) {
                    var x = document.getElementById("DOMClass_invisible_div");
                    var z;
                    if (x == null) {
                        setTimeout(function() {DOMClass.loadImage(imagepath);}, 10);
                        return;
                    }
                    else {
                        z = document.createElement("img");
                        z.src = imagepath;
                        x.appendChild(z);
                    }
                },

                addClass : function (element, classname) {
                    if (!element.className)
                        element.className = classname;
                    else {
                        var t = element.className.trim();
                        if (t == "") {
                            t = classname;
                        }
                        else {
                            var cls = t.split(/\s/);
                            var flg = false;
                            for (var i = 0; i < cls.length; ++i)
                                if (cls[i] == classname) {
                                    flg = true;
                                }
                            if (!flg) t += " " + classname;

                        }
                        element.className = t;
                    }
                },

                removeClass : function (element, classname) {
                    if (!element.className) return;
                    var res = "";
                    var cls = element.className.trim().split(/\s/);
                    for (var i = 0; i < cls.length; ++i)
                        if (cls[i] != classname) res += cls[i] + " ";
                    res = res.trim();
                    if (res == "") element.removeAttribute('class');
                    else
                        element.className = res;
                },

                containClass : function (element, classname) {
                    if (!element.className) return false;
                    var cls = element.className.split(/\s/);
                    for (var i = 0; i < cls.length; ++i)
                        if (cls[i] == classname) return true;
                    return false;
                },

                loadImages : function (imagepaths) {
                    var x = document.getElementById("DOMClass_invisible_div");
                    var i, z;
                    if (x == null) {
                        setTimeout(function() {DOMClass.loadImages(imagepaths);}, 10);
                        return;
                    }
                    else {
                        for (i = 0; i < imagepaths.length; i++) {
                            z = document.createElement("img");
                            z.src = imagepaths[i];
                            x.appendChild(z);
                        }
                    }
                },

                getContentSize : function (htmlContent) {
                    if (DOMElement.hiddendiv === undefined) return {width: 0, height: 0};
                    if (DOMElement.hiddendiv_checkcontentlength === undefined) {
                        DOMElement.hiddendiv_checkcontentlength = DOMElement.div({});
                        DOMElement.hiddendiv.appendChild(DOMElement.hiddendiv_checkcontentlength);
                    }
                    DOMElement.hiddendiv_checkcontentlength.innerHTML = htmlContent;
                    return {
                        width: DOMElement.hiddendiv_checkcontentlength.clientWidth,
                        height: DOMElement.hiddendiv_checkcontentlength.clientHeight
                    }
                },

                getTextSize : function (text) {
                    return DOMClass.getContentSize("<text>" + EncodingClass.inputvalue(text) + "</text>");
                },

                linkString : function (params) {
                    var st = "<a";
                    if (params.link !== undefined) {
                        st += " href=\"" + params.link + "\"";
                    }
                    st += " style=\"text-decoration: none; cursor: pointer;";
                    if (params.textcolor !== undefined) st += " color: " + params.textcolor + ";";
                    st += "\"";
                    if (params.onclickCmd !== undefined) {
                        if (params.onclickCmd != "") {
                            st += " onclick=\"" + params.onclickCmd;
                            if (params.link === undefined) st += "; event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;";
                            st += "\"";
                        }
                    }
                    st += ">";
                    if (params.content !== undefined) st += params.content;
                    st += "</a>";
                    return st;
                },

                imageString : function (params) {
                    var st = " src=\"" + params.image + "\"";
                    if (params.elementid !== undefined) st += " id=\"" + params.elementid + "\"";
                    if (params.width !== undefined) st += " width=\"" + params.width + "\"";
                    if (params.height !== undefined) st += " height=\"" + params.height + "\"";
                    if (params.class !== undefined) st += " class=\"" + params.class + "\"";
                    if (params.style !== undefined) st += " style=\"" + params.style + "\"";
                    if (params.image2 !== undefined) st += "onmouseover=\"this.src='" + params.image2 + "';\" onmouseout=\"this.src='" + params.image + "';\"";
                    return "<img" + st + "/>";
                },

                imagelinkString : function (params) {
                    var t = {image: params.image};
                    var st;
                    if (params.elementid !== undefined) t.elementid = params.elementid;
                    if (params.width !== undefined) t.width = params.width;
                    if (params.height !== undefined) t.height = params.height;
                    if (params.image2 !== undefined) t.image2 = params.image2;
                    if (params.class !== undefined) t.class = params.class;
                    st = "<a style=\"cursor: pointer;";
                    if (params.style !== undefined) st += params.style;
                    st += "\"";
                    if (params.link !== undefined) st += " href=\"" + params.link + "\"";
                    if (params.onclickCmd !== undefined) {
                        if (params.onclickCmd != "") {
                            st += " onclick=\"" + params.onclickCmd;
                            if (params.link === undefined) st += "; event.preventDefault ? event.preventDefault() : event.returnValue = false; return false;";
                            st += "\"";
                        }
                    }
                    st += ">" + DOMClass.imageString(t) + "</a>";
                    return st;
                },

                onloadString : function (cmd) {
                    return "<img src onerror=\"" + cmd + "\" style=\"display: none;\"/>";
                },

                onloadFuncString : function (func) {
                    var k;
                    k = StorageClass.setTempVarValue(func);
                    return "<img src onerror=\"StorageClass.getTempVarValue(" + k + ")();\" style=\"display: none;\"/>";
                }
            };

            window.addEventListener("click", DOMClass.dropdownbox.onclickeventFunction);
        </script>
        <?php
    }
}
?>
