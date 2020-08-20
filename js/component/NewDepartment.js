import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/NewDepartment.css"
import R from '../R';
import Fcore from '../dom/Fcore';


var _ = Fcore._;
var $ = Fcore.$;

function NewDepartment(data,parent_id) {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.textHeader = "Sửa ";
    this.data = data;
    if(parent_id!==undefined)
    this.parent_id = parseFloat(parent_id);
    if(this.data!==undefined)
    this.parent_id = parseFloat(data.original.parent_id);
    else
    this.textHeader = "Thêm ";
}

NewDepartment.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(NewDepartment.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
NewDepartment.prototype.constructor = NewDepartment;

NewDepartment.prototype.createPromise = function()
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

NewDepartment.prototype.resetPromise = function(value)
{
    if(self.promiseAddDB!==undefined)
    self.promiseAddDB = undefined;
    if(self.promiseEditDB!==undefined)
    self.promiseEditDB = undefined;
}

NewDepartment.prototype.getView = function (dataParent) {
    if (this.$view) return this.$view;
    var self = this;
    self.createPromise();
    var array = [{text:"Phòng ban cao nhất",value:0}];
    if(self.parent_id===undefined)
    self.parent_id = 0;
    self.check = [];
    for(var i = 0;i<dataParent.length;i++)
    {
        if(self.data !== undefined&&self.data.original.id == dataParent[i].id)
            continue;
        array.push({text:dataParent[i].name,value:parseFloat(dataParent[i].id)});
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
                            innerHTML: self.textHeader+"bộ phận"
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
                                        self.rejectDB(self.getData());
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
                                        self.resolveDB(self.getData());
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
                                        self.resolveDB(self.getData());
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
                            style:{
                                width:"50%"
                            },
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
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-category-container-code",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-category-container-code-container",
                                            child:[
                                                {
                                                    tag:"span",
                                                    class:"pizo-new-category-container-code-container-label",
                                                    props:{
                                                        innerHTML:"Mã"
                                                    }
                                                },
                                                {
                                                    tag:"input",
                                                    class:["pizo-new-category-container-code-container-input","pizo-new-realty-dectruct-input"],
                                                    on:{
                                                    }
                                                }
                                            ]
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
                                                        innerHTML:"Chức vụ cha"
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
    this.code = $('input.pizo-new-category-container-code-container-input.pizo-new-realty-dectruct-input',this.$view);
    this.parentElement = $('.pizo-new-state-selectbox-container-input.pizo-new-realty-dectruct-input',this.$view);
    if(this.data!==undefined)
    {
        this.name.value = this.data.original.name;
        this.code.value = this.data.original.code;
    }
    return this.$view;
}

NewDepartment.prototype.getData = function(){
    var temp = {
        name:this.name.value,
        code:this.code.value,
        parent_id:this.parentElement.value
    }

    if(this.data!==undefined)
    temp.id = this.data.original.id;
    return temp;
}

NewDepartment.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

NewDepartment.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

NewDepartment.prototype.flushDataToView = function () {
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

NewDepartment.prototype.start = function () {

}

export default NewDepartment;