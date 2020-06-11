import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/NewState.css"
import R from '../R';
import Fcore from '../dom/Fcore';

var _ = Fcore._;
var $ = Fcore.$;

function NewState(data) {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
        
    this.textHeader = "Sửa";
    this.data = data;

    if(this.data ==undefined)
    this.textHeader = "Thêm ";
}

NewState.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(NewState.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
NewState.prototype.constructor = NewState;

NewState.prototype.getDataSave = function() {
    
    return {
        id:this.data===undefined?undefined:this.data.original.id,
        name:this.name.value,
        type:this.type.value,
        districtid:this.district.value
    }
}

NewState.prototype.createPromise = function()
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

NewState.prototype.getView = function () {
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
                            innerHTML:  self.textHeader+"Tỉnh/TP"
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
                                                    {text:"Thành phố",value:"Thành phố"},
                                                    {text:"Tỉnh",value:"Tỉnh"}
                                                ]
                                            }
                                        }
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
                                                innerHTML:"Quốc gia"
                                            }
                                        },
                                        {
                                            tag:"selectmenu",
                                            class:"pizo-new-state-container-nation-container-input",
                                            props:{
                                                items:[
                                                    {text:"Việt Nam",value:1},
                                                ]
                                            }
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
    this.createPromise();
    this.name = $('input.pizo-new-state-container-name-container-input"',this.$view);
    this.type = $('div.pizo-new-state-container-type-container-input',this.$view);
    this.nation = $('div.pizo-new-state-container-nation-container-input',this.$view);
    if(this.data!==undefined)
    {
        this.name.value = this.data.original.name;
        this.type.value = this.data.original.type;
        this.nation.value = this.data.original.nationid;
    }
   
    return this.$view;
}

NewState.prototype.getDataSave = function() {
    var temp = {
        name:this.name.value,
        type:this.type.value,
        nationid:this.nation.value
    }
    if(this.data!==undefined)
    temp.id = this.data.original.id;
    return temp;
}

NewState.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

NewState.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

NewState.prototype.flushDataToView = function () {
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

NewState.prototype.start = function () {

}

export default NewState;