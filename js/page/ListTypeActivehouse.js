import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListTypeActivehouse.css"
import R from '../R';
import Fcore from '../dom/Fcore';

import moduleDatabase from '../component/ModuleDatabase';

import { tableView, deleteQuestion } from '../component/ModuleView';

import NewTypeActivehouse from '../component/NewTypeActivehouse';

var _ = Fcore._;
var $ = Fcore.$;

function ListTypeActivehouse() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
}

ListTypeActivehouse.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(ListTypeActivehouse.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
ListTypeActivehouse.prototype.constructor = ListTypeActivehouse;

ListTypeActivehouse.prototype.getView = function () {
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
                            innerHTML: "Quản lý loại bất động sản"
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

    var juridicalModule = moduleDatabase.getModule("type_activehouses");
        juridicalModule.load().then(function(value){
            var header = [
            { type: "increase", value: "#",style:{minWidth:"50px",width:"50px"}}, 
            {value:'MS',sort:true,style:{minWidth:"50px",width:"50px"}}, 
            {value:'Tên',sort:true,style:{minWidth:"unset"}},
            {type:"detail", functionClickAll:functionClickMore,icon:"",dragElement : false,style:{width:"30px"}}];
            self.mTable = new tableView(header, self.formatDataRow(value), false, true, 2);
            tabContainer.addChild(self.mTable);
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

ListTypeActivehouse.prototype.formatDataRow = function(data)
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

ListTypeActivehouse.prototype.getDataRow = function(data)
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

ListTypeActivehouse.prototype.formatDataList = function(data){
    var temp = [{text:"Tất cả",value:0}];
    for(var i = 0;i<data.length;i++)
    {
        temp[i+1] = {text:data[i].name,value:data[i].id};
    }
    return temp;
}

ListTypeActivehouse.prototype.searchControlContent = function(){  
    var content = _({
        tag:"div"
    })
    var temp = _({
        tag:"div",
        style:{
            display:"none"
        },
        child:[
            content
        ]
    })
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

ListTypeActivehouse.prototype.getDataCurrent = function()
{
    return this.getDataChild(this.mTable.data);
}



ListTypeActivehouse.prototype.getDataChild = function(arr)
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

ListTypeActivehouse.prototype.add = function(parent_id = 0,row)
{
    var self = this;
    var mNewTypeActivehouse = new NewTypeActivehouse(undefined,parent_id);
    mNewTypeActivehouse.attach(self.parent);
    var frameview = mNewTypeActivehouse.getView();
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.addDB(mNewTypeActivehouse,row);
}

ListTypeActivehouse.prototype.addDB = function(mNewTypeActivehouse,row ){
    var self = this;
    mNewTypeActivehouse.promiseAddDB.then(function(value){
        moduleDatabase.getModule("type_activehouses").add(value).then(function(result){
            self.addView(result,row);
        })
        mNewTypeActivehouse.promiseAddDB = undefined;
        setTimeout(function(){
            if(mNewTypeActivehouse.promiseAddDB!==undefined)
            self.addDB(mNewTypeActivehouse);
        },10);
    })
}

ListTypeActivehouse.prototype.addView = function(value,parent){
    var result = this.getDataRow(value);
    
    var element = this.mTable;
    element.insertRow(result);
}

ListTypeActivehouse.prototype.edit = function(data,parent,index)
{
    var self = this;
    var mNewTypeActivehouse = new NewTypeActivehouse(data);
    mNewTypeActivehouse.attach(self.parent);
    var frameview = mNewTypeActivehouse.getView();
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDB(mNewTypeActivehouse,data,parent,index);
}

ListTypeActivehouse.prototype.editDB = function(mNewTypeActivehouse,data,parent,index){
    var self = this;
    mNewTypeActivehouse.promiseEditDB.then(function(value){
        value.id = data.original.id;
        moduleDatabase.getModule("type_activehouses").update(value).then(function(result){
            self.editView(value,data,parent,index);
        })
        mNewTypeActivehouse.promiseEditDB = undefined;
        setTimeout(function(){
        if(mNewTypeActivehouse.promiseEditDB!==undefined)
            self.editDB(mNewTypeActivehouse,data,parent,index);
        },10);
    })
}

ListTypeActivehouse.prototype.editView = function(value,data,parent,index){
    var data = this.getDataRow(value);

    var indexOF = index,element = parent;
    
    element.updateRow(data,indexOF,true);
}

ListTypeActivehouse.prototype.delete = function(data,parent,index)
{   
    var self = this;
    var deleteItem = deleteQuestion("Xoá danh mục","Bạn có chắc muốn xóa :"+data.name);
    this.$view.addChild(deleteItem);
    deleteItem.promiseComfirm.then(function(){
        self.deleteDB(data,parent,index);
    })
}

ListTypeActivehouse.prototype.deleteView = function(parent,index){
    var self = this;
    var bodyTable = parent.bodyTable;
    parent.dropRow(index).then(function(){
    });
}

ListTypeActivehouse.prototype.deleteDB = function(data,parent,index){
    var self = this;
    moduleDatabase.getModule("type_activehouses").delete({id:data.id}).then(function(value){
        self.deleteView(parent,index);
    })
}

ListTypeActivehouse.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

ListTypeActivehouse.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.juridical == "RUNNING")
        this.flushDataToView();
};

ListTypeActivehouse.prototype.flushDataToView = function () {
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

ListTypeActivehouse.prototype.start = function () {

}

export default ListTypeActivehouse;