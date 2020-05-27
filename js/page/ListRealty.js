import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListRealty.css"
import R from '../R';
import Fcore from '../dom/Fcore';

import { tableView, ModuleView} from '../component/ModuleView';
import NewRealty from '../component/NewRealty';

import {loadData,updateData} from '../component/ModuleDatabase';

var _ = Fcore._;
var $ = Fcore.$;

function ListRealty() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.ModuleView = new ModuleView();
}

ListRealty.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(ListRealty.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
ListRealty.prototype.constructor = ListRealty;

ListRealty.prototype.getView = function () {
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
            placeholder:"Tìm theo mã, tên, địa chỉ bất động sản"
        }
    });
    if(window.mobilecheck())
    {
        allinput.placeholder = "Tìm bất động sản"
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
                                        var mNewRealty = new NewRealty();
                                        mNewRealty.attach(self.parent);
                                        mNewRealty.setDataListAccount(self.listAccoutData);
                                        var frameview = mNewRealty.getView();
                                        self.parent.body.addChild(frameview);
                                        self.parent.body.activeFrame(frameview);
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
    var docTypeMemuProps,token,functionX;
    var functionClickMore = function(event, me, index, parent, data, row)
    {
       
        docTypeMemuProps = {
            items: [
                {
                    text: 'Sửa',
                    icon: 'span.mdi.mdi-text-short',
                    value:0,
                },
                {
                    text: 'Xóa',
                    icon: 'span.mdi.mdi-text',
                    value:1,
                },
            ]
        };
        token = absol.QuickMenu.show(me, docTypeMemuProps, [3,4], function (menuItem) {
            switch(menuItem.value)
            {
                case 0:
                    var mNewRealty = new NewRealty();
                    mNewRealty.attach(self.parent);
                    
                    var frameview = mNewRealty.getView();
                    self.parent.body.addChild(frameview);
                    self.parent.body.activeFrame(frameview);
                    break;
                case 1:
                    break;
            }
        });

        functionX = function(token){
            return function(){
                var x = function(event){
                    absol.QuickMenu.close(token);
                    document.body.removeEventListener("click",x);
                }
                document.body.addEventListener("click",x)
            }
        }(token);

        setTimeout(functionX,10)
    }

    var tabContainer = _({
        tag:"div",
        class:["pizo-list-realty-main-result-control","drag-zone-bg"],
        child:[
            
        ]
    })

    loadData("https://lab.daithangminh.vn/home_co/pizo/php/php/load_activehomes.php").then(function(value){
        
        var header = [{ type: "dragzone" , dragElement : false},{ type: "increase", value: "#"}, {value:'MS',sort:true}, 'Số nhà', {value: 'Tên đường' }, { value:'Phường/Xã' }, { value: 'Quận/Huyện' }, { value: 'Tỉnh/TP' }, { value: 'Ghi chú', sort: true }, {value: 'Ngang', sort: true }, {value: 'Dài',sort:true}, {value: 'DT' }, { value: 'Kết cấu' }, { value: 'Hướng'}, 'Giá', { value: 'Giá m²' }, { value: 'Hiện trạng'}, {value:'Ngày tạo'},{type:"detail", functionClickAll:functionClickMore,icon:"",dragElement : false}];
        self.mTable = new tableView(header, self.formatDataRow(value), false, true, 1);
        tabContainer.addChild(self.mTable);
        self.mTable.addInputSearch($('.pizo-list-realty-page-allinput-container input',self.$view));
    });

    loadData("https://lab.daithangminh.vn/home_co/pizo/php/php/load_accounts.php").then(function(value){
        self.formatDataRowAccount(value);
    })

  
    this.searchControl = this.searchControlContent();

    this.$view.addChild(_({
            tag:"div",
            class:["pizo-list-realty-main"],
            child:[
                this.searchControl,
                tabContainer
            ]   
        })
        );
    return this.$view;
}


ListRealty.prototype.formatDataRowAccount = function(data){
    var checkAccount = [];
    this.listAccoutData = data;
}

