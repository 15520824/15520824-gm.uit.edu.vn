import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListPositions.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import { formatDate, getGMT } from '../component/FormatFunction';

import moduleDatabase from '../component/ModuleDatabase';

import { tableView, deleteQuestion } from '../component/ModuleView';

import NewDepartment from '../component/NewDepartment';
import NewPosition from '../component/NewPosition';
var _ = Fcore._;
var $ = Fcore.$;

function ListPositions() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
}

ListPositions.prototype.setContainer = function(parent) {
    this.parent = parent;
}

Object.defineProperties(ListPositions.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
ListPositions.prototype.constructor = ListPositions;

ListPositions.prototype.getView = function() {
    if (this.$view) return this.$view;
    var self = this;
    this.$view = _({
        tag: 'singlepage',
        class: "pizo-list-position-list",
        child: [{
            class: 'absol-single-page-header',
            child: [{
                    tag: "span",
                    class: "pizo-body-title-left",
                    props: {
                        innerHTML: "Sơ đồ tổ chức"
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

                        //         }
                        //     },
                        //     child: [
                        //     '<span>' + "Tìm nhân viên" + '</span>'
                        //     ]
                        // }
                    ]
                },
            ]
        }, ]
    });
    if (moduleDatabase.checkPermission[0].indexOf(6) !== -1) {
        $("div.pizo-list-realty-button", this.$view).appendChild(_({
            tag: "button",
            class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
            on: {
                click: function(evt) {
                    self.addDepartment();
                }
            },
            child: [
                '<span>' + "Thêm bộ phận" + '</span>'
            ]
        }));
        $("div.pizo-list-realty-button", this.$view).appendChild(_({
            tag: "button",
            class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
            on: {
                click: function(evt) {
                    var arr = self.mTable.getElementsByClassName("choice");
                    if (arr.length == 1)
                        arr = arr[0];
                    else
                        return;
                    self.addPosition(arr.data.original.id, arr);
                }
            },
            child: [
                '<span>' + "Thêm chức vụ" + '</span>'
            ]
        }));
    }
    var tabInput = _({
        tag: "input",
        class: "pizo-list-realty-page-allinput-input",
        style: {
            marginBottom: "0.71428571428rem",
            display: "flex",
            flexShrink: 0
        },
        props: {
            placeholder: "Tìm kiếm"
        }
    });
    var titleInput = _({
        tag: "input",
        class: "pizo-list-realty-page-allinput-input",
        style: {
            marginBottom: "0.71428571428rem",
            fontWeight: "bold",
            pointerEvents: "none"
        },
        props: {
            innerHTML: ""
        }
    });
    self.titleInput = titleInput;
    var tabContainer = _({
        tag: "div",
        class: ["pizo-list-realty-main-result-control-child", "drag-zone-bg"],
    })

    var contentContainer = _({
        tag: "div",
        class: ["pizo-list-realty-main-result-control-child", "drag-zone-bg"],
    })

    var docTypeMemuProps, token, functionX;
    token = "showMenu";
    var functionClickMore = function(event, me, index, parent, data, row) {
        if (token == absol.QuickMenu._session) {
            token = "showMenu";
            return;
        }
        docTypeMemuProps = {
            items: []
        };
        if (moduleDatabase.checkPermission[0].indexOf(6) !== -1) {
            docTypeMemuProps.items.push({
                text: 'Thêm',
                icon: 'span.mdi.mdi-text-short',
                value: 0,
            });
        }
        if (moduleDatabase.checkPermission[0].indexOf(7) !== -1) {
            docTypeMemuProps.items.push({
                text: 'Sửa',
                icon: 'span.mdi.mdi-text-short',
                value: 1,
            });
        }
        if (moduleDatabase.checkPermission[0].indexOf(8) !== -1) {
            docTypeMemuProps.items.push({
                text: 'Xóa',
                icon: 'span.mdi.mdi-text',
                value: 2,
            });
        }
        if (moduleDatabase.checkPermission[0].indexOf(6) !== -1) {
            docTypeMemuProps.items.push({
                text: 'Thêm chức vụ',
                icon: 'span.mdi.mdi-text-short',
                value: 3,
            });
        }
        token = absol.QuickMenu.show(me, docTypeMemuProps, [3, 4], function(menuItem) {
            switch (menuItem.value) {
                case 0:
                    self.addDepartment(data.original.id, row);
                    break;
                case 1:
                    self.editDepartment(data, parent, index);
                    break;
                case 2:
                    self.deleteDepartment(data.original, parent, index);
                    break;
                case 3:
                    self.addPosition(data.original.id, row);
                    break;
            }
        });

        functionX = function(token) {
            return function() {
                var x = function(event) {
                    absol.QuickMenu.close(token);
                    document.body.removeEventListener("click", x);
                }
                document.body.addEventListener("click", x)
            }
        }(token);

        setTimeout(functionX, 10)
    }
    var functionClickRow = function(event, me, index, parent, data, row) {
        var updateData = [];
        if (self.checkDepartment[data.original.id])
            updateData = self.checkDepartment[data.original.id];
        self.mTablePosition.updateTable(undefined, updateData);

        var arr = self.mTable.getElementsByClassName("choice");
        for (var i = 0; i < arr.length; i++)
            arr[i].classList.remove("choice");
        row.classList.add("choice");
        self.titleInput.value = data.original.name;
        self.titleInput.data = data.original.id;
    }
    var token2 = "showMenu";
    var functionClickMoreSencond = function(event, me, index, parent, data, row) {
        if (token2 == absol.QuickMenu._session) {
            token2 = "showMenu";
            return;
        }
        docTypeMemuProps = {
            items: []
        };
        if (moduleDatabase.checkPermission[0].indexOf(7) !== -1) {
            docTypeMemuProps.items.push({
                text: 'Sửa',
                icon: 'span.mdi.mdi-text-short',
                value: 0,
            });
        }
        if (moduleDatabase.checkPermission[0].indexOf(8) !== -1) {
            docTypeMemuProps.items.push({
                text: 'Xóa',
                icon: 'span.mdi.mdi-text',
                value: 1,
            });
        }
        token2 = absol.QuickMenu.show(me, docTypeMemuProps, [3, 4], function(menuItem) {
            switch (menuItem.value) {
                case 0:
                    self.editPosition(data, parent, index);
                    break;
                case 1:
                    self.deletePosition(data.original, parent, index);
                    break;
            }
        });

        functionX = function(token2) {
            return function() {
                var x = function(event) {
                    absol.QuickMenu.close(token2);
                    document.body.removeEventListener("click", x);
                }
                document.body.addEventListener("click", x)
            }
        }(token2);

        setTimeout(functionX, 10)
    }

    moduleDatabase.getModule("departments").load().then(function(value) {
        var header = [{ type: "dragzone", style: { minWidth: "30px", width: "30px" } }, { value: 'Bộ phận', sort: true, style: { minWidth: "unset" }, functionClickAll: functionClickRow }, { value: 'Mã', sort: true, style: { minWidth: "100px", width: "100px" }, functionClickAll: functionClickRow }, { type: "detail", functionClickAll: functionClickMore, icon: "", dragElement: false, style: { width: "30px" } }];
        self.mTable = new tableView(header, self.formatDataRow(value), false, true, 1);
        tabContainer.addChild(self.mTable);
        self.mTable.addInputSearch(tabInput);

        var header = [{ value: 'STT', type: "increase", sort: true, style: { minWidth: "50px", width: "50px" } }, { value: 'Mã', sort: true, style: { minWidth: "100px", width: "100px" } }, { value: 'Họ và tên', sort: true, style: { minWidth: "unset" } }, { value: 'Chức vụ', sort: true, style: { minWidth: "unset" } }, { value: 'Ghi chú', style: { minWidth: "unset" } }, { type: "detail", functionClickAll: functionClickMoreSencond, icon: "", dragElement: false, style: { width: "30px" } }];
        self.mTablePosition = new tableView(header, [], false, true);
        contentContainer.addChild(self.mTablePosition);

        var promiseAll = [];
        promiseAll.push(moduleDatabase.getModule("positions").load());
        promiseAll.push(moduleDatabase.getModule("users").load());
        Promise.all(promiseAll).then(function(values) {
            self.formatDataRowAccount(values[1]);
            self.formatDataRowPosition(values[0]);
        });
    });



    this.$view.addChild(_({
        tag: "div",
        class: ["pizo-list-realty-main"],
        style: {
            flexDirection: "row"
        },
        child: [{
                tag: "div",
                class: ["pizo-list-realty-main-result-control", "drag-zone-bg"],
                style: {
                    flexGrow: 0,
                    flexShrink: 0,
                    width: "40%"
                },
                child: [
                    tabInput,
                    tabContainer
                ]
            },
            {
                tag: "div",
                class: ["pizo-list-realty-main-result-control", "drag-zone-bg"],
                style: {
                    paddingLeft: "30px"
                },
                child: [
                    titleInput,
                    contentContainer
                ]
            },

        ]
    }));
    return this.$view;
}

ListPositions.prototype.formatDataRowPosition = function(data) {
    this.checkDepartment = moduleDatabase.getModule("positions").getLibary("department_id", this.getDataRowPosition.bind(this), true);
    console.log(this.checkDepartment)
}

ListPositions.prototype.getDataRowPosition = function(data) {
    var name;
    console.log(this.checkAccount[data.id], data)
    if (this.checkAccount[data.id] == undefined)
        name = "";
    else {
        name = this.checkAccount[data.id].name;
    }

    var temp = [
        {},
        data.code,
        name,
        data.name,
        data.note,
        {}
    ]
    temp.original = data;
    return temp;
}

ListPositions.prototype.formatDataRowAccount = function(data) {
    this.listAccoutData = data;
    this.checkAccount = moduleDatabase.getModule("users").getLibary("positionid");
}

ListPositions.prototype.formatDataRow = function(data) {
    var temp = [];
    var check = [];
    var k = 0;

    for (var i = 0; i < data.length; i++) {
        var result = [
            {},
            data[i].name,
            data[i].code,
            {}
        ]
        result.original = data[i];
        if (check[data[i].parent_id] !== undefined) {
            if (check[data[i].parent_id].child === undefined)
                check[data[i].parent_id].child = [];
            check[data[i].parent_id].child.push(result);
        } else
            temp[k++] = result;
        check[data[i].id] = result;
    }

    return temp;
}

ListPositions.prototype.getDataCurrent = function() {
    return this.getDataChild(this.mTable.data);
}



ListPositions.prototype.getDataChild = function(arr) {
    var self = this;
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        result.push(arr[i].original);
        if (arr[i].child !== undefined)
            result = result.concat(self.getDataChild(arr[i].child));
    }
    return result;
}

