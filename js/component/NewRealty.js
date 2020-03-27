import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import '../../css/NewRealty.css';
import '../../css/imagesilder.css';
import '../../css/style_alignFormCss.css';
import '../../css/style_alignFormCss_1.css';
import '../../css/style_alignFormCss_2.css';
import '../../css/style_alignFormCss_3.css';
import '../../css/style_alignFormCss_4.css';
import '../../css/style_alignFormCss_5.css';
import {unit_Long,unit_Zone,selectElement} from './ModuleView';
import R from '../R';
import Fcore from '../dom/Fcore';

var _ = Fcore._;
var $ = Fcore.$;

function NewRealty(header, dataTable) {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.header = header;
    this.dataTable = dataTable;
}

NewRealty.prototype.setContainer = function (parent) {
    this.parent = parent;
}

Object.defineProperties(NewRealty.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
NewRealty.prototype.constructor = NewRealty;

NewRealty.prototype.generalData = function()
{
    for(var i=0;i<this.header.length;i++)
    {
        if (this.header[i].value === undefined) {
            if (typeof this.header[i] === "object")
                value = "";
            else
                value = this.header[i];
        }
        else
            value = this.header[i].value;   
        switch(value){

        }
    }
}

NewRealty.prototype.getView = function () {
    // if(this.$view!==undefined)
    //     return this.$view;
    var self = this;
    this.$view = _({
        tag: "singlepage",
        class: "pizo-new-realty",
        child: [
            {
                class: 'absol-single-page-header',
                child: [
                    {
                        tag: "div",
                        class: "pizo-list-project-button",
                        child: [
                            {
                                tag: "button",
                                class: ["pizo-list-project-button-quit","pizo-list-project-button-element"],
                                on: {
                                    click: function (evt) {
                                        self.$view.selfRemove();
                                        var arr = self.parent.body.getAllChild();
                                        self.parent.body.activeFrame(arr[arr.length - 1]);
                                        if (arr.length === 0)
                                            self.parent.body.selfRemove();
                                    }
                                },
                                child: [
                                '<span>' + "Đóng" + '</span>'
                                ]
                            },
                            {
                                tag: "button",
                                class: ["pizo-list-project-button-add","pizo-list-project-button-element"],
                                on: {
                                    click: function (evt) {

                                    }
                                },
                                child: [
                                '<span>' + "Lưu" + '</span>'
                                ]
                            },
                            {
                                tag: "button",
                                class: ["pizo-list-project-button-add","pizo-list-project-button-element"],
                                on: {
                                    click: function (evt) {

                                    }
                                },
                                child: [
                                '<span>' + "Lưu & đóng" + '</span>'
                                ]
                            },
                            {
                                tag: "button",
                                class: ["pizo-list-project-button-add","pizo-list-project-button-element"],
                                on: {
                                    click: function (evt) {

                                    }
                                },
                                child: [
                                '<span>' + "Lưu & thêm mới" + '</span>'
                                ]
                            }
                        ]
                    }
                ]
            },
        ]
    })

    this.$view.addChild(_({
        tag: "div",
        class: ["pizo-list-project-main"],
        child: [
            // NewRealty.prototype.locationView(),
            NewRealty.prototype.descView()
        ]
    }));
    setTimeout(function(){selectElement("pizo-new-realty-convenient-content-area-size-zone",1)},500)
    self.parent.parent.titlePage.innerHTML = "Thêm dự án";
    return this.$view;
}

NewRealty.prototype.descView = function()
{
    var map = NewRealty.prototype.mapView();
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-desc",
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-desc-content",
                child: [
                    NewRealty.prototype.descViewdetail(map),
                    NewRealty.prototype.descViewImageThumnail(),
                    // NewRealty.prototype.descViewImagePreview()
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-desc-infomation",
                child:[
                    NewRealty.prototype.detructView(),
                    {
                        tag:"div",
                        class:"pizo-new-realty-desc-infomation-cell",
                        child:[
                            NewRealty.prototype.utilityView(),
                            NewRealty.prototype.convenientView(),
                        ]
                    },
                    {
                        tag:"div",
                        class:"pizo-new-realty-desc-infomation-cell",
                        child:[
                            NewRealty.prototype.juridicalView(),
                            NewRealty.prototype.historyView()
                        ]
                    }
                ]
            }
        ]
    })
    return temp;
}

NewRealty.prototype.descViewImageThumnail = function()
{
    var temp = _({
        tag:"div",
        class:["pizo-new-relty-desc-content-thumnail","pizo-new-realty-dectruct-content-area-size-zone"],
        child:[
            {
                tag:"img",
                props:{
                    src:"assets/images/thumnail.png"
                }
            }
        ]
    })
    return temp;
}

