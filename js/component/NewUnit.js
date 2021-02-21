import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/NewUnit.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import moduleDatabase from './ModuleDatabase';

var _ = Fcore._;
var $ = Fcore.$;

function NewUnit(data) {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();

    this.textHeader = "Sửa ";
    this.data = data;

    if (this.data == undefined)
        this.textHeader = "Thêm ";
}

NewUnit.prototype.setContainer = function(parent) {
    this.parent = parent;
}

Object.defineProperties(NewUnit.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
NewUnit.prototype.constructor = NewUnit;

NewUnit.prototype.createPromise = function() {
    var self = this;
    if (this.data === undefined) {
        self.promiseAddDB = new Promise(function(resolve, reject) {
            self.resolveDB = resolve;
            self.rejectDB = reject;
        })

    } else {
        self.promiseEditDB = new Promise(function(resolve, reject) {
            self.resolveDB = resolve;
            self.rejectDB = reject;
        })

    }
}

NewUnit.prototype.getView = function() {
    if (this.$view) return this.$view;
    var self = this;
    this.$view = _({
        tag: 'singlepage',
        class: "pizo-list-realty",
        child: [{
            class: 'absol-single-page-header',
            child: [{
                    tag: "span",
                    class: "pizo-body-title-left",
                    props: {
                        innerHTML: self.textHeader + " đơn vị"
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
                        // {
                        //     tag: "button",
                        //     class: ["pizo-list-realty-button-add","pizo-list-realty-button-element"],
                        //     on: {
                        //         click: function (evt) {
                        //             self.resolveDB(self.getDataSave());
                        //             self.createPromise();
                        //         }
                        //     },
                        //     child: [
                        //     '<span>' + "Lưu" + '</span>'
                        //     ]
                        // },
                        {
                            tag: "button",
                            class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
                            on: {
                                click: function(evt) {
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
        }, ]
    });

    this.$view.addChild(_({
        tag: "div",
        class: ["pizo-list-realty-main"],
        child: [{
            tag: "div",
            class: ["pizo-list-realty-main-result-control"],
            child: [{
                tag: "div",
                class: "pizo-new-state-container",
                child: [{
                        tag: "div",
                        class: "pizo-new-state-container-name-container",
                        child: [{
                                tag: "span",
                                class: "pizo-new-state-container-name-container-label",
                                props: {
                                    innerHTML: "Tên"
                                }
                            },
                            {
                                tag: "input",
                                class: ["pizo-new-state-container-name-container-input", "pizo-new-realty-dectruct-input"],
                            }
                        ]
                    },
                    {
                        tag: "div",
                        class: "pizo-new-state-container-name-container",
                        child: [{
                                tag: "span",
                                class: "pizo-new-state-container-name-container-label",
                                props: {
                                    innerHTML: "Tỉ số"
                                }
                            },
                            {
                                tag: "input",
                                class: ["pizo-new-state-container-unit-container-input", "pizo-new-realty-dectruct-input"],
                                props: {
                                    type: "number"
                                }
                            }
                        ]
                    },
                    {
                        tag: "div",
                        class: "pizo-new-state-container-nation-container",
                        child: [{
                                tag: "span",
                                class: "pizo-new-state-container-nation-container-label",
                                props: {
                                    innerHTML: "Có sẳn"
                                }
                            },
                            {
                                tag: "div",
                                class: "pizo-new-state-container-nation-container-input",
                                style: {
                                    border: "none",
                                    justifyContent: "unset"
                                },
                                child: [{
                                    tag: "switch",
                                    class: "pizo-new-state-container-nation-container-input-switch"
                                }]

                            }

                        ]
                    }
                ]
            }]
        }]
    }));
    this.createPromise();
    this.name = $('input.pizo-new-state-container-name-container-input"', this.$view);
    this.unit = $('input.pizo-new-state-container-unit-container-input"', this.$view);
    this.available = $('label.pizo-new-state-container-nation-container-input-switch', this.$view);
    if (this.data !== undefined) {
        this.name.value = this.data.original.name;
        this.available.checked = this.data.original.available == 1 ? true : false;
        this.unit.value = this.data.original.coefficient;
    }

    return this.$view;
}

NewUnit.prototype.getDataSave = function() {
    var temp = {
        name: this.name.value,
        available: this.available.checked === true ? 1 : 0,
        coefficient: this.unit.value
    }
    if (this.data !== undefined)
        temp.id = this.data.original.id;
    return temp;
}

NewUnit.prototype.refresh = function() {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

NewUnit.prototype.setData = function(data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

NewUnit.prototype.flushDataToView = function() {
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

NewUnit.prototype.start = function() {

}

export default NewUnit;