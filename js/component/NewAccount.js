import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/NewAccount.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { locationView } from "./MapView";
import { formatDate, getGMT } from '../component/FormatFunction';

var _ = Fcore._;
var $ = Fcore.$;

function NewAccount(data) {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.data = data;
}

NewAccount.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(NewAccount.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
NewAccount.prototype.constructor = NewAccount;

NewAccount.prototype.createPromise = function()
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

NewAccount.prototype.resetPromise = function(value)
{
    if(self.promiseAddDB!==undefined)
    self.promiseAddDB = undefined;
    if(self.promiseEditDB!==undefined)
    self.promiseEditDB = undefined;
}

NewAccount.prototype.getView = function (dataParent) {
    if (this.$view) return this.$view;
    var self = this;
    self.createPromise();

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
                            innerHTML: "Thêm tài khoản"
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
    var active = _( {
        tag:"switch"
    })
    var activePemission = _( {
        tag:"switch",
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
                            class:"pizo-new-account-container",
                            child:[
                                {
                                    tag:"div",
                                    class:"pizo-new-account-container-username",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-account-container-username-container",
                                            child:[
                                                {
                                                    tag:"span",
                                                    class:"pizo-new-account-container-username-container-label",
                                                    props:{
                                                        innerHTML:"Tài khoản đăng nhập"
                                                    }
                                                },
                                                {
                                                    tag:"input",
                                                    class:["pizo-new-account-container-username-container-input","pizo-new-realty-dectruct-input"],
                                                    on:{
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-account-container-change-password",
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-change-password-show",
                                            props:{
                                                innerHTML:"Đổi mật khẩu"
                                            }
                                        },
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-change-password-hide",
                                            props:{
                                                innerHTML:"Ẩn đổi mật khẩu"
                                            }
                                        }
                                    ],
                                    on:{
                                        click:function(event){
                                            var container = $("div.pizo-new-account-container-password",self.$view);
                                            if(this.classList.contains("show-password-change"))
                                            {
                                                this.classList.remove("show-password-change");
                                                container.style.display = "none";
                                            }else
                                            {
                                                this.classList.add("show-password-change");
                                                container.style.display = "unset";
                                            }
                                        }
                                    }
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-account-container-password",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-account-container-password-container",
                                            child:[
                                                {
                                                    tag:"div",
                                                    class:"pizo-new-account-container-password-container-new",
                                                    child:[
                                                        {
                                                            tag:"span",
                                                            class:"pizo-new-account-container-password-container-label",
                                                            props:{
                                                                innerHTML:"Mật khẩu mới"
                                                            }
                                                        },
                                                        {
                                                            tag:"input",
                                                            class:["pizo-new-account-container-password-container-input-new","pizo-new-realty-dectruct-input"],
                                                            on:{
                                                            }
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag:"div",
                                                    class:"pizo-new-account-container-password-container-new-confirm",
                                                    child:[
                                                        {
                                                            tag:"span",
                                                            class:"pizo-new-account-container-password-container-label",
                                                            props:{
                                                                innerHTML:"Xác nhận mật khẩu"
                                                            }
                                                        },
                                                        {
                                                            tag:"input",
                                                            class:["pizo-new-account-container-password-container-input-new-confirm","pizo-new-realty-dectruct-input"],
                                                            on:{
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-account-container-name",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-account-container-name-container",
                                            child:[
                                                {
                                                    tag:"span",
                                                    class:"pizo-new-account-container-name-container-label",
                                                    props:{
                                                        innerHTML:"Họ và tên"
                                                    }
                                                },
                                                {
                                                    tag:"input",
                                                    class:["pizo-new-account-container-name-container-input","pizo-new-realty-dectruct-input"],
                                                    on:{
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-account-container-email",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-account-container-email-container",
                                            child:[
                                                {
                                                    tag:"span",
                                                    class:"pizo-new-account-container-email-container-label",
                                                    props:{
                                                        innerHTML:"Email"
                                                    }
                                                },
                                                {
                                                    tag:"input",
                                                    class:["pizo-new-account-container-email-container-input","pizo-new-realty-dectruct-input"],
                                                    on:{
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-account-container-phone-birthday-gender",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-account-container-phone",
                                            child:[
                                                {
                                                    tag:"div",
                                                    class:"pizo-new-account-container-phone-container",
                                                    child:[
                                                        {
                                                            tag:"span",
                                                            class:"pizo-new-account-container-phone-container-label",
                                                            props:{
                                                                innerHTML:"Số điện thoại"
                                                            }
                                                        },
                                                        {
                                                            tag:"input",
                                                            class:["pizo-new-account-container-phone-container-input","pizo-new-realty-dectruct-input"],
                                                            on:{
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            tag:"div",
                                            class:"pizo-new-account-container-birthday",
                                            child:[
                                                {
                                                    tag:"div",
                                                    class:"pizo-new-account-container-birthday-container",
                                                    child:[
                                                        {
                                                            tag:"span",
                                                            class:"pizo-new-account-container-birthday-container-label",
                                                            props:{
                                                                innerHTML:"Ngày sinh"
                                                            }
                                                        },
                                                        {
                                                            tag: 'calendar-input',
                                                            data: {
                                                                anchor: 'top',
                                                                value: new Date(new Date().getFullYear(), 0, 1),
                                                                maxDateLimit: new Date()
                                                            },
                                                            on: {
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            tag:"div",
                                            class:"pizo-new-account-container-gender",
                                            child:[
                                                {
                                                    tag:"div",
                                                    class:"pizo-new-account-container-gender-container",
                                                    child:[
                                                        {
                                                            tag:"span",
                                                            class:"pizo-new-account-container-gender-container-label",
                                                            props:{
                                                                innerHTML:"Giới tính"
                                                            }
                                                        },
                                                        {
                                                            tag:"selectmenu",
                                                            props:{
                                                                items:[
                                                                    {text:"Nam",value:"Nam"},
                                                                    {text:"Nữ",value:"Nữ"}
                                                                ]
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                
                                // {
                                //     tag:"div",
                                //     class:"pizo-new-account-container-avatar",
                                //     child:[
                                //         {
                                //             tag:"div",
                                //             class:"pizo-new-account-container-avatar-container",
                                //             child:[
                                //                 {
                                //                     tag:"span",
                                //                     class:"pizo-new-account-container-avatar-container-label",
                                //                     props:{
                                //                         innerHTML:"Avatar"
                                //                     }
                                //                 },
                                //                 {
                                //                     tag:"div",
                                //                     class:"pizo-new-account-container-avatar-container-image",
                                //                     child:[
                                //                         {
                                //                             tag:"img",
                                //                             class:"pizo-new-account-container-avatar-container-image-content",
                                //                         }
                                //                     ]
                                //                 }
                                //             ]
                                //         }
                                //     ]
                                // },
                                
                                {
                                    tag:"div",
                                    class:"pizo-new-account-container-address",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-account-container-address-container",
                                            child:[
                                                {
                                                    tag:"span",
                                                    class:"pizo-new-account-container-address-container-label",
                                                    props:{
                                                        innerHTML:"Địa chỉ"
                                                    }
                                                },
                                                {
                                                    tag: "input",
                                                    class: ["pizo-new-account-container-address-container-input"],
                                                    on: {
                                                        click: function (event) {
                                                            this.blur();
                                                            var selfElement = this;
                                                            var childNode = locationView(function (value) {
                                                                selfElement.value = value.input.value;
                                                                childRemove.selfRemove();
                                                            })
                                                            var childRemove = _({
                                                                tag: "modal",
                                                                on: {
                                                                    click: function (event) {
                                                                        var target = event.target;
                                                                        while (target !== childNode && target !== childRemove && target !== document.body)
                                                                            target = target.parentNode;
                                                                        if (target === childRemove)
                                                                            childRemove.selfRemove();
                                                                    }
                                                                },
                                                                child: [
                                                                    childNode
                                                                ]
                                                            })
                                                            self.$view.addChild(childRemove)
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-account-container-status-position",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-account-container-position",
                                            child:[
                                                {
                                                    tag:"div",
                                                    class:"pizo-new-account-container-position-container",
                                                    child:[
                                                        {
                                                            tag:"span",
                                                            class:"pizo-new-account-container-position-container-label",
                                                            props:{
                                                                innerHTML:"Chức vụ"
                                                            }
                                                        },
                                                        {
                                                            tag:"div",
                                                            class:"pizo-new-account-container-position-container-input",
                                                            child:[
                                                                {
                                                                    tag:"selectmenu",
                                                                    class:["pizo-new-account-selectbox-container-input","pizo-new-realty-dectruct-input"],
                                                                    props:{
                                                                        enableSearch: true,
                                                                        items:dataParent
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
            
                                        },
                                        {
                                            tag:"div",
                                            class:"pizo-new-account-container-status",
                                            child:[
                                                {
                                                    tag:"div",
                                                    class:"pizo-new-account-container-status-container",
                                                    child:[
                                                        {
                                                            tag:"span",
                                                            class:"pizo-new-account-container-status-container-label",
                                                            props:{
                                                                innerHTML:"Hoạt động"
                                                            }
                                                        },
                                                        active
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            tag:"div",
                                            class:"pizo-new-account-container-permission",
                                            child:[
                                                {
                                                    tag:"div",
                                                    class:"pizo-new-account-container-permission-container",
                                                    child:[
                                                        {
                                                            tag:"span",
                                                            class:"pizo-new-account-container-permission-container-label",
                                                            props:{
                                                                innerHTML:"Quyền hệ thống"
                                                            }
                                                        },
                                                        activePemission
                                                    ]
                                                }
                                            ]
                                        },
                                    ]
                                }
                                
                            ]
                        }
                    ]
                }
            ]   
        })
        );

    this.name = $('input.pizo-new-account-container-name-container-input',this.$view);
    this.username = $('input.pizo-new-account-container-username-container-input',this.$view);
    this.email = $('input.pizo-new-account-container-email-container-input',this.$view);
    this.phone = $('input.pizo-new-account-container-phone-container-input',this.$view);
    this.birthday = $('div.pizo-new-account-container-birthday-container div',this.$view);
    this.gender = $('div.pizo-new-account-container-gender-container div',this.$view);
    this.address = $('input.pizo-new-account-container-address-container-input',this.$view);
    this.position = $('div.pizo-new-account-selectbox-container-input',this.$view);
    this.status = $('div.pizo-new-account-container-status-container label.absol-switch',this.$view);
    this.permission = $('div.pizo-new-account-container-permission-container label.absol-switch',this.$view);
    if(this.data!==undefined)
    {
        this.name.value = this.data.original.name;
        this.username.value = this.data.original.username;
        this.username.setAttribute("disabled","");
        this.email.value = this.data.original.email;
        this.phone.value = this.data.original.phone;
        this.birthday.value = new Date(this.data.original.birthday);
        this.gender.value = this.data.original.gender;
        this.address.value = this.data.original.address;
        this.position.value = parseInt(this.data.original.positionid);
        this.status.checked = parseInt(this.data.original.status)?true:false;
        this.permission.checked = parseInt(this.data.original.permission)?true:false;
    }
    return this.$view;
}

NewAccount.prototype.getDataSave = function() {
    
    return {
        id:this.data===undefined?undefined:this.data.original.id,
        name:this.name.value,
        username:this.username.value,
        email:this.email.value,
        phone:this.phone.value,
        birthday: getGMT(this.birthday.value,new Date().getTimezoneOffset()/-60,true),
        gender:this.gender.value,
        address:this.address.value,
        positionid:this.position.value,
        status:this.status.checked?1:0,
        permission:this.permission.checked?1:0
    }
}

NewAccount.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

NewAccount.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

NewAccount.prototype.flushDataToView = function () {
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

NewAccount.prototype.start = function () {

}

export default NewAccount;