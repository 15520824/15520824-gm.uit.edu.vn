
import BaseView from './component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../css/App.css";
import R from './R';
import Fcore from './dom/Fcore';
import listProject from './page/listProject'

var _ = Fcore._;
var $ = Fcore.$;

function App(){
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.listProject = new listProject();
    this.listProject.attach(this);
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
                                            text: "Nhiệm vụ",
                                            pageIndex: 2
                                        },
                                        {
                                            text: "Danh mục",
                                            pageIndex: 3,
                                            items:[
                                                {
                                                    text:"Bất động sản",
                                                    pageIndex:31
                                                },
                                                {
                                                    text:"Dự án",
                                                    pageIndex:32
                                                }
                                            ]
                                        },
                                        {
                                            text: "Hệ thống",
                                            pageIndex: 4
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
    var frameview = this.listProject.getView();
    this.body.addChild(frameview);
    this.body.activeFrame(frameview);
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
        case 31:
            var frameview = this.listRealty.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            this.refresh();
        break;
        case 32:
            var frameview = this.listProject.getView();
            this.body.addChild(frameview);
            this.body.activeFrame(frameview);
            this.refresh();
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



