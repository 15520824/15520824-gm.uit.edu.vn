import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/NewState.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { formatDate } from '../component/FormatFunction';

import { input_choicenumber,tableView, ModuleView} from '../component/ModuleView';
import NewRealty from '../component/NewRealty';

var _ = Fcore._;
var $ = Fcore.$;

function NewState() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.ModuleView = new ModuleView();
    
    this.NewRealty = new NewRealty();
    this.NewRealty.attach(this);
}

NewState.prototype.setContainer = function(parent)
{
    this.parent = parent;
}

Object.defineProperties(NewState.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
NewState.prototype.constructor = NewState;

NewState.prototype.getView = function () {
    if (this.$view) return this.$view;
    var self = this;
    if(window.mobilecheck())
    {
        allinput.placeholder = "Tên"
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
                                    }
                                },
                                child: [
                                '<span>' + "Lưu" + '</span>'
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
                                                    {text:"Thành phố trực thuộc trung ương",value:79},
                                                    {text:"Tỉnh",value:80}
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
                                                    {text:"Việt Nam",value:79},
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
    return this.$view;
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