NewRealty.prototype.descViewdetail = function()
{
    var temp = _({
        tag: "div",
        class: ["pizo-new-realty-desc-detail","pizo-new-realty-dectruct-content-area-size-zone"],
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-desc-detail-row",
                child: [
                    {
                        tag:"div",
                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                        child:[
                            {
                                tag: "span",
                                class: "pizo-new-realty-desc-detail-row-cell-label",
                                props: {
                                    innerHTML: "Tên"
                                },
                                child:[
                                    {
                                        tag: "span",
                                        class: "pizo-new-realty-location-detail-row-label-important",
                                        props: {
                                            innerHTML: "*"
                                        }
                                    }
                                ]
                            },
                            {
                                tag: "input",
                                class: "pizo-new-realty-desc-detail-row-cell-input",
                            }
                        ]
                    },
                    {
                        tag: "div",
                        class: "pizo-new-realty-dectruct-content-area-size-zone",
                        child:[
                            {
                                tag: "span",
                                class: "pizo-new-realty-desc-detail-row-cell-label",
                                props: {
                                    innerHTML: "Trạng thái"
                                }
                            },
                            {
                                tag: "selectmenu",
                                class: "pizo-new-realty-desc-detail-row-cell-menu",
                                props: {
                                    items:[
                                        { text:"Còn bán", value:0},
                                        { text:"Còn cho thuê", value:1},
                                        { text:"Đóng", value:2},
                                    ]
                                }
                            }
                        ]
                    }
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-desc-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-desc-detail-1-row-label",
                        props: {
                            innerHTML: "Địa chỉ"
                        }
                    },
                    {
                        tag: "input",
                        class: "pizo-new-realty-desc-detail-1-row-input",
                        on:{
                            click:function()
                            {
                                console.log("open locationView")
                            }
                        }
                    }
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-desc-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-desc-detail-row-label",
                        props: {
                            innerHTML: "Mô tả"
                        },
                       
                    },
                    {
                        tag: "textarea",
                        style:{
                            height:"15em"
                        },
                        class: "pizo-new-realty-desc-detail-row-input",
                        on:{
                            click:function()
                            {
                                console.log("open locationView")
                            }
                        }
                    }
                ]
            }]
    });
    return temp;
}

