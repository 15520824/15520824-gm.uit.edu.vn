import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/HelpContainer.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import Dom from 'absol/src/HTML5/Dom';
import moduleDatabase from '../component/ModuleDatabase';

import { tableView } from './ModuleView'

var _ = Fcore._;
var $ = Fcore.$;

function HelpContainer() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    if (this.$view) return this.$view;
    var self = this;
    var input = _({
        tag: "input",
        class: "input-search-list",
        props: {
            type: "text",
            placeholder: "Tìm kiếm"
        }
    });
    moduleDatabase.getModule("helps").load().then(function(value) {
        var header = [{ value: "Title", sort: true, functionClickAll: this.$view.functionClickDetail.bind(this.$view), style: { minWidth: "unset !important" } }];
        this.$view.mTable = new tableView(header, this.$view.formatDataRow(value), false, true, 0);
        this.$view.mTable.addInputSearch(input);
        this.$view.mTable.headerTable.style.display = "none";
        mTable.parentNode.replaceChild(this.$view.mTable, mTable);
        self.$view.checkAlias = moduleDatabase.getModule("helps").getLibary("alias");
        if (window.exttask) {
            if (self.$view.checkAlias[window.exttask]) {
                setTimeout(function() {
                    var temp = document.getElementById("x86" + self.$view.checkAlias[window.exttask].id);
                    window.addHref = window.exttask;
                    if (temp)
                        temp.click();
                }.bind(this), 80);
            }
        }
        this.$view.firstChildClick();
    }.bind(this));

    var mTable = _({
        tag: "div"
    });

    var tabContainer = _({
        tag: "div",
        class: "header-display-visible",
        child: [{
                tag: "div",
                class: "js-stools-container-bar",
                child: [{
                        tag: "div",
                        class: ["absol-tabbar-button", "absol-tabbar-button-active"],
                        child: [{
                            tag: "div",
                            class: "absol-tabbar-button-text",
                            props: {
                                innerHTML: "Danh mục"
                            }
                        }]
                    },
                    {
                        tag: "div",
                        class: ["btn-wrapper", "input-append"],
                        child: [
                            input
                        ]
                    }
                ]
            },
            mTable
        ]
    })

    this.$view = _({
        tag: "div",
        class: "b-workZone__layout",
        child: [{
            tag: "div",
            class: ["b-workZone__side", "m-workZone__side__nav"],
            child: [{
                tag: "div",
                class: ["b-workZone__content", "m-workZone__content__nav"],
                props: {
                    id: "workZone_nav",
                },
                child: [{
                    tag: "div",
                    class: "absol-tab-frame-small",
                    child: [
                        tabContainer
                    ]
                }]
            }]
        }, ]
    })
    var containerView = _({
        tag: "div",
        class: ["cke_editable", "cke_editable_themed", "cke_contents_ltr", "cke_show_borders"],
        props: {
            contenteditable: true,
            spellcheck: false
        }
    })
    var title = _({
        tag: "li",
        class: "b-breadCrumbs__item",
        props: {
            innerHTML: "Introduction"
        }
    })
    this.$view.addChild(_({
        tag: "div",
        class: ["b-workZone__side", "m-workZone__side__article"],
        props: {
            id: "workZone_article"
        },
        child: [{
            tag: "div",
            class: "b-workZone__content",
            props: {
                id: "workZone_article__content"
            },
            child: [{
                tag: "div",
                class: "b-article",
                child: [{
                    tag: "div",
                    class: "b-article__headerLayout",
                    props: {
                        id: "article__header"
                    },
                    child: [{
                            tag: "div",
                            class: ["b-article__headerSide", "m-article__headerSide__nav"],
                            props: {
                                id: "headerSide__nav"
                            },
                            child: [{
                                tag: "ul",
                                class: "b-breadCrumbs__items",
                                child: [title]
                            }]
                        },
                        {
                            tag: "div",
                            class: ["b-article__headerSide", "m-article__headerSide__buttons"],
                            props: {
                                id: "headerSide__buttons"
                            },
                            child: [{
                                tag: "ul",
                                class: "b-controlButtons__items",
                                child: [{
                                        tag: "li",
                                        class: ["b-controlButtons__item", "m-controlButtons__item__prev"],
                                        on: {
                                            click: function() {
                                                if (self.$view.mTable) {
                                                    var arr = self.$view.mTable.getElementsByClassName("choice-event-category");
                                                    if (arr.length > 0) {
                                                        arr = arr[0];
                                                        arr = self.$view.mTable.getElementPrevVisiale(arr);
                                                        if (arr)
                                                            arr.childNodes[0].click();
                                                    }
                                                }
                                            }
                                        },
                                        child: [{
                                                tag: "i",
                                                class: "material-icons",
                                                props: {
                                                    innerHTML: "arrow_back"
                                                }
                                            },
                                            {
                                                tag: "span",
                                                class: "b-controlButtons__link_text",
                                                props: {
                                                    innerHTML: " Trang trước"
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        tag: "li",
                                        class: ["b-controlButtons__item", "m-controlButtons__item__next"],
                                        on: {
                                            click: function() {
                                                if (self.$view.mTable) {
                                                    var arr = self.$view.mTable.getElementsByClassName("choice-event-category");
                                                    if (arr.length > 0) {
                                                        arr = arr[0];
                                                        arr = self.$view.mTable.getElementNextVisiale(arr);
                                                        if (arr)
                                                            arr.childNodes[0].click();
                                                    }
                                                }
                                            }
                                        },
                                        child: [{
                                                tag: "span",
                                                class: "b-controlButtons__link_text",
                                                props: {
                                                    innerHTML: " Trang tiếp theo"
                                                }
                                            },
                                            {
                                                tag: "i",
                                                class: "material-icons",
                                                props: {
                                                    innerHTML: "arrow_forward"
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        tag: "li",
                                        class: ["b-controlButtons__item", "m-controlButtons__item__print"],
                                        on: {
                                            click: function() {
                                                Dom.printElement(self.$view.containerView.parentNode);
                                            }
                                        },
                                        child: [{
                                                tag: "i",
                                                class: "material-icons",
                                                props: {
                                                    innerHTML: "print"
                                                }
                                            },
                                            {
                                                tag: "span",
                                                class: "b-controlButtons__link_text",
                                                props: {
                                                    innerHTML: "In"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }]
                        }
                    ]
                }, {
                    tag: "div",
                    class: "container-content-information",
                    child: [containerView]
                }]
            }]
        }]
    }))
    Object.assign(this.$view, HelpContainer.prototype);
    this.$view.containerView = containerView;
    this.$view.titleLabel = title;
    return this.$view;
}

Object.defineProperties(HelpContainer.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
HelpContainer.prototype.constructor = HelpContainer;

HelpContainer.prototype.firstChildClick = function() {
    if (this.mTable.childrenNodes.length > 0) {
        this.mTable.childrenNodes[0].classList.add("choice-event-category");
        this.titleLabel.innerHTML = this.mTable.childrenNodes[0].data.original.title;
        this.containerView.innerHTML = this.mTable.childrenNodes[0].data.original.fulltext;
    }
}
HelpContainer.prototype.functionClickDetail = function(event, me, index, parent, data, row) {
    var arr = this.getElementsByClassName("choice-event-category");
    var isRemove = true;
    if (arr.length !== 0)
        arr = arr[0];
    if (arr == row)
        return true;
    if (row === undefined)
        isRemove = false;
    if (isRemove) {
        if (arr.classList)
            arr.classList.remove("choice-event-category");
    }
    row.classList.add("choice-event-category");
    var text = window.location.href;
    if (window.addHref !== undefined) {
        text = window.location.href.replace(window.addHref, "");
    }
    window.addHref = data.original.alias;
    history.replaceState({}, "", text + window.addHref);
    this.titleLabel.innerHTML = data.original.title;
    this.containerView.innerHTML = data.original.fulltext;
}

HelpContainer.prototype.formatDataRow = function(data) {
    var temp = [];
    var check = [];
    var k = 0;
    for (var i = 0; i < data.length; i++) {
        if (!parseInt(data[i].active))
            continue;
        var result = [{
            value: data[i].title,
            element: _({
                tag: "div",
                props: {
                    id: "x86" + data[i].id
                },
                child: [{
                    tag: "span",
                    class: "title-label",
                    props: {
                        innerHTML: data[i].title
                    }
                }]
            }),
        }];
        result.original = data[i];
        if (check[data[i].parent_id] !== undefined) {
            if (check[data[i].parent_id].child === undefined)
                check[data[i].parent_id].child = [];
            check[data[i].parent_id].child.push(result);
        } else
            temp[k++] = result;
        check[data[i].id] = result;
    }

    return temp;
}

HelpContainer.prototype.refresh = function() {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

HelpContainer.prototype.setData = function(data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

HelpContainer.prototype.flushDataToView = function() {
    if (this.dataFlushed) return;
    this.dataFlushed = true;
    //TODO: remove older view
    if (!this.data) return;
    this.$content.clearChild();
    if (this.data && this.$view) {
        this.rootComponent = this.build(this.data);
        this.$content.addChild(this.rootComponent.view);
        this.rootComponent.onAttach();
        this.$widthIp.value = this.rootComponent.getStyle('width', 'px');
        this.$heightIp.value = this.rootComponent.getStyle('height', 'px');
    }
};

HelpContainer.prototype.start = function() {

}

export default HelpContainer;