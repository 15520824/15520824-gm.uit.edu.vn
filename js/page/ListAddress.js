import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListAdress.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { formatDate, getGMT } from '../component/FormatFunction';

import moduleDatabase from '../component/ModuleDatabase';

import { tableView, deleteQuestion } from '../component/ModuleView';

import NewDistrict from '../component/NewDistrict';

var _ = Fcore._;
var $ = Fcore.$;

function ListAdress() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
}

ListAdress.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(ListAdress.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
ListAdress.prototype.constructor = ListAdress;

ListAdress.prototype.getView = function () {
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
                            innerHTML: "Quản lý địa chỉ"
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

    moduleDatabase.getModule("addresses").load().then(function(value){
    moduleDatabase.getModule("streets").load().then(function(listStreet){
        moduleDatabase.getModule("wards").load().then(function(listWard){
            moduleDatabase.getModule("districts").load().then(function(listDistrict){
                moduleDatabase.getModule("states").load().then(function(listState){
                self.setListParamStreet();
                self.setListParamDitrict();
                self.setListParamState();
                self.setListParamWard();
                self.listStateElement.items = self.listState;
                self.listDistrictElement.items = self.listDistrict;
                self.listWardElement.items = self.listWard;
                var header = [
                { type: "increase", value: "#",style:{minWidth:"50px",width:"50px"}}, 
                {value:'MS',sort:true,style:{minWidth:"50px",width:"50px"}}, 
                {value:'Số nhà',sort:true,style:{minWidth:"unset"}},
                {value:'Đường',sort:true,style:{minWidth:"unset"}},
                {value:'Phường/Xã',sort:true,style:{minWidth:"unset"}},
                {value:'Quận/Huyện',sort:true,style:{minWidth:"unset"}},
                {value:'Tỉnh/TP',sort:true,style:{minWidth:"unset"}},
                {type:"detail", functionClickAll:functionClickMore,icon:"",dragElement : false,style:{width:"30px"}}];
                self.mTable = new tableView(header, self.formatDataRow(value), false, true, 2);
                tabContainer.addChild(self.mTable);
                self.mTable.addInputSearch($('.pizo-list-realty-page-allinput-container input',self.$view));
                self.mTable.addFilter(self.listWardElement,4);
                self.mTable.addFilter(self.listDistrictElement,5);
                self.mTable.addFilter(self.listStateElement,6);
            });
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

ListAdress.prototype.setListParamStreet = function()
{
    this.checkStreet = moduleDatabase.getModule("streets").getLibary("id");
    this.listStreet = moduleDatabase.getModule("streets").getList("name",["name","id"]);
}

ListAdress.prototype.setListParamWard = function()
{
    this.checkWard = moduleDatabase.getModule("wards").getLibary("id");
    this.listWard = [{text:"Tất cả",value:0}].concat(moduleDatabase.getModule("wards").getList("name",["name","id"]));
    this.checkWardDistrict = moduleDatabase.getModule("wards").getLibary("districtid",function(data){
        return {text:data.name,value:data.name+"_"+data.id}
    },true);
}


ListAdress.prototype.setListParamDitrict = function()
{
    this.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");
    this.listDistrict = [{text:"Tất cả",value:0}].concat(moduleDatabase.getModule("districts").getList("name",["name","id"]));
    this.checkDistrictState = moduleDatabase.getModule("districts").getLibary("stateid",function(data){
        return {text:data.name,value:data.name+"_"+data.id}
    },true);
}

ListAdress.prototype.setListParamState = function()
{
    this.checkState = moduleDatabase.getModule("states").getLibary("id");
    this.listState = [{text:"Tất cả",value:0}].concat(moduleDatabase.getModule("states").getList("name",["name","id"]));
    this.isLoaded = true;
}

ListAdress.prototype.getDataParam = function()
{
    return this.listParam;
}

ListAdress.prototype.formatDataRow = function(data)
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

ListAdress.prototype.getDataRow = function(data)
{
    
    var result = [
        {},
        data.id,
        data.addressnumber,
        {element:_({text:this.checkStreet[data.streetid].name}),value:this.checkStreet[data.streetid].name+"_"+this.checkStreet[data.streetid].id},
        {element:_({text:this.checkWard[data.wardid].name}),value:this.checkWard[data.wardid].name+"_"+this.checkWard[data.wardid].id},
        {element:_({text:this.checkDistrict[this.checkWard[data.wardid].districtid].name}),value:this.checkDistrict[this.checkWard[data.wardid].districtid].name+"_"+this.checkDistrict[this.checkWard[data.wardid].districtid].id},
        {element:_({text:this.checkState[this.checkDistrict[this.checkWard[data.wardid].districtid].stateid].name}),value:this.checkState[this.checkDistrict[this.checkWard[data.wardid].districtid].stateid].name+"_"+this.checkState[this.checkDistrict[this.checkWard[data.wardid].districtid].stateid].id},
        {}
        ]
        result.original = data;
    
    return result;
}

ListAdress.prototype.formatDataList = function(data){
    var temp = [{text:"Tất cả",value:0}];
    for(var i = 0;i<data.length;i++)
    {
        temp[i+1] = {text:data[i].name,value:data[i].id};
    }
    return temp;
}
ListAdress.prototype.searchControlContent = function(){
    var self =this;
    self.listStateElement = _({
        tag:"selectmenu",
        props:{
            enableSearch:true,
            items:[{text:"Tất cả",value:0}]
        },
        on:{
            change:function(event){
                if(this.value == 0){
                    self.listDistrictElement.items = self.listDistrict;
                }
                else{
                    if(event!==undefined)
                    {
                        self.listDistrictElement.value = 0;
                    }
                    self.listDistrictElement.items = [{text:"Tất cả",value:0}].concat(self.checkDistrictState[this.value.slice(this.value.lastIndexOf("_")+1)]);
                    self.listDistrictElement.emit('change');
                }
            }
        }
    });

    self.listDistrictElement = _({
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
                    var checkResult =self.checkState[self.checkDistrict[this.value.slice(this.value.lastIndexOf("_")+1)].stateid];
                    var checkid = checkResult.name+"_"+checkResult.id;
                    if(self.listStateElement.value!=checkid)
                    {
                        self.listStateElement.value = checkid;
                        self.listStateElement.emit('change');
                    }

                    if(event!==undefined)
                    {
                        self.listWardElement.value = 0;
                    }
                    self.listWardElement.items = [{text:"Tất cả",value:0}].concat(self.checkWardDistrict[this.value.slice(this.value.lastIndexOf("_")+1)]);
                    self.listWardElement.emit('change');
                }
               
            }
        }
    });

    self.listWardElement = _({
        tag:"selectmenu",
        props:{
            enableSearch:true,
            items:[{text:"Tất cả",value:0}]
        },
        on:{
            change:function(event){
                if(this.value !== 0){
                    var checkResult = self.checkDistrict[self.checkWard[this.value.slice(this.value.lastIndexOf("_")+1)].districtid];
                    var checkid = checkResult.name+"_"+checkResult.id;
                    if(self.listDistrictElement.value!=checkid)
                    {
                        self.listDistrictElement.value = checkid;
                        self.listDistrictElement.emit('change');
                    }
                }
               
            }
        }
    });

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
                                            self.listDistrictElement
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
                                            innerHTML:"Phường/Xã"
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

  
    return temp;
}


ListAdress.prototype.getDataCurrent = function()
{
    return this.getDataChild(this.mTable.data);
}



ListAdress.prototype.getDataChild = function(arr)
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

ListAdress.prototype.add = function(parent_id = 0,row)
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

ListAdress.prototype.addDB = function(mNewDistrict,row ){
    var self = this;
    mNewDistrict.promiseAddDB.then(function(value){
        var phpFile = moduleDatabase.addStatesPHP;
        if(self.phpUpdateContent)
        phpFile = self.phpUpdateContent;
        moduleDatabase.updateData(phpFile,value).then(function(result){
            
            value.id = result;
            self.addView(value,row);
        })
        mNewDistrict.promiseAddDB = undefined;
        setTimeout(function(){
            if(mNewDistrict.promiseAddDB!==undefined)
            self.addDB(mNewDistrict);
        },10);
    })
}

ListAdress.prototype.addView = function(value,parent){
    value.created = getGMT();
    value.modified = getGMT();
    var result = this.getDataRow(value);
    
    var element = this.mTable;
    element.insertRow(result);
}

ListAdress.prototype.edit = function(data,parent,index)
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

ListAdress.prototype.editDB = function(mNewDistrict,data,parent,index){
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

ListAdress.prototype.editView = function(value,data,parent,index){
    value.created = data.original.created;
    value.modified = getGMT();
    var data = this.getDataRow(value);

    var indexOF = index,element = parent;
    
    element.updateRow(data,indexOF,true);
}

ListAdress.prototype.delete = function(data,parent,index)
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

ListAdress.prototype.deleteView = function(parent,index){
    var self = this;
    var bodyTable = parent.bodyTable;
    parent.dropRow(index).then(function(){
    });
}

ListAdress.prototype.deleteDB = function(data,parent,index){
    var self = this;
    var phpFile = moduleDatabase.deleteStatesPHP;
    if(self.phpDeleteContent)
    phpFile = self.phpUpdateContent;
    moduleDatabase.updateData(phpFile,data).then(function(value){
        self.deleteView(parent,index);
    })
}

ListAdress.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

ListAdress.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

ListAdress.prototype.flushDataToView = function () {
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

ListAdress.prototype.start = function () {

}

export default ListAdress;