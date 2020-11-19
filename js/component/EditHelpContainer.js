import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/EditHelpContainer.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import "../../css/NewCategory.css"

import { tableView, deleteQuestion } from './ModuleView';
import { allowNumbersOnly, createAlias } from './ModuleView';
import moduleDatabase from '../component/ModuleDatabase';
import { loaddingWheel } from './FormatFunction';

var _ = Fcore._;
var $ = Fcore.$;

function EditHelpContainer() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    var self = this;
    if (this.$view) return this.$view;
    var input = _({
        tag: "input",
        class: "input-search-list",
        props: {
            type: "text",
            placeholder: "Search"
        }
    });
    var tabContainer = _({
        tag: "div",
        class: "header-display-visible",
        child: [{
            tag: "div",
            class: "js-stools-container-bar",
            child: [{
                    tag: "div",
                    class: ["absol-tabbar-button", "absol-tabbar-button-active"],
                    child: [{
                        tag: "div",
                        class: "absol-tabbar-button-text",
                        props: {
                            innerHTML: "Menu"
                        }
                    }]
                },
                {
                    tag: "div",
                    class: ["btn-wrapper", "input-append"],
                    child: [
                        input
                    ]
                }
            ]
        }]
    })

    this.$view = _({
        tag: "div",
        class: "b-workZone__layout",
        child: [{
            tag: "div",
            class: ["b-workZone__side", "m-workZone__side__nav"],
            child: [{
                tag: "div",
                class: ["b-workZone__content", "m-workZone__content__nav"],
                props: {
                    id: "workZone_nav",
                },
                child: [{
                    tag: "div",
                    class: "absol-tab-frame-small",
                    child: [
                        tabContainer,
                    ]
                }]
            }]
        }, ]
    })
    Object.assign(this.$view, EditHelpContainer.prototype);

    this.$view.editor = this.$view.itemEdit();
    var listParent = _({
        tag: "selectmenu",
        class: ["pizo-new-state-selectbox-container-input", "pizo-new-realty-dectruct-input"],
        style: {
            backGroundColor: ""
        },
        props: {
            enableSearch: true
        }
    });
    listParent.updateItemList = function() {
        listParent.items = self.$view.formatDataRowChoice(self.$view.getDataCurrent());
    }
    var active = _({
        tag: "switch"
    })

    var updateTableFunction;
    this.$view.addChild(_({
        tag: "div",
        class: ["b-workZone__side", "m-workZone__side__article"],
        props: {
            id: "workZone_article",
        },
        child: [{
            tag: "div",
            class: "b-workZone__content",
            props: {
                id: "workZone_article__content"
            },
            child: [{
                tag: "div",
                class: "b-article",
                child: [{
                        tag: "div",
                        class: "b-article__headerLayout-edit",
                        props: {
                            id: "article__header"
                        },
                        child: [{
                            tag: "div",
                            class: ["b-article__headerSide", "m-article__headerSide__nav"],
                            props: {
                                id: "headerSide__nav"
                            },
                            child: [{
                                tag: "ul",
                                class: "b-breadCrumbs__items",
                                child: [{
                                    tag: "div",
                                    class: "pizo-new-catergory-container",
                                    child: [{
                                            tag: "div",
                                            class: "pizo-new-category-container-name",
                                            child: [{
                                                tag: "div",
                                                class: "pizo-new-category-container-name-container",
                                                child: [{
                                                        tag: "span",
                                                        class: "pizo-new-category-container-name-container-label",
                                                        props: {
                                                            innerHTML: "Tên"
                                                        }
                                                    },
                                                    {
                                                        tag: "input",
                                                        class: ["pizo-new-category-container-name-container-input", "pizo-new-realty-dectruct-input"],
                                                        on: {
                                                            change: function(event) {
                                                                if (self.$view.alias.value === "" || self.$view.aliasErorr.classList.contains("hasErrorElement")) {
                                                                    self.$view.alias.value = createAlias(this.value);
                                                                    self.$view.alias.dispatchEvent(new Event("input"));
                                                                }
                                                            },
                                                            blur: function() {
                                                                self.$view.saveDataCurrent();
                                                            }
                                                        }
                                                    }
                                                ]
                                            }]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-category-container-alias-active",
                                            child: [{
                                                    tag: "div",
                                                    class: "pizo-new-category-container-alias",
                                                    child: [{
                                                            tag: "div",
                                                            class: "pizo-new-category-container-alias-container",
                                                            child: [{
                                                                    tag: "span",
                                                                    class: "pizo-new-category-container-alias-container-label",
                                                                    props: {
                                                                        innerHTML: "Alias"
                                                                    },
                                                                    child: [{
                                                                        tag: "span",
                                                                        class: "pizo-new-realty-location-detail-row-label-important",
                                                                        props: {
                                                                            innerHTML: "*"
                                                                        }
                                                                    }]
                                                                },
                                                                {
                                                                    tag: "input",
                                                                    class: ["pizo-new-category-container-alias-container-input", "pizo-new-realty-dectruct-input"],
                                                                    on: {
                                                                        input: function(event) {
                                                                            var parent = this.parentNode.parentNode;

                                                                            if (this.value == "") {
                                                                                if (!parent.classList.contains("hasErrorElement"))
                                                                                    parent.classList.add("hasErrorElement");
                                                                                if (!parent.classList.contains("invalid-error"))
                                                                                    parent.classList.add("invalid-error");
                                                                            } else {
                                                                                if (parent.classList.contains("invalid-error"))
                                                                                    parent.classList.remove("invalid-error");
                                                                            }

                                                                            if (listParent.items.check[this.value] !== undefined && self.$view.rowSelected.data.original.alias !== this.value) {
                                                                                if (!parent.classList.contains("hasErrorElement"))
                                                                                    parent.classList.add("hasErrorElement");
                                                                                if (!parent.classList.contains("used-error"))
                                                                                    parent.classList.add("used-error");
                                                                            } else {
                                                                                if (parent.classList.contains("used-error"))
                                                                                    parent.classList.remove("used-error");
                                                                            }


                                                                            if (!parent.classList.contains("used-error") && !parent.classList.contains("invalid-error") && parent.classList.contains("hasErrorElement"))
                                                                                parent.classList.remove("hasErrorElement")
                                                                        },
                                                                        keypress: function(event) {
                                                                            allowNumbersOnly(event);
                                                                        },
                                                                        blur: function() {
                                                                            self.$view.saveDataCurrent();
                                                                        }
                                                                    }
                                                                }

                                                            ]
                                                        },
                                                        {
                                                            tag: "span",
                                                            class: ["pizo-new-realty-location-detail-row-label-important", "label-used-error"],
                                                            props: {
                                                                innerHTML: "Alias không có sẳn để sử dụng"
                                                            }
                                                        },
                                                        {
                                                            tag: "span",
                                                            class: ["pizo-new-realty-location-detail-row-label-important", "label-invalid-error"],
                                                            props: {
                                                                innerHTML: "Alias không thể để trống"
                                                            }
                                                        }
                                                    ]
                                                },
                                                {
                                                    tag: "div",
                                                    class: "pizo-new-state-publish",
                                                    child: [{
                                                        tag: "div",
                                                        class: "pizo-new-state-publish-container",
                                                        child: [{
                                                                tag: "span",
                                                                class: "pizo-new-category-container-publish-container-label",
                                                                props: {
                                                                    innerHTML: "Xuất bản"
                                                                }
                                                            },
                                                            active
                                                        ]
                                                    }]
                                                },
                                            ]
                                        },
                                        {
                                            tag: "div",
                                            class: "pizo-new-state-selectbox",
                                            child: [{
                                                tag: "div",
                                                class: "pizo-new-state-selectbox-container",
                                                child: [{
                                                        tag: "span",
                                                        class: "pizo-new-state-selectbox-container-label",
                                                        props: {
                                                            innerHTML: "Danh mục cha"
                                                        }
                                                    },
                                                    listParent
                                                ]
                                            }]
                                        }
                                    ]
                                }]
                            }]
                        }]
                    },
                    {
                        tag: "div",
                        class: ["b-article__wrapper", "os-host", "os-theme-dark", "os-host-resize-disabled", "os-host-scrollbar-horizontal-hidden", "os-host-overflow", "os-host-overflow-y", "os-host-transition"],
                        child: [
                            self.$view.editor
                        ]
                    }
                ]
            }]
        }]
    }))
    moduleDatabase.getModule("helps").load().then(function(value) {
        var header = [{ type: "dragzone", style: { width: "30px" } }, { value: "Title", sort: true, functionClickAll: self.$view.functionClickDetail.bind(self.$view), style: { minWidth: "unset !important" } }, "Publish", { type: "detail", functionClickAll: self.$view.functionClickMore.bind(self.$view), icon: "" }];
        self.$view.mTable = new tableView(header, self.$view.formatDataRow(value), false, true, 1);
        tabContainer.addChild(self.$view.mTable);
        updateTableFunction = self.$view.mTable.updateTable.bind(self.$view.mTable);
        self.$view.mTable.updateTable = function() {
            self.$view.resetChoice();
            updateTableFunction.apply(self.$view.mTable, arguments);
        }
        listParent.updateItemList();
        var x = setInterval(function() {
            if (self.$view.editor !== undefined) {
                clearInterval(x);
                self.$view.resetChoice();
            }
        }, 100)
        setTimeout(function() {
            clearInterval(x);
        }, 5000);
        self.$view.mTable.addInputSearch(input);
    });

    this.$view.name = $('input.pizo-new-category-container-name-container-input.pizo-new-realty-dectruct-input', this.$view);
    this.$view.alias = $('input.pizo-new-category-container-alias-container-input.pizo-new-realty-dectruct-input', this.$view);
    this.$view.listParent = listParent;
    this.$view.aliasErorr = $('div.pizo-new-category-container-alias', this.$view);
    this.$view.active = active;
    return this.$view;

}

