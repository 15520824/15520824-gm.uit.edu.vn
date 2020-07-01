
import BaseView from './component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../css/App.css";
import R from './R';
import Fcore from './dom/Fcore';
import ListRealty from './page/ListRealty';
import ListWard from './page/ListWard';
import ListStreet from './page/ListStreet';
import ListState from './page/ListState';
import ListDistrict from './page/ListDistrict';
import PlanningInformation from './page/PlanningInformation';
import ListHelp from './page/ListHelp';
import ListEditHelp from './page/ListEditHelp';
import ListPositions from './page/ListPositions';
import ListAccount from './page/ListAccount';
import ListAddress from './page/ListAddress';
import ListContact from './page/ListContact';
import ListEquipment from './page/ListEquipment';

import xmlModalDragManyFiles from './component/modal_drag_drop_manyfiles';

var _ = Fcore._;
var $ = Fcore.$;

function App(){
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
}

Object.defineProperties(App.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
App.prototype.constructor = App;

App.prototype.getView = function()
{
    if (this.$view) return this.$view;
    var self = this;
    this.body = _(
            {
                tag:"frameview",
                style:{
                    width:'100%',
                    height:'100%'
                }
            }
    )
    this.$view = _({
        tag:"div",
        class:"pizo-app",
        child:[
            {
                tag:"div",
                class:"pizo-header",
                child:[
                    {
                        tag:"div",
                        class:"outer-wrapper",
                        child:[
                            {
                                tag:"div",
                                class:"pizo-header-logo",
                                child:[
                                    {
                                        tag:"img",
                                        class:"pizo-header-logo-icon",
                                        props:{
                                            src : "assets/images/logo.png"
                                        }
                                    },
                                    {
                                        tag:"img",
                                        class:"pizo-header-logo-text",
                                        props:{
                                            src:"assets/images/logo-text.png"
                                        }
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"portal-section",
                                child:[
                                    {
                                        tag:"div",
                                        class:"not-loggedin",
                                        child:[
                                            {
                                                tag:"button",
                                                class:"not-login-signin",
                                                child:[
                                                    {
                                                        tag:"span",
                                                        class:"not-login-signin-text",
                                                        props:{
                                                            innerHTML:"Đăng nhập"
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"hmenu",
                                class:"pizo-header-menu",
                                on: {
                                    press: function(event) {
                                        var item = event.menuItem;
                                        if (typeof item.pageIndex == 'number') {
                                            self.openPage(item.pageIndex);
                                            document.body.click();
                                        }
                                    }
                                },
                                props:{
                                    items:[
                                        {
                                            text: "Dự án",
                                            pageIndex: 1,
                                            items:[
                                                {
                                                    text:"Tất cả",
                                                    pageIndex:11
                                                },
                                                {
                                                    text:"Dự án đã quan tâm",
                                                    pageIndex:12
                                                },
                                                {
                                                    text:"Cần kiểm duyệt",
                                                    pageIndex:13
                                                },
                                                {
                                                    text:"Cần gọi lại",
                                                    pageIndex:14
                                                },
                                                {
                                                    text:"Cần gộp",
                                                    pageIndex:15
                                                },
                                                {
                                                    text:"Cập nhật hình ảnh nhanh",
                                                    pageIndex:16
                                                },
                                                {
                                                    text:"Yêu cầu chỉnh sửa",
                                                    pageIndex:17
                                                },
                                                {
                                                    text:"Thêm mới",
                                                    pageIndex:18
                                                }
                                            ]
                                        },
                                        {
                                            text: "Khu vực",
                                            pageIndex: 2,
                                            items:[
                                                {
                                                    text:"Tỉnh/TP",
                                                    pageIndex:21
                                                },
                                                {
                                                    text:"Quận/Huyện",
                                                    pageIndex:22
                                                },
                                                {
                                                    text:"Phường/Xã",
                                                    pageIndex:23
                                                },
                                                {
                                                    text:"Tên đường",
                                                    pageIndex:24
                                                },
                                                {
                                                    text:"Địa chỉ",
                                                    pageIndex:25
                                                },
                                                {
                                                    text:"Thông tin quy hoạch",
                                                    pageIndex:26
                                                }
                                            ]
                                        },
                                        {
                                            text: "Thông tin",
                                            pageIndex: 3,
                                            items:[
                                                {
                                                    text:"Tiện nghi trong nhà",
                                                    pageIndex:31
                                                },
                                                {
                                                    text:"Thông tin liên hệ",
                                                    pageIndex:33
                                                }
                                            ]
                                        },
                                        {
                                            text: "Thông báo",
                                            pageIndex: 4
                                        },
                                        {
                                            text: "Sơ đồ tổ chức",
                                            pageIndex: 5
                                        },
                                        {
                                            text: "Tài khoản",
                                            pageIndex: 6
                                        },
                                        {
                                            text: "Thống kê",
                                            pageIndex: 7,
                                            items:[
                                                {
                                                    text:"Tổng quan",
                                                    pageIndex:71
                                                },
                                                {
                                                    text:"Cuộc gọi",
                                                    pageIndex:72
                                                },
                                                {
                                                    text:"Upload hình",
                                                    pageIndex:73
                                                }
                                            ]
                                        },
                                        {
                                            text: "Nhập xuất dữ liệu",
                                            pageIndex: 9
                                        },
                                        {
                                            text: "Trợ giúp",
                                            pageIndex: 10,
                                            items:[
                                                {
                                                    text:"Sửa trợ giúp",
                                                    pageIndex:101
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    
                ]
            },
            {
                tag:"div",
                class:"pizo-body",
                child:[
                    {
                        tag:"div",
                        class:"pizo-body-title",
                        child:[
                            {
                                tag:"span",
                                class:"pizo-body-title-right",
                                child:[
                                    {
                                        tag:"div",
                                        class:"pizo-body-title-right-item",
                                        on:{
                                            load:function(event)
                                            {

                                                self.pageSelect = this;
                                            }
                                        },
                                        props:{
                                            innerHTML:""
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tag:'div',
                        class:'pizo-body-dashboard',
                        child:[
                            this.body
                        ]
                    }
                ]
            }
        ]
    });
    // var mListHelp = new ListHelp();
    // mListHelp.attach(this);
    // var frameview = mListHelp.getView();
    // this.body.addChild(frameview);
    // this.body.activeFrame(frameview);
    this.refresh();
    
    return this.$view;
}

App.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

App.prototype.openPage = function(index){

    switch(index)
    {
        case 4:
            xmlModalDragManyFiles.createModal(document.body,function(value){
                console.log(value);
            })
            break;
        case 5:
            var mListPositions = new ListPositions();
            mListPositions.attach(this);
            var frameview = mListPositions.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 6:
            var mListAccount = new ListAccount();
            mListAccount.attach(this);
            var frameview = mListAccount.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 11:
            var mListRealty = new ListRealty();
            mListRealty.attach(this);
            var frameview = mListRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 12:
            var mListRealty = new ListRealty();
            mListRealty.attach(this);
            var frameview = mListRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 13:
            var mListRealty = new ListRealty();
            mListRealty.attach(this);
            var frameview = mListRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 14:
            var mListRealty = new ListRealty();
            mListRealty.attach(this);
            var frameview = mListRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 15:
            var mListRealty = new ListRealty();
            mListRealty.attach(this);
            var frameview = ListRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 16:
            var mListRealty = new ListRealty();
            mListRealty.attach(this);
            var frameview = mListRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 17:
            var mListRealty = new ListRealty();
            mListRealty.attach(this);
            var frameview = mListRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 18:
            var mListRealty = new ListRealty();
            mListRealty.attach(this);
            var frameview = mListRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            this.refresh();
        break;
        case 21:
            var mListState = new ListState();
            mListState.attach(this);
            var frameview = mListState.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 22:
            var mListDistrict = new ListDistrict();
            mListDistrict.attach(this);
            var frameview = mListDistrict.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 23:
            var mListWard = new ListWard();
            mListWard.attach(this);
            var frameview = mListWard.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 24:
            var mListStreet = new ListStreet();
            mListStreet.attach(this);
            var frameview = mListStreet.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 25:
            var mListAddress = new ListAddress();
            mListAddress.attach(this);
            var frameview = mListAddress.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 26:
            var mPlanningInformation = new PlanningInformation();
            mPlanningInformation.attach(this);
            var frameview = mPlanningInformation.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 31:
            var mListEquipment = new ListEquipment();
            mListEquipment.attach(this);
            var frameview = mListEquipment.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 33:
            var mListContact = new ListContact();
            mListContact.attach(this);
            var frameview = mListContact.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        case 101:
            var mListEditHelp = new ListEditHelp();
            mListEditHelp.attach(this);
            var frameview = mListEditHelp.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
        break;
        
    }
   
}

App.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

App.prototype.flushDataToView = function () {
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

App.prototype.start = function()
{

}

export default App;



