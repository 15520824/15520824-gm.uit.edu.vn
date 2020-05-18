import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/NewCategory.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import {allowNumbersOnly, createAlias} from './ModuleView';

var _ = Fcore._;
var $ = Fcore.$;

function NewCategory(data,parent_id) {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.data = data;
    if(parent_id!==undefined)
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
    var array = [{text:"Danh mục cao nhất",value:0}];
    
    if(self.parent_id===undefined)
    self.parent_id = 0;
    self.check = [];
    for(var i = 0;i<dataParent.length;i++)
    {
        array[i+1] = {text:dataParent[i].title,value:parseFloat(dataParent[i].id)};
        if(self.data == undefined)
        self.check[dataParent[i].alias] = dataParent[i];
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
                            innerHTML: "Thêm help"
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
                                        if(self.aliasErorr.classList.contains("hasErrorElement"))
                                            return;
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
                                        if(self.aliasErorr.classList.contains("hasErrorElement"))
                                            return;
                                        var result = {
                                            title:self.name.value,
                                            alias:self.alias.value,
                                            parent_id:self.parentElement.value
                                        }
                                        self.resolveDB(result);
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
                            class:"pizo-new-catergory-container",
                            child:[
                                {
                                    tag:"div",
                                    class:"pizo-new-category-container-name",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-category-container-name-container",
                                            child:[
                                                {
                                                    tag:"span",
                                                    class:"pizo-new-category-container-name-container-label",
                                                    props:{
                                                        innerHTML:"Tên"
                                                    }
                                                },
                                                {
                                                    tag:"input",
                                                    class:["pizo-new-category-container-name-container-input","pizo-new-realty-dectruct-input"],
                                                    on:{
                                                        change:function(event)
                                                        {
                                                            if(self.alias.value === ""||self.aliasErorr.classList.contains("hasErrorElement")){
                                                                self.alias.value = createAlias(this.value);
                                                                self.alias.dispatchEvent(new Event("input"));
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-category-container-alias",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-category-container-alias-container",
                                            child:[
                                                {
                                                    tag:"span",
                                                    class:"pizo-new-category-container-alias-container-label",
                                                    props:{
                                                        innerHTML:"Alias"
                                                    },
                                                    child:[
                                                        {
                                                            tag:"span",
                                                            class:"pizo-new-realty-location-detail-row-label-important",
                                                            props:{
                                                                innerHTML:"*"
                                                            }
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag:"input",
                                                    class:["pizo-new-category-container-alias-container-input","pizo-new-realty-dectruct-input"],
                                                    on:{
                                                        input:function(event)
                                                        {
                                                            var parent = this.parentNode.parentNode;
                                                            
                                                            if(this.value == ""){
                                                                if(!parent.classList.contains("hasErrorElement"))
                                                                parent.classList.add("hasErrorElement");
                                                                if(!parent.classList.contains("invalid-error"))
                                                                parent.classList.add("invalid-error");
                                                            }else
                                                            {
                                                                if(parent.classList.contains("invalid-error"))
                                                                parent.classList.remove("invalid-error");
                                                            }

                                                            if(self.check[this.value] !== undefined)
                                                            {
                                                                if(!parent.classList.contains("hasErrorElement"))
                                                                parent.classList.add("hasErrorElement");
                                                                if(!parent.classList.contains("used-error"))
                                                                parent.classList.add("used-error");
                                                            }else
                                                            {
                                                                if(parent.classList.contains("used-error"))
                                                                parent.classList.remove("used-error");
                                                            }
                                                            
                                                            if(!parent.classList.contains("used-error")&&!parent.classList.contains("invalid-error")&&parent.classList.contains("hasErrorElement"))
                                                            parent.classList.remove("hasErrorElement")
                                                        },
                                                        keypress:function(event){
                                                            allowNumbersOnly(event);
                                                        }
                                                    }
                                                }
                                                
                                            ]
                                        },
                                        {
                                            tag:"span",
                                            class:["pizo-new-realty-location-detail-row-label-important","label-used-error"],
                                            props:{
                                                innerHTML:"Alias không có sẳn để sử dụng"
                                            }
                                        },
                                        {
                                            tag:"span",
                                            class:["pizo-new-realty-location-detail-row-label-important","label-invalid-error"],
                                            props:{
                                                innerHTML:"Alias không thể để trống"
                                            }
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-state-selectbox",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-state-selectbox-container",
                                            child:[
                                                {
                                                    tag:"span",
                                                    class:"pizo-new-state-selectbox-container-label",
                                                    props:{
                                                        innerHTML:"Danh mục cha"
                                                    }
                                                },
                                                {
                                                    tag:"selectmenu",
                                                    class:["pizo-new-state-selectbox-container-input","pizo-new-realty-dectruct-input"],
                                                    props:{
                                                        enableSearch: true,
                                                        items:array,
                                                        value:self.parent_id
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]   
        })
        );

    this.name = $('input.pizo-new-category-container-name-container-input.pizo-new-realty-dectruct-input',this.$view);
    this.alias = $('input.pizo-new-category-container-alias-container-input.pizo-new-realty-dectruct-input',this.$view);
    this.parentElement = $('.pizo-new-state-selectbox-container-input.pizo-new-realty-dectruct-input',this.$view);
    this.aliasErorr = $('div.pizo-new-category-container-alias',this.$view);
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