ListPositions.prototype.addDepartment = function(parent_id = 0, row) {
    var self = this;
    var mNewDepartment = new NewDepartment(undefined, parent_id);
    mNewDepartment.attach(self.parent);
    var frameview = mNewDepartment.getView(self.getDataCurrent());
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.addDBDepartment(mNewDepartment, row);
}

ListPositions.prototype.addDBDepartment = function(mNewDepartment, row) {
    var self = this;
    mNewDepartment.promiseAddDB.then(function(value) {
        moduleDatabase.getModule("departments").add(value).then(function(result) {
            self.addViewDepartment(result, row);
        })
        mNewDepartment.promiseAddDB = undefined;
        setTimeout(function() {
            if (mNewDepartment.promiseAddDB !== undefined)
                self.addDBDepartment(mNewDepartment);
        }, 10);
    })
}

ListPositions.prototype.addViewDepartment = function(value, parent) {
    var result = [
        {},
        value.name,
        value.code,
        {}
    ]
    result.original = value;

    var element = parent;
    if (value.parent_id == 0)
        element = this.mTable;
    else
        for (var i = 0; i < parent.bodyTable.childNodes.length; i++) {
            if (parent.bodyTable.childNodes[i].data.original.id == value.parent_id) {
                element = parent.bodyTable.childNodes[i];
                break;
            }
        }
    element.insertRow(result);
}

