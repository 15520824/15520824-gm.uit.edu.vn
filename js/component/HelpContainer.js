import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/HelpContainer.css"
import R from '../R';
import Fcore from '../dom/Fcore';

import {tableView} from './ModuleView'

var _ = Fcore._;
var $ = Fcore.$;

function HelpContainer() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    if (this.$view) return this.$view;
    var self = this;
    if(window.mobilecheck())
    {
        allinput.placeholder = "Tên"
    }
    var header = [{}];
    var row1 = ['Giới thiệu'];
    row1.child = [
        ['Giới thiệu phần mềm Bsc2Kpi'],
        ['Quy trình nhập liệu hồ sơ mới']
    ]

    var row2 = ['Giới thiệu'];
    row2.child = [
        ['Giới thiệu phần mềm Bsc2Kpi'],
        ['Quy trình nhập liệu hồ sơ mới']
    ]

    var row3 = ['Giới thiệu'];
    row3.child = [
        ['Giới thiệu phần mềm Bsc2Kpi'],
        ['Quy trình nhập liệu hồ sơ mới']
    ]
    var data = [
        row1,
        ['Menu tổng quan'],
        ['Menu BSC'],
        ['Menu đề xuất'],
        ['Menu duyệt'],
        ['Menu danh mục'],
        ['Menu báo cáo'],
        ['Menu hệ thống'],
        ['Menu người dùng'],
        row2,
        ['Menu tổng quan'],
        ['Menu BSC'],
        ['Menu đề xuất'],
        ['Menu duyệt'],
        ['Menu danh mục'],
        ['Menu báo cáo'],
        ['Menu hệ thống'],
        ['Menu người dùng'],
        row3,
        ['Menu tổng quan'],
        ['Menu BSC'],
        ['Menu đề xuất'],
        ['Menu duyệt'],
        ['Menu danh mục'],
        ['Menu báo cáo'],
        ['Menu hệ thống'],
        ['Menu người dùng'],
    ]
    var mTable = new tableView(header,data,false,false,0);
    this.$view = _({
        tag:"table",
        class:"b-workZone__layout",
        child:[
            {
                tag:"tbody",
                child:[
                    {
                        tag:"tr",
                        child:[
                            {
                                tag:"td",
                                class:["b-workZone__side", "m-workZone__side__nav"],
                                child:[
                                    {
                                        tag:"div",
                                        class:["b-workZone__content", "m-workZone__content__nav"],
                                        props:{
                                            id:"workZone_nav",
                                        },
                                        child:[
                                            {
                                                tag:"div",
                                                class:["b-workZone__content", "m-workZone__content__nav"],
                                                child:[
                                                    {
                                                        tag:"tabview",
                                                        class:"absol-tab-frame-small",
                                                        props:{
                                                            value:0
                                                        },
                                                        style:{
                                                            width:"fit-content"
                                                        },
                                                        child:[
                                                            {
                                                                tag:"tabframe",
                                                                attr:{
                                                                    name:"Menu",
                                                                    id:"matd",
                                                                    desc:""
                                                                },
                                                                child:[
                                                                    mTable
                                                                ]
                                                            },
                                                            {
                                                                tag:"tabframe",
                                                                attr:{
                                                                    name:"Index",
                                                                    id:"matd2",
                                                                    desc:""
                                                                },
                                                                child:[
                                                                    {
                                                                        tag:"span",
                                                                        props:{
                                                                            innerHTML:"2"
                                                                        }
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                tag:"tabframe",
                                                                attr:{
                                                                    name:"Search",
                                                                    id:"matd3",
                                                                    desc:""
                                                                },
                                                                child:[
                                                                    {
                                                                        tag:"span",
                                                                        props:{
                                                                            innerHTML:"3"
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"td",
                                class:["b-workZone__side", "m-workZone__side__article"],
                                props:{
                                    id:"workZone_article"
                                },
                                child:[
                                    {
                                        tag:"div",
                                        class:"b-workZone__content",
                                        props:{
                                            id:"workZone_article__content"
                                        },
                                        child:[
                                            {
                                                tag:"div",
                                                class:"b-article",
                                                child:[
                                                    {
                                                        tag:"div",
                                                        class:"b-article__headerLayout",
                                                        props:{
                                                            id:"article__header"
                                                        },
                                                        child:[
                                                            {
                                                                tag:"div",
                                                                class:["b-article__headerSide", "m-article__headerSide__nav"],
                                                                props:{
                                                                    id:"headerSide__nav"
                                                                },
                                                                child:[
                                                                    {
                                                                        tag:"ul",
                                                                        class:"b-breadCrumbs__items",
                                                                        child:[
                                                                            {
                                                                                tag:"li",
                                                                                class:"b-breadCrumbs__item",
                                                                                props:{
                                                                                    innerHTML:"Introduction"
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                tag:"div",
                                                                class:["b-article__headerSide", "m-article__headerSide__buttons"],
                                                                props:{
                                                                    id:"headerSide__buttons"
                                                                },
                                                                child:[
                                                                    {
                                                                        tag:"ul",
                                                                        class:"b-controlButtons__items",
                                                                        child:[
                                                                            {
                                                                                tag:"li",
                                                                                class:["b-controlButtons__item", "m-controlButtons__item__prev"],
                                                                                child:[
                                                                                    {
                                                                                        tag:"i",
                                                                                        class:"material-icons",
                                                                                        props:{
                                                                                            innerHTML:"arrow_back"
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        tag:"span",
                                                                                        class:"b-controlButtons__link_text",
                                                                                        props:{
                                                                                            innerHTML:" Previous page"
                                                                                        }
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                tag:"li",
                                                                                class:["b-controlButtons__item", "m-controlButtons__item__next"],
                                                                                child:[
                                                                                    {
                                                                                        tag:"span",
                                                                                        class:"b-controlButtons__link_text",
                                                                                        props:{
                                                                                            innerHTML:" Next page"
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        tag:"i",
                                                                                        class:"material-icons",
                                                                                        props:{
                                                                                            innerHTML:"arrow_forward"
                                                                                        }
                                                                                    }
                                                                                ]
                                                                            },
                                                                            {
                                                                                tag:"li",
                                                                                class:["b-controlButtons__item", "m-controlButtons__item__print"],
                                                                                child:[
                                                                                    {
                                                                                        tag:"i",
                                                                                        class:"material-icons",
                                                                                        props:{
                                                                                            innerHTML:"print"
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        tag:"span",
                                                                                        class:"b-controlButtons__link_text",
                                                                                        props:{
                                                                                            innerHTML:"Print"
                                                                                        }
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
    return this.$view;
}

Object.defineProperties(HelpContainer.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
HelpContainer.prototype.constructor = HelpContainer;

HelpContainer.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

HelpContainer.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

HelpContainer.prototype.flushDataToView = function () {
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

HelpContainer.prototype.start = function () {

}

export default HelpContainer;