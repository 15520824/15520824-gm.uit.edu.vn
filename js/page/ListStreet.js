import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListStreet.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { formatDate, getGMT } from '../component/FormatFunction';

import moduleDatabase from '../component/ModuleDatabase';

import { tableView, deleteQuestion } from '../component/ModuleView';

import NewStreet from '../component/NewStreet';

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

    var header = [
    { type: "increase", value: "#",style:{minWidth:"50px",width:"50px"}}, 
    {value:'MS',sort:true,style:{minWidth:"50px",width:"50px"}}, 
    {value:'Tên',sort:true,style:{minWidth:"unset"}},
    {value:'Phường/xã',sort:true,style:{minWidth:"100px"}},
    {type:"detail", functionClickAll:functionClickMore,icon:"",dragElement : false,style:{width:"30px"}}];
    self.mTable = new tableView(header, [], false, true, 2);
    tabContainer.addChild(self.mTable);
    self.mTable.addInputSearch($('.pizo-list-realty-page-allinput-container input',self.$view));
        // self.listParent.updateItemList(listParam);
    moduleDatabase.getModule("wards").load().then(function(listWard){
        moduleDatabase.getModule("districts").load().then(function(listDistrict){
            moduleDatabase.getModule("states").load().then(function(listState){
            self.setListParamWard(listWard);
            self.setListParamDitrict(listDistrict);
            self.setListParamState(listState);
            self.listStateElement.items = self.listState;
            self.listStateElement.emit("change");
            self.mTable.addFilter(self.listWardElement,3);
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

ListStreet.prototype.setListParamWard = function(value)
{
    this.checkWard = moduleDatabase.getModule("wards").getLibary("id");

    this.checkDistrictWard = moduleDatabase.getModule("wards").getLibary("districtid",function(data){
        return {text:data.name,value:data.name+"_"+data.id}
    },true);
}


ListStreet.prototype.setListParamDitrict = function(value)
{
    this.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");

    this.checkStateDistrict = moduleDatabase.getModule("districts").getLibary("stateid",function(data){
        return {text:data.name,value:data.name+"_"+data.id}
    },true);
}

ListStreet.prototype.setListParamState = function(value)
{
    this.checkState = moduleDatabase.getModule("states").getLibary("id");
    this.listState = moduleDatabase.getModule("states").getList("name",["name","id"]);
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
        {value:this.checkWard[data.wardid].name+"_"+data.wardid,element:_({text:this.checkWard[data.wardid].name})},
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
    var self = this;
    self.listStateElement = _({
        tag:"selectmenu",
        style:{
            width:"100%"
        },
        props:{
            enableSearch:true,
        },
        on:{
            change:function(event){
                    self.listDistrictElement.items = self.checkStateDistrict[this.value.slice(this.value.lastIndexOf("_")+1)];
                    self.listDistrictElement.emit('change');
            }
        }
    });

    self.listDistrictElement = _({
        tag:"selectmenu",
        style:{
            width:"100%"
        },
        props:{
            enableSearch:true,
        },
        on:{
            change:function(event){
                if(this.value!==this.lastValue)
                {
                    self.listWardElement.items = [{text:"Tất cả",value:0}].concat(self.checkDistrictWard[this.value.slice(this.value.lastIndexOf("_")+1)]);
                    self.listWardElement.emit('change');
                    var arr = [];
                    var arrTemp = self.checkDistrictWard[this.value.slice(this.value.lastIndexOf("_")+1)];
                    for(var i = 0;i<arrTemp.length;i++)
                    {
                        arr.push(
                            moduleDatabase.getModule("streets").load({WHERE:[{wardid:parseFloat(arrTemp[i].value.slice(arrTemp[i].value.lastIndexOf("_")+1))}]})
                        )
                    }
                    
                    Promise.all(arr).then(function(value){
                        var result = [];
                        for(var i = 0;i<value.length;i++)
                        {
                            result = result.concat(value[i]);
                        }
                        self.mTable.data = self.formatDataRow(result);
                        self.mTable.updatePagination();
                        self.mTable.resetHash();
                    })
                }
                this.lastValue = this.value;
        }
        }
    });

    self.listWardElement = _({
        tag:"selectmenu",
        style:{
            width:"100%"
        },
        props:{
            enableSearch:true,
        },
        on:{
            change:function(event){
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
                                    self.listStateElement
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
                                    self.listDistrictElement
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
                                            innerHTML:"Phường/xã"
                                        }
                                    },
                                    self.listWardElement
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


    temp.apply = function()
    {

    }
    temp.reset = function()
    {

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
    var mNewStreet = new NewStreet(undefined,parent_id);
    mNewStreet.attach(self.parent);
    var frameview = mNewStreet.getView(self.listParam);
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.addDB(mNewStreet,row);
}

ListStreet.prototype.addDB = function(mNewStreet,row ){
    var self = this;
    mNewStreet.promiseAddDB.then(function(value){
        moduleDatabase.getModule("streets").add(value).then(function(result){
            self.addView(result.data,row);
        })
        mNewStreet.promiseAddDB = undefined;
        setTimeout(function(){
            if(mNewStreet.promiseAddDB!==undefined)
            self.addDB(mNewStreet);
        },10);
    })
}

ListStreet.prototype.addView = function(value,parent){
    var result = this.getDataRow(value);
    
    var element = this.mTable;
    element.insertRow(result);
}

ListStreet.prototype.edit = function(data,parent,index)
{
    if(!this.isLoaded)
        return;
    var self = this;
    var mNewStreet = new NewStreet(data);
    mNewStreet.attach(self.parent);
    var frameview = mNewStreet.getView(self.listParam);
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDB(mNewStreet,data,parent,index);
}

ListStreet.prototype.editDB = function(mNewStreet,data,parent,index){
    var self = this;
    mNewStreet.promiseEditDB.then(function(value){
        value.id = data.original.id;
        moduleDatabase.getModule("streets").update(value).then(function(result){
            self.editView(value,data,parent,index);
        })
        mNewStreet.promiseEditDB = undefined;
        setTimeout(function(){
        if(mNewStreet.promiseEditDB!==undefined)
            self.editDB(mNewStreet,data,parent,index);
        },10);
    })
}

ListStreet.prototype.editView = function(value,data,parent,index){
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
    moduleDatabase.getModule("streets").delete({id:data.id}).then(function(value){
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