ListRealty.prototype.formatDataRow = function(data)
{
    var temp = [];
    var check = [];
    var k = 0;
    var checkElement;
    for(var i=0;i<data.length;i++)
    {
        checkElement = parseInt(data[i].active)? _({
            tag:"div",
            class:"tick-element"
        }):_({
            tag:"div",
            class:"cross-element"
        })
        var result = [{value:"",style:{maxWidth:"21px"}},{
            value:data[i].title,
            element:_({
                tag:"div",
                child:[
                    {
                        tag:"span",
                        class:"title-label",
                        props:{
                            innerHTML:data[i].title
                        }
                    },
                    {
                        tag:"span",
                        class:"alias-label",
                        props:{
                            innerHTML:" (Alias :"+data[i].alias+")"
                        }
                    }
                ]
            }),
        },
        {value:data[i].active,
            element:checkElement
            ,style:{maxWidth:"21px"}},
        {value:"",style:{maxWidth:"21px"}}
    ];
        result.original = data[i];
        if(check[data[i].parent_id]!==undefined)
        {
            if(check[data[i].parent_id].child === undefined)
            check[data[i].parent_id].child = [];
            check[data[i].parent_id].child.push(result);
        }
        else
        temp[k++] = result;
        check[data[i].id] = result;
    }
    
    return temp;
}


ListRealty.prototype.searchControlContent = function(){
    var startDay,endDay;

    startDay = _(
        {
            tag: 'calendar-input',
            data: {
                anchor: 'top',
                value: new Date(new Date().getFullYear(), 0, 1),
                maxDateLimit: new Date()
            },
            on: {
                changed: function (date) {
                    
                    endDay.minDateLimit = date;
                }
            }
        }
    )

    endDay = _(
        {
            tag: 'calendar-input',
            data: {
                anchor: 'top',
                value: new Date(),
                minDateLimit: new Date()
            },
            on: {
                changed: function (date) {
                    
                    startDay.maxDateLimit = date;
                }
            }
        }
    )
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
                                class:"pizo-list-realty-main-search-control-row-date",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-date-label",
                                        props:{
                                            innerHTML:"Thời gian"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-date-input",
                                        child:[
                                            startDay,
                                            endDay
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-price",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-price-label",
                                        props:{
                                            innerHTML:"Khoảng giá"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-price-input",
                                        child:[
                                            {
                                                tag:"input",
                                                class:"pizo-list-realty-main-search-control-row-price-input-low",
                                                props:{
                                                    type:"number",
                                                    autocomplete:"off",
                                                    placeholder:"đ Từ",
                                                }
                                            },
                                            {
                                                tag:"input",
                                                class:"pizo-list-realty-main-search-control-row-price-input-high",
                                                props:{
                                                    type:"number",
                                                    autocomplete:"off",
                                                    placeholder:"đ Đến",
                                                }
                                            },
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-phone",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-phone-label",
                                        props:{
                                            innerHTML:"Số điện thoại"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-phone-input",
                                        child:[
                                            {
                                                tag:"input",
                                                props:{
                                                    type:"number",
                                                    autocomplete:"off"
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
                    },
                    {
                        tag:"div",
                        class:"pizo-list-realty-main-search-control-row",
                        child:[
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-MS",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-MS-label",
                                        props:{
                                            innerHTML:"Mã số"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-MS-input",
                                        child:[
                                            {
                                                tag:"input",
                                                props:{
                                                    type:"number",
                                                    autocomplete:"off"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-SN",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-SN-label",
                                        props:{
                                            innerHTML:"Số nhà"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-SN-input",
                                        child:[
                                            {
                                                tag:"input",
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-TD",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-TD-label",
                                        props:{
                                            innerHTML:"Tên đường"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-TD-input",
                                        child:[
                                            {
                                                tag:"input",
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-PX",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-PX-label",
                                        props:{
                                            innerHTML:"Phường/Xã"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-PX-input",
                                        child:[
                                            {
                                                tag:"input",
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-QH",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-QH-label",
                                        props:{
                                            innerHTML:"Quận huyện"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-QH-input",
                                        child:[
                                            {
                                                tag:"input",
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-TT",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-TT-label",
                                        props:{
                                            innerHTML:"Tỉnh/TP"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-TT-input",
                                        child:[
                                            {
                                                tag:"input"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-HT",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-HT-label",
                                        props:{
                                            innerHTML:"Tình trạng"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-HT-input",
                                        child:[
                                            {
                                                tag:"selectmenu",
                                                props:{
                                                    items:[
                                                        {text:"Tất cả",value:0},
                                                        {text:"Còn bán",value:1},
                                                        {text:"Đã bán",value:2},
                                                        {text:"Ngưng bán",value:3},
                                                    ]
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
    content.timestart = startDay;
    content.timeend = endDay;
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
        content.timestart = new Date();
        content.timeend = new Date();
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

ListRealty.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

ListRealty.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

ListRealty.prototype.flushDataToView = function () {
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

ListRealty.prototype.start = function () {

}

export default ListRealty;