ListPositions.prototype.editDepartment = function(data, parent, index) {
    var self = this;
    var mNewDepartment = new NewDepartment(data);
    mNewDepartment.attach(self.parent);
    var frameview = mNewDepartment.getView(self.getDataCurrent());
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDBDepartment(mNewDepartment, data, parent, index);
}

ListPositions.prototype.editDBDepartment = function(mNewDepartment, data, parent, index) {
    var self = this;
    var parent_id = data.original.parent_id;
    mNewDepartment.promiseEditDB.then(function(value) {
        moduleDatabase.getModule("departments").update(value).then(function(result) {
            self.editViewDepartment(result, data, parent, index, parent_id);
        })
        mNewDepartment.promiseEditDB = undefined;
        setTimeout(function() {
            if (mNewDepartment.promiseEditDB !== undefined)
                self.editDBDepartment(mNewDepartment, data, parent, index);
        }, 10);
    })
}

ListPositions.prototype.editViewDepartment = function(value, data, parent, index, parent_id) {
    var isChangeView = false;

    if (parent_id != value.parent_id) {
        isChangeView = true;
    }
    data[1] = value.name;
    data[2] = value.code;

    var indexOF = index,
        element = parent;

    if (isChangeView === true) {
        var element;
        if (value.parent_id == 0)
            element = parent.realTable.parentNode;
        else
            for (var i = 0; i < parent.bodyTable.childNodes.length; i++) {
                if (parent.bodyTable.childNodes[i].data.original.id == value.parent_id) {
                    element = parent.bodyTable.childNodes[i];
                    break;
                }
            }
        indexOF = parent.changeParent(index, element);
    }
    element.updateRow(data, indexOF, true);
    if (this.titleInput.data == value.id) {
        this.titleInput.value = value.name;
    }
}

