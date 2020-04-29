import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/NewCategory.css"
import R from '../R';
import Fcore from '../dom/Fcore';

var _ = Fcore._;
var $ = Fcore.$;

function NewCategory(data,parent_id) {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.data = data;
    this.parent_id = parseFloat(parent_id);
    if(this.data!==undefined)
    this.parent_id = parseFloat(data.original.parent_id);
}

NewCategory.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(NewCategory.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
NewCategory.prototype.constructor = NewCategory;

NewCategory.prototype.createPromise = function()
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

NewCategory.prototype.resetPromise = function(value)
{
    if(self.promiseAddDB!==undefined)
    self.promiseAddDB = undefined;
    if(self.promiseEditDB!==undefined)
    self.promiseEditDB = undefined;
}

NewCategory.prototype.getView = function (dataParent) {
    if (this.$view) return this.$view;
    var self = this;
    self.createPromise();
    var array = [{text:"Danh mục cao nhất",value:0}]
    for(var i = 0;i<dataParent.length;i++)
    {
        array[i+1] = {text:dataParent[i].title,value:parseFloat(dataParent[i].id)};
    }
    console.log(this.parent_id)
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
                            innerHTML: "Thêm Tỉnh/TP"
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

                                        var result = {
                                            title:self.name.value,
                                            alias:self.alias.value,
                                            parent_id:self.parentElement.value
                                        }
                                        self.rejectDB(result);
                                        self.resetPromise();
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
                                        var result = {
                                            title:self.name.value,
                                            alias:self.alias.value,
                                            parent_id:self.parentElement.value
                                        }
                                        self.resolveDB(result);
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
                                        var result = {
                                            title:self.name.value,
                                            alias:self.alias.value,
                                            parent_id:self.parentElement.value
                                        }
                                        self.resolveDB(result);
                                        self.resetPromise();
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
                                    class:"pizo-new-state-container-alias-container",
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-state-container-alias-container-label",
                                            props:{
                                                innerHTML:"Alias"
                                            }
                                        },
                                        {
                                            tag:"input",
                                            class:["pizo-new-state-container-alias-container-input","pizo-new-realty-dectruct-input"],
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-state-container-selectbox-container",
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-state-container-selectbox-container-label",
                                            props:{
                                                innerHTML:"Danh mục cha"
                                            }
                                        },
                                        {
                                            tag:"selectmenu",
                                            class:["pizo-new-state-container-selectbox-container-input","pizo-new-realty-dectruct-input"],
                                            props:{
                                                enableSearch: true,
                                                items:array,
                                                value:self.parent_id
                                            }
                                        }
                                    ]
                                },
                            ]
                        }
                    ]
                }
            ]   
        })
        );

    this.name = $('input.pizo-new-state-container-name-container-input.pizo-new-realty-dectruct-input',this.$view);
    this.alias = $('input.pizo-new-state-container-alias-container-input.pizo-new-realty-dectruct-input',this.$view);
    this.parentElement = $('.pizo-new-state-container-selectbox-container-input.pizo-new-realty-dectruct-input',this.$view);
    if(this.data!==undefined)
    {
        this.name.value = this.data.original.title;
        this.alias.value = this.data.original.alias;
    }
    return this.$view;
}

NewCategory.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

NewCategory.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

NewCategory.prototype.flushDataToView = function () {
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

NewCategory.prototype.start = function () {

}

export default NewCategory;