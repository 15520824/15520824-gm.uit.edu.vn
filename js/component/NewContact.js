import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/NewContact.css"
import R from '../R';
import Fcore from '../dom/Fcore';


var _ = Fcore._;
var $ = Fcore.$;

function NewContact(data) {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    
    this.textHeader = "Sửa";
    this.data = data;

    if(this.data ==undefined)
    this.textHeader = "Thêm ";
    
}

NewContact.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(NewContact.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
NewContact.prototype.constructor = NewContact;

NewContact.prototype.getView = function () {
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
                            innerHTML:  self.textHeader+"Quận/Huyện"
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
                            class:"pizo-new-contact-container",
                            child:[
                                {
                                    tag:"div",
                                    class:"pizo-new-contact-container-name-container",
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-contact-container-name-container-label",
                                            props:{
                                                innerHTML:"Tên"
                                            }
                                        },
                                        {
                                            tag:"input",
                                            class:["pizo-new-contact-container-name-container-input","pizo-new-realty-dectruct-input"],
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-contact-container-email-container",
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-contact-container-email-container-label",
                                            props:{
                                                innerHTML:"Email"
                                            }
                                        },
                                        {
                                            tag:"input",
                                            class:"pizo-new-contact-container-email-container-input",
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-contact-container-phone-container",
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-contact-container-phone-container-label",
                                            props:{
                                                innerHTML:"Số điện thoại"
                                            }
                                        },
                                        {
                                            tag:"input",
                                            class:"pizo-new-contact-container-phone-container-input",
                                            props:{
                                                type:"number"
                                            }
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-contact-container-type-container",
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-contact-container-type-container-label",
                                            props:{
                                                innerHTML:"Tình trạng cuộc gọi"
                                            }
                                        },
                                        {
                                            tag:"selectmenu",
                                            class:"pizo-new-contact-container-type-container-input",
                                            props:{
                                                items:[
                                                    {text:"Còn hoạt động",value:1},
                                                    {text:"Sai số", value:0},
                                                    {text:"Gọi lại sau",value:2},
                                                    {text:"Bỏ qua",value:3},
                                                    {text:"Khóa máy",value:4}
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
    this.name = $('input.pizo-new-contact-container-name-container-input',this.$view);
    this.phone = $('input.pizo-new-contact-container-phone-container-input',this.$view);
    this.type = $('div.pizo-new-contact-container-type-container-input',this.$view);
    this.email = $('input.pizo-new-contact-container-email-container-input',this.$view);
    
    if(this.data!==undefined)
    {
        this.name.value = this.data.original.name;
        this.phone.value = this.data.original.phone;
        this.type.value = this.data.original.statusphone;
        this.email.value = this.data.original.email;
    }
    return this.$view;
}

NewContact.prototype.getDataSave = function() {
    
    return {
        id:this.data===undefined?undefined:this.data.original.id,
        name:this.name.value,
        phone:this.phone.value,
        statusphone:this.type.value,
        email:this.email.value
    }
}

NewContact.prototype.createPromise = function()
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

NewContact.prototype.resetPromise = function(value)
{
    if(self.promiseAddDB!==undefined)
    self.promiseAddDB = undefined;
    if(self.promiseEditDB!==undefined)
    self.promiseEditDB = undefined;
}

NewContact.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

NewContact.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.contact == "RUNNING")
        this.flushDataToView();
};

NewContact.prototype.flushDataToView = function () {
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

NewContact.prototype.start = function () {

}

export default NewContact;