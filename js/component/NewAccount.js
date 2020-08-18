import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/NewAccount.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { formatDate, getGMT } from '../component/FormatFunction';
import { locationView } from "./MapView";
import xmlModalDragImage from './modal_drag_drop_image';
import moduleDatabase from '../component/ModuleDatabase';

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

    var x = [{text:"Không có chức danh", value:0}];
    for(var i = 0;i<dataParent.length;i++)
    {
        x.push(dataParent[i])
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
    var address = this.itemAddressOld();
    if(this.data!==undefined){
        if(this.data.original.addressid!=0)
        moduleDatabase.getModule("addresses_user").load({WHERE:[{id:self.data.original.addressid}]}).then(function(valueAdr){
            self.checkAddress = moduleDatabase.getModule("addresses_user").getLibary("id");
            var connect = "";
            var arr = [];
            console.log(valueAdr)
            for(var i = 0;i<valueAdr.length;i++)
            {
                if(connect!=="")
                arr.push(connect);
                arr.push({id:valueAdr[i].streetid});
                connect = "||";
            }
            console.log(arr)
            moduleDatabase.getModule("streets").load({WHERE:arr}).then(function(valueStr){
                self.checkStreet = moduleDatabase.getModule("streets").getLibary("id");
                self.checkState = moduleDatabase.getModule("states").getLibary("id");
                self.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");
                self.checkWard = moduleDatabase.getModule("wards").getLibary("id");
                address.setAddressData(self.data.original.addressid);
            })
        })
    }

    var container;
    var state,district,ward,street;
    state = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu",
        props:{
            enableSearch: true
        },
        on:{
            change:function(event)
            {
                var x = parseInt(getIDCompair(this.value));
                for(var i = 0;i<temp.checkStateDistrict[x].length;i++)
                {
                    if(temp.checkStateDistrict[x][i] == district.value)
                    return;
                }
                if(temp.checkStateDistrict[x]!==undefined)
                district.items = temp.checkStateDistrict[x];
                district.emit("change");
                if(event!==undefined)
                temp.setInput();
            }
        }
    });
    district = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu",
        props:{
            enableSearch: true
        },
        style:{
            poiterEvent:"none",
            backGroundColor:"#fafafa"
        },
        on:{
            change:function(event){
                var x = parseInt(getIDCompair(this.value));
                if(temp.checkDistrictWard[x]!==undefined)
                {
                    ward.items = temp.checkDistrictWard[x];
                    ward.emit("change");
                }
                
                if(event!==undefined)
                temp.setInput();
            }
        }
    });
    ward = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu",
        props:{
            enableSearch: true
        },
        style:{
            poiterEvent:"none",
            backGroundColor:"#fafafa"
        },
        on:{
            change:function(event)
            {
                var x = parseInt(getIDCompair(this.value));
                moduleDatabase.getModule("streets").load({WHERE:[{wardid:x}]}).then(function(value){
                    temp.checkWardStreet = moduleDatabase.getModule("streets").getLibary("wardid",function(data){
                        return {text:data.name,value:data.name+"_"+data.id}
                    },true);
                    street.items = temp.checkWardStreet[x];
                    if(event!==undefined)
                    temp.setInput();
                })
                
            }
        }
    });
    street = _({
        tag: "selectmenu",
        class: "pizo-new-realty-location-detail-row-menu",
        style:{
            poiterEvent:"none",
            backGroundColor:"#fafafa"
        },
        on:{
            change:function(event)
            {
                if(event!==undefined)
                temp.setInput();
            }
        }
    });
    this.$view.addChild(_({
            tag:"div",
            class:["pizo-list-realty-main"],
            child:[
                {
                    tag:"div",
                    class:["pizo-list-realty-main-result-control-advance"],
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
                                                            attr:{
                                                                type:"password"
                                                            },
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
                                                            attr:{
                                                                type:"password"
                                                            },
                                                            on:{
                                                                change:function()
                                                                {

                                                                }
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
                                                            props:{
                                                                type:"number"
                                                            },
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
                                {
                                    tag:"div",
                                    class:"pizo-new-account-container-avatar",
                                    child:[
                                        {
                                            tag:"div",
                                            class:"pizo-new-account-container-avatar-container",
                                            child:[
                                                {
                                                    tag:"span",
                                                    class:"pizo-new-account-container-avatar-container-label",
                                                    props:{
                                                        innerHTML:"Avatar"
                                                    }
                                                },
                                                {
                                                    tag:"div",
                                                    class:"pizo-new-account-container-avatar-container-image",
                                                    on:{
                                                        click:function(event){
                                                            xmlModalDragImage.createModal(document.body,function(){
                                                                if(xmlModalDragImage.imgUrl)
                                                                this.childNodes[0].src = xmlModalDragImage.imgUrl.src;
                                                            }.bind(this));
                                                            xmlModalDragImage.addImage(this.childNodes[0].src);
                                                        }
                                                    },
                                                    child:[
                                                        {
                                                            tag:"img",
                                                            class:"pizo-new-account-container-avatar-container-image-content",
                                                            attr:{
                                                                src:"../assets/avatar/avatar-default.png"
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
                                    class:"pizo-new-account-container-address",
                                    child:[
                                        address,
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
                                                                        items:x
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
                                        // {
                                        //     tag:"div",
                                        //     class:"pizo-new-account-container-permission",
                                        //     child:[
                                        //         {
                                        //             tag:"div",
                                        //             class:"pizo-new-account-container-permission-container",
                                        //             child:[
                                        //                 {
                                        //                     tag:"span",
                                        //                     class:"pizo-new-account-container-permission-container-label",
                                        //                     props:{
                                        //                         innerHTML:"Quyền hệ thống"
                                        //                     }
                                        //                 },
                                        //                 activePemission
                                        //             ]
                                        //         }
                                        //     ]
                                        // },
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:"pizo-new-account-container-permission-realty",
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-prermission-label",
                                            props:{
                                                innerHTML:"Quyền bất động sản"
                                            }
                                        },
                                        {
                                            tag:"div",
                                            class:["pizo-new-account-container-permission-1","pizo-new-account-container-permission-child"],
                                            child:[
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                    child: [
                                                        {
                                                            tag: "span",
                                                            class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                            props: {
                                                                innerHTML: "Danh sách"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                    child: [
                                                        {
                                                            tag: "span",
                                                            class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                            props: {
                                                                innerHTML: "Thêm"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                    child: [
                                                        {
                                                            tag: "span",
                                                            class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                            props: {
                                                                innerHTML: "Sửa"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                    child: [
                                                        {
                                                            tag: "span",
                                                            class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                            props: {
                                                                innerHTML: "Xóa"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                        }
                                                    ]
                                                },
                                            ]
                                        },
                                        {
                                            tag:"div",
                                            class:["pizo-new-account-container-permission-2","pizo-new-account-container-permission-child"],
                                            child:[
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                    child: [
                                                        {
                                                            tag: "span",
                                                            class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                            props: {
                                                                innerHTML: "Sửa (liên hệ)"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                    child: [
                                                        {
                                                            tag: "span",
                                                            class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                            props: {
                                                                innerHTML: "Xóa (liên hệ)"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                    child: [
                                                        {
                                                            tag: "span",
                                                            class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                            props: {
                                                                innerHTML: "Cần kiểm duyệt"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                    child: [
                                                        {
                                                            tag: "span",
                                                            class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                            props: {
                                                                innerHTML: "Sửa (Cần kiểm duyệt)"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                        }
                                                    ]
                                                },
                                            ]
                                        },
                                        {
                                            tag:"div",
                                            class:["pizo-new-account-container-permission-3","pizo-new-account-container-permission-child"],
                                            child:[
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                    child: [
                                                        {
                                                            tag: "span",
                                                            class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                            props: {
                                                                innerHTML: "Gộp dự án"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                    child: [
                                                        {
                                                            tag: "span",
                                                            class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                            props: {
                                                                innerHTML: "Yêu cầu gọi lại"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                    child: [
                                                        {
                                                            tag: "span",
                                                            class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                            props: {
                                                                innerHTML: "Thực hiện gọi lại"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                    child: [
                                                        {
                                                            tag: "span",
                                                            class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                            props: {
                                                                innerHTML: "Upload hình ảnh nhanh"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                        }
                                                    ]
                                                },
                                            ]
                                        },
                                        {
                                            tag:"div",
                                            class:["pizo-new-account-container-permission-4","pizo-new-account-container-permission-child"],
                                            child:[
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                    style:{
                                                        width:"25%"
                                                    },
                                                    child: [
                                                        {
                                                            tag: "span",
                                                            class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                            props: {
                                                                innerHTML: "Chi tiết"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                    style:{
                                                        width:"25%"
                                                    },
                                                    child: [
                                                        {
                                                            tag: "span",
                                                            class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                            props: {
                                                                innerHTML: "Yêu cầu chỉnh sửa"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                    style:{
                                                        width:"50%"
                                                    },
                                                    child: [
                                                        {
                                                            tag: "span",
                                                            class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                            props: {
                                                                innerHTML: "Đồng ý/Từ chối"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                        }
                                                    ]
                                                },
                                            ]
                                        },
                                    ]
                                }
                            ]
                        },
                        {
                            tag:"div",
                            class:"pizo-new-account-container-permission",
                            child:[
                                {
                                    tag:"span",
                                    class:"pizo-new-account-container-prermission-label",
                                    props:{
                                        innerHTML:"Quyền hệ thống"
                                    }
                                },
                                {
                                    tag:"div",
                                    class:["pizo-new-account-container-permission-user","pizo-new-account-container-permission-child"],
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-prermission-container-label",
                                            props:{
                                                innerHTML:"Tài khoản"
                                            }
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Danh sách"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Thêm"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Sửa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Xóa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:["pizo-new-account-container-permission-position","pizo-new-account-container-permission-child"],
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-prermission-container-label",
                                            props:{
                                                innerHTML:"Sơ đồ tổ chức"
                                            }
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Danh sách"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Thêm"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Sửa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Xóa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:["pizo-new-account-container-permission-contact","pizo-new-account-container-permission-child"],
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-prermission-container-label",
                                            props:{
                                                innerHTML:"Liên hệ"
                                            }
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Danh sách"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Thêm"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Sửa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Xóa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:["pizo-new-account-container-permission-notification","pizo-new-account-container-permission-child"],
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-prermission-container-label",
                                            props:{
                                                innerHTML:"Thông báo"
                                            }
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            style:{
                                                width: 100/3+"%"
                                            },
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Danh sách"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Push"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:["pizo-new-account-container-permission-state","pizo-new-account-container-permission-child"],
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-prermission-container-label",
                                            props:{
                                                innerHTML:"Tỉnh/TP"
                                            }
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Danh sách"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Thêm"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Sửa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Xóa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:["pizo-new-account-container-permission-district","pizo-new-account-container-permission-child"],
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-prermission-container-label",
                                            props:{
                                                innerHTML:"Quận/Huyện"
                                            }
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Danh sách"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Thêm"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Sửa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Xóa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:["pizo-new-account-container-permission-ward","pizo-new-account-container-permission-child"],
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-prermission-container-label",
                                            props:{
                                                innerHTML:"Tài khoản"
                                            }
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Danh sách"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Thêm"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Sửa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Xóa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:["pizo-new-account-container-permission-street","pizo-new-account-container-permission-child"],
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-prermission-container-label",
                                            props:{
                                                innerHTML:"Đường"
                                            }
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Danh sách"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Thêm"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Sửa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Xóa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:["pizo-new-account-container-permission-planing_information","pizo-new-account-container-permission-child"],
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-prermission-container-label",
                                            props:{
                                                innerHTML:"Thông tin quy hoạch"
                                            }
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Danh sách"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Thêm"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Sửa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Xóa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:["pizo-new-account-container-permission-equipments","pizo-new-account-container-permission-child"],
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-prermission-container-label",
                                            props:{
                                                innerHTML:"Tiện nghi trong nhà"
                                            }
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Danh sách"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Thêm"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Sửa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Xóa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:["pizo-new-account-container-permission-juridicals","pizo-new-account-container-permission-child"],
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-prermission-container-label",
                                            props:{
                                                innerHTML:"Pháp lý"
                                            }
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Danh sách"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Thêm"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Sửa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Xóa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:["pizo-new-account-container-permission-ex_im","pizo-new-account-container-permission-child"],
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-prermission-container-label",
                                            props:{
                                                innerHTML:"Tài khoản"
                                            }
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Danh sách"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Thêm"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Sửa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Xóa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:["pizo-new-account-container-permission-report","pizo-new-account-container-permission-child"],
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-prermission-container-label",
                                            props:{
                                                innerHTML:"Báo cáo"
                                            }
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            style:{
                                                width:"25%"
                                            },
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Tổng quát"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            style:{
                                                width:"25%"
                                            },
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Cuộc gọi"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            style:{
                                                width:"50%"
                                            },
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Upload hình"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:["pizo-new-account-container-permission-type_realty","pizo-new-account-container-permission-child"],
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-prermission-container-label",
                                            props:{
                                                innerHTML:"Loại bất động sản"
                                            }
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Danh sách"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Thêm"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Sửa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Xóa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    tag:"div",
                                    class:["pizo-new-account-container-permission-help","pizo-new-account-container-permission-child"],
                                    child:[
                                        {
                                            tag:"span",
                                            class:"pizo-new-account-container-prermission-container-label",
                                            props:{
                                                innerHTML:"Trợ giúp"
                                            }
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Danh sách"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Thêm"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Sửa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                                {
                                                    tag: "span",
                                                    class: "pizo-new-realty-desc-detail-row-cell-menu-ultra-span",
                                                    props: {
                                                        innerHTML: "Xóa"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: "pizo-new-realty-desc-detail-row-menu-1-checkbox"
                                                }
                                            ]
                                        },
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    tag:"div",
                    class:["pizo-list-realty-main-result-control-advance"],
                    child:[
                        {
                            tag: "div",
                            class: "pizo-new-realty-location-detail",
                            style:{
                                marginTop:"10px",
                                width: "calc(37.5% - 10px)"
                            },
                            child: [
                                {
                                    tag: "div",
                                    class: "pizo-new-realty-location-detail-row",
                                    child: [
                                        {
                                            tag: "span",
                                            class: "pizo-new-realty-location-detail-row-label",
                                            props: {
                                                innerHTML: "Tỉnh/TP"
                                            }
                                        },
                                        state
                                    ]
                                },
                                {
                                    tag: "div",
                                    class: "pizo-new-realty-location-detail-row",
                                    child: [
                                        {
                                            tag: "span",
                                            class: "pizo-new-realty-location-detail-row-label",
                                            props: {
                                                innerHTML: "Quận/Huyện"
                                            }
                                        },
                                        district
                                    ]
                                },
                                {
                                    tag: "div",
                                    class: "pizo-new-realty-location-detail-row",
                                    child: [
                                        {
                                            tag: "span",
                                            class: "pizo-new-realty-location-detail-row-label",
                                            props: {
                                                innerHTML: "Phường/Xã"
                                            }
                                        },
                                        ward
                                    ]
                                },
                                {
                                    tag: "div",
                                    class: "pizo-new-realty-location-detail-row",
                                    child: [
                                        {
                                            tag: "span",
                                            class: "pizo-new-realty-location-detail-row-label",
                                            props: {
                                                innerHTML: "Đường"
                                            }
                                        },
                                        street
                                    ]
                                },
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
    this.address = address;
    this.position = $('div.pizo-new-account-selectbox-container-input',this.$view);
    this.status = $('div.pizo-new-account-container-status-container label.absol-switch',this.$view);
    // this.permission = $('div.pizo-new-account-container-permission-container label.absol-switch',this.$view);
    this.avatar = $("img.pizo-new-account-container-avatar-container-image-content",this.$view);
    container = $("div.pizo-new-account-container-password",self.$view);
    if(this.data!==undefined)
    {
        this.name.value = this.data.original.name;
        this.username.value = this.data.original.username;
        this.username.setAttribute("disabled","");
        this.email.value = this.data.original.email;
        this.phone.value = this.data.original.phone;
        this.birthday.value = new Date(this.data.original.birthday);
        this.gender.value = this.data.original.gender;
        this.position.value = parseInt(this.data.original.positionid);
        this.status.checked = parseInt(this.data.original.status)?true:false;
        // this.permission.checked = parseInt(this.data.original.permission)?true:false;
        if(this.data.original.avatar!=="")
        {
            this.avatar.src = "https://lab.daithangminh.vn/home_co/pizo/assets/avatar/"+this.data.original.avatar;
        }
    }else
    {
        $("div.pizo-new-account-container-change-password",this.$view).style.display = "none";
        container.style.display = "unset";
    }
    return this.$view;
}

NewAccount.prototype.itemAddressOld = function(data = {addressid_old:0})
{
    var addressid;
    if(data.addressid_old !== undefined)
    addressid = data.addressid_old;
    else
    addressid = 0;
    var temp = _({
        tag: "div",
        class: ["pizo-new-account-container-address-container", "addressItemCheck"],
        child: [
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
                            temp.data = childNode.getDataCurrent();
                            childRemove.selfRemove();

                        },temp.data)
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
                        temp.appendChild(childRemove)
                    }
                }
            }
        ]
    })
    temp.setAddressData = function(addressid = 0)
    {
        if(addressid!=0)
        {
            var number = this.checkAddress[addressid].addressnumber;
            var street = this.checkStreet[this.checkAddress[addressid].streetid].name;
            var ward = this.checkWard[this.checkAddress[addressid].wardid].name;
            var district = this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].name;
            var state = this.checkState[this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].stateid].name;
            $("input.pizo-new-account-container-address-container-input",temp).value = number+" "+street+", "+ward+", "+district+", "+state;
            temp.data = {
                number:this.checkAddress[addressid].addressnumber,
                street:this.checkStreet[this.checkAddress[addressid].streetid].name+"_"+this.checkAddress[addressid].streetid,
                ward:this.checkWard[this.checkAddress[addressid].wardid].name+"_"+this.checkAddress[addressid].wardid,
                district:this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].name+"_"+this.checkWard[this.checkAddress[addressid].wardid].districtid,
                state:this.checkState[this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].stateid].name+"_"+this.checkDistrict[this.checkWard[this.checkAddress[addressid].wardid].districtid].stateid
            }
        }
    }.bind(this)
    temp.setAddressData(addressid);
    return temp;
}


NewAccount.prototype.getDataSave = function() {
    var avatar = this.avatar.src;
    avatar = avatar.replace("https://lab.daithangminh.vn/home_co/pizo/assets/avatar/","");
    var temp = {
        name:this.name.value,
        username:this.username.value,
        email:this.email.value,
        phone:this.phone.value,
        birthday: getGMT(this.birthday.value,new Date().getTimezoneOffset()/-60,true),
        gender:this.gender.value,
        positionid:this.position.value,
        status:this.status.checked?1:0,
        // permission:this.permission.checked?1:0,
        avatar:avatar
    }

    if(this.address.data!==undefined){
        var address = {};
        var data = this.address.data;

        var lastIndex = data.ward.lastIndexOf("_");
        if(lastIndex === -1)
        {
            address.ward = data.ward;
            lastIndex = data.district.lastIndexOf("_");
            if(lastIndex == -1)
            {
                address.district = data.district;
                lastIndex = data.state.lastIndexOf("_");
                if(lastIndex == -1)
                {
                    address.state = data.state;
                }else
                {
                    address.stateid = data.state.slice(lastIndex+1);
                }
            }
            else
                address.districtid = data.district.slice(lastIndex+1);
        }
        else
        address.wardid = data.ward.slice(lastIndex+1);
        
        var lastIndex = data.street.lastIndexOf("_");
        if(lastIndex === -1)
        address.street = data.street;
        else
        address.streetid = data.street.slice(lastIndex+1);

        address.number = data.number;

        temp.addressid = address;
    }
    if(this.data!==undefined)
    temp.id = this.data.original.id;
    return temp;
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