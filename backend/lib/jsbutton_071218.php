
<?php
    function write_button_071218_style_black() {
?>

    <script type="text/javascript">
    "use strict";
    pizo.button071218 = {};
    pizo.button071218.showButton = function(params){
        var sym, con, tcolor, bcolor, xheight, xwidth, xborder, xradius,icolor,hcolor;
        sym = DOMElement.div({});
        con = "";
        tcolor = "#000000";
        bcolor: "#ffffff";
        xborder = "1px solid #c0c0c0";
        xheight = "30px";
        xradius = "3px";
        if (params.sym !== undefined) sym = params.sym;
        if (params.text !== undefined) con = params.text;
        if (params.textcolor !== undefined) tcolor = params.textcolor;
        if (params.typebutton !== undefined) {
            if (params.typebutton == 1){
                bcolor = "#c9f1fd";
                icolor = "#91e4fb";
                hcolor = "#91e4fb";
            }
            else {
                bcolor = "#ebebeb";
                icolor = "#d6d6d6";
                hcolor = "#d6d6d6";
            }
        }
        if (params.height !== undefined) xheight = params.height;
        if (params.width !== undefined) xwidth = params.width;
        if (params.border !== undefined) xborder = params.border;
        if (params.borderRadius !== undefined) xradius = params.borderRadius;
        sym.style.fontSize = "16px";
        sym.style.color = "#929292";
        var iconx = DOMElement.td({
            align: "center",
            attrs: {
                style: {
                    width: "30px",
                    height: "28px",
                    textAlign: "center",
                    borderRight: xborder,
                    backgroundColor: icolor,
                    paddingTop: "3px"
                }
            },
            children: [sym]
        });
        var textx = DOMElement.td({
            attrs: {
                align: "center",
                style: {
                    backgroundColor: bcolor,
                    paddingRight: "10px",
                    height: "28px",
                    paddingLeft: "5px",
                    whiteSpace: "nowrap"
                }
            },
            text: con
        });
        iconx.onmouseover = textx.onmouseover = function (iconx, textx) {
            return function(event, me) {
                textx.style.backgroundColor = hcolor;
            }
        } (iconx, textx);
        iconx.onmouseout = textx.onmouseout = function (iconx, textx) {
            return function(event, me) {
                textx.style.backgroundColor = bcolor;
            }
        } (iconx, textx);
        var st = DOMElement.div({
            attrs: {
                style: {
                    minWidth: "110px",
                    width: xwidth,
                    height: xheight,
                    border: xborder,
                    borderBottom: xborder,
                    color: tcolor,
                    borderRadius: xradius,
                    display: "inline-block", //thanhyen
                    cursor: "pointer"
                },
                onclick: (params.onclick !== undefined)? params.onclick : function(){}
            },
            children: [
                DOMElement.table({
                    attrs: {style: {width: "100%",height: "28px"}},
                    data: [[
                        iconx,
                        textx
                    ]]
                })
            ]
        })
        return st;
    };

    pizo.button071218.showCheckbox = function(params){
        var x, z, rv,textpos = "right",xcursor = "pointer", xpad = 0;
        if (params.attrs !== undefined){
            if (params.attrs.textpos !== undefined) textpos = params.attrs.textpos;
            if (params.attrs.cursor !== undefined) xcursor = params.attrs.cursor;
        }
        z = DOMElement.duplicateObj(params, ["text", "textcolor", "checked", "id"]);
        if (z.attrs === undefined) z.attrs = {};
        var idcheckbox = contentModule.generateRandom();
        z.attrs.type = "checkbox";
        z.attrs.id = idcheckbox;
        if (params.id !== undefined) z.attrs.id = params.id;
        if (params.checked !== undefined) z.attrs.checked = params.checked;
        if (z.attrs.style === undefined) z.attrs.style = {};
        if (z.attrs.style.cursor === undefined) z.attrs.style.cursor = xcursor;
        z.fontSize = "20px";
        x = DOMElement.input(z);
        if (params.text === undefined) {
            params.text = "&emsp;";
            xpad = 1;
        }
        if (params.textcolor === undefined) {
            z = DOMElement.label({
                attrs: {
                    className: DOMElement.treetableclass.noselect,
                    for: idcheckbox,
                    style: {
                        color: "#000000",
                        cursor: xcursor
                    },
                    onclick: function (me) {
                        return function (event) {
                            me.click();
                            DOMElement.cancelEvent(event);
                            return false;
                        }
                    } (x)
                },
                innerHTML: params.text
            });
        }
        else {
            z = DOMElement.label({
                attrs: {
                    className: DOMElement.treetableclass.noselect,
                    for: idcheckbox,
                    style: {
                        color: params.textcolor,
                        whiteSpace: "nowrap",
                        cursor: xcursor
                    },
                    onclick: function (me) {
                        return function (event) {
                            me.click();
                            DOMElement.cancelEvent(event);
                            return false;
                        }
                    } (x)
                },
                innerHTML: params.text
            });
        }
        if (xpad == 1) {
            z.style.paddingLeft = "0.65em";
        }
        if (textpos == "left"){
            rv = DOMElement.div({
                attrs: {
                    className: "bsc2kpi-checkbox right"
                },
                children: [
                    x,z
                ]
            });
        }
        else {
            rv = DOMElement.div({
                attrs: {
                    className: "bsc2kpi-checkbox left"
                },
                children: [
                    x,z
                ]
            });
        }
        rv.localData.content = x;
        Object.defineProperty(rv, "checked", {
            set: function (me) {
                return function (value) {
                    me.checked = value;
                }
            } (x),
            get: function (me) {
                return function () {
                    return me.checked;
                }
            } (x)
        });

        Object.defineProperty(rv, "disabled", {
            set: function (me) {
                return function (value) {
                    me.disabled = value;
                }
            } (x),
            get: function (me) {
                return function () {
                    return me.disabled;
                }
            } (x)
        });
        return rv;
    }

    pizo.button071218.showRadio = function (params) {
        var  textpos = "right", xcursor = "pointer"

        var aObject = { tag: 'radio', class: [], attr: {}, props: {}, style: {}, on:{}};
        if (params.textcolor) aObject.style.color = params.textcolor;


        if (params.attrs !== undefined) {
            if (params.attrs.textpos !== undefined) textpos = params.attrs.textpos;
            if (params.attrs.cursor !== undefined) xcursor = params.attrs.cursor;
        }
        if (params.textpos )  textpos = params.textpos;
        if (textpos != 'right') aObject.class.push('right');


        var idradio = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 20; i++) {
            idradio += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        aObject.attr.id = idradio;

        if (params.id !== undefined) aObject.attr.id = params.id;
        if (params.checked !== undefined) aObject.props.checked = params.checked;

        if (params.disabled !== undefined) aObject.props.disabled = params.disabled;
        if (params.style !== undefined) Object.assign(aObject.style, params.style);
        aObject.style.cursor = xcursor;


        var mergeParam = Object.assign(Object.assign({}, params), Object.assign({},params.attrs||{} ));

        var on = Object.keys(mergeParam).filter(function (key) {
            return (/^on.+/.test(key)) && (typeof mergeParam[key] == 'function');
        }).reduce(function (ac, key) {
            var eventName = key.replace(/^on/, '');
            ac[eventName] = mergeParam[key];
            return ac;
        }, {});

        var props  = Object.keys(mergeParam).filter(function (key) {
            return !(/(^on.+)|style|cursor|id|attrs/).test(key);
        }).reduce(function (ac, key) {
            ac[key] = mergeParam[key];
            return ac;
        }, {});

        Object.assign(aObject.on, on);
        Object.assign(aObject.props, props);

        return absol.buildDom(aObject);
    }

    pizo.button071218.getRadioValue = function (name) {
        return absol.ShareCreator.radio.getValueByName(name);
    };



    // pizo.button071218.showRadio = function(params){
    //     var x, z, rv,textpos = "right",xcursor = "pointer", xpad = 0;
    //     if (params.attrs !== undefined){
    //         if (params.attrs.textpos !== undefined) textpos = params.attrs.textpos;
    //         if (params.attrs.cursor !== undefined) xcursor = params.attrs.cursor;
    //     }
    //     z = DOMElement.duplicateObj(params, ["text", "textcolor", "checked", "id"]);
    //     if (z.attrs === undefined) z.attrs = {};
    //     var idradio = contentModule.generateRandom();
    //     z.attrs.type = "radio";
    //     z.attrs.id = idradio;
    //     if (params.id !== undefined) z.attrs.id = params.id;
    //     if (params.checked !== undefined) z.attrs.checked = params.checked;
    //     if (params.disabled !== undefined) z.attrs.disabled = params.disabled;
    //     if (z.attrs.style === undefined) z.attrs.style = {};
    //     if (z.attrs.style.cursor === undefined) z.attrs.style.cursor = xcursor;
    //     z.fontSize = "20px";
    //     x = DOMElement.input(z);
    //     if (params.text === undefined) {
    //         params.text = "&emsp;";
    //         xpad = 1;
    //     }
    //     if (params.textcolor === undefined) {
    //         z = DOMElement.label({
    //             attrs: {
    //                 className: DOMElement.treetableclass.noselect,
    //                 for: idradio,
    //                 style: {
    //                     color: "#000000",
    //                     cursor: xcursor
    //                 },
    //                 onclick: function (me) {
    //                     return function (event) {
    //                         me.click();
    //                         DOMElement.cancelEvent(event);
    //                         return false;
    //                     }
    //                 } (x)
    //             },
    //             innerHTML: params.text
    //         });
    //     }
    //     else {
    //         z = DOMElement.label({
    //             attrs: {
    //                 className: DOMElement.treetableclass.noselect,
    //                 for: idradio,
    //                 style: {
    //                     color: params.textcolor,
    //                     whiteSpace: "nowrap",
    //                     cursor: xcursor
    //                 },
    //                 onclick: function (me) {
    //                     return function (event) {
    //                         me.click();
    //                         DOMElement.cancelEvent(event);
    //                         return false;
    //                     }
    //                 } (x)
    //             },
    //             innerHTML: params.text
    //         });
    //     }
    //     if (xpad == 1) {
    //         z.style.paddingLeft = "9.1px";
    //     }
    //     if (textpos == "left"){
    //         rv = DOMElement.div({
    //             attrs: {
    //                 style: {
    //                     paddingTop: "5px"
    //                 },
    //                 className: "bsc2kpi-radio right" +(absol.browser.isFirefox?' firefox':'')
    //             },
    //             children: [
    //                 x,z
    //             ]
    //         });
    //     }
    //     else {
    //         rv = DOMElement.div({
    //             attrs: {
    //                 style: {
    //                     paddingTop: "5px"
    //                 },
    //                 className: "bsc2kpi-radio left" +(absol.browser.isFirefox?' firefox':'')
    //             },
    //             children: [
    //                 x,z
    //             ]
    //         });
    //     }
    //     rv.localData.content = x;
    //     Object.defineProperty(rv, "checked", {
    //         set: function (me) {
    //             return function (value) {
    //                 me.checked = value;
    //             }
    //         } (x),
    //         get: function (me) {
    //             return function () {
    //                 return me.checked;
    //             }
    //         } (x)
    //     });
    //
    //     Object.defineProperty(rv, "disabled", {
    //         set: function (me) {
    //             return function (value) {
    //                 me.disabled = value;
    //             }
    //         } (x),
    //         get: function (me) {
    //             return function () {
    //                 return me.disabled;
    //             }
    //         } (x)
    //     });
    //     return rv;
    // }

    // pizo.button071218.getRadioValue = function (name) {
    //     var i, e = document.getElementsByName(name);
    //     for (i = 0; i < e.length; i++) {
    //         if (e[i].checked) return e[i].value;
    //     }
    //     return null;
    // };

    </script>
<?php
    }
?>
