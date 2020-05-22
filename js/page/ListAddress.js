import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListAddress.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { formatDate, getGMT } from '../component/FormatFunction';

import {loadData,updateData} from '../component/ModuleDatabase';

import { tableView, deleteQuestion } from '../component/ModuleView';

import NewPosition from '../component/NewPosition';

var _ = Fcore._;
var $ = Fcore.$;

function ListAddress() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
}

ListAddress.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(ListAddress.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
ListAddress.prototype.constructor = ListAddress;

ListAddress.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;
    var input = _({
        tag:"input",
        class:"quantumWizTextinputPaperinputInput",
        on:{
            change:function(){
                self.mTable.updatePagination(this.value);
            }
        },
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
                            innerHTML: "Quản lý chức vụ"
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


    loadData("https://lab.daithangminh.vn/home_co/pizo/php/php/load_positions.php").then(function(value){
        
        var header = [{ type: "increase", value: "#",style:{minWidth:"50px",width:"50px"}}, {value:'MS',sort:true,style:{minWidth:"150px",width:"150px"}}, {value:'Tên',sort:true,style:{minWidth:"unset"}},{value: 'Ngày tạo',sort:true,style:{minWidth:"250px",width:"250px"}}, { value:'Ngày cập nhật', sort:true,style:{minWidth:"250px",width:"250px"} },{type:"detail", functionClickAll:functionClickMore,icon:"",dragElement : false,style:{width:"30px"}}];
        
        self.mTable = new tableView(header, self.formatDataRow(value), false, true, 2);
        tabContainer.addChild(self.mTable);
        self.mTable.addInputSearch($('.pizo-list-realty-page-allinput-container input',self.$view));
        self.listParent.updateItemList();
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

ListAddress.prototype.formatDataRow = function(data)
{
    var temp = [];
    var check = [];
    var k = 0;
    var checkElement;
    for(var i=0;i<data.length;i++)
    {
        var result = [
        {},
        data[i].id,
        data[i].name,
        formatDate(data[i].created,true,true,true,true,true),
        formatDate(data[i].modified,true,true,true,true,true),
        {}
        ]
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

ListAddress.prototype.formatDataList = function(data){
    var temp = [{text:"Chức vụ cao nhất",value:0}];
    for(var i = 0;i<data.length;i++)
    {
        temp[i+1] = {text:data[i].name,value:data[i].id};
    }
    return temp;
}

ListAddress.prototype.searchControlContent = function(){
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
                {text:"Chức vụ cao nhất",value:0}
            ]
        }
    });

    self.listParent.updateItemList = function()
    {
        self.listParent.items = self.formatDataList(self.getDataCurrent());
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
                                class:"pizo-list-realty-main-search-control-row-state-district",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-state-district-label",
                                        props:{
                                            innerHTML:"Chức vụ cha"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-state-district-input",
                                        child:[
                                            self.listParent
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

ListAddress.prototype.getDataCurrent = function()
{
    return this.getDataChild(this.mTable.data);
}



ListAddress.prototype.getDataChild = function(arr)
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

ListAddress.prototype.add = function(parent_id = 0,row)
{
    var self = this;
    var mNewPosition = new NewPosition(undefined,parent_id);
    mNewPosition.attach(self.parent);
    var frameview = mNewPosition.getView(self.getDataCurrent());
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.addDB(mNewPosition,row);
}

ListAddress.prototype.addDB = function(mNewPosition,row ){
    var self = this;
    mNewPosition.promiseAddDB.then(function(value){
        var phpFile = "https://lab.daithangminh.vn/home_co/pizo/php/php/add_position.php";
        if(self.phpUpdateContent)
        phpFile = self.phpUpdateContent;
        updateData(phpFile,value).then(function(result){
            value.id = result;
            self.addView(value,row);
        })
        mNewPosition.promiseAddDB = undefined;
        setTimeout(function(){
            if(mNewPosition.promiseAddDB!==undefined)
            self.addDB(mNewPosition);
        },10);
    })
}

ListAddress.prototype.addView = function(value,parent){
    value.created = getGMT();
    value.modified = getGMT();
    var result = [
        {},
        value.id,
        value.name,
        formatDate(value.created,true,true,true,true,true),
        formatDate(value.modified,true,true,true,true,true),
        {}
    ]
    result.original = value;

    var element = parent;
        if(value.parent_id == 0)
        element = this.mTable;
        else
        for(var i = 0;i<parent.bodyTable.childNodes.length;i++)
        {
            if(parent.bodyTable.childNodes[i].data.original.id==value.parent_id){
                element = parent.bodyTable.childNodes[i];
                break;
            }
         }
    element.insertRow(result);
}

ListAddress.prototype.edit = function(data,parent,index)
{
    var self = this;
    var mNewPosition = new NewPosition(data);
    mNewPosition.attach(self.parent);
    var frameview = mNewPosition.getView(self.getDataCurrent());
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDB(mNewPosition,data,parent,index);
}

ListAddress.prototype.editDB = function(mNewPosition,data,parent,index){
    var self = this;
    mNewPosition.promiseEditDB.then(function(value){
        var phpFile = "https://lab.daithangminh.vn/home_co/pizo/php/php/update_position.php";
        if(self.phpUpdateContent)
        phpFile = self.phpUpdateContent;
        value.id = data.original.id;
        updateData(phpFile,value).then(function(result){
            self.editView(value,data,parent,index);
        })
        mNewPosition.promiseEditDB = undefined;
        setTimeout(function(){
        if(mNewPosition.promiseEditDB!==undefined)
            self.editDB(mNewPosition,data,parent,index);
        },10);
    })
}

ListAddress.prototype.editView = function(value,data,parent,index){
    var isChangeView=false;
    value.modified = getGMT();
    data.original.name = value.name;
    data.original.modified = formatDate(value.modified);
    if(data.original.parent_id!=value.parent_id){
        isChangeView = true;
    }
    data.original.parent_id = value.parent_id;


    data[2] = value.name;
    data[4] = value.modified;


    var indexOF = index,element = parent;
    
    if(isChangeView===true)
    {
        var element;
        if(value.parent_id == 0)
        element = parent.bodyTable.parentNode;
        else
        for(var i = 0;i<parent.bodyTable.childNodes.length;i++)
        {
            if(parent.bodyTable.childNodes[i].data.original.id==value.parent_id){
                element = parent.bodyTable.childNodes[i];
                break;
            }
        }
        parent.changeParent(index,element);
    }
    element.updateRow(data,indexOF,true);
    this.listParent.updateItemList();
}

ListAddress.prototype.delete = function(data,parent,index)
{
    
    var self = this;
    var deleteItem = deleteQuestion("Xoá danh mục","Bạn có chắc muốn xóa :"+data.name);
    this.$view.addChild(deleteItem);
    deleteItem.promiseComfirm.then(function(){
        self.deleteDB(data,parent,index);
    })
}

ListAddress.prototype.deleteView = function(parent,index){
    var self = this;
    var bodyTable = parent.bodyTable;
    parent.dropRow(index).then(function(){
        self.listParent.updateItemList();
    });
}

ListAddress.prototype.deleteDB = function(data,parent,index){
    var self = this;
    var phpFile = "https://lab.daithangminh.vn/home_co/pizo/php/php/delete_position.php";
    if(self.phpDeleteContent)
    phpFile = self.phpUpdateContent;
    updateData(phpFile,data).then(function(value){
        self.deleteView(parent,index);
    })
}

ListAddress.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

ListAddress.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

ListAddress.prototype.flushDataToView = function () {
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

ListAddress.prototype.start = function () {

}

export default ListAddress;