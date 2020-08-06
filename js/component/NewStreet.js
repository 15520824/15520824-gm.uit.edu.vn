import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/NewStreet.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import moduleDatabase from './ModuleDatabase';
import {getIDCompair} from './FormatFunction';

var _ = Fcore._;
var $ = Fcore.$;

function NewStreet(data) {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    
    this.textHeader = "Sửa ";
    this.data = data;

    if(this.data ==undefined)
    this.textHeader = "Thêm ";
    
}

NewStreet.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(NewStreet.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
NewStreet.prototype.constructor = NewStreet;

NewStreet.prototype.getView = function (data) {
    if (this.$view) return this.$view;
    var self = this;
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
                            innerHTML:  self.textHeader+"Phường xã"
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

                                        self.rejectDB(self.getDataSave());
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
                                        self.resolveDB(self.getDataSave());
                                        self.createPromise();
                                    }
                                },
                                child: [
                                '<span>' + "Lưu" + '</span>'
                                ]
                            },
                            {
                                tag: "button",
                                class: ["pizo-list-realty-button-add","pizo-list-realty-button-element"],
                                on: {
                                    click: function (evt) {
                                        self.resolveDB(self.getDataSave());
                                        self.$view.selfRemove();
                                        var arr = self.parent.body.getAllChild();
                                        self.parent.body.activeFrame(arr[arr.length - 1]);
                                    }
                                },
                                child: [
                                '<span>' + "Lưu và đóng" + '</span>'
                                ]
                            }
                        ]
                    }
                ]
            },
        ]
    });

    self.listStateElement = _({
        tag:"selectmenu",
        class:"pizo-new-state-container-nation-container-input",
        props:{
            enableSearch:true
        },
        on:{
            change:function(event){
                var x = getIDCompair(this.value);
                self.listDistrictElement.items = self.checkStateDistrict[x];
                self.listDistrictElement.emit("change");
            }
        }
    });
    self.listDistrictElement = _({
        tag:"selectmenu",
        class:"pizo-new-ward-container-district-container-input",
        props:{
            enableSearch:true
        },
        on:{
            change:function(event){
                var x = getIDCompair(this.value);
                self.listWardElement.items = self.checkDistrictWard[x];
                self.listWardElement.emit("change");
            }
        }
    });
    self.listWardElement = _({
        tag:"selectmenu",
        class:"pizo-new-ward-container-district-container-input",
        props:{
            enableSearch:true
        },
        on:{
            change:function(event){
            }
        }
    });
    var arr = [];
    arr.push(moduleDatabase.getModule("wards").load());
    arr.push(moduleDatabase.getModule("districts").load());
    arr.push(moduleDatabase.getModule("states").load());

    Promise.all(arr).then(function(values){
            var listWard = values[0];
            var listDistrict = values[1];
            var listState = values[2];
            self.setListParamState(listState);
            self.listStateElement.items = self.listState;
            self.setListParamDistrict(listDistrict);
            // self.listDistrictElement.items = self.listDistrict;
            self.setListParamWard(listWard);
            // self.listWardElement.items = self.listWard;
            if(self.data!==undefined)
            {
                
                
                var x = parseInt(self.data.original.wardid);
                
                var checkidState = self.checkState[self.checkDistrict[self.checkWard[x].districtid].stateid].name+"_"+self.checkDistrict[self.checkWard[x].districtid].stateid;
                    self.listStateElement.value = checkidState;
                    self.listStateElement.emit("change");

                    var checkid = self.checkDistrict[self.checkWard[x].districtid].name+"_"+self.checkWard[x].districtid;
                    self.listDistrictElement.value = checkid;
                    self.listDistrictElement.emit("change");

                    self.listWardElement.value = self.checkWard[self.data.original.wardid].name+"_"+self.data.original.wardid;
            }
    });

    this.$view.addChild(_({
            tag:"div",
            class:["pizo-list-realty-main"],
            child:[
                {
                    tag:"div",
                    class:["pizo-list-realty-main-result-control"],
                    child:[
                        {
                            tag:"div",
                            class:"pizo-new-state-container",
                            child:[
                                {
                                    tag:"div",
                                    class:"pizo-new-state-container-name-container",
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-state-container-name-container-label",
                                            props:{
                                                innerHTML:"Tên"
                                            }
                                        },
                                        {
                                            tag:"input",
                                            class:["pizo-new-state-container-name-container-input","pizo-new-realty-dectruct-input"],
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-ward-container-ward-container",
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-ward-container-ward-container-label",
                                            props:{
                                                innerHTML:"Phường/Xã"
                                            }
                                        },
                                        self.listWardElement
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-ward-container-district-container",
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-ward-container-district-container-label",
                                            props:{
                                                innerHTML:"Quận/Huyện"
                                            }
                                        },
                                        self.listDistrictElement
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-state-container-nation-container",
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-state-container-nation-container-label",
                                            props:{
                                                innerHTML:"Tỉnh/Thành phố"
                                            }
                                        },
                                        self.listStateElement
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]   
        })
        );
    this.createPromise();
    this.name = $('input.pizo-new-state-container-name-container-input',this.$view);
    this.district = self.listDistrictElement;
    
    if(this.data!==undefined)
    {
        this.name.value = this.data.original.name;
    }
    return this.$view;
}

NewStreet.prototype.setListParamWard = function(value)
{
    this.checkWard = moduleDatabase.getModule("wards").getLibary("id");

    this.checkDistrictWard = moduleDatabase.getModule("wards").getLibary("districtid",function(data){
        return {text:data.name,value:data.name+"_"+data.id}
    },true);
    // this.listWard = moduleDatabase.getModule("wards").getList("name",["name","id"]);
}

NewStreet.prototype.setListParamDistrict = function(value)
{
    this.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");

    this.checkStateDistrict = moduleDatabase.getModule("districts").getLibary("stateid",function(data){
        return {text:data.name,value:data.name+"_"+data.id}
    },true);
    // this.listDistrict = moduleDatabase.getModule("districts").getList("name",["name","id"]);
}

NewStreet.prototype.setListParamState = function()
{
    this.checkState = moduleDatabase.getModule("states").getLibary("id");
    this.listState = moduleDatabase.getModule("states").getList("name",["name","id"]);
    this.isLoaded = true;
}

NewStreet.prototype.getDataSave = function() {
    
    var temp = {
        id:this.data===undefined?undefined:this.data.original.id,
        name:this.name.value,
        wardid:getIDCompair(this.listWardElement.value)
    }
    if(this.data!==undefined)
    temp.id = this.data.original.id;
    return temp;
}

NewStreet.prototype.createPromise = function()
{
    var self = this;
    if(this.data === undefined)
    {
        self.promiseAddDB = new Promise(function(resolve,reject){
            self.resolveDB = resolve;
            self.rejectDB = reject;
        })

    }else
    {
        self.promiseEditDB = new Promise(function(resolve,reject){
            self.resolveDB = resolve;
            self.rejectDB = reject;
        })
        
    }
}

NewStreet.prototype.resetPromise = function(value)
{
    if(self.promiseAddDB!==undefined)
    self.promiseAddDB = undefined;
    if(self.promiseEditDB!==undefined)
    self.promiseEditDB = undefined;
}

NewStreet.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

NewStreet.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

NewStreet.prototype.flushDataToView = function () {
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

NewStreet.prototype.start = function () {

}

export default NewStreet;