import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListState.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { formatDate, getGMT } from '../component/FormatFunction';

import {loadData,updateData} from '../component/ModuleDatabase';

import { tableView, deleteQuestion } from '../component/ModuleView';

import NewState from '../component/NewState';

var _ = Fcore._;
var $ = Fcore.$;

function ListState() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
}

ListState.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(ListState.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
ListState.prototype.constructor = ListState;

ListState.prototype.getView = function () {
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
            placeholder:"Tìm kiếm"
        }
    });
    if(window.mobilecheck())
    {
        allinput.placeholder = "Tìm kiếm"
    }
    this.$view = _({
        tag: 'singlepage',
        class: "pizo-list-realty",
        child: [
            {
                class: 'absol-single-page-header',
                child: [
                    {
                        tag: "span",
                        class: "pizo-body-title-left",
                        props: {
                            innerHTML: "Quản lý Tỉnh/TP"
                        }
                    },
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
                                        self.add();
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
    var tabContainer = _({
        tag:"div",
        class:["pizo-list-realty-main-result-control","drag-zone-bg"],
        child:[
        ]
    })

    var docTypeMemuProps,token,functionX;
    var functionClickMore = function(event, me, index, parent, data, row)
    {
       
        docTypeMemuProps = {
            items: [
                {
                    text: 'Thêm',
                    icon: 'span.mdi.mdi-text-short',
                    value:0,
                },
                {
                    text: 'Sửa',
                    icon: 'span.mdi.mdi-text-short',
                    value:1,
                },
                {
                    text: 'Xóa',
                    icon: 'span.mdi.mdi-text',
                    value:2,
                },
            ]
        };
        token = absol.QuickMenu.show(me, docTypeMemuProps, [3,4], function (menuItem) {
            switch(menuItem.value)
            {
                case 0:
                    self.add(data.original.id,row);
                    break;
                case 1:
                    self.edit(data,parent,index);
                    break;
                case 2:
                    self.delete(data.original,parent,index);
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


    loadData("https://lab.daithangminh.vn/home_co/pizo/php/php/load_states.php").then(function(value){
        loadData("https://lab.daithangminh.vn/home_co/pizo/php/php/load_nations.php").then(function(listParam){
            self.setListParam(listParam);
            var header = [
            { type: "increase", value: "#",style:{minWidth:"50px",width:"50px"}}, 
            {value:'MS',sort:true,style:{minWidth:"50px",width:"50px"}}, 
            {value:'Tên',sort:true,style:{minWidth:"unset"}},
            {value:'Loại',sort:true,style:{minWidth:"unset"}},
            {value:'Quốc gia',sort:true,style:{minWidth:"unset"}},
            {type:"detail", functionClickAll:functionClickMore,icon:"",dragElement : false,style:{width:"30px"}}];
            self.mTable = new tableView(header, self.formatDataRow(value), false, true, 2);
            tabContainer.addChild(self.mTable);
            self.mTable.addInputSearch($('.pizo-list-realty-page-allinput-container input',self.$view));
            self.listParent.updateItemList(listParam);
        });
    });

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

ListState.prototype.setListParam = function(value)
{
    this.checkPosition = [];
    this.listParam = [];
    for(var i  = 0;i<value.length;i++)
    {
        this.checkPosition[value[i].id] = value[i];
        this.listParam[i] = {text:value[i].name,value:value[i].id};
    }
    this.isLoaded = true;
}

ListState.prototype.getDataParam = function()
{
    return this.listParam;
}

ListState.prototype.formatDataRow = function(data)
{
    var temp = [];
    var check = [];
    var k = 0;
    for(var i=0;i<data.length;i++)
    {

        var result = this.getDataRow(data[i]);
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

ListState.prototype.getDataRow = function(data)
{
    var result = [
        {},
        data.id,
        data.name,
        data.type,
        this.checkPosition[parseInt(data.nationid)].name,
        {}
        ]
        result.original = data;
    return result;
}

ListState.prototype.formatDataList = function(data){
    var temp = [{text:"Tất cả",value:0}];
    for(var i = 0;i<data.length;i++)
    {
        temp[i+1] = {text:data[i].name,value:data[i].id};
    }
    return temp;
}

ListState.prototype.searchControlContent = function(){
    var startDay,endDay,startDay1,endDay1;
    var self = this;
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
                    console.log(endDay)
                    endDay.minDateLimit = date;
                }
            }
        }
    );

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
                    console.log(date)
                    startDay.maxDateLimit = date;
                }
            }
        }
    );

    startDay1 = _(
        {
            tag: 'calendar-input',
            data: {
                anchor: 'top',
                value: new Date(new Date().getFullYear(), 0, 1),
                maxDateLimit: new Date()
            },
            on: {
                changed: function (date) {
                    console.log(endDay1)
                    endDay1.minDateLimit = date;
                }
            }
        }
    )

    endDay1 = _(
        {
            tag: 'calendar-input',
            data: {
                anchor: 'top',
                value: new Date(),
                minDateLimit: new Date()
            },
            on: {
                changed: function (date) {
                    console.log(date)
                    startDay1.maxDateLimit = date;
                }
            }
        }
    )

    self.listParent = _( {
        tag:"selectmenu",
        props:{
            enableSearch:true,
            items:[
                {text:"Tất cả",value:0}
            ]
        }
    });

    self.listStatus = _( {
        tag:"selectmenu",
        props:{
            items:[
                {text:"Tất cả",value:0},
                {text:"Đang hoạt động",value:1},
                {text:"Đã bị cấm",value:2},
            ]
        }
    });

    self.listParent.updateItemList = function(value)
    {
        self.listParent.items = self.formatDataList(value);
    }

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
                                class:"pizo-list-realty-main-search-control-row-positions",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-state-ditrict-label",
                                        props:{
                                            innerHTML:"Chức vụ"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-state-ditrict-input",
                                        child:[
                                            self.listParent
                                        ]
                                    }
                                ]

                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-status",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-state-ditrict-label",
                                        props:{
                                            innerHTML:"Trạng thái"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-state-ditrict-input",
                                        child:[
                                            self.listStatus
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
                                            innerHTML:"Ngày tạo"
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
                                class:"pizo-list-realty-main-search-control-row-phone",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-phone-label",
                                        props:{
                                            innerHTML:"Ngày cập nhật"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-date-input",
                                        child:[
                                            startDay1,
                                            endDay1
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
    content.timestart = startDay;
    content.timeend = endDay;

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
       
    }

  
    return temp;
}

ListState.prototype.getDataCurrent = function()
{
    return this.getDataChild(this.mTable.data);
}



ListState.prototype.getDataChild = function(arr)
{
    var self = this;
    var result = [];
    for(var i = 0;i<arr.length;i++)
    {
        result.push(arr[i].original);
        if(arr[i].child.length!==0)
        result = result.concat(self.getDataChild(arr[i].child));
    }
    return result;
}

ListState.prototype.add = function(parent_id = 0,row)
{

    if(!this.isLoaded)
        return;
    var self = this;
    var mNewState = new NewState(undefined,parent_id);
    mNewState.attach(self.parent);
    var frameview = mNewState.getView(self.getDataParam());
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.addDB(mNewState,row);
}

ListState.prototype.addDB = function(mNewState,row ){
    var self = this;
    mNewState.promiseAddDB.then(function(value){
        var phpFile = "https://lab.daithangminh.vn/home_co/pizo/php/php/add_account.php";
        if(self.phpUpdateContent)
        phpFile = self.phpUpdateContent;
        updateData(phpFile,value).then(function(result){
            console.log(result)
            value.id = result;
            self.addView(value,row);
        })
        mNewState.promiseAddDB = undefined;
        setTimeout(function(){
            if(mNewState.promiseAddDB!==undefined)
            self.addDB(mNewState);
        },10);
    })
}

ListState.prototype.addView = function(value,parent){
    value.created = getGMT();
    value.modified = getGMT();
    var result = this.getDataRow(value);
    console.log(result)
    var element = this.mTable;
    element.insertRow(result);
}

ListState.prototype.edit = function(data,parent,index)
{
    if(!this.isLoaded)
        return;
    var self = this;
    var mNewState = new NewState(data);
    mNewState.attach(self.parent);
    var frameview = mNewState.getView(self.getDataParam());
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDB(mNewState,data,parent,index);
}

ListState.prototype.editDB = function(mNewState,data,parent,index){
    var self = this;
    mNewState.promiseEditDB.then(function(value){
        var phpFile = "https://lab.daithangminh.vn/home_co/pizo/php/php/update_account.php";
        if(self.phpUpdateContent)
        phpFile = self.phpUpdateContent;
        value.id = data.original.id;
        updateData(phpFile,value).then(function(result){
            self.editView(value,data,parent,index);
        })
        mNewState.promiseEditDB = undefined;
        setTimeout(function(){
        if(mNewState.promiseEditDB!==undefined)
            self.editDB(mNewState,data,parent,index);
        },10);
    })
}

ListState.prototype.editView = function(value,data,parent,index){
    value.created = data.original.created;
    value.modified = getGMT();
    var data = this.getDataRow(value);

    var indexOF = index,element = parent;
    
    element.updateRow(data,indexOF,true);
}

ListState.prototype.delete = function(data,parent,index)
{
    if(!this.isLoaded)
        return;
    console.log(data)
    var self = this;
    var deleteItem = deleteQuestion("Xoá danh mục","Bạn có chắc muốn xóa :"+data.name);
    this.$view.addChild(deleteItem);
    deleteItem.promiseComfirm.then(function(){
        self.deleteDB(data,parent,index);
    })
}

ListState.prototype.deleteView = function(parent,index){
    var self = this;
    var bodyTable = parent.bodyTable;
    parent.dropRow(index).then(function(){
    });
}

ListState.prototype.deleteDB = function(data,parent,index){
    var self = this;
    var phpFile = "https://lab.daithangminh.vn/home_co/pizo/php/php/delete_account.php";
    if(self.phpDeleteContent)
    phpFile = self.phpUpdateContent;
    updateData(phpFile,data).then(function(value){
        self.deleteView(parent,index);
    })
}

ListState.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

ListState.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

ListState.prototype.flushDataToView = function () {
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

ListState.prototype.start = function () {

}

export default ListState;