ListPositions.prototype.deleteDepartment = function(data, parent, index) {

    var self = this;
    var deleteItem = deleteQuestion("Xoá danh mục", "Bạn có chắc muốn xóa :" + data.name);
    this.$view.addChild(deleteItem);
    deleteItem.promiseComfirm.then(function() {
        self.deleteDBDepartment(data, parent, index);
    })
}

ListPositions.prototype.deleteViewDepartment = function(parent, index) {
    parent.dropRow(index).then(function() {

    });
}

ListPositions.prototype.deleteDBDepartment = function(data, parent, index) {
    var self = this;
    moduleDatabase.getModule("departments").delete({ id: data.id }).then(function(value) {
        self.deleteViewDepartment(parent, index);
    })
}

ListPositions.prototype.addPosition = function(parent_id = 0, row) {
    var self = this;
    var mNewPosition = new NewPosition(undefined, parent_id);
    mNewPosition.attach(self.parent);
    mNewPosition.setDataListAccount(self.listAccoutData)
    var frameview = mNewPosition.getView(self.getDataCurrent());
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.addDBPosition(mNewPosition, row);
}

ListPositions.prototype.addDBPosition = function(mNewPosition, row) {
    var self = this;
    mNewPosition.promiseAddDB.then(function(value) {
        var username = value.username;
        delete value.username;
        moduleDatabase.getModule("positions").add(value).then(function(result) {
            value.id = result.id;

            if (value.username !== undefined) {
                var x = {
                    id: username.id,
                    positionid: value.id
                }
                moduleDatabase.getModule("users").update(x).then(function() {
                    self.addViewPosition(value, row);
                })

            } else
                self.addViewPosition(value, row);
        })


        mNewPosition.promiseAddDB = undefined;
        setTimeout(function() {
            if (mNewPosition.promiseAddDB !== undefined)
                self.addDBPosition(mNewPosition);
        }, 10);
    })
}

