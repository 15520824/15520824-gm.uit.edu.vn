import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListStreet.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { formatDate } from '../component/FormatFunction';

import { input_choicenumber,tableView, ModuleView} from '../component/ModuleView';
import NewRealty from '../component/NewRealty';

var _ = Fcore._;
var $ = Fcore.$;

function ListStreet() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.ModuleView = new ModuleView();
    
    this.NewRealty = new NewRealty();
    this.NewRealty.attach(this);
}

ListStreet.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(ListStreet.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
ListStreet.prototype.constructor = ListStreet;

ListStreet.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;
    var input = _({
        tag:"input",
        class:"quantumWizTextinputPaperinputInput",
        props:{
            type:"number",
            autocomplete:"off",
            min:1,
            max:200,
            step:1,
            value:50
        }
    })
    var allinput = _({
        tag:"input",
        class:"pizo-list-realty-page-allinput-input",
        props:{
            placeholder:"Tên đường"
        }
    });
    if(window.mobilecheck())
    {
        allinput.placeholder = "Tên đường"
    }
    this.$view = _({
        tag: 'singlepage',
        class: "pizo-list-realty",
        child: [
            {
                class: 'absol-single-page-header',
                child: [
                    {
                        tag: "div",
                        class: "pizo-list-realty-button",
                        child: [
                            {
                                tag: "span",
                                class: "pizo-body-title-left",
                                props: {
                                    innerHTML: "Quản lý Tên đường"
                                }
                            },
                            {
                                tag: "button",
                                class: ["pizo-list-realty-button-quit","pizo-list-realty-button-element"],
                                on: {
                                    click: function (evt) {
                                        self.$view.selfRemove();
                                        var arr = self.parent.body.getAllChild();
                                        self.parent.body.activeFrame(arr[arr.length - 1]);
                                    }
                                },
                                child: [
                                '<span>' + "Đóng" + '</span>'
                                ]
                            },
                            {
                                tag: "button",
                                class: ["pizo-list-realty-button-add","pizo-list-realty-button-element"],
                                on: {
                                    click: function (evt) {
                                        var frameAdd = self.NewRealty.getView();
                                        self.parent.body.addChild(frameAdd);
                                        self.parent.body.activeFrame(frameAdd);
                                        self.NewRealty.setContainer(self.parent);
                                    }
                                },
                                child: [
                                '<span>' + "Thêm" + '</span>'
                                ]
                            }
                        ]
                    },
                    {
                        tag:"div",
                        class:"pizo-list-realty-page-allinput",
                        child:[
                            {
                                tag:"div",
                                class:"pizo-list-realty-page-allinput-container",
                                child:[
                                    allinput,
                                    {
                                        tag:"button",
                                        class:"pizo-list-realty-page-allinput-search",
                                        child:[
                                            {
                                                tag: 'i',
                                                class: 'material-icons',
                                                props: {
                                                    innerHTML: 'search'
                                                },
                                            },
                                        ]
                                    },
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-page-allinput-filter",
                                on:{
                                    click:function(event)
                                    {
                                        self.searchControl.show();
                                    }
                                },
                                child:[
                                    {
                                        tag: 'filter-ico',
                                    },
                                    {
                                        tag:"span",
                                        class:"navbar-search__filter-text",
                                        props:{
                                            innerHTML:"Lọc"
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        tag: "div",
                        class: "pizo-list-realty-page-number-line",
                        child: [
                            input,
                            {
                                tag: "span",
                                class:
                                    "freebirdFormeditorViewAssessmentWidgetsPointsLabel",
                                props: {
                                    innerHTML: "Số dòng"
                                }
                            }
                        ]
                    }
                ]
            },
        ]
    });
    var tableViewX;
    var header = [{ type: "dragzone" , dragElement : false},{ type: "increase", value: "#"}, {value:'ID',sort:true}, {value:'Tên',sort:true}, {value:'Phường/Xã', sort:true},{value:'Quận/Huyện', sort:true},{value:'Tỉnh/TP', sort:true}, {value: 'Ngày tạo',sort:true }, { value:'Ngày cập nhật', sort:true }, {type:"detail",dragElement : false}];
    var dataTable = [
        [{},{},'1282','Lê Sao','Phường Tân Định','Quận 1','Thành phố Hồ Chí Minh', formatDate("2020-04-21T04:25:21.769Z",true,true,true,true,true),formatDate("2020-04-21T04:25:21.769Z",true,true,true,true,true),{}],
        [{},{},'1283','Huỳnh Đình Hai','Phường Tân Định','Quận 1','Thành phố Hồ Chí Minh', formatDate("2020-04-21T04:25:21.769Z",true,true,true,true,true),formatDate("2020-04-21T04:25:21.769Z",true,true,true,true,true),{}],
        [{},{},'1284','Nguyễn Văn Mai','Phường Tân Định','Quận 1','Thành phố Hồ Chí Minh', formatDate("2020-04-21T04:25:21.769Z",true,true,true,true,true),formatDate("2020-04-21T04:25:21.769Z",true,true,true,true,true),{}],
        [{},{},'1285','3 Tháng 2','Phường Tân Định','Quận 1','Thành phố Hồ Chí Minh', formatDate("2020-04-21T04:25:21.769Z",true,true,true,true,true),formatDate("2020-04-21T04:25:21.769Z",true,true,true,true,true),{}]
    ];

    tableViewX = tableView(header, dataTable,true,true,2);
    tableViewX.addInputSearch($('.pizo-list-realty-page-allinput-container input',this.$view))
    this.searchControl = this.searchControlContent();

    this.$view.addChild(_({
            tag:"div",
            class:["pizo-list-realty-main"],
            child:[
                this.searchControl,
                {
                    tag:"div",
                    class:["pizo-list-realty-main-result-control","drag-zone-bg"],
                    child:[
                        tableViewX
                    ]
                }
            ]   
        })
        );
    return this.$view;
}

ListStreet.prototype.searchControlContent = function(){
    var content = _({
        tag:"div",
        class:"pizo-list-realty-main-search-control-container",
        on:{
            click:function(event)
            {
                event.stopPropagation();
            }
        },
        child:[
            {
                tag:"div",
                class:"pizo-list-realty-main-search-control-container-scroller",
                child:[
                    {
                        tag:"div",
                        class:"pizo-list-realty-main-search-control-row",
                        child:[
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-state-street",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-state-street-label",
                                        props:{
                                            innerHTML:"Tỉnh/TP"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-state-street-input",
                                        child:[
                                            {
                                                tag:"selectmenu",
                                                props:{
                                                    enableSearch:true,
                                                    items:[
                                                        {text:'Thành phố Hồ Chí Minh',id:79},
                                                        {text:'Thủ đô Hà Nội',id:80}
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]

                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-ditrict-street",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-ditrict-street-label",
                                        props:{
                                            innerHTML:"Quận/Huyện"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-ditrict-street-input",
                                        child:[
                                            {
                                                tag:"selectmenu",
                                                props:{
                                                    enableSearch:true,
                                                    items:[
                                                        {text:'Quận 1',id:79},
                                                        {text:'Quận Bình Thạnh',id:80},
                                                        {text:'Quận Tân Bình',id:81}
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]

                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-ward-street",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-ward-street-label",
                                        props:{
                                            innerHTML:"Phường/Xã"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-ward-street-input",
                                        child:[
                                            {
                                                tag:"selectmenu",
                                                props:{
                                                    enableSearch:true,
                                                    items:[
                                                        {text:'Phường Tân Định',id:79},
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                ]

                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-button",
                                child:[
                                    {
                                        tag: "button",
                                        class: ["pizo-list-realty-button-apply","pizo-list-realty-button-element"],
                                        on: {
                                            click: function (evt) {
        
                                            }
                                        },
                                        child: [
                                        '<span>' + "Áp dụng" + '</span>'
                                        ]
                                    },
                                    {
                                        tag: "button",
                                        class: ["pizo-list-realty-button-deleteall","pizo-list-realty-button-element"],
                                        on: {
                                            click: function (evt) {
                                                temp.reset();
                                            }
                                        },
                                        child: [
                                        '<span>' + "Thiết lập lại" + '</span>'
                                        ]
                                    }
                                ]
                            },
                        ]
                    }
                ]
            }
        ]
    });
    var temp = _({
        tag:"div",
        class:"pizo-list-realty-main-search-control",
        on:{
            click:function(event)
            {
                this.hide();
            }
        },
        child:[
            content
        ]
    })

    temp.content = content;
    content.lowprice = $('input.pizo-list-realty-main-search-control-row-price-input-low',content);
    content.highprice = $('input.pizo-list-realty-main-search-control-row-price-input-high',content);
    content.phone = $('.pizo-list-realty-main-search-control-row-phone-input input',content);
    content.MS = $('.pizo-list-realty-main-search-control-row-MS-input input',content);
    content.SN = $('.pizo-list-realty-main-search-control-row-SN input',content);
    content.TD = $('.pizo-list-realty-main-search-control-row-TD input',content);
    content.PX = $('.pizo-list-realty-main-search-control-row-PX input',content);
    content.QH = $('.pizo-list-realty-main-search-control-row-QH input',content);
    content.HT = $('.pizo-list-realty-main-search-control-row-HT input',content);

    temp.show = function()
    {
        if(!temp.classList.contains("showTranslate"))
        temp.classList.add("showTranslate");
    }
    temp.hide = function()
    {
        if(!content.classList.contains("hideTranslate"))
            content.classList.add("hideTranslate");
        var eventEnd = function(){
            if(temp.classList.contains("showTranslate"))
            temp.classList.remove("showTranslate");
            content.classList.remove("hideTranslate");
            content.removeEventListener("webkitTransitionEnd",eventEnd);
            content.removeEventListener("transitionend",eventEnd);
        };
        // Code for Safari 3.1 to 6.0
        content.addEventListener("webkitTransitionEnd", eventEnd);

        // Standard syntax
        content.addEventListener("transitionend", eventEnd);
    }
    temp.apply = function()
    {

    }
    temp.reset = function()
    {
        content.lowprice.value = "";
        content.highprice.value = "";
        content.phone.value = "";
        content.MS.value = "";
        content.SN.value = "";
        content.TD.value = "";
        content.PX.value = "";
        content.QH.value = "";
        content.TT.value = "";
        content.HT.value = 0;
    }

  
    return temp;
}

ListStreet.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

ListStreet.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

ListStreet.prototype.flushDataToView = function () {
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

ListStreet.prototype.start = function () {

}

export default ListStreet;