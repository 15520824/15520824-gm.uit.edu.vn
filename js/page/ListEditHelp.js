import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListHelp.css"
import R from '../R';
import Fcore from '../dom/Fcore';

import EditHelpContainer from '../component/EditHelpContainer';

var _ = Fcore._;
var $ = Fcore.$;

function ListHelp() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
}

ListHelp.prototype.setContainer = function(parent) {
    this.parent = parent;
}

Object.defineProperties(ListHelp.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
ListHelp.prototype.constructor = ListHelp;

ListHelp.prototype.getView = function() {
    if (this.$view) return this.$view;
    var self = this;
    var containerHelp = new EditHelpContainer();
    this.$view = _({
        tag: 'singlepage',
        class: "pizo-list-realty",
        child: [{
            class: 'absol-single-page-header',
            child: [{
                    tag: "span",
                    class: "pizo-body-title-left",
                    props: {
                        innerHTML: "Chỉnh sửa trợ giúp"
                    }
                },
                {
                    tag: "div",
                    class: "pizo-list-realty-button",
                    child: [{
                            tag: "button",
                            class: ["pizo-list-realty-button-quit", "pizo-list-realty-button-element"],
                            on: {
                                click: function(evt) {
                                    if (!containerHelp.closeEditPage()) {
                                        self.$view.selfRemove();
                                        var arr = self.parent.body.getAllChild();
                                        self.parent.body.activeFrame(arr[arr.length - 1]);
                                    } else {
                                        var arr = self.$view.getElementsByClassName("pizo-list-realty-button-add");
                                        for (var i = 0; i < arr.length; i++) {
                                            arr[i].style.display = "";
                                        }
                                        var arr = self.$view.getElementsByClassName("pizo-list-realty-button-edit-page");
                                        for (var i = 0; i < arr.length; i++) {
                                            arr[i].style.display = "none";
                                        }
                                    }
                                }
                            },
                            child: [
                                '<span>' + "Đóng" + '</span>'
                            ]
                        },
                        {
                            tag: "button",
                            class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
                            on: {
                                click: function(evt) {
                                    containerHelp.editContentAll();
                                }
                            },
                            child: [
                                '<span>' + "Lưu" + '</span>'
                            ]
                        },
                        {
                            tag: "button",
                            class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
                            on: {
                                click: function(evt) {
                                    containerHelp.add();
                                }
                            },
                            child: [
                                '<span>' + "Thêm" + '</span>'
                            ]
                        },
                        {
                            tag: "button",
                            class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
                            on: {
                                click: function(evt) {
                                    containerHelp.editPage();
                                    var arr = self.$view.getElementsByClassName("pizo-list-realty-button-add");
                                    for (var i = 0; i < arr.length; i++) {
                                        arr[i].style.display = "none";
                                    }
                                    var arr = self.$view.getElementsByClassName("pizo-list-realty-button-edit-page");
                                    for (var i = 0; i < arr.length; i++) {
                                        arr[i].style.display = "";
                                    }
                                }
                            },
                            child: [
                                '<span>' + "Cài đặt trang" + '</span>'
                            ]
                        },
                        {
                            tag: "button",
                            class: ["pizo-list-realty-button-edit-page", "pizo-list-realty-button-element"],
                            on: {
                                click: function(evt) {
                                    containerHelp.editContentAll();
                                }
                            },
                            style: {
                                display: "none"
                            },
                            child: [
                                '<span>' + "Lưu" + '</span>'
                            ]
                        },
                    ]
                }
            ]
        }, ]
    });
    containerHelp.parent = this.parent;
    this.$view.addChild(_({
        tag: "div",
        class: ["pizo-list-help-main"],
        child: [
            containerHelp
        ]
    }));
    return this.$view;
}

ListHelp.prototype.refresh = function() {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

ListHelp.prototype.setData = function(data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

ListHelp.prototype.flushDataToView = function() {
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

ListHelp.prototype.start = function() {

}

export default ListHelp;