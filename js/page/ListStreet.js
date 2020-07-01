import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListStreet.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { formatDate, getGMT } from '../component/FormatFunction';

import moduleDatabase from '../component/ModuleDatabase';

import { tableView, deleteQuestion } from '../component/ModuleView';

import NewDistrict from '../component/NewDistrict';

var _ = Fcore._;
var $ = Fcore.$;

function ListStreet() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
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
                            innerHTML: "Quản lý Tên đường"
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


    moduleDatabase.getModule("streets").load().then(function(value){
        moduleDatabase.getModule("wards").load().then(function(listWard){
            moduleDatabase.getModule("districts").load().then(function(listDistrict){
                moduleDatabase.getModule("states").load().then(function(listState){
                self.setListParamDitrict(listDistrict);
                self.setListParamState(listState);
                var header = [
                { type: "increase", value: "#",style:{minWidth:"50px",width:"50px"}}, 
                {value:'MS',sort:true,style:{minWidth:"50px",width:"50px"}}, 
                {value:'Tên',sort:true,style:{minWidth:"unset"}},
                {type:"detail", functionClickAll:functionClickMore,icon:"",dragElement : false,style:{width:"30px"}}];
                self.mTable = new tableView(header, self.formatDataRow(value), false, true, 2);
                tabContainer.addChild(self.mTable);
                self.mTable.addInputSearch($('.pizo-list-realty-page-allinput-container input',self.$view));
                // self.listParent.updateItemList(listParam);
            });
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

ListStreet.prototype.setListParamWard = function()
{
    this.checkWard = moduleDatabase.getModule("wards").getLibary("id");
    this.listWard = moduleDatabase.getModule("wards").getList("name","id");
}


ListStreet.prototype.setListParamDitrict = function(value)
{
    this.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");
    this.listDistrict = moduleDatabase.getModule("districts").getList("name","id");
}

ListStreet.prototype.setListParamState = function(value)
{
    this.checkState = moduleDatabase.getModule("states").getLibary("id");
    this.listState = moduleDatabase.getModule("states").getList("name","id");
    this.isLoaded = true;
}

ListStreet.prototype.getDataParam = function()
{
    return this.listParam;
}

ListStreet.prototype.formatDataRow = function(data)
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

ListStreet.prototype.getDataRow = function(data)
{
    
    var result = [
        {},
        data.id,
        data.name,
        {}
        ]
        result.original = data;
    
    return result;
}

ListStreet.prototype.formatDataList = function(data){
    var temp = [{text:"Tất cả",value:0}];
    for(var i = 0;i<data.length;i++)
    {
        temp[i+1] = {text:data[i].name,value:data[i].id};
    }
    return temp;
}
ListStreet.prototype.searchControlContent = function(){
    var startDay,endDay,startDay1,endDay1;

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


ListStreet.prototype.getDataCurrent = function()
{
    return this.getDataChild(this.mTable.data);
}



ListStreet.prototype.getDataChild = function(arr)
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

ListStreet.prototype.add = function(parent_id = 0,row)
{

    if(!this.isLoaded)
        return;
    var self = this;
    var mNewDistrict = new NewDistrict(undefined,parent_id);
    mNewDistrict.attach(self.parent);
    var frameview = mNewDistrict.getView(self.getDataParam());
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.addDB(mNewDistrict,row);
}

ListStreet.prototype.addDB = function(mNewDistrict,row ){
    var self = this;
    mNewDistrict.promiseAddDB.then(function(value){
        var phpFile = moduleDatabase.addStatesPHP;
        if(self.phpUpdateContent)
        phpFile = self.phpUpdateContent;
        moduleDatabase.updateData(phpFile,value).then(function(result){
            self.addView(result.data,row);
        })
        mNewDistrict.promiseAddDB = undefined;
        setTimeout(function(){
            if(mNewDistrict.promiseAddDB!==undefined)
            self.addDB(mNewDistrict);
        },10);
    })
}

ListStreet.prototype.addView = function(value,parent){
    value.created = getGMT();
    value.modified = getGMT();
    var result = this.getDataRow(value);
    
    var element = this.mTable;
    element.insertRow(result);
}

ListStreet.prototype.edit = function(data,parent,index)
{
    if(!this.isLoaded)
        return;
    var self = this;
    var mNewDistrict = new NewDistrict(data);
    mNewDistrict.attach(self.parent);
    var frameview = mNewDistrict.getView(self.getDataParam());
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDB(mNewDistrict,data,parent,index);
}

ListStreet.prototype.editDB = function(mNewDistrict,data,parent,index){
    var self = this;
    mNewDistrict.promiseEditDB.then(function(value){
        var phpFile = moduleDatabase.updateStatesPHP;
        if(self.phpUpdateContent)
        phpFile = self.phpUpdateContent;
        value.id = data.original.id;
        moduleDatabase.updateData(phpFile,value).then(function(result){
            self.editView(value,data,parent,index);
        })
        mNewDistrict.promiseEditDB = undefined;
        setTimeout(function(){
        if(mNewDistrict.promiseEditDB!==undefined)
            self.editDB(mNewDistrict,data,parent,index);
        },10);
    })
}

ListStreet.prototype.editView = function(value,data,parent,index){
    value.created = data.original.created;
    value.modified = getGMT();
    var data = this.getDataRow(value);

    var indexOF = index,element = parent;
    
    element.updateRow(data,indexOF,true);
}

ListStreet.prototype.delete = function(data,parent,index)
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

ListStreet.prototype.deleteView = function(parent,index){
    var self = this;
    var bodyTable = parent.bodyTable;
    parent.dropRow(index).then(function(){
    });
}

ListStreet.prototype.deleteDB = function(data,parent,index){
    var self = this;
    var phpFile = moduleDatabase.deleteStatesPHP;
    if(self.phpDeleteContent)
    phpFile = self.phpUpdateContent;
    moduleDatabase.updateData(phpFile,data).then(function(value){
        self.deleteView(parent,index);
    })
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