NewRealty.prototype.descViewImagePreview = function(){
    var temp = _({
        tag:"ul",
        class:"slides",
        child:[
            {
                tag:"input",
                attr:{
                    type:"radio",
                    name:"radio-btn",
                    checked:""
                },
                props:{
                    id:"img-1",
                }
            },
            {
                tag:"li",
                class:"slide-container",
                child:[
                    {
                        tag:"div",
                        class:"slide",
                        child:[
                            {
                                tag:"img",
                                props:{
                                    src:"assets/images/1.jfif"
                                }
                            }
                        ]
                    },
                    {
                        tag:"div",
                        class:"nav",
                        child:[
                            {
                                tag:"label",
                                class:"prev",
                                attr:{
                                    for:"img-6"
                                },
                                props:{
                                    innerHTML:"&#x2039;"
                                }
                            },
                            {
                                tag:"label",
                                class:"next",
                                attr:{
                                    for:"img-2"
                                },
                                props:{
                                    innerHTML:"&#x203a;"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                tag:"input",
                attr:{
                    type:"radio",
                    name:"radio-btn",
                    id:"img-2",
                },
            },
            {
                tag:"li",
                class:"slide-container",
                child:[
                    {
                        tag:"div",
                        class:"slide",
                        child:[
                            {
                                tag:"img",
                                props:{
                                    src:"assets/images/2.jfif"
                                }
                            }
                        ]
                    },
                    {
                        tag:"div",
                        class:"nav",
                        child:[
                            {
                                tag:"label",
                                class:"prev",
                                attr:{
                                    for:"img-1"
                                },
                                props:{
                                    innerHTML:"&#x2039;"
                                }
                            },
                            {
                                tag:"label",
                                class:"next",
                                attr:{
                                    for:"img-3"
                                },
                                props:{
                                    innerHTML:"&#x203a;"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                tag:"input",
                attr:{
                    type:"radio",
                    name:"radio-btn",
                    id:"img-3",
                },
            },
            {
                tag:"li",
                class:"slide-container",
                child:[
                    {
                        tag:"div",
                        class:"slide",
                        child:[
                            {
                                tag:"img",
                                props:{
                                    src:"assets/images/3.jfif"
                                }
                            }
                        ]
                    },
                    {
                        tag:"div",
                        class:"nav",
                        child:[
                            {
                                tag:"label",
                                class:"prev",
                                attr:{
                                    for:"img-2"
                                },
                                props:{
                                    innerHTML:"&#x2039;"
                                }
                            },
                            {
                                tag:"label",
                                class:"next",
                                attr:{
                                    for:"img-4"
                                },
                                props:{
                                    innerHTML:"&#x203a;"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                tag:"input",
                attr:{
                    type:"radio",
                    name:"radio-btn",
                    id:"img-4",
                },
            },
            {
                tag:"li",
                class:"slide-container",
                child:[
                    {
                        tag:"div",
                        class:"slide",
                        child:[
                            {
                                tag:"img",
                                props:{
                                    src:"assets/images/4.jfif"
                                }
                            }
                        ]
                    },
                    {
                        tag:"div",
                        class:"nav",
                        child:[
                            {
                                tag:"label",
                                class:"prev",
                                attr:{
                                    for:"img-3"
                                },
                                props:{
                                    innerHTML:"&#x2039;"
                                }
                            },
                            {
                                tag:"label",
                                class:"next",
                                attr:{
                                    for:"img-5"
                                },
                                props:{
                                    innerHTML:"&#x203a;"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                tag:"input",
                attr:{
                    type:"radio",
                    name:"radio-btn",
                    id:"img-5",
                },
            },
            {
                tag:"li",
                class:"slide-container",
                child:[
                    {
                        tag:"div",
                        class:"slide",
                        child:[
                            {
                                tag:"img",
                                props:{
                                    src:"assets/images/5.jfif"
                                }
                            }
                        ]
                    },
                    {
                        tag:"div",
                        class:"nav",
                        child:[
                            {
                                tag:"label",
                                class:"prev",
                                attr:{
                                    for:"img-4"
                                },
                                props:{
                                    innerHTML:"&#x2039;"
                                }
                            },
                            {
                                tag:"label",
                                class:"next",
                                attr:{
                                    for:"img-6"
                                },
                                props:{
                                    innerHTML:"&#x203a;"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                tag:"input",
                attr:{
                    type:"radio",
                    name:"radio-btn",
                    id:"img-6",
                },
            },
            {
                tag:"li",
                class:"slide-container",
                child:[
                    {
                        tag:"div",
                        class:"slide",
                        child:[
                            {
                                tag:"img",
                                props:{
                                    src:"assets/images/6.jfif"
                                }
                            }
                        ]
                    },
                    {
                        tag:"div",
                        class:"nav",
                        child:[
                            {
                                tag:"label",
                                class:"prev",
                                attr:{
                                    for:"img-5"
                                },
                                props:{
                                    innerHTML:"&#x2039;"
                                }
                            },
                            {
                                tag:"label",
                                class:"next",
                                attr:{
                                    for:"img-1"
                                },
                                props:{
                                    innerHTML:"&#x203a;"
                                }
                            }
                        ]
                    }
                ]
            },
        ]
    })
    return temp;
}

NewRealty.prototype.detructView = function(){
    var temp = _({
        tag:"div",
        class:"pizo-new-realty-dectruct",
        child:[
            {
                tag: "div",
                class: "pizo-new-realty-dectruct-tab",
                props: {
                    innerHTML: "Thông tin xây dựng"
                }
            },
            {
                tag:"div",
                class:"pizo-new-realty-dectruct-content",
                child:[
                    {
                        tag:"div",
                        class:"pizo-new-realty-dectruct-content-area",
                        child:[
                            {
                                tag:"span",
                                class:"pizo-new-realty-detruct-content-area-label",
                                props: {
                                    innerHTML: "Diện tích"
                                },
                            },
                            {
                                tag:"div",
                                class:"pizo-new-realty-dectruct-content-area-size",
                                child:[
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                        child:[
                                            {
                                                tag:"span",
                                                class:"pizo-new-realty-dectruct-content-area-1-label",
                                                props: {
                                                    innerHTML: "Đất"
                                                },
                                            },
                                            {
                                                tag:"input",
                                                class:["pizo-new-realty-dectruct-content-area-1","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    type:"number"
                                                }
                                            },
                                            unit_Zone(),
                                        ]
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                        child:[
                                            {
                                                tag:"span",
                                                class:"pizo-new-realty-dectruct-content-area-2-label",
                                                props: {
                                                    innerHTML: "Sàn"
                                                },
                                            },
                                            {
                                                tag:"input",
                                                class:["pizo-new-realty-dectruct-content-area-2","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    type:"number"
                                                }
                                            },
                                            unit_Zone()
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-new-realty-dectruct-content-area-size",
                                child:[
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                        child:[
                                            {
                                                tag:"span",
                                                class:"pizo-new-realty-dectruct-content-area-width-label",
                                                props: {
                                                    innerHTML: "Dài"
                                                },
                                            },
                                            {
                                                tag:"input",
                                                class:["pizo-new-realty-dectruct-content-area-width","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    type:"number"
                                                }
                                            },
                                            unit_Long(),
                                        ]
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                        child:[
                                            {
                                                tag:"span",
                                                class:"pizo-new-realty-dectruct-content-area-height-label",
                                                props: {
                                                    innerHTML: "Ngang"
                                                },
                                            },
                                            {
                                                tag:"input",
                                                class:["pizo-new-realty-dectruct-content-area-height","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    type:"number"
                                                }
                                            },
                                            unit_Long()
                                        ]
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        tag:"div",
                        class:"pizo-new-realty-dectruct-content-area",
                        child:[
                            {
                                tag:"div",
                                class:["pizo-new-realty-dectruct-content-area-size-zone","no-margin-style"],
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-new-realty-detruct-content-area-label",
                                        props: {
                                            innerHTML: "Hướng"
                                        },
                                    },
                                    {
                                        tag:"selectmenu",
                                        class:"pizo-new-realty-detruct-content-direction",
                                        props:{
                                            items:[
                                                {text:"Đông",value:6},
                                                {text:"Tây",value:4},
                                                {text:"Nam",value:2},
                                                {text:"Bắc",value:8},
                                                {text:"Đông Bắc",value:9},
                                                {text:"Đông Nam",value:3},
                                                {text:"Tây Bắc",value:7},
                                                {text:"Tây Nam",value:1},
                                            ]
                                        }
                                    },
                                ]
                            },
                            {
                                tag:"div",
                                class:["pizo-new-realty-dectruct-content-area-size-zone","margin-style"],
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-new-realty-detruct-content-area-label",
                                        props: {
                                            innerHTML: "Loại nhà"
                                        },
                                    },
                                    {
                                        tag:"selectmenu",
                                        class:"pizo-new-realty-detruct-content-type",
                                        props:{
                                            items:[
                                                {text:"Hẻm",value:0},
                                                {text:"Mặt tiền",value:1},
                                                {text:"Chung cư",value:2},
                                            ]
                                        }
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        tag:"div",
                        class:"pizo-new-realty-dectruct-content-area",
                        child:[
                            {
                                tag:"span",
                                class:"pizo-new-realty-detruct-content-area-label",
                                props: {
                                    innerHTML: "Số lượng phòng"
                                },
                            },
                            {
                                tag:"div",
                                class:"pizo-new-realty-dectruct-content-area-size",
                                child:[
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                        child:[
                                            {
                                                tag:"span",
                                                class:"pizo-new-realty-dectruct-content-area-bedroom-label",
                                                props: {
                                                    innerHTML: "Phòng ngủ"
                                                },
                                            },
                                            {
                                                tag:"input",
                                                class:["pizo-new-realty-dectruct-content-area-bedroom","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    type:"number",
                                                    min:0,
                                                    step:1
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                        child:[
                                            {
                                                tag:"span",
                                                class:"pizo-new-realty-dectruct-content-area-kitchen-label",
                                                props: {
                                                    innerHTML: "Bếp"
                                                },
                                            },
                                            {
                                                tag:"input",
                                                class:["pizo-new-realty-dectruct-content-area-kitchen","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    type:"number",
                                                    min:0,
                                                    step:1
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-new-realty-dectruct-content-area-size",
                                child:[
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                        child:[
                                            {
                                                tag:"span",
                                                class:"pizo-new-realty-dectruct-content-area-bathroom-label",
                                                props: {
                                                    innerHTML: "Phòng tắm"
                                                },
                                            },
                                            {
                                                tag:"input",
                                                class:["pizo-new-realty-dectruct-content-area-bathroom","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    type:"number",
                                                    min:0,
                                                    step:1
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                        child:[
                                            {
                                                tag:"span",
                                                class:"pizo-new-realty-dectruct-content-area-garage-label",
                                                props: {
                                                    innerHTML: "Garage"
                                                },
                                            },
                                            {
                                                tag:"input",
                                                class:["pizo-new-realty-dectruct-content-area-garage","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    type:"number",
                                                    min:0,
                                                    step:1
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-new-realty-dectruct-content-area-size",
                                child:[
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                        child:[
                                            {
                                                tag:"span",
                                                class:"pizo-new-realty-dectruct-content-area-basement-label",
                                                props: {
                                                    innerHTML: "Tầng hầm"
                                                },
                                            },
                                            {
                                                tag:"input",
                                                class:["pizo-new-realty-dectruct-content-area-basement","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    type:"number",
                                                    min:0,
                                                    step:1
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                        child:[
                                            {
                                                tag:"span",
                                                class:"pizo-new-realty-dectruct-content-area-balcony-label",
                                                props: {
                                                    innerHTML: "Ban công"
                                                },
                                            },
                                            {
                                                tag:"input",
                                                class:["pizo-new-realty-dectruct-content-area-balcony","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    type:"number",
                                                    min:0,
                                                    step:1
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        tag:"div",
                        class:"pizo-new-realty-dectruct-content-area-right",
                        child:[
                            {
                                tag:"span",
                                class:"pizo-new-realty-detruct-content-area-label",
                                props: {
                                    innerHTML: "Chiều rộng đường vào"
                                },
                            },
                            {
                                tag:"input",
                                class:["pizo-new-realty-dectruct-content-area-access","pizo-new-realty-dectruct-input"],
                                attr:{
                                    type:"number",
                                    min:0,
                                    step:1
                                }
                            },
                            unit_Long()
                        ]
                    },
                    {
                        tag:"div",
                        class:"pizo-new-realty-dectruct-content-area-right",
                        child:[
                            {
                                tag:"span",
                                class:"pizo-new-realty-detruct-content-area-label",
                                props: {
                                    innerHTML: "Năm xây dựng"
                                },
                            },
                            {
                                tag:"input",
                                class:["pizo-new-realty-dectruct-content-area-year","pizo-new-realty-dectruct-input"],
                                attr:{
                                    type:"number",
                                    min:0,
                                    step:1
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    })
    return temp;
}

NewRealty.prototype.utilityView = function(){
    var temp = _({
        tag:"div",
        class:"pizo-new-realty-utility",
        child:[
            {
                tag: "div",
                class: "pizo-new-realty-utility-tab",
                props: {
                    innerHTML: "Tiện ích xung quanh"
                }
            },
            {
                tag:"div",
                class:"pizo-new-realty-dectruct-content",
                child:[
                    {
                        tag:"div",
                        class:"pizo-new-realty-dectruct-content-area",
                        child:[
                            {
                                tag:"div",
                                class:"pizo-new-realty-dectruct-content-area-size",
                                child:[
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                        child:[
                                            {
                                                tag:"span",
                                                class:"pizo-new-realty-dectruct-content-area-pool-label",
                                                props: {
                                                    innerHTML: "Bể bơi"
                                                },
                                            },
                                            {
                                                tag:"input",
                                                class:["pizo-new-realty-dectruct-content-area-pool","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    type:"number"
                                                }
                                            },
                                            unit_Long(),
                                        ],
                                        on:{

                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                        child:[
                                            {
                                                tag:"span",
                                                class:"pizo-new-realty-dectruct-content-area-gym-label",
                                                props: {
                                                    innerHTML: "Phòng Gym"
                                                },
                                            },
                                            {
                                                tag:"input",
                                                class:["pizo-new-realty-dectruct-content-area-gym","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    type:"number"
                                                }
                                            },
                                            unit_Long()
                                        ]
                                    }
                                ]
                            },{
                                tag:"div",
                                class:"pizo-new-realty-dectruct-content-area-size",
                                child:[
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                        child:[
                                            {
                                                tag:"span",
                                                class:"pizo-new-realty-dectruct-content-area-supermarket-label",
                                                props: {
                                                    innerHTML: "Siêu thị"
                                                },
                                            },
                                            {
                                                tag:"input",
                                                class:["pizo-new-realty-dectruct-content-area-supermarket","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    type:"number"
                                                }
                                            },
                                            unit_Long(),
                                        ]
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                        child:[
                                            {
                                                tag:"span",
                                                class:"pizo-new-realty-dectruct-content-area-market-label",
                                                props: {
                                                    innerHTML: "Chợ"
                                                },
                                            },
                                            {
                                                tag:"input",
                                                class:["pizo-new-realty-dectruct-content-area-market","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    type:"number"
                                                }
                                            },
                                            unit_Long()
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-new-realty-dectruct-content-area-size",
                                child:[
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                        child:[
                                            {
                                                tag:"span",
                                                class:"pizo-new-realty-dectruct-content-area-hospital-label",
                                                props: {
                                                    innerHTML: "Bệnh viện"
                                                },
                                            },
                                            {
                                                tag:"input",
                                                class:["pizo-new-realty-dectruct-content-area-hospital","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    type:"number"
                                                }
                                            },
                                            unit_Long(),
                                        ]
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                        child:[
                                            {
                                                tag:"span",
                                                class:"pizo-new-realty-dectruct-content-area-park-label",
                                                props: {
                                                    innerHTML: "Công viên"
                                                },
                                            },
                                            {
                                                tag:"input",
                                                class:["pizo-new-realty-dectruct-content-area-park","pizo-new-realty-dectruct-input"],
                                                attr:{
                                                    type:"number"
                                                }
                                            },
                                            unit_Long()
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-new-realty-dectruct-content-area-size",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-new-realty-detruct-content-area-label",
                                        props: {
                                            innerHTML: "Trường học"
                                        },
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-new-realty-dectruct-content-area-size",
                                        child:[

                                                    {
                                                        tag:"div",
                                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                                        child:[
                                                            {
                                                                tag:"span",
                                                                class:"pizo-new-realty-dectruct-content-area-preschool-label",
                                                                props: {
                                                                    innerHTML: "Mầm non"
                                                                },
                                                            },
                                                            {
                                                                tag:"input",
                                                                class:["pizo-new-realty-dectruct-content-area-preschool","pizo-new-realty-dectruct-input"],
                                                                attr:{
                                                                    type:"number"
                                                                }
                                                            },
                                                            unit_Long(),
                                                        ]
                                                    },
                                                    {
                                                        tag:"div",
                                                        class:"pizo-new-realty-dectruct-content-area-size-zone",
                                                        child:[
                                                            {
                                                                tag:"span",
                                                                class:"pizo-new-realty-dectruct-content-area-highschool-label",
                                                                props: {
                                                                    innerHTML: "Phổ thông"
                                                                },
                                                            },
                                                            {
                                                                tag:"input",
                                                                class:["pizo-new-realty-dectruct-content-area-highschool","pizo-new-realty-dectruct-input"],
                                                                attr:{
                                                                    type:"number"
                                                                }
                                                            },
                                                            unit_Long()
                                                        ]
                                                    }
                                                ]
                                            }
                                    
                                ]
                            },
                        ]
                    }
                ]
            }
        ]
    })
    return temp;
}

NewRealty.prototype.convenientView = function(){
    var temp = _({
        tag:"div",
        class:"pizo-new-realty-convenient",
        child:[
            {
                tag: "div",
                class: "pizo-new-realty-convenient-tab",
                props: {
                    innerHTML: "Tiện ích trong nhà"
                }
            },
            {
                tag:"div",
                class:"pizo-new-realty-convenient-content",
                child:[
                    {
                        tag:"div",
                        class:"pizo-new-realty-convenient-content-size",
                        child:[
                            {
                                tag:"div",
                                class:"pizo-new-realty-convenient-content-area-size-zone",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-new-realty-convenient-content-area-tivi-label",
                                        props: {
                                            innerHTML: "Tivi"
                                        },
                                    },
                                    {
                                        tag:"input",
                                        class:["pizo-new-realty-convenient-content-area-tivi","pizo-new-realty-dectruct-input"],
                                        attr:{
                                            type:"number"
                                        }
                                    },
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-new-realty-convenient-content-area-size-zone",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-new-realty-convenient-content-area-fridge-label",
                                        props: {
                                            innerHTML: "Tủ lạnh"
                                        },
                                    },
                                    {
                                        tag:"input",
                                        class:["pizo-new-realty-convenient-content-area-fridge","pizo-new-realty-dectruct-input"],
                                        attr:{
                                            type:"number"
                                        }
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        tag:"div",
                        class:"pizo-new-realty-convenient-content-size",
                        child:[
                            {
                                tag:"div",
                                class:"pizo-new-realty-convenient-content-area-size-zone",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-new-realty-convenient-content-area-conditioning-label",
                                        props: {
                                            innerHTML: "Điều hòa"
                                        },
                                    },
                                    {
                                        tag:"input",
                                        class:["pizo-new-realty-convenient-content-area-conditioning","pizo-new-realty-dectruct-input"],
                                        attr:{
                                            type:"number"
                                        }
                                    },
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-new-realty-convenient-content-area-size-zone",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-new-realty-convenient-content-area-washing-label",
                                        props: {
                                            innerHTML: "Máy giặt"
                                        },
                                    },
                                    {
                                        tag:"input",
                                        class:["pizo-new-realty-convenient-content-area-washing","pizo-new-realty-dectruct-input"],
                                        attr:{
                                            type:"number"
                                        }
                                    },
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    })
    return temp;
}

NewRealty.prototype.juridicalView = function(){
    var temp = _({
        tag:"div",
        class:"pizo-new-realty-juridical",
        child:[
            {
                tag: "div",
                class: "pizo-new-realty-juridical-tab",
                props: {
                    innerHTML: "Pháp lý"
                }
            },
            {
                tag:"div",
                class:"pizo-new-realty-juridical-content",
                child:[
                    {
                        tag:"div",
                        class:""
                    }
                ]
            }
        ]
    })
    return temp;
}

NewRealty.prototype.historyView = function(){
    var temp = _({
        tag:"div",
        class:"pizo-new-realty-history",
        child:[
            {
                tag: "div",
                class: "pizo-new-realty-history-tab",
                props: {
                    innerHTML: "Lịch sử sở hữu"
                }
            },
        ]
    })
    return temp;
}

NewRealty.prototype.locationView = function () {
    var map = NewRealty.prototype.mapView();
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-location",
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-location-tab",
                props: {
                    innerHTML: "Vị trí"
                }
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-content",
                child: [
                    NewRealty.prototype.detailView(map),
                    map
                ]
            }
        ]
    })
    return temp;
}

NewRealty.prototype.detailView = function (map) {

    var input = _({
        tag: "input",
        class: "pizo-new-realty-location-detail-row-input",
        props: {
            type: "text",
            placeholder: ""
        }
    });
    var state = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu"
    });
    var dictrict = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu"
    })
    var ward = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu"
    })
    var street = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu"
    })
    var number = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu"
    })
    var long = _({
        tag:"input",
        class:"pizo-new-realty-location-detail-row-input-long",
    })
    var lat = _({
        tag:"input",
        class:"pizo-new-realty-location-detail-row-input-lat",
    })
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-location-detail",
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Địa chỉ đầy đủ"
                        }
                    },
                    input
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Tỉnh/TP"
                        },
                        child: [
                            {
                                tag: "span",
                                class: "pizo-new-realty-location-detail-row-label-important",
                                props: {
                                    innerHTML: "*"
                                }
                            },
                        ]
                    },
                    state
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Quận/Huyện"
                        },
                        child: [
                            {
                                tag: "span",
                                class: "pizo-new-realty-location-detail-row-label-important",
                                props: {
                                    innerHTML: "*"
                                }
                            }
                        ]
                    },
                    dictrict
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Phường/Xã"
                        },
                        child: [
                            {
                                tag: "span",
                                class: "pizo-new-realty-location-detail-row-label-important",
                                props: {
                                    innerHTML: "*"
                                }
                            }
                        ]
                    },
                    ward
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Đường"
                        },
                        child: [
                            {
                                tag: "span",
                                class: "pizo-new-realty-location-detail-row-label-important",
                                props: {
                                    innerHTML: "*"
                                }
                            }
                        ]
                    },
                    street
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "Số nhà"
                        },
                        child: [
                            {
                                tag: "span",
                                class: "pizo-new-realty-location-detail-row-label-important",
                                props: {
                                    innerHTML: "*"
                                }
                            }
                        ]
                    },
                    number
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-location-detail-row",
                child: [
                    {
                        tag: "span",
                        class: "pizo-new-realty-location-detail-row-label",
                        props: {
                            innerHTML: "GPS"
                        },
                    },
                    {
                        tag:"div",
                        class:"pizo-new-realty-location-detail-row-menu",
                        child:[
                            long,
                            lat
                        ]
                    }
                ]
            }
        ]
    })
    temp.input = input;
    temp.number = number;
    temp.dictrict = dictrict;
    temp.street = street;
    temp.ward = ward;
    temp.state = state;
    temp.activeAutocomplete = activeAutocomplete;
    temp.fillInAddress = activeAutocomplete.prototype.fillInAddress;
    temp.long = long;
    temp.lat = lat;
    temp.activeAutocomplete(map);
    return temp;
}

function activeAutocomplete(map) {
    var self = this;
    var autocomplete;
    var options = {
        terms:['street_number','route','locality','administrative_area_level_1','administrative_area_level_2','administrative_area_level_3'],
        types: ['geocode'],
        componentRestrictions: { country: 'vn' }
    };


    autocomplete = new google.maps.places.Autocomplete(
        self.input, options);

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    autocomplete.setFields(['address_component']);

    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener('place_changed', function () {
        self.fillInAddress(autocomplete, self.input.value, map)
    });
}

activeAutocomplete.prototype.fillInAddress = function (autocomplete, text, map) {
    // Get the place details from the autocomplete object.
    var self = this;
    var place = autocomplete.getPlace();
    console.log(autocomplete)
    NewRealty.prototype.getLongLat(text).then(function (result) {
        console.log(map)
        map.addMoveMarker(result)
    })
    console.log(place);
    var textResult = text;
    var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'long_name',
        administrative_area_level_2: 'long_name',
        country: 'long_name',
        postal_code: 'short_name'
    };

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            switch (addressType) {
                case "street_number":
                    self.number.value = val;
                    break;
                case "route":
                    self.street.value = val;
                    textResult = textResult.replace(textResult.slice(0,textResult.indexOf(val+", ")+val.length+2),"");
                    break;
                case "administrative_area_level_1":
                    self.state.value = val;
                    break;
                case "administrative_area_level_2":
                    self.dictrict.value = val;
                    break;
                case "country":
                    break;
            }
        }
    }
    console.log(textResult.slice(0,textResult.indexOf(", ")));
}

activeAutocomplete.prototype.geolocate = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle(
                { center: geolocation, radius: position.coords.accuracy });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}

NewRealty.prototype.mapView = mapView;


NewRealty.prototype.getLongLat = function (text) {
    return new Promise(function (resolve, reject) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': text }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                // do something with the geocoded result
                //
                console.log([results[0].geometry.location.lat(), results[0].geometry.location.lng()])
                resolve([results[0].geometry.location.lat(), results[0].geometry.location.lng()])
                // results[0].geometry.location.latitude
                // results[0].geometry.location.longitude
            } else {
                reject();
            }
        });
    })

}

function mapView() {
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-location-map-view",
        child: [
            {
                tag: "div",
                class: "pizo-new-realty-location-map-view-content",
                props: {
                    id: "map-View"
                }
            }
        ]
    })
    temp.activeMap = mapView.prototype.activeMap;
    temp.map = temp.activeMap();
    return temp;
}

mapView.prototype.activeMap = function (center = [10.822500, 106.629104], zoom = 16) {
    var map = new google.maps.Map(this, {
        zoom: zoom,
        center: new google.maps.LatLng(center[0], center[1]),
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite']
        }
    });
    this.addMoveMarker = mapView.prototype.addMoveMarker;
    this.transition = mapView.prototype.transition;
    this.moveMarker = mapView.prototype.moveMarker;
    this.smoothZoom = mapView.prototype.smoothZoom;
    this.delay = 10;
    this.numDeltas = 50;
    return map;
}

mapView.prototype.addMoveMarker = function (position) {
    var self = this;
    var marker;
    if (this.currentMarker !== undefined) {
        marker = this.currentMarker;
        self.transition(position).then(function (value) {
            self.map.setCenter(new google.maps.LatLng(position[0], position[1]));
            self.smoothZoom(12, self.map.getZoom());
        })
    } else {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(position[0], position[1]),
            map: self.map,
            title: "Latitude:" + position[0] + " | Longtitude:" + position[1]
        });
        this.currentMarker = marker;
        self.map.setCenter(new google.maps.LatLng(position[0], position[1]));
        self.smoothZoom(12, self.map.getZoom());

        google.maps.event.addListener(self.map, "click", function (event) {
            var result = [event.latLng.lat(), event.latLng.lng()];
            self.transition(result).then(function (value) {
                self.map.setCenter(new google.maps.LatLng(result[0], result[1]));
                self.smoothZoom(12, self.map.getZoom());
            })
        });

    }


    return marker;
}

mapView.prototype.transition = function (result) {
    var position = [this.currentMarker.getPosition().lat(), this.currentMarker.getPosition().lng()];
    console.log(position)
    var deltaLat = (result[0] - position[0]) / this.numDeltas;
    var deltaLng = (result[1] - position[1]) / this.numDeltas;
    return this.moveMarker(position, deltaLat, deltaLng);
}

mapView.prototype.moveMarker = function (position, deltaLat, deltaLng, i = 0) {
    var self = this;
    return new Promise(function (resolve, reject) {
        position[0] += deltaLat;
        position[1] += deltaLng;
        var latlng = new google.maps.LatLng(position[0], position[1]);
        self.currentMarker.setTitle("Latitude:" + position[0] + " | Longtitude:" + position[1]);
        self.currentMarker.setPosition(latlng);
        if (i != self.numDeltas - 1) {
            i++;
            setTimeout(function () {
                resolve(self.moveMarker(position, deltaLat, deltaLng, i));
            }, self.delay);
        } else
            resolve();
    })
}

mapView.prototype.smoothZoom = function (max, cnt) {
    if (cnt >= max) {
        return;
    }
    else {
        var z = google.maps.event.addListener(this, 'zoom_changed', function (event) {
            google.maps.event.removeListener(z);
            smoothZoom(this.map, max, cnt + 1);
        });
        setTimeout(function () { this.setZoom(cnt) }, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
}

NewRealty.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

NewRealty.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

NewRealty.prototype.flushDataToView = function () {
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

NewRealty.prototype.start = function () {

}

function removeAccents(str) {
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ", "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ"    
    ];
    for (var i=0; i<AccentsMap.length; i++) {
      var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    str = str.replace(" ","");
    return str;
  }

export default NewRealty;