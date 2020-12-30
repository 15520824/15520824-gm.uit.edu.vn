import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/Import_DB.css"
import R from '../R';
import Fcore from '../dom/Fcore';

import { consoleWKT, loadingWheel, getGMT, formatDate, consoleWKTLine } from '../component/FormatFunction';
import moduleDatabase from '../component/ModuleDatabase';

var _ = Fcore._;
var $ = Fcore.$;

function Import_DB() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.hash = [];
}

Import_DB.prototype.setContainer = function(parent) {
    this.parent = parent;
}

Object.defineProperties(Import_DB.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
Import_DB.prototype.constructor = Import_DB;

Import_DB.prototype.getView = function() {
    if (this.$view) return this.$view;
    var self = this;
    this.$view = _({
        tag: 'singlepage',
        class: ["pizo-list-realty", "pizo-list-realty-import-db"],
        child: [{
            tag: "div",
            class: "pizo-list-realty-import-db-container",
            child: [{
                    tag: "span",
                    props: {
                        innerHTML: "Tên table",
                    }
                },
                {
                    tag: "input",
                    props: {
                        id: "table-input-element",
                        value: "districts"
                    }
                },
                {
                    tag: "span",
                    props: {
                        innerHTML: "Điều kiện"
                    }
                },
                {
                    tag: "span",
                    props: {
                        innerHTML: "Chuyển dữ liệu"
                    }
                },
                {
                    tag: "input",
                    props: {
                        id: "replace-input-element",
                        value: `{"district_id":"id"}`
                    }
                },
                {
                    tag: "span",
                    props: {
                        innerHTML: "Điều kiện"
                    }
                },
                {
                    tag: "input",
                    props: {
                        id: "where-input-element",
                        value: '{"stateid":46}'
                    }
                },
                {
                    tag: "span",
                    props: {
                        innerHTML: "Kiểm tra tên"
                    }
                },
                {
                    tag: "input",
                    props: {
                        id: "checkNumberic-input-element",
                        value: '{"name":"Quận "}'
                    }
                },
                {
                    tag: "span",
                    props: {
                        innerHTML: "Nhập file loại JSON "
                    }
                },
                {
                    tag: "input",
                    props: {
                        id: "json-input-element",
                        type: "file",
                        accept: "application/JSON"
                    }
                },
                {
                    tag: "button",
                    on: {
                        click: function() {
                            var input = document.getElementById("json-input-element");
                            var reader = new FileReader();
                            reader.readAsText(input.files[0]);
                            reader.onloadend = function() {
                                var data = JSON.parse(reader.result);
                                var dataChild;
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].data != undefined) {
                                        dataChild = data[i].data;
                                        self.setDataImport(dataChild);
                                        break;
                                    }
                                }
                            }
                        }
                    },
                    props: {
                        innerHTML: "Thực hiện"
                    }
                }
            ]
        }]
    })
    return this.$view;
}

Import_DB.prototype.setDataImport = function(dataChild) {
    var loading = new loadingWheel();
    var input = JSON.parse(document.getElementById("replace-input-element").value);
    var where = JSON.parse(document.getElementById("where-input-element").value);
    var table = document.getElementById("table-input-element").value;
    console.log(table)
    var number = JSON.parse(document.getElementById("checkNumberic-input-element").value);
    var promisAll = [];
    for (var i = 0; i < dataChild.length; i++) {
        for (var param in input) {
            dataChild[i][input[param]] = dataChild[i][param];
            delete dataChild[i][param];
        }
        for (var param in where) {
            dataChild[i][param] = where[param];
        }
        for (var param in number) {
            if (Number.isInteger(parseInt(dataChild[i][param])) == true) {
                dataChild[i][param] = number[param] + dataChild[i][param];
            }
        }
        var promise = moduleDatabase.getModule(table).add(dataChild[i]);
        promisAll.push(promise);
    }
    Promise.all(promisAll).then(function() {
        loading.disable();
    })
}

Import_DB.prototype.setData = function(data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

Import_DB.prototype.flushDataToView = function() {
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

Import_DB.prototype.start = function() {

}

export default Import_DB;