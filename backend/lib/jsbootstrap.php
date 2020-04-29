<?php
include_once    "jsdomelement.php";

/*
php:
    BootstrapElementClass::write_script();
javascript:
    BootstrapElement.menu({
        content: "Bootstrap Sample Menu",
        list: [ {title, [onclick], [children]}]
    });
*/

$Bootstrap_script_written = 0;

class BootstrapElementClass {
    public static function write_script() {
        global $Bootstrap_script_written;
        if ($Bootstrap_script_written == 1) return;
        $Bootstrap_script_written = 1;
        DOMElementClass::write_script();
        ?>
        <style>
            .bs-dropdown-submenu {
                position: relative;
            }

            .bs-dropdown-submenu .dropdown-menu {
                top: 0;
                left: 100%;
                margin-top: -1px;
            }
        </style>
        <script type="text/javascript">

            'use strict';

            var BootstrapElement = {

                menuHandler : null,
                menuShownList: [],

                submenu : function (list) {
                    var s = [];
                    var i, c, t, h, v;
                    var title;
                    for (i = 0;  i < list.length; i++) {
                        c = false;
                        if (list[i].children !== undefined) {
                            if (list[i].children.length > 0) c = true;
                        }
                        title = list[i].title;
                        if (c) {
                            h = DOMElement.ul({
                                attrs: {
                                    className: "dropdown-menu",
                                },
                                children: BootstrapElement.submenu(list[i].children)
                            });
                            if (EncodingClass.type.isString(title)) {
                                v = DOMElement.a({
                                    attrs: {
                                        tabIndex: "-1",
                                        href: "#",
                                    },
                                    children: [
                                        DOMElement.textNode(title + "\xa0"),
                                        DOMElement.span({
                                            attrs: {
                                                className: "caret",
                                                style: {
                                                    transform : "rotate(270deg)"
                                                }
                                            }
                                        })
                                    ]
                                });
                            }
                            else if (title.tagName !== undefined) {
                                v = title;
                            }
                            else {
                                v = DOMElement.a({
                                    attrs: {
                                        tabIndex: "-1",
                                        href: "#",
                                    },
                                    children: [
                                        DOMElement.textNode(title.toString() + "\xa0"),
                                        DOMElement.span({
                                            attrs: {
                                                className: "caret",
                                                style: {
                                                    transform : "rotate(270deg)"
                                                }
                                            }
                                        })
                                    ]
                                });
                            }
                            t = DOMElement.li({
                                attrs: {
                                    className: "bs-dropdown-submenu",
                                },
                                children: [v, h]
                            });
                            t.onclick = v.onclick = function (me, host) {
                                return function (event) {
                                    var x, i, k, ok;
                                    for (k = 0; k < BootstrapElement.menuShownList.length; k++) {
                                        x = BootstrapElement.menuShownList[k];
                                        for (i = 0; i < host.length; i++) {
                                            if (x.parentElement === host[i]) {
                                                while (BootstrapElement.menuShownList.length > k) {
                                                    x = BootstrapElement.menuShownList.pop();
                                                    x.style.display = "none";
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    if ((me.style.display == "none") || (me.style.display == "")) {
                                        me.style.display = "inline-block";
                                        BootstrapElement.menuShownList.push(me);
                                    }
                                    else {
                                        me.style.display = "none";
                                    }
                                    event.stopPropagation();
                                    DOMElement.cancelEvent(event);
                                    return false;
                                }
                            } (h, s);
                        }
                        else {
                            if (EncodingClass.type.isString(title)) {
                                h = DOMElement.a({
                                    attrs: {
                                        tabIndex: "-1",
                                        href: "#",
                                    },
                                    text: title
                                });
                                t = DOMElement.li({
                                    children: [h]
                                });
                            }
                            else if (title.tagName !== undefined) {
                                h = undefined;
                                t = title;
                            }
                            else {
                                h = DOMElement.a({
                                    attrs: {
                                        tabIndex: "-1",
                                        href: "#",
                                    },
                                    text: title.toString()
                                });
                                t = DOMElement.li({
                                    children: [h]
                                });
                            }
                            if (list[i].onclick !== undefined) {
                                t.onclick = function (func, me) {
                                    return function (event) {
                                        var x = undefined;
                                        var t = (new Date()).getTime();
                                        if (me.localData.lastClicked + 200 < t) {
                                            if (EncodingClass.type.isFunction(func)) x = func(event, me);
                                            me.localData.lastClicked = (new Date()).getTime();
                                            BootstrapElement.closeMenu();
                                        }
                                        DOMElement.cancelEvent(event);
                                        return false;
                                    }
                                } (list[i].onclick, t);
                                t.localData.lastClicked = 0;
                            }
                            else {
                                t.onclick = function (event) {
                                    DOMElement.cancelEvent(event);
                                    return false;
                                }
                            }
                            if (h !== undefined) h.onclick = t.onclick;
                        }
                        s.push(t)
                    }
                    return s;
                },
                closeMenu : function () {
                    var i, t, h;
                    for (i = 0; i < BootstrapElement.menuShownList.length; i++) {
                        BootstrapElement.menuShownList[i].style.display = "none";
                    }
                    BootstrapElement.menuShownList = [];
                    /*
                    t = document.getElementsByClassName("bs-dropdown-submenu");
                    if (t != null) {
                        for (i = 0; i < t.length; i++) {
                            t[i].style.display = "none";
                        }
                    }
                    t = document.getElementsByClassName("dropdown-menu");
                    if (t != null) {
                        for (i = 0; i < t.length; i++) {
                            h = t[i].parentElement;
                            while (h != null) {
                                if (h.classList.contains("dropdown-menu")) break;
                                h = h.parentElement;
                            }
                            if (h == null) t[i].style.display = "none";
                        }
                    }
                    */
                    BootstrapElement.lastdropdown = null;
                },
                menu : function (params) {
                    var xparams = DOMElement.duplicateObj(params, ["content", "list"]), rv;
                    var subcontent = [];
                    if (params.content === undefined) return null;
                    if (BootstrapElement.menuHandler == null) {
                        BootstrapElement.lastdropdown = null;
                        BootstrapElement.menuHandler = function (event) {
                            var i, t, h, c = false;
                            h = event.target;
                            while (h !== null) {
                                c = false;
                                if (h.classList.contains("dropdown")) return;
                                if (h.classList.contains("dropdown-menu")) return;
                                if (h.classList.contains("bs-dropdown-submenu")) return;
                                for (i = 0; i < BootstrapElement.menuShownList.length; i++) {
                                    if (h === BootstrapElement.menuShownList[i]) {
                                        c = true;
                                        break;
                                    }
                                }
                                if (c) break;
                                h = h.parentElement;
                            }
                            if (!c) {
                                BootstrapElement.closeMenu();
                                return;
                            }
                            /*
                            t = document.getElementsByClassName("bs-dropdown-submenu");
                            if (t != null) {
                                for (i = 0; i < t.length; i++) {
                                    c = t[i];
                                    while (c != null) {
                                        if (c === BootstrapElement.lastdropdown) break;
                                        c = c.parentElement;
                                    }
                                    if (c == null) t[i].style.display = "none";
                                }
                            }
                            t = document.getElementsByClassName("dropdown-menu");
                            if (t != null) {
                                for (i = 0; i < t.length; i++) {
                                    c = t[i];
                                    while (c != null) {
                                        if (c === BootstrapElement.lastdropdown) break;
                                        c = c.parentElement;
                                    }
                                    if (c == null) t[i].style.display = "none";
                                }
                            }
                            BootstrapElement.closeMenu();
                            */
                        };
                        window.addEventListener("click", BootstrapElement.menuHandler);
                    }
                    if (EncodingClass.type.isString(params.content)) {
                        subcontent.push(DOMElement.button({
                            attrs: {
                                className: "btn btn-default dropdown-toggle",
                                type: "button",
                                dataset: {
                                    toggle: "dropdown"
                                }
                            },
                            children: [
                                DOMElement.textNode(params.content + "\xa0"),
                                DOMElement.span({
                                    attrs: {
                                        className: "caret"
                                    }
                                })
                            ]
                        }));
                    }
                    else if (params.content.tagName !== undefined) {
                        subcontent.push(DOMElement.div({
                            attrs: {
                                className: "dropdown-toggle",
                                dataset: {
                                    toggle: "dropdown"
                                }
                            },
                            children: [params.content]
                        }));
                    }
                    else {
                        subcontent.push(DOMElement.button({
                            attrs: {
                                className: "btn btn-default dropdown-toggle",
                                type: "button",
                                dataset: {
                                    toggle: "dropdown"
                                }
                            },
                            children: [
                                DOMElement.textNode(params.content.toString() + "\xa0"),
                                DOMElement.span({
                                    attrs: {
                                        className: "caret"
                                    }
                                })
                            ]
                        }));
                    }
                    var t = DOMElement.ul({
                        attrs: {
                            className: "dropdown-menu",
                        },
                        children: BootstrapElement.submenu(params.list)
                    });
                    subcontent.push(t);
                    rv = DOMElement.div({
                        attrs: {
                            className: "dropdown",
                        },
                        children: subcontent
                    });
                    rv.onclick = function (host, me) {
                        return function (event) {
                            BootstrapElement.lastdropdown = host;
                            if ((me.style.display == "none") || (me.style.display == "")) {
                                BootstrapElement.closeMenu();
                                me.style.display = "inline-block";
                                BootstrapElement.menuShownList.push(me);
                            }
                            else {
                                me.style.display = "none";
                            }
                            DOMElement.cancelEvent(event);
                            return false;
                        }
                    } (rv, t);
                    return rv;
                }
            }
        </script>
        <?php
    }
}
?>
