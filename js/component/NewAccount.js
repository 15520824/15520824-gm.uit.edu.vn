import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/NewAccount.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { getIDCompair, getGMT, getNameCompair } from '../component/FormatFunction';
import { locationView } from "./MapView";
import xmlModalDragImage from './modal_drag_drop_image';
import moduleDatabase from '../component/ModuleDatabase';
import { confirmQuestion } from './ModuleView';
var _ = Fcore._;
var $ = Fcore.$;

function NewAccount(data) {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.data = data;
    if(data!==undefined)
    this.textHeader = "Sửa ";
    else
    this.textHeader = "Thêm ";
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

NewAccount.prototype.setOnlyInformation = function()
{
    this.isOnlyInformation = true
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
                            innerHTML: this.textHeader+" tài khoản"
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
                                        var tempData = self.getDataSave();
                                    
                                        if(tempData!==undefined)
                                        {
                                            self.resolveDB(tempData);
                                            self.createPromise();
                                        }
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
                                        var tempData = self.getDataSave();
                                        if(tempData!==undefined)
                                        {
                                            self.resolveDB(tempData);
                                            self.$view.selfRemove();
                                            var arr = self.parent.body.getAllChild();
                                            self.parent.body.activeFrame(arr[arr.length - 1]);
                                        }
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
    var address = this.itemAddressOld();
    if(this.data!==undefined){
        if(this.data.original.addressid!=0)
        moduleDatabase.getModule("addresses_user").load({WHERE:[{id:self.data.original.addressid}]}).then(function(valueAdr){
            self.checkAddress = moduleDatabase.getModule("addresses_user").getLibary("id");
            var connect = "";
            var arr = [];
            for(var i = 0;i<valueAdr.length;i++)
            {
                if(connect!=="")
                arr.push(connect);
                arr.push({id:valueAdr[i].streetid});
                connect = "||";
            }

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
        class: "pizo-new-realty-desc-detail-row-permission-state",
        props:{
            enableSearch: true
        },
        on:{
            change:function(event)
            {
                var x = parseInt(getIDCompair(this.value));
                if(x == 0){
                    district.items = [{text:"Tất cả",value:0}]
                    district.value = 0;
                }else
                {
                    for(var i = 0;i<self.checkStateDistrict[x].length;i++)
                    {
                        if(self.checkStateDistrict[x][i] == district.value)
                        return;
                    }
                    if(self.checkStateDistrict[x]!==undefined);
                    district.items = [{text:"Tất cả",value:0}].concat(self.checkStateDistrict[x]);
                }
                district.emit("change");
                if(event!==undefined)
                {
                    if(this.value == 0)
                    self.setValueNull("state");
                    else
                    self.addPermissionParent({stateid:this.value});
                }
            }
        }
    });
    district = _({
        tag: "selectmenu",
        class: "pizo-new-realty-desc-detail-row-permission-district",
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
                if(x == 0){
                    ward.items = [{text:"Tất cả",value:0}]
                    ward.value = 0;
                }else
                {
                    if(self.checkDistrictWard[x]!==undefined)
                    {
                        ward.items = [{text:"Tất cả",value:0}].concat(self.checkDistrictWard[x]);
                    }    
                }
                ward.emit("change");
                if(event!==undefined)
                {
                    if(this.value == 0)
                    self.setValueNull("district");
                    else
                    self.addPermissionParent({districtid:this.value});
                }
            }
        }
    });
    ward = _({
        tag: "selectmenu",
        class: "pizo-new-realty-desc-detail-row-permission-ward",
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
                if(x == 0)
                {
                    street.items = [{text:"Tất cả",value:0}];
                }else
                moduleDatabase.getModule("streets").load({WHERE:[{wardid:x}]}).then(function(value){
                    self.checkWardStreet = moduleDatabase.getModule("streets").getLibary("wardid",function(data){
                        return {text:data.name,value:data.name+"_"+data.id}
                    },true);
                    street.items = [{text:"Tất cả",value:0}].concat(self.checkWardStreet[x]);
                })
                street.emit("change");
                if(event!==undefined)
                {
                    if(this.value == 0)
                    self.setValueNull("ward");
                    else
                    self.addPermissionParent({wardid:this.value});
                }
            }
        }
    });
    street = _({
        tag: "selectmenu",
        class: "pizo-new-realty-desc-detail-row-permission-street",
        style:{
            poiterEvent:"none",
            backGroundColor:"#fafafa"
        },
        on:{
            change:function(event)
            {
                if(event!==undefined)
                {
                    if(event!==undefined)
                    {
                        if(this.value == 0)
                        self.setValueNull("ward");
                        else
                        self.addPermissionParent({streetid:this.value});
                    }
                }
            }
        }
    });
    var selectPermission = _({
        tag:"selectbox",
        class:"pizo-new-account-container-permission-addvance-selectmenu-content",
        on:{
            click:function(event)
            {
                var element = event.target;
                while(!(element.classList.contains("absol-selectbox-item-close")||element.classList.contains("absol-selectbox-item")||element.classList.contains("absol-selectbox")))
                element = element.parentNode;
                if(element.classList.contains("absol-selectbox-item"))
                {
                    var dataTemp = JSON.parse(element.data.value);
                    if(dataTemp["streetid"]!==undefined)
                    {
                        street.value = dataTemp["streetid"];
                        street.emit("change");

                        ward.value = dataTemp["wardid"];
                        ward.emit("change"); 

                        district.value = dataTemp["districtid"];
                        district.emit("change"); 

                        state.value = dataTemp["stateid"];
                        state.emit("change"); 

                    }else
                    {
                        if(dataTemp["wardid"]!==undefined)
                        {
                            ward.value = dataTemp["wardid"];
                            ward.emit("change");

                            district.value = dataTemp["districtid"];
                            district.emit("change"); 
    
                            state.value = dataTemp["stateid"];
                            state.emit("change"); 
                             
                            street.value = 0;
                            street.emit("change");
                        }else
                        {
                            if(dataTemp["districtid"]!==undefined)
                            {
                                district.value = dataTemp["districtid"];
                                district.emit("change");

                                state.value = dataTemp["stateid"];
                                state.emit("change"); 

                                ward.value = 0;
                                ward.emit("change");
                            }else
                            {
                                if(dataTemp["stateid"]!==undefined)
                                {
                                    state.value = dataTemp["stateid"];
                                    state.emit("change");

                                    district.value = 0;
                                    district.emit("change");
                                }else
                                {
                                    state.value = 0;
                                    state.emit("change");
                                }
                            }
                        }
                    }
                    self.resetPermission();
                    var objectPermission = self.checkPermission[element.data.value];
                    self.addPermissionParent(JSON.parse(element.data.value));
                    for(var i = 0;i<objectPermission.length;i++)
                    {
                        $("div.checkbox_"+objectPermission[i],self.$view).checked = true;
                    }
                    self.resetPermissionChoice();
                    element.classList.add("selectedIItem");
                }
            },
            remove:function(event)
            {
                if(self.checkPermission[event.itemElt.data.value]!==undefined)
                {
                    delete self.checkPermission[event.itemElt.data.value]!==undefined;
                }
                if(event.itemElt.classList.contains("selectedIItem"))
                {
                    if(selectPermission.values.indexOf(0)!==-1)
                    {
                        var arrayItem = selectPermission.getElementsByClassName("absol-selectbox-item");
                        for(var i = 0;i<arrayItem.length;i++)
                        {
                            if(arrayItem[i].data.value == 0)
                            {
                                arrayItem[i].click();
                                break;
                            }
                        }
                    }else
                    {
                        var arrayItem = selectPermission.getElementsByClassName("absol-selectbox-item");
                        if(arrayItem.length)
                        {
                            arrayItem[0].click();
                        }
                    }
                }else
                {
                    var selected = $("div.absol-selectbox-item.selectedIItem",selectPermission);
                    if(selected!==undefined)
                    {
                        selected.click();
                    }
                }
            }
        },
        props:{
            items:[],
            disableClickToFocus:true
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
                                                            },
                                                            child:[
                                                                {
                                                                    tag: "span",
                                                                    class: "pizo-new-realty-location-detail-row-label-important",
                                                                    props: {
                                                                        innerHTML: "*"
                                                                    }
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            tag:"input",
                                                            class:["pizo-new-account-container-phone-container-input","pizo-new-realty-dectruct-input"],
                                                            props:{
                                                                type:"number"
                                                            },
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
                                                    child:[
                                                        {
                                                            tag:"img",
                                                            class:"pizo-new-account-container-avatar-container-image-content",
                                                            attr:{
                                                                src:"./assets/avatar/avatar-default.png"
                                                            },
                                                            on:{
                                                                click:function(event){
                                                                    xmlModalDragImage.createModal(document.body,function(){
                                                                        if(xmlModalDragImage.imgUrl)
                                                                        this.src = xmlModalDragImage.imgUrl.src;
                                                                    }.bind(this));
                                                                    xmlModalDragImage.addImage(this.src);
                                                                }
                                                            },
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
                                                                    class:["pizo-new-account-selectbox-container-input","pizo-new-realty-dectruct-input","disabled"],
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
                                                            class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_56"],
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
                                                            class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_57"],
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
                                                            class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_58"],
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
                                                            class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_59"],
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
                                                            class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_60"],
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
                                                            class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_61"],
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
                                                            class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_62"],
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
                                                            class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_63"],
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
                                                            class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_64"],
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
                                                            class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_65"],
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
                                                            class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_66"],
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
                                                                innerHTML: "Chi tiết"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_67"],
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
                                                            class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_68"],
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
                                                                innerHTML: "Xác nhận chỉnh sửa"
                                                            }
                                                        },
                                                        {
                                                            tag: "checkbox",
                                                            class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_69"],
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                },
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-realty-desc-detail-row-permission",
                                                }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_1"],
                                                   on:{
                                                        click:function(event)
                                                        {
                                                            if(this.checked == false)
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = true;
                                                                }
                                                            }else
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = false;
                                                                }
                                                            }
                                                        }
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_2"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_3"],
                                                    props:{
                                                        disabled : true
                                                    }

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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_4"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_5"],
                                                   on:{
                                                        click:function(event)
                                                        {
                                                            if(this.checked == false)
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = true;
                                                                }
                                                            }else
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = false;
                                                                }
                                                            }
                                                        }
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_6"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_7"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_8"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_9"],
                                                    on:{
                                                        click:function(event)
                                                        {
                                                            if(this.checked == false)
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = true;
                                                                }
                                                            }else
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = false;
                                                                }
                                                            }
                                                        }
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_10"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_11"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_12"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_49"],
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_50"]
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                        }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_13"],
                                                   on:{
                                                        click:function(event)
                                                        {
                                                            if(this.checked == false)
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = true;
                                                                }
                                                            }else
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = false;
                                                                }
                                                            }
                                                        }
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_14"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_15"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_16"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_17"],
                                                   on:{
                                                        click:function(event)
                                                        {
                                                            if(this.checked == false)
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = true;
                                                                }
                                                            }else
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = false;
                                                                }
                                                            }
                                                        }
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_18"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_19"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_20"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                innerHTML:"Phường/ xã"
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_21"],
                                                   on:{
                                                        click:function(event)
                                                        {
                                                            if(this.checked == false)
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = true;
                                                                }
                                                            }else
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = false;
                                                                }
                                                            }
                                                        }
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_22"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_23"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_24"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_25"],
                                                   on:{
                                                        click:function(event)
                                                        {
                                                            if(this.checked == false)
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = true;
                                                                }
                                                            }else
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = false;
                                                                }
                                                            }
                                                        }
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_26"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_27"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_28"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_29"],
                                                   on:{
                                                        click:function(event)
                                                        {
                                                            if(this.checked == false)
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = true;
                                                                }
                                                            }else
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = false;
                                                                }
                                                            }
                                                        }
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_30"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_31"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_32"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_33"],
                                                   on:{
                                                        click:function(event)
                                                        {
                                                            if(this.checked == false)
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = true;
                                                                }
                                                            }else
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = false;
                                                                }
                                                            }
                                                        }
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_34"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_35"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_36"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_37"],
                                                   on:{
                                                        click:function(event)
                                                        {
                                                            if(this.checked == false)
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = true;
                                                                }
                                                            }else
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = false;
                                                                }
                                                            }
                                                        }
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_38"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_39"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_40"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                innerHTML:"Nhập xuất dữ liệu"
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
                                                        innerHTML: "Nhập dữ liệu"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_51"]
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
                                                        innerHTML: "Xuất dữ liệu"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_52"]
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            child: [
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_53"]
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
                                                        innerHTML: "Cuộc gọi"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_54"]
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
                                                        innerHTML: "Upload hình"
                                                    }
                                                },
                                                {
                                                    tag: "checkbox",
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_55"]
                                                }
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                        }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_41"],
                                                   on:{
                                                        click:function(event)
                                                        {
                                                            if(this.checked == false)
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = true;
                                                                }
                                                            }else
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = false;
                                                                }
                                                            }
                                                        }
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_42"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_43"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_44"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_45"],
                                                   on:{
                                                        click:function(event)
                                                        {
                                                            if(this.checked == false)
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = true;
                                                                }
                                                            }else
                                                            {
                                                                var index = parseInt(getIDCompair(this.classList[2]))
                                                                for(var i = 0;i<3;i++)
                                                                {
                                                                    var elementTemp = $("div.checkbox_"+(index+1+i),self.$view);
                                                                    if(elementTemp!==undefined)
                                                                    elementTemp.disabled = false;
                                                                }
                                                            }
                                                        }
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_46"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_47"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                                                    class: ["pizo-new-realty-desc-detail-row-menu-1-checkbox","checkbox_48"],
                                                    props:{
                                                        disabled : true
                                                    }
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
                            tag:"div",
                            class:["pizo-new-account-container","pizo-new-account-advance-permission"],
                            child:[
                                {
                                    tag: "div",
                                    class: "pizo-new-account-container-permission-child",
                                    child: [
                                        {
                                            tag: "span",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            props: {
                                                innerHTML: "Tỉnh/TP"
                                            }
                                        },
                                        state
                                    ]
                                },
                                {
                                    tag: "div",
                                    class: "pizo-new-account-container-permission-child",
                                    child: [
                                        {
                                            tag: "span",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            props: {
                                                innerHTML: "Quận/Huyện"
                                            }
                                        },
                                        district
                                    ]
                                },
                                {
                                    tag: "div",
                                    class: "pizo-new-account-container-permission-child",
                                    child: [
                                        {
                                            tag: "span",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            props: {
                                                innerHTML: "Phường/Xã"
                                            }
                                        },
                                        ward
                                    ]
                                },{
                                    tag: "div",
                                    class: "pizo-new-account-container-permission-child",
                                    child: [
                                        {
                                            tag: "span",
                                            class: "pizo-new-realty-desc-detail-row-permission",
                                            props: {
                                                innerHTML: "Đường"
                                            }
                                        },
                                        street
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
                                    class:"pizo-new-account-container-permission-addvance-selectmenu",
                                    child:[
                                        {
                                            tag:"i",
                                            class:["material-icons","pizo-new-account-container-permission-addvance-selectmenu-icon"],
                                            on:{
                                                click:function(event)
                                                {
                                                    var indexValue;
                                                    var itemValue;
                                                    var objectPermission = [];
                                                    for(var  i = 56;i<70;i++)
                                                    {
                                                        if($("div.checkbox_"+i,self.$view).checked == true&&$("div.checkbox_"+i,self.$view).disabled == false)
                                                        {
                                                            objectPermission.push(i);
                                                        }
                                                    }
                                                    if(street.value == 0)
                                                    {
                                                        if(ward.value == 0)
                                                        {
                                                            if(district.value == 0)
                                                            {
                                                                if(state.value == 0)
                                                                {
                                                                    indexValue = 0;
                                                                    itemValue = {
                                                                        text:"Tất cả",
                                                                        value:indexValue
                                                                    }
                                                                }else
                                                                {
                                                                    indexValue = '{"stateid":"'+state.value+'"}';
                                                                    itemValue = {
                                                                        text:getNameCompair(state.value),
                                                                        value:indexValue
                                                                    }
                                                                }
                                                            }else
                                                            {
                                                                indexValue = '{"stateid":"'+state.value+'","districtid":"'+district.value+'"}';
                                                                itemValue = {
                                                                    text:getNameCompair(district.value),
                                                                    value:indexValue
                                                                }
                                                            }
                                                        }else
                                                        {
                                                            indexValue = '{"stateid":"'+state.value+'","districtid":"'+district.value+'","wardid":"'+ward.value+'"}';
                                                            itemValue = {
                                                                text:getNameCompair(ward.value),
                                                                value:indexValue
                                                            }
                                                        }
                                                    }else
                                                    {
                                                        indexValue = '{"stateid":"'+state.value+'","districtid":"'+district.value+'","wardid":"'+ward.value+'","streetid":"'+street.value+'"}';
                                                        itemValue = {
                                                            text:getNameCompair(street.value),
                                                            value:indexValue
                                                        }
                                                    }
                                                    if(selectPermission.values.indexOf(indexValue)==-1)
                                                    {
                                                        selectPermission.items.push(itemValue);
                                                        selectPermission.values.push(indexValue);
                                                        selectPermission.items = selectPermission.items;
                                                        selectPermission.values = selectPermission.values;
                                                    }

                                                    var selected = $("div.absol-selectbox-item.selectedIItem",selectPermission);
                                                    if(selected!==undefined)
                                                    {
                                                        selected.classList.remove("selectedIItem");
                                                    }
                                                    var arrayItem = selectPermission.getElementsByClassName("absol-selectbox-item");
                                                    for(var i = 0;i<arrayItem.length;i++)
                                                    {
                                                        if(arrayItem[i].data.value == indexValue)
                                                        {
                                                            arrayItem[i].classList.add("selectedIItem");
                                                            break;
                                                        }
                                                    }

                                                    self.checkPermission[indexValue] = objectPermission;
                                                }
                                            },
                                            props:{
                                                innerHTML:"send"
                                            }
                                        },
                                        selectPermission
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]   
        })
        );
    var arr = [];
    arr.push(moduleDatabase.getModule("states").load());
    arr.push(moduleDatabase.getModule("districts").load({ORDERING:"stateid"}));
    arr.push(moduleDatabase.getModule("wards").load({ORDERING:"districtid"}));
    if(this.data!==undefined)
    {
        var x = moduleDatabase.queryData("loadPermision.php",{userid:this.data.original.id},"privileges");
        var resolveStreet;
        var y = new Promise(function(resolve,reject){
            resolveStreet = resolve;
        })
        x.then(function(values){
            var where = [];
            var first = ""
            for(var i = 0;i<values.length;i++)
            {
                if(values[i].streetid!=0){
                    if(first!=="")
                    where.push(first);
                    where.push({id:values[i].streetid});
                    if(first == "")
                    first = "&&";
                }
            }
            if(where.length>0)
            moduleDatabase.getModule("streets").load({WHERE:where}).then(function(value){
                this.checkStreet = moduleDatabase.getModule("streets").getLibary("id");
                resolveStreet();
            }.bind(this));
            else{
                resolveStreet();
            }
        }.bind(this))
        arr.push(x);
        arr.push(y);
    }
    
    this.state = state;
    this.district = district;
    this.ward = ward;
    this.street = street;
    Promise.all(arr).then(function(values){
        state.items = [{text:"Tất cả",value:0}].concat(moduleDatabase.getModule("states").getList("name",["name","id"]));
        district.items = [{text:"Tất cả",value:0}];
        ward.items = [{text:"Tất cả",value:0}];
        street.items = [{text:"Tất cả",value:0}];
        this.checkStateDistrict = moduleDatabase.getModule("districts").getLibary("stateid",function(data){
            return {text:data.name,value:data.name+"_"+data.id}
        },true);
        this.checkDistrictWard = moduleDatabase.getModule("wards").getLibary("districtid",function(data){
            return {text:data.name,value:data.name+"_"+data.id}
        },true);
        this.checkWard = moduleDatabase.getModule("wards").getLibary("id");
        this.checkState = moduleDatabase.getModule("states").getLibary("id");
        this.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");
        this.checkPermission = [];
        if(values[3]!==undefined)
        {
            var result =values[3];
            for(var i = 0;i<result.length;i++)
            {
                var permissionTemp = result[i].permission
                if(permissionTemp<56&&permissionTemp>0)
                {
                    var tempCheckbox =  $("div.checkbox_"+(permissionTemp),self.$view);
                    tempCheckbox.click();
                }else
                {
                    var indexTemp = "{";
                    var tempCheck;
                    if(result[i]["stateid"]!==0)
                    {
                        tempCheck = this.checkState[result[i]["stateid"]];
                         if(tempCheck!==undefined)
                         indexTemp += '"stateid":"'+tempCheck.name+"_"+tempCheck.id+'"';
                    }
                    if(result[i]["districtid"]!==0)
                    {
                        tempCheck = this.checkDistrict[result[i]["districtid"]];
                         if(tempCheck!==undefined)
                         indexTemp += ',"districtid":"'+tempCheck.name+"_"+tempCheck.id+'"';
                    }
                    if(result[i]["wardid"]!==0)
                    {
                        tempCheck = this.checkWard[result[i]["wardid"]];
                         if(tempCheck!==undefined)
                         indexTemp += ',"wardid":"'+tempCheck.name+"_"+tempCheck.id+'"';
                    }
                    if(result[i]["streetid"]!==0)
                    {
                        tempCheck = this.checkStreet[result[i]["streetid"]];
                         if(tempCheck!==undefined)
                         indexTemp += ',"streetid":"'+tempCheck.name+"_"+tempCheck.id+'"';
                    }
                    if(indexTemp == "{")
                    indexTemp = 0;
                    else
                    indexTemp += "}";
                    if(this.checkPermission[indexTemp]===undefined)
                    this.checkPermission[indexTemp] = [];
                    this.checkPermission[indexTemp].push(permissionTemp);
                }
            }
            var indexValue,indexItem,stringTemp,lastParam;
            for(var param in this.checkPermission)
            {
                if(param == 0)
                {
                    indexValue = 0;
                    indexItem = {
                        text:"Tất cả",
                        value:indexValue
                    }
                }else
                {
                    stringTemp = JSON.parse(param);
                    lastParam = Object.keys(stringTemp)[Object.keys(stringTemp).length-1];
                    indexValue = param;
                    indexItem = {
                        text:getNameCompair(stringTemp[lastParam]),
                        value:param
                    }
                }
                
                selectPermission.items.push(indexItem);
                selectPermission.values.push(indexValue);
                selectPermission.items = selectPermission.items;
                selectPermission.values = selectPermission.values;
                var arrayItem = selectPermission.getElementsByClassName("absol-selectbox-item");
                if(arrayItem.length)
                {
                    arrayItem[0].click();
                }
            }
        }
    }.bind(this))
    this.selectPermission = selectPermission;
    this.name = $('input.pizo-new-account-container-name-container-input',this.$view);
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
    this.containerPassword = container;
    this.newPassWord = $('input.pizo-new-account-container-password-container-input-new',this.$view);
    this.confirmPassWord = $('input.pizo-new-account-container-password-container-input-new-confirm',this.$view);
    this.street = street;
    this.ward = ward;
    this.district = district;
    this.state = state
    if(this.data!==undefined)
    {
        this.name.value = this.data.original.name;
        this.phone.setAttribute("disabled","");
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
    if(this.isOnlyInformation === true)
    {
        $("div.pizo-new-account-container-permission",this.$view).style.display = "none";
        $("div.pizo-new-account-container.pizo-new-account-advance-permission",this.$view).parentNode.style.display = "none";
        $("div.pizo-new-account-container-permission-realty",this.$view).style.display = "none";
        $("div.pizo-new-account-container-status-position",this.$view).style.display = "none";
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


NewAccount.prototype.resetPermission = function()
{
    for(var i = 56;i<70;i++)
    {
        if($("div.checkbox_"+i,this.$view).checked == true)
        $("div.checkbox_"+i,this.$view).checked = false;
        if($("div.checkbox_"+i,this.$view).disabled == true)
        $("div.checkbox_"+i,this.$view).disabled = false;
    }
}

NewAccount.prototype.resetPermissionChoice = function()
{
    var selected = $("div.absol-selectbox-item.selectedIItem",this.selectPermission);
    if(selected!==undefined)
    {
        selected.classList.remove("selectedIItem");
    }
}

NewAccount.prototype.backPermission = function(objectChild)
{
    var temp = {...objectChild};
    if(temp["streetid"]!==undefined)
    {
        if(temp["streetid"] == 0)
        return {stateid:0};
        if(temp["wardid"]==undefined)
        {
                temp["wardid"] = this.checkStreet[getIDCompair(temp["streetid"])].wardid;
                temp["wardid"] = this.checkWard[temp["wardid"]].name+"_"+temp["wardid"];
        }
        delete temp["streetid"];
        return temp;        
    }
    if(temp["wardid"]!==undefined)
    {
        if(temp["wardid"] == 0)
        return {stateid:0};
        if(temp["districtid"]==undefined)
        {
            temp["districtid"] = this.checkWard[getIDCompair(temp["wardid"])].districtid;
            temp["districtid"] = this.checkDistrict[temp["districtid"]].name+"_"+temp["districtid"];
        }
        delete temp["wardid"];
        return temp;        
    }
    if(temp["districtid"]!==undefined)
    {
        if(temp["districtid"] == 0)
        return {stateid:0};
        if(temp["stateid"]==undefined)
        {
                temp["stateid"] = this.checkDistrict[getIDCompair(temp["districtid"])].stateid;
                temp["stateid"] = this.checkState[temp["stateid"]].name+"_"+temp["stateid"];
        }
        delete temp["districtid"];
        return temp;        
    }
    return {stateid:0};
}

NewAccount.prototype.addPermissionParent = function(objectChild)
{
    this.resetPermission();
    this.resetPermissionChoice();
    var objectChildOlder = this.backPermission(objectChild);
    for(var param in this.checkPermission)
    {
        var objectParam = JSON.parse(param);
        if(this.checkSameAddress(objectChild,objectParam))
        {
            this.sameClick(param);
        }else
        {
            if(param==0||(this.checkOlderPermission(objectChildOlder,JSON.parse(param))&&this.checkPermissionParent(objectChildOlder,objectParam)))
            {
                for(var i = 0;i<this.checkPermission[param].length;i++)
                {
                    var tempCheckbox =  $("div.checkbox_"+(this.checkPermission[param][i]),this.$view);
                    tempCheckbox.checked = true;
                    if(objectChild!=0)
                    tempCheckbox.disabled = true;
                }
            }
        }
    }
}

NewAccount.prototype.checkSameAddress = function(objectChild,object)
{
    var param;
    if(typeof objectChild == "object")
    {
        for(param in objectChild)
        {
            if(object[param]!==undefined&&objectChild[param]==object[param])
            {
                continue;
            }
            return false;
        }
        if(!this.checkOlderPermission(objectChild,object))
        return false;
    }else
    return false;
    return true;
}

NewAccount.prototype.sameClick = function(param)
{
    var objectPermission = param;
    var arrayItem = this.selectPermission.getElementsByClassName("absol-selectbox-item");
    for(var i = 0;i<arrayItem.length;i++)
    {
        if(arrayItem[i].data.value == objectPermission)
        {
            if(!arrayItem[i].classList.contains("selectedIItem"))
            arrayItem[i].click();
            break;
        }
    }
}

NewAccount.prototype.checkOlderPermission = function(objectChild,objectParent)
{
    if(objectChild["wardid"]!==undefined)
    {
        if(objectParent["streetid"]!==undefined)
        return false;
    }
    else
    if(objectChild["districtid"]!==undefined)
    {
        if(objectParent["wardid"]!==undefined)
        return false;
    }
    else
    if(objectChild["stateid"]!==undefined)
    {
        if(objectParent["districtid"]!==undefined)
        return false;
    }


    return true;
}

NewAccount.prototype.checkPermissionParent = function(objectChild,objectParent)
{
    if(objectChild["wardid"]!==undefined)
    {
        var dataTemp =  getIDCompair(objectChild["wardid"]);
        if(objectParent["wardid"]!==undefined)
        {
            if(dataTemp == getIDCompair(objectParent["wardid"]))
            return true;
            return false;
        }else
        {
            dataTemp =  this.checkWard[dataTemp].districtid;
            dataTemp = this.checkDistrict[dataTemp].name+"_"+dataTemp;
            return this.checkPermissionParent({districtid:dataTemp},objectParent)
        }
    }

    if(objectChild["districtid"]!==undefined)
    {
        var dataTemp =  getIDCompair(objectChild["districtid"]);
        if(objectParent["districtid"]!==undefined)
        {
            if(dataTemp == getIDCompair(objectParent["districtid"]))
            return true;
            return false;
        }else
        {
            dataTemp =  this.checkDistrict[dataTemp].stateid;
            dataTemp = this.checkState[dataTemp].name+"_"+dataTemp;
            return this.checkPermissionParent({stateid:dataTemp},objectParent);
        }
    }

    if(objectChild["stateid"]!==undefined)
    {
        var dataTemp = getIDCompair(objectChild["stateid"]);
       
        if(objectParent["stateid"]!==undefined&&dataTemp == getIDCompair(objectParent["stateid"]))
        {
            return true;
        }
    }
    return false;
}



NewAccount.prototype.setValueNull = function(object)
{
    if(object == "street")
    {
        if(this.ward.value!=0){
            this.addPermissionParent({wardid:this.ward.value});
        }else
        {
            return this.setValueNull("ward");
        }
    }
    if(object == "ward")
    {
        if(this.district.value != 0)
        {
            this.addPermissionParent({districtid:this.district.value});
        }else
        {
            return this.setValueNull("district");
        }
    }
    if(object == "district")
    {
        if(this.state.value != 0)
        {
            this.addPermissionParent({stateid:this.state.value});
        }else
        {
            return this.setValueNull("state");
        }
    }
    if(object == "state")
    {
        if(this.selectPermission.values.indexOf(0)!==-1)
        {
            var arrayItem = this.selectPermission.getElementsByClassName("absol-selectbox-item");
            for(var i = 0;i<arrayItem.length;i++)
            {
                if(arrayItem[i].data.value == 0)
                {
                    arrayItem[i].click();
                    break;
                }
            }
        }else
        {
            this.resetPermission();
            this.resetPermissionChoice();
        }
    }
}

NewAccount.prototype.getDataSave = function() {
    var avatar = this.avatar.src;
    avatar = avatar.replace("https://lab.daithangminh.vn/home_co/pizo/assets/avatar/","");
    var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if(vnf_regex.test(this.phone.value) == false)
    {
        var deleteItem = confirmQuestion("Xác nhận số điện thoại", "Số điện thoại chưa đúng vui lòng kiểm tra lại!");
        this.$view.addChild(deleteItem);
        return;
    }
    if(this.data==undefined)
    {
        if(moduleDatabase.getModule("users").getLibary("phone")[this.phone.value]!==undefined||moduleDatabase.getModule("contacts").getLibary("phone")[this.phone.value]!==undefined)
        {
            var deleteItem = confirmQuestion("Xác nhận số điện thoại", "Số điện thoại trùng vui lòng kiểm tra lại!");
            this.$view.addChild(deleteItem);
            return;
        }
    }
    var arrayItem = this.selectPermission.getElementsByClassName("absol-selectbox-item")
    for(var i = 0;i<arrayItem.length;i++)
    {
        arrayItem[i].click();
    }
    var permission = {...this.checkPermission};
    var tempParam;
    for(var param in permission)
    {
        tempParam = JSON.parse(param);
        for(var paramChild in  tempParam)
        {
            tempParam[paramChild] = getIDCompair(tempParam[paramChild]);
        }
        permission[JSON.stringify(tempParam)] = permission[param];
        delete permission[param];
    }
    permission[0] = this.checkPermission[0];
    if(permission[0]===undefined)
    {
        permission[0] = [];
    }
    for(var i = 1;i<56;i++)
    {
        var tempCheckbox =  $("div.checkbox_"+(i),this.$view);
        if(tempCheckbox.checked == true)
        {
            permission[0].unshift(i);
        }
    }
    var temp = {
        name : this.name.value,
        email : this.email.value,
        phone : this.phone.value,
        birthday : getGMT(this.birthday.value,new Date().getTimezoneOffset()/-60,true),
        gender : this.gender.value,
        positionid : this.position.value,
        status : this.status.checked?1:0,
        permission : permission,
        avatar : avatar
    }
    if(this.containerPassword.style.display == "unset")
    {
        if(this.newPassWord.value=="" ||this.newPassWord.value !== this.confirmPassWord.value)
        {
            var deleteItem = confirmQuestion("Xác nhận mật khẩu", "Mật khẩu xác nhận chưa đúng vui lòng kiểm tra lại!");
            this.$view.addChild(deleteItem);
            return;
        }else
        {
            temp.password = this.newPassWord.value;
        }
    }
    if(this.address.data !== undefined){
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
    if(this.data !== undefined)
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