ListPositions.prototype.addViewPosition = function(value, parent) {
    var arr = this.mTable.getElementsByClassName("choice");
    if (arr.length != 1)
        return;
    else
        arr = arr[0];
    if (value.department_id != arr.data.original.id)
        return;
    var result = this.getDataRowPosition(value);
    var element = this.mTablePosition;
    element.insertRow(result);
}

ListPositions.prototype.editPosition = function(data, parent, index) {
    var self = this;
    var mNewPosition = new NewPosition(data);
    mNewPosition.attach(self.parent);
    var frameview = mNewPosition.getView(self.getDataCurrent());
    mNewPosition.setDataListAccount(self.listAccoutData);
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDBPosition(mNewPosition, data, parent, index);
}

ListPositions.prototype.editDBPosition = function(mNewPosition, data, parent, index) {
    var self = this;
    mNewPosition.promiseEditDB.then(function(result) {
        moduleDatabase.getModule("positions").update(result).then(function(value) {
            if (value.username !== undefined && value.username.positionid != value.id) {
                var x = {
                    id: value.username.id,
                    positionid: value.id
                }
                var promiseAll = [];
                promiseAll.push(moduleDatabase.getModule("users").update(x));
                if (self.checkAccount[value.id] !== undefined) {
                    var y = {
                        id: self.checkAccount[value.id].id,
                        positionid: 0
                    }
                    var promiseAll = [];
                    promiseAll.push(moduleDatabase.getModule("users").update(y));

                }

                for (var i = 0; i < self.listAccoutData.length; i++) {
                    if (self.listAccoutData[i] !== undefined && self.checkAccount[value.id] !== undefined && self.listAccoutData[i].id == self.checkAccount[value.id].id) {
                        self.mTablePosition.updateTable(undefined, self.mTablePosition.data);
                        self.listAccoutData[i].positionid = 0;
                    }
                    if (self.listAccoutData[i].id == value.username.id)
                        self.listAccoutData[i].positionid = value.id;
                }

                Promise.all(promiseAll).then(function() {
                    delete self.checkAccount[value.username.positionid];
                    value.username.positionid = value.id;

                    self.checkAccount[value.id] = value.username;
                    value.username = undefined;
                    self.editViewPosition(value, data, parent, index);
                })

            } else
                self.editViewPosition(value, data, parent, index);
        })

        mNewPosition.promiseEditDB = undefined;
        setTimeout(function() {
            if (mNewPosition.promiseEditDB !== undefined)
                self.editDBPosition(mNewPosition, data, parent, index);
        }, 10);
    })
}

ListPositions.prototype.editViewPosition = function(value, data, parent, index) {
    var data = this.getDataRowPosition(value);

    var indexOF = index,
        element = parent;

    element.updateRow(data, indexOF, true);
}

ListPositions.prototype.deletePosition = function(data, parent, index) {

    var self = this;
    var deleteItem = deleteQuestion("Xoá danh mục", "Bạn có chắc muốn xóa :" + data.name);
    this.$view.addChild(deleteItem);
    deleteItem.promiseComfirm.then(function() {
        self.deleteDBPosition(data, parent, index);
    })
}

ListPositions.prototype.deleteViewPosition = function(parent, index) {
    parent.dropRow(index).then(function() {

    });
}

ListPositions.prototype.deleteDBPosition = function(data, parent, index) {
    var self = this;
    moduleDatabase.getModule("positions").delete({ id: data.id }).then(function(value) {
        self.deleteViewPosition(parent, index);
    })
}


ListPositions.prototype.refresh = function() {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

ListPositions.prototype.setData = function(data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

ListPositions.prototype.flushDataToView = function() {
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

ListPositions.prototype.start = function() {

}

export default ListPositions;