Object.defineProperties(EditHelpContainer.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
EditHelpContainer.prototype.constructor = EditHelpContainer;

EditHelpContainer.prototype.functionClickMore = function(event, me, index, parent, data, row) {

    var self = this;

    var docTypeMemuProps = {
        items: [{
                text: 'Thêm',
                icon: 'span.material-icons.material-icons-add',
                value: 0,
            },
            // {
            //     text: 'Sửa',
            //     icon: 'i.material-icons.material-icons-edit',
            //     value: 1,
            // },
            {
                text: 'Xóa',
                icon: 'span.material-icons.material-icons-delete',
                value: 2,
            },
        ]
    };
    var token = absol.QuickMenu.show(me, docTypeMemuProps, [3, 4], function(menuItem) {
        switch (menuItem.value) {
            case 0:
                self.add(row.data.original.id, row);
                break;
                // case 1:
                //     self.edit(data,parent,index);
                //     break;
            case 2:
                self.delete(row.data.original, parent, index);
                break;
        }
    });

    var functionX = function(token) {
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

EditHelpContainer.prototype.functionClickDetail = function(event, me, index, parent, data, row) {
    if (this.alias.parentNode.parentNode.classList.contains("hasErrorElement"))
        return;
    if (this.saveDataCurrent(row) === true)
        return;

    row.indexDetail = index;
    row.parentDetail = parent;
    this.rowSelected = row;

    row.classList.add("choice-event-category");
    this.setDataTitle(data.original);
    this.editor.setData(data.original.fulltext);
    this.alias.dispatchEvent(new Event("input"));
}

EditHelpContainer.prototype.saveDataCurrent = function(row) {
    var arr = this.getElementsByClassName("choice-event-category");
    var isRemove = true;
    if (arr.length !== 0)
        arr = arr[0];
    if (arr == row)
        return true;
    if (row === undefined)
        isRemove = false

    var value = {
        title: this.name.value,
        alias: this.alias.value,
        fulltext: this.editor.getData(),
        active: this.active.checked ? 1 : 0,
        parent_id: this.listParent.value
    }

    if (isRemove) {
        if (arr.classList)
            arr.classList.remove("choice-event-category");
    }

    if (arr.data) {
        var rowSelected = this.editView(value, arr.data, arr.parentDetail, arr.indexDetail);

        if (!isRemove) {
            rowSelected.parentDetail = arr.parentDetail;
            rowSelected.indexDetail = arr.indexDetail
        }
    }

    return false;
}

EditHelpContainer.prototype.resetChoice = function() {
    var arr = this.getElementsByClassName("choice-event-category");
    if (arr.length !== 0) {
        this.saveDataCurrent();
        this.resetDataTitle();
    }
    // var choice = this.getElementsByClassName("choice-event-category");
    // var mTable = this.mTable;
    // if (choice.length == 0) {
    //     if (mTable.childrenNodes.length > 0) {
    //         mTable.childrenNodes[0].indexDetail = 0;
    //         mTable.childrenNodes[0].parentDetail = mTable;
    //         this.rowSelected = mTable.childrenNodes[0];
    //         mTable.childrenNodes[0].classList.add("choice-event-category");
    //         this.setDataTitle(mTable.childrenNodes[0].data.original);
    //         this.editor.setData(mTable.childrenNodes[0].data.original.fulltext);
    //         this.alias.dispatchEvent(new Event("input"));
    //     }
    // }
}

EditHelpContainer.prototype.functionChoice = function(event, me, index, parent, data, row) {
    var self = this;

    var arr = this.getElementsByClassName("choice-list-category");
    if (arr.length !== 0)
        arr = arr[0];
    var today = new Date();
    if (self.modal.clickTime === undefined)
        self.modal.clickTime = 0;
    if (arr == row && today - self.modal.clickTime < 300) {
        self.modal.selfRemove();
        self.modal.resolve({ event: event, me: me, index: index, parent: parent, data: data, row: row });
    }
    self.modal.clickTime = today;
    if (arr.length !== 0) {
        if (arr)
            arr.classList.remove("choice-list-category");
    }

    row.classList.add("choice-list-category");
}

EditHelpContainer.prototype.syncRow = function() {
    this.saveDataCurrent();
}


EditHelpContainer.prototype.formatDataRow = function(data) {
    var temp = [];
    var check = [];
    var k = 0;
    var checkElement;
    for (var i = 0; i < data.length; i++) {
        checkElement = parseInt(data[i].active) ? _({
            tag: "div",
            class: "tick-element"
        }) : _({
            tag: "div",
            class: "cross-element"
        })
        var result = [{ value: "", style: { maxWidth: "21px" } }, {
                value: data[i].title,
                element: _({
                    tag: "div",
                    child: [{
                            tag: "span",
                            class: "title-label",
                            props: {
                                innerHTML: data[i].title
                            }
                        },
                        {
                            tag: "span",
                            class: "alias-label",
                            props: {
                                innerHTML: " (Alias :" + data[i].alias + ")"
                            }
                        }
                    ]
                }),
            },
            {
                value: data[i].active,
                element: checkElement,
                style: { maxWidth: "21px" }
            },
            { value: "", style: { maxWidth: "21px" } }
        ];
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

EditHelpContainer.prototype.formatDataRowList = function(data) {
    var temp = [];
    var check = [];
    var k = 0;
    for (var i = 0; i < data.length; i++) {
        var result = [{
                value: data[i].title,
                element: _({
                    tag: "div",
                    child: [{
                        tag: "span",
                        class: "title-label",
                        props: {
                            innerHTML: data[i].title
                        }
                    }]
                })
            },
            { value: data[i].created, style: { minWidth: "150px" } },
            { value: data[i].id }
        ];
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

EditHelpContainer.prototype.formatDataRowChoice = function() {
    var self = this;
    var array = [{ text: "Danh mục cao nhất", value: 0 }];
    var check = [];
    var dataParent = self.getDataCurrent();
    for (var i = 0; i < dataParent.length; i++) {
        array[i + 1] = { text: dataParent[i].title, value: parseFloat(dataParent[i].id) };
        if (self.data == undefined)
            check[dataParent[i].alias] = dataParent[i];
    }
    array.check = check;
    return array;
}

EditHelpContainer.prototype.getDataCurrent = function() {
    return this.getDataChild(this.mTable.data);
}

EditHelpContainer.prototype.getDataChild = function(arr) {
    var self = this;
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        result.push(arr[i].original);
        if (arr[i].child.length !== 0)
            result = result.concat(self.getDataChild(arr[i].child));
    }
    return result;
}

EditHelpContainer.prototype.default = function(parent_id = 0, ordering = -1) {
    return {
        active: 0,
        fulltext: "",
        ordering: ordering,
        parent_id: parent_id,
        title: "New Category",
        alias: ""
    }
}

EditHelpContainer.prototype.add = function(parentid = 0, row = this.mTable) {
    var self = this;
    self.addView(undefined, row, parentid)
}

EditHelpContainer.prototype.addView = function(value, row, parent_id) {
    if (value == undefined) {
        value = this.default(parent_id, row.childrenNodes.length);
    }
    var checkElement = parseInt(value.active) ? _({
        tag: "div",
        class: "tick-element"
    }) : _({
        tag: "div",
        class: "cross-element"
    })
    var result = [{ value: "", style: { maxWidth: "21px" } }, {
            value: value.title,
            element: _({
                tag: "div",
                child: [{
                        tag: "span",
                        class: "title-label",
                        props: {
                            innerHTML: value.title
                        }
                    },
                    {
                        tag: "span",
                        class: "alias-label",
                        props: {
                            innerHTML: " (Alias :" + value.alias + ")"
                        }
                    }
                ]
            }),
        },
        {
            value: parseInt(value.active),
            element: checkElement,
            style: { maxWidth: "21px" }
        },
        { value: "", style: { maxWidth: "21px" } }
    ];
    result.original = value;
    var temp = row.insertRow(result);
    temp.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    this.listParent.updateItemList();
}

EditHelpContainer.prototype.addDB = function(value) {
    var self = this;
    moduleDatabase.getModule("helps").add(value).then(function(result) {
        value.id = result.data.id;
    });
}

EditHelpContainer.prototype.edit = function(data, parent, index) {

    var self = this;
}

EditHelpContainer.prototype.editView = function(value, data, parent, index) {
    var isChangeView = false;
    if (data.original.id != undefined) {
        if (data.original.title !== value.title)
            data.original.isTitle = true;

        if (data.original.alias !== value.alias)
            data.original.isAlias = true;
        if (data.original.active !== value.active)
            data.original.isActive = true;


        if (value.fulltext !== undefined) {
            if (data.original.fulltext !== value.fulltext)
                data.original.isFulltext = true;

        }
        if (data.original.parent_id !== value.parent_id)
            data.original.isParent_id = true;
    }

    data.original.title = value.title;
    data.original.alias = value.alias;
    data.original.active = parseInt(value.active);

    if (value.fulltext !== undefined)
        data.original.fulltext = value.fulltext;

    if (data.original.parent_id != value.parent_id) {
        isChangeView = true;
    }

    data.original.parent_id = value.parent_id;
    var checkElement = parseInt(value.active) ? _({
        tag: "div",
        class: "tick-element"
    }) : _({
        tag: "div",
        class: "cross-element"
    })
    data[1] = {
        value: data.original.title,
        element: _({
            tag: "div",
            child: [{
                    tag: "span",
                    class: "title-label",
                    props: {
                        innerHTML: data.original.title
                    }
                },
                {
                    tag: "span",
                    class: "alias-label",
                    props: {
                        innerHTML: " (Alias :" + data.original.alias + ")"
                    }
                }
            ]
        }),
        style: { maxWidth: "150px" }
    };
    data[2] = {
        value: value.active,
        element: checkElement,
        style: { maxWidth: "21px" }
    };
    var indexOF = index,
        element = parent;
    if (isChangeView === true) {
        var element;
        if (value.parent_id == 0)
            element = parent.bodyTable.parentNode;
        else
            for (var i = 0; i < parent.bodyTable.childNodes.length; i++) {
                if (parent.bodyTable.childNodes[i].data.original.id == value.parent_id) {
                    element = parent.bodyTable.childNodes[i];
                    break;
                }
            }
        parent.changeParent(index, element);
    }
    var temp = element.updateRow(data, indexOF, true);
    this.listParent.updateItemList();
    return temp;
}

EditHelpContainer.prototype.editDB = function(mNewCategory, data, parent, index) {
    var self = this;
    mNewCategory.promiseEditDB.then(function(value) {
        value.id = data.original.id;
        moduleDatabase.getModule("helps").update(value).then(function(result) {
            self.editView(value, data, parent, index);
        })
        mNewCategory.promiseEditDB = undefined;
        setTimeout(function() {
            if (mNewCategory.promiseEditDB !== undefined)
                self.editDB(mNewCategory, data, parent, index);
        }, 10);
    })
}

EditHelpContainer.prototype.editContentAll = function() {
    var self = this;
    self.syncRow();
    var sync = self.mTable.data;
    var loadding = new loaddingWheel();
    var promiseAll = self.updateChild(sync);
    Promise.all(promiseAll).then(function() {
        loadding.disable();
    })
}

EditHelpContainer.prototype.updateChild = function(child) {
    var self = this;
    var promiseAll = [];
    var dataUpdate = {};
    var isUpdate;
    for (var i = 0; i < child.length; i++) {
        if (child[i].original.id == undefined) {
            promiseAll.push(self.addDB(child[i].original));
        } else {
            isUpdate = false;
            dataUpdate.id = child[i].original.id;
            if (child[i].original.isTitle === true) {
                isUpdate = true;
                dataUpdate.title = child[i].original.title;
                child[i].original.isTitle = false;
            }

            if (child[i].original.isAlias === true) {
                isUpdate = true;
                dataUpdate.alias = child[i].original.alias;
                child[i].original.isAlias = false;
            }

            if (child[i].original.isActive === true) {
                isUpdate = true;
                dataUpdate.active = child[i].original.active;
                child[i].original.isActive = false;
            }

            if (child[i].original.isParent_id === true) {
                isUpdate = true;
                dataUpdate.parent_id = child[i].original.parent_id;
                child[i].original.isParent_id = false;
            }

            if (child[i].original.isFulltext === true) {
                isUpdate = true;
                dataUpdate.fulltext = child[i].original.fulltext;
                child[i].original.isFulltext = false;
            }

            if (isUpdate || child[i].original.ordering != i) {
                if (child[i].original.ordering != i)
                    child[i].original.ordering = i;
                promiseAll.push(moduleDatabase.getModule("helps").update(dataUpdate));
            }
        }

        if (child[i].child.length !== 0)
            promiseAll.concat(this.updateChild(child[i].child));
    }
    return promiseAll;
}


EditHelpContainer.prototype.delete = function(data, parent, index) {

    var self = this;
    var deleteItem = deleteQuestion("Xoá danh mục", "Bạn có chắc muốn xóa :" + data.title);
    this.addChild(deleteItem);
    deleteItem.promiseComfirm.then(function() {
        self.deleteDB(data, parent, index);
    })
}

EditHelpContainer.prototype.deleteView = function(parent, index) {
    var self = this;
    if (this.rowSelected.parentDetail === parent && this.rowSelected.indexDetail > index)
        this.rowSelected.indexDetail--;
    parent.dropRow(index).then(function() {
        self.resetChoice();
        self.listParent.updateItemList();
    });
}

EditHelpContainer.prototype.resetDataTitle = function(data) {
    this.name.value = "";
    this.alias.value = "";
    this.listParent.value = 0;
    this.active.checked = false;
    this.editor.setData("");
}

EditHelpContainer.prototype.setDataTitle = function(data) {
    this.name.value = data.title;
    this.alias.value = data.alias;
    this.listParent.value = data.parent_id;
    this.active.checked = parseInt(data.active);
}

EditHelpContainer.prototype.deleteDB = function(data, parent, index) {
    var self = this;
    moduleDatabase.getModule("helps").delete(data).then(function(value) {
        self.deleteView(parent, index);
    })
}

EditHelpContainer.prototype.itemEdit = function() {
    var self = this;
    var textId = ("text_" + Math.random() + Math.random()).replace(/\./g, '');
    var temp = _({
        tag: 'div',
        class: "container-bot",
        props: {
            id: textId
        }
    })

    var ckedit = _({
        tag: 'attachhook',
        on: {
            error: function() {
                this.selfRemove();
                self.editor = CKEDITOR.replace(textId);
                // self.editor.on('doubleclick', function(evt) {
                //     var element = evt.data.element;
                //     if (element.is('a') && !element.getAttribute('_cke_realelement'))
                //         evt.data.dialog = null;
                // }, null, null, 10);
                self.editor.on('blur', function(e) {
                    self.saveDataCurrent();
                });
                self.editor.addCommand("comand_link_direction", {
                    exec: function(edt) {
                        var listLink = self.listLink();
                        self.appendChild(listLink);
                        listLink.promiseSelectList.then(function(value) {
                            self.editor.insertHtml("<a id=x86" + value.data.original.id + " href='./'>" + value.data.original.title + "</a>");
                        })
                    }
                });
            }
        }
    });

    return temp;
}

EditHelpContainer.prototype.listLink = function() {
    var self = this;

    var header = [{ value: "Title", sort: true, functionClickAll: self.functionChoice.bind(self) }, { value: "Date", sort: true }, { value: "ID", sort: true }];
    var mTable = new tableView(header, self.formatDataRowList(self.getDataCurrent()), false, false, 0);
    mTable.style.width = "calc(100% - 20px)";
    mTable.style.marginLeft = "10px";
    var input = _({
        tag: "input",
        class: "input-search-list",
        props: {
            type: "text",
            placeholder: "Search"
        }
    })
    self.modal = _({
        tag: "modal",
        class: "list-linkChoice",
        on: {
            click: function(event) {
                var element = event.target;

                while (!(element.classList.contains("list-linkChoice") || element.classList.contains("list-linkChoice-container")))
                    element = element.parentNode;
                if (element.classList.contains("list-linkChoice")) {
                    this.selfRemove();
                    self.modal.reject();
                }
            }
        },
        child: [{
            tag: "div",
            class: ["list-linkChoice-container", "absol-single-page-scroller"],
            child: [{
                    tag: "div",
                    class: "js-stools-container-bar",
                    child: [{
                        tag: "div",
                        class: ["btn-wrapper", "input-append"],
                        child: [
                            input
                        ]
                    }]
                },
                mTable
            ]
        }]
    })
    mTable.addInputSearch(input);
    self.modal.promiseSelectList = new Promise(function(resolve, reject) {
        self.modal.resolve = resolve;
        self.modal.reject = reject;
    })
    return self.modal;
}

EditHelpContainer.prototype.refresh = function() {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData().toString();
    if (data)
        this.setData(data);
};

EditHelpContainer.prototype.setData = function(data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

EditHelpContainer.prototype.flushDataToView = function() {
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

EditHelpContainer.prototype.start = function() {

}

export default EditHelpContainer;