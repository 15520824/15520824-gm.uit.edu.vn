import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListWard.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { formatDate, getGMT } from '../component/FormatFunction';

import moduleDatabase from '../component/ModuleDatabase';

import { tableView, deleteQuestion } from '../component/ModuleView';

import NewWard from '../component/NewWard';

var _ = Fcore._;
var $ = Fcore.$;

function ListWard() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
}

ListWard.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(ListWard.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
ListWard.prototype.constructor = ListWard;

ListWard.prototype.getView = function () {
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
                            innerHTML: "Quản lý Phường/Xã"
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
        class:["pizo-list-realty-main-result-control","drag-zone-bg","no-animation"],
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


    moduleDatabase.getModule("wards").load().then(function(value){
        moduleDatabase.getModule("districts").load().then(function(listWard){
            moduleDatabase.getModule("states").load().then(function(listState){
            self.setListParamState(listState);
            self.listStateElement.items = self.listState;
            self.setListParamWard(listWard);
            self.listWardElement.items = self.listWard;

            var header = [
            { type: "increase", value: "#",style:{minWidth:"50px",width:"50px"}}, 
            {value:'MS',sort:true,style:{minWidth:"50px",width:"50px"}}, 
            {value:'Tên',sort:true,style:{minWidth:"unset"}},
            {value:'Loại',sort:true,style:{minWidth:"200px",width:"200px"}},
            {value:'Quận/Huyện',sort:true,style:{minWidth:"200px",width:"200px"}},
            {value:'Tỉnh/Thành phố',sort:true,style:{minWidth:"200px",width:"200px"}},
            {type:"detail", functionClickAll:functionClickMore,icon:"",dragElement : false,style:{width:"30px"}}];
            self.mTable = new tableView(header, self.formatDataRow(value), false, true, 2);
            tabContainer.addChild(self.mTable);
            self.mTable.addInputSearch($('.pizo-list-realty-page-allinput-container input',self.$view),2);
            self.mTable.addFilter(self.listWardElement,4);
            self.mTable.addFilter(self.listStateElement,5);
            });
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

ListWard.prototype.setListParamWard = function(value)
{
    this.checkWard = moduleDatabase.getModule("districts").getLibary("id");

    this.checkStateWard = moduleDatabase.getModule("districts").getLibary("stateid",function(data){
        return {text:data.name,value:data.name+"_"+data.id}
    },true);
    this.listWard = [{text:"Tất cả",value:0}].concat(moduleDatabase.getModule("districts").getList("name",["name","id"]));
}

ListWard.prototype.setListParamState = function()
{
    this.checkState = moduleDatabase.getModule("states").getLibary("id");
    this.listState = [{text:"Tất cả",value:0}].concat(moduleDatabase.getModule("states").getList("name",["name","id"]));
    this.isLoaded = true;
}

ListWard.prototype.getDataParam = function()
{
    return this.listParam;
}

ListWard.prototype.formatDataRow = function(data)
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

ListWard.prototype.getDataRow = function(data)
{
    var result = [
        {},
        data.id,
        data.name,
        data.type,
        {value:this.checkWard[parseInt(data.districtid)].name+"_"+data.districtid,element:_({text:this.checkWard[parseInt(data.districtid)].type+" "+this.checkWard[parseInt(data.districtid)].name})},
        {value:this.checkState[parseInt(this.checkWard[parseInt(data.districtid)].stateid)].name+"_"+this.checkWard[parseInt(data.districtid)].stateid,element:_({text:this.checkState[parseInt(this.checkWard[parseInt(data.districtid)].stateid)].type+" "+this.checkState[parseInt(this.checkWard[parseInt(data.districtid)].stateid)].name})},
        {}
        ]
        result.original = data;
    return result;
}

ListWard.prototype.formatDataList = function(data){
    var temp = [{text:"Tất cả",value:0}];
    for(var i = 0;i<data.length;i++)
    {
        temp[i+1] = {text:data[i].name,value:data[i].id};
    }
    return temp;
}
ListWard.prototype.searchControlContent = function(){
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

    self.listStateElement = _({
        tag:"selectmenu",
        props:{
            enableSearch:true,
            items:[{text:"Tất cả",value:0}]
        },
        on:{
            change:function(event){
                if(this.value == 0){
                    self.listWardElement.items = self.listWard;
                }
                else{
                    self.listWardElement.items = [{text:"Tất cả",value:0}].concat(self.checkStateWard[this.value.slice(this.value.lastIndexOf("_")+1)]);
                    self.listWardElement.value = 0;
                    self.listWardElement.emit('change');
                }
            }
        }
    });
    self.listStateElement.updateItemList = function(value){
        self.listStateElement.items = self.formatDataList(value);
    }
    self.listWardElement = _({
        tag:"selectmenu",
        props:{
            enableSearch:true,
            items:[{text:"Tất cả",value:0}]
        },
        on:{
            change:function(event){
                if(this.value  !== 0){
                    var checkid = parseInt(self.checkState[self.checkWard[this.value.slice(this.value.lastIndexOf("_")+1)].stateid].id);
                    if(self.listStateElement.value!=checkid)
                        self.listStateElement.value = checkid;
                }
               
            }
        }
    });
    self.listWardElement.updateItemList = function(value){
        self.listWardElement.items = self.formatDataList(value);
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
                                class:"pizo-list-realty-main-search-control-row-state-ward",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-state-ward-label",
                                        props:{
                                            innerHTML:"Tỉnh/TP"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-state-ward-input",
                                        child:[
                                            self.listStateElement
                                        ]
                                    }
                                ]

                            },
                            {
                                tag:"div",
                                class:"pizo-list-realty-main-search-control-row-district-ward",
                                child:[
                                    {
                                        tag:"span",
                                        class:"pizo-list-realty-main-search-control-row-district-ward-label",
                                        props:{
                                            innerHTML:"Quận/Huyện"
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:"pizo-list-realty-main-search-control-row-district-ward-input",
                                        child:[
                                            self.listWardElement
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


ListWard.prototype.getDataCurrent = function()
{
    return this.getDataChild(this.mTable.data);
}



ListWard.prototype.getDataChild = function(arr)
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

ListWard.prototype.add = function(parent_id = 0,row)
{

    if(!this.isLoaded)
        return;
    var self = this;
    var mNewWard = new NewWard(undefined,parent_id);
    mNewWard.attach(self.parent);
    var frameview = mNewWard.getView(self.getDataParam());
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.addDB(mNewWard,row);
}

ListWard.prototype.addDB = function(mNewWard,row ){
    var self = this;
    mNewWard.promiseAddDB.then(function(value){
        var phpFile = moduleDatabase.addStatesPHP;
        if(self.phpUpdateContent)
        phpFile = self.phpUpdateContent;
        moduleDatabase.updateData(phpFile,value).then(function(result){
            
            value.id = result;
            self.addView(value,row);
        })
        mNewWard.promiseAddDB = undefined;
        setTimeout(function(){
            if(mNewWard.promiseAddDB!==undefined)
            self.addDB(mNewWard);
        },10);
    })
}

ListWard.prototype.addView = function(value,parent){
    var result = this.getDataRow(value);
    
    var element = this.mTable;
    element.insertRow(result);
}

ListWard.prototype.edit = function(data,parent,index)
{
    if(!this.isLoaded)
        return;
    var self = this;
    var mNewWard = new NewWard(data);
    mNewWard.attach(self.parent);
    var frameview = mNewWard.getView(self.getDataParam());
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDB(mNewWard,data,parent,index);
}

ListWard.prototype.editDB = function(mNewWard,data,parent,index){
    var self = this;
    mNewWard.promiseEditDB.then(function(value){
        var phpFile = moduleDatabase.updateStatesPHP;
        if(self.phpUpdateContent)
        phpFile = self.phpUpdateContent;
        value.id = data.original.id;
        moduleDatabase.updateData(phpFile,value).then(function(result){
            self.editView(value,data,parent,index);
        })
        mNewWard.promiseEditDB = undefined;
        setTimeout(function(){
        if(mNewWard.promiseEditDB!==undefined)
            self.editDB(mNewWard,data,parent,index);
        },10);
    })
}

ListWard.prototype.editView = function(value,data,parent,index){
    var data = this.getDataRow(value);

    var indexOF = index,element = parent;
    
    element.updateRow(data,indexOF,true);
}

ListWard.prototype.delete = function(data,parent,index)
{
    if(!this.isLoaded)
        return;
    
    var self = this;
    var deleteItem = deleteQuestion("Xoá danh mục","Bạn có chắc muốn xóa :"+data.name);
    this.$view.addChild(deleteItem);
    deleteItem.promiseComfirm.then(function(){
        self.deleteDB(data,parent,index);
    })
}

ListWard.prototype.deleteView = function(parent,index){
    var self = this;
    var bodyTable = parent.bodyTable;
    parent.dropRow(index).then(function(){
    });
}

ListWard.prototype.deleteDB = function(data,parent,index){
    var self = this;
    var phpFile = moduleDatabase.deleteStatesPHP;
    if(self.phpDeleteContent)
    phpFile = self.phpUpdateContent;
    moduleDatabase.updateData(phpFile,data).then(function(value){
        self.deleteView(parent,index);
    })
}

ListWard.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

ListWard.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

ListWard.prototype.flushDataToView = function () {
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

ListWard.prototype.start = function () {

}

export default ListWard;