import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/NewWard.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import moduleDatabase from '../component/ModuleDatabase';

var _ = Fcore._;
var $ = Fcore.$;

function NewWard(data) {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    
    this.textHeader = "Sửa";
    this.data = data;

    if(this.data ==undefined)
    this.textHeader = "Thêm ";
    
}

NewWard.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(NewWard.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
NewWard.prototype.constructor = NewWard;

NewWard.prototype.getView = function (data) {
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
                self.listWardElement.items = self.checkStateWard[this.value];
            }
        }
    });
    self.listWardElement = _({
        tag:"selectmenu",
        class:"pizo-new-ward-container-district-container-input",
        props:{
            enableSearch:true
        }
    });
    moduleDatabase.getModule("districts").load().then(function(listWard){
        moduleDatabase.getModule("states").load().then(function(listState){
            self.setListParamState(listState);
            self.listStateElement.items = self.listState;
            self.setListParamWard(listWard);
            self.listWardElement.items = self.listWard;
            if(self.data!==undefined)
            {
                self.listWardElement.value = self.data.original.districtid;
                self.listWardElement.emit("change");
                var checkid = parseInt(self.checkState[self.checkWard[self.listWardElement.value].stateid].id);
                    self.listStateElement.value = checkid;
            }
        })
    })

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
                                    class:"pizo-new-state-container-type-container",
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-state-container-type-container-label",
                                            props:{
                                                innerHTML:"Loại"
                                            }
                                        },
                                        {
                                            tag:"selectmenu",
                                            class:"pizo-new-state-container-type-container-input",
                                            props:{
                                                items:[
                                                    {text:"Phường",value:"Phường"},
                                                    {text:"Xã",value:"Xã"},
                                                    {text:"Thị trấn",value:"Thị trấn"},
                                                ]
                                            }
                                        }
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
                                        self.listWardElement
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
    this.type = $('div.pizo-new-state-container-type-container-input',this.$view);
    this.district = self.listWardElement;
    
    if(this.data!==undefined)
    {
        this.name.value = this.data.original.name;
        this.type.value = this.data.original.type;
    }
    return this.$view;
}

NewWard.prototype.setListParamWard = function(value)
{
    this.checkWard = moduleDatabase.getModule("districts").getLibary("id");

    this.checkStateWard = moduleDatabase.getModule("districts").getLibary("stateid",function(data){
        return {text:data.name,value:data.name+"_"+data.id}
    },true);
    this.listWard = moduleDatabase.getModule("districts").getList("name","id");
}

NewWard.prototype.setListParamState = function()
{
    this.checkState = moduleDatabase.getModule("states").getLibary("id");
    this.listState = moduleDatabase.getModule("states").getList("name","id");
    this.isLoaded = true;
}

NewWard.prototype.getDataSave = function() {
    
    var temp = {
        id:this.data===undefined?undefined:this.data.original.id,
        name:this.name.value,
        type:this.type.value,
        districtid:this.district.value
    }
    if(this.data!==undefined)
    temp.id = this.data.original.id;
    return temp;
}

NewWard.prototype.createPromise = function()
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

NewWard.prototype.resetPromise = function(value)
{
    if(self.promiseAddDB!==undefined)
    self.promiseAddDB = undefined;
    if(self.promiseEditDB!==undefined)
    self.promiseEditDB = undefined;
}

NewWard.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

NewWard.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

NewWard.prototype.flushDataToView = function () {
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

NewWard.prototype.start = function () {

}

export default NewWard;