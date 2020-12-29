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
import { loadingWheel } from './FormatFunction';

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
            style: {
                height: "calc(100% - 50px)",
                top: "50px"
            },
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

    var editor = this.$view.itemEdit();
    var editorBottom = this.$view.itemEditRelated();

    var listParent = _({
        tag: "selecttreemenu",
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
    var containerEditView = _({
        tag: "div",
        class: "b-article",
        style: {
            display: "none"
        },
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
                    editor
                ]
            },
            {
                tag: "div",
                class: ["b-article__wrapper", "os-host-bottom", "os-theme-dark", "os-host-resize-disabled", "os-host-scrollbar-horizontal-hidden", "os-host-overflow", "os-host-overflow-y", "os-host-transition"],
                child: [
                    editorBottom
                ]
            }
        ]
    });
    var containerPreview = this.$view.editViewContent();
    this.$view.containerEditView = containerEditView;
    this.$view.containerPreview = containerPreview;
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
            child: [
                containerEditView,
                containerPreview
            ]
        }]
    }))
    moduleDatabase.getModule("helps").load({ ORDERING: "parent_id , ordering" }).then(function(value) {
        var header = [{ type: "dragzone", style: { width: "30px" } }, { value: "Title", sort: true, functionClickAll: self.$view.functionClickDetail.bind(self.$view), style: { minWidth: "unset !important" } }, { value: "Publish", style: { width: "67px" } }, { type: "detail", functionClickAll: self.$view.functionClickMore.bind(self.$view), icon: "", style: { width: "30px" } }];
        self.$view.mTable = new tableView(header, self.$view.formatDataRow(value), false, true, 1);
        tabContainer.addChild(self.$view.mTable);
        updateTableFunction = self.$view.mTable.updateTable.bind(self.$view.mTable);
        self.$view.mTable.updateTable = function() {
            self.$view.resetChoice();
            updateTableFunction.apply(self.$view.mTable, arguments);
        }
        self.$view.mTable.addInputSearch(input);
    });

    this.$view.tabContainer = tabContainer;
    this.$view.name = $('input.pizo-new-category-container-name-container-input.pizo-new-realty-dectruct-input', this.$view);
    this.$view.alias = $('input.pizo-new-category-container-alias-container-input.pizo-new-realty-dectruct-input', this.$view);
    this.$view.listParent = listParent;
    this.$view.aliasErorr = $('div.pizo-new-category-container-alias', this.$view);
    this.$view.active = active;

    return this.$view;

}

Object.defineProperties(EditHelpContainer.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
EditHelpContainer.prototype.constructor = EditHelpContainer;

EditHelpContainer.prototype.enableEditViewContent = function() {
    this.containerPreview.style.display = "none";
    this.containerEditView.style.display = "";
    this.tabContainer.style.pointerEvents = "none";
    this.enableEditting = true;
}

EditHelpContainer.prototype.disableEditViewContent = function() {
    this.saveDataCurrent();
    this.containerPreview.style.display = "";
    this.containerEditView.style.display = "none";
    this.tabContainer.style.pointerEvents = "";
    this.enableEditting = false;
    var row = this.getElementsByClassName("choice-event-category");
    var data;
    if (row.length === 1) {
        row = row[0]
    }
    data = row.data;
    if (data) {
        this.titleLabel.innerHTML = data.original.title;
        var text = data.original.fulltext;
        if (data.original.related) {
            text += "<div style='border: 1px solid;'></div>";
            text += "<h3>Bài liên quan</h3>";
            text += data.original.related;
        }
        text += "<div style='width:100%;height:150px'></div>";
        this.containerView.innerHTML = text;
        var location = "";
        var tempElement = row;
        while (tempElement && tempElement.tagName != "DIV") {
            if (location !== "") {
                location = "<span> > </span>" + location;
            }
            location = "<a href='./' id='x64" + tempElement.data.original.id + "'>" + tempElement.data.original.title + "</a>" + location;
            tempElement = tempElement.getParentNode();
        }
        if (location !== "")
            this.locationLabel.innerHTML = location;
    }
}


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
                if (row.parentNode == null) {
                    for (var i = 0; i < parent.childrenNodes.length; i++) {
                        if (row.data == parent.childrenNodes[i].data) {
                            row = parent.childrenNodes[i];
                            break;
                        }
                    }
                }
                self.add(row.data.original.id, row);
                break;
                // case 1:
                //     self.edit(data,parent,index);
                //     break;
            case 2:
                if (parent.parentNode == null) {
                    parent = row.getParentNode();
                }
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
    var arr = this.getElementsByClassName("choice-event-category");
    if (this.alias.parentNode.parentNode.classList.contains("hasErrorElement") && arr.length > 0)
        return;
    if (this.saveDataCurrent(row) === true)
        return;

    this.titleLabel.innerHTML = data.original.title;
    var text = data.original.fulltext;
    if (data.original.related) {
        text += "<div style='border: 1px solid;'></div>";
        text += "<h3>Bài liên quan</h3>";
        text += data.original.related;
    }
    text += "<div style='width:100%;height:150px'></div>";
    this.containerView.innerHTML = text;
    var location = "";
    var tempElement = row;
    while (tempElement && tempElement.tagName != "DIV") {
        if (location !== "") {
            location = "<span> > </span>" + location;
        }
        location = "<a href='./' id='x64" + tempElement.data.original.id + "'>" + tempElement.data.original.title + "</a>" + location;
        tempElement = tempElement.getParentNode();
    }
    this.locationLabel.innerHTML = location;
    this.rowSelected = row;
    row.classList.add("choice-event-category");
    this.setDataTitle(data.original);
    this.editor.setData(data.original.fulltext);
    this.editorRelated.setData(data.original.related);
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
        isRemove = false;

    var value = {
        title: this.name.value,
        alias: this.alias.value,
        fulltext: this.editor.getData(),
        related: this.editorRelated.getData(),
        active: this.active.checked ? 1 : 0,
        parent_id: this.listParent.value,
        id: this.idCurrent
    }

    if (isRemove) {
        if (arr.classList)
            arr.classList.remove("choice-event-category");
    }

    if (arr.data) {
        this.editView(value, arr.data, arr);
    }
    this.listParent.updateItemList();
    return false;
}

EditHelpContainer.prototype.resetChoice = function() {
    var arr = this.getElementsByClassName("choice-event-category");
    if (arr.length !== 0) {
        this.saveDataCurrent();
        this.resetDataTitle();
        arr[0].classList.remove("choice-event-category");
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

EditHelpContainer.prototype.formatDataRowOne = function(data) {
    var checkElement = parseInt(data.active) ? _({
        tag: "div",
        class: "tick-element"
    }) : _({
        tag: "div",
        class: "cross-element"
    })
    var result = [{ value: "" }, {
            value: data.title,
            element: _({
                tag: "div",
                child: [{
                        tag: "span",
                        class: "title-label",
                        props: {
                            innerHTML: data.title
                        }
                    },
                    {
                        tag: "span",
                        class: "alias-label",
                        props: {
                            innerHTML: " (Alias :" + data.alias + ")"
                        }
                    }
                ]
            }),
        },
        {
            value: data.active,
            element: checkElement,
        },
        { value: "" }
    ];
    result.original = data;
    return result;
}

EditHelpContainer.prototype.formatDataRow = function(data) {
    var temp = [];
    var check = [];
    var result;
    for (var i = 0; i < data.length; i++) {
        result = this.formatDataRowOne(data[i]);
        if (data[i].parent_id != 0) {
            if (check[data[i].parent_id] === undefined)
                check[data[i].parent_id] = [];
            check[data[i].parent_id].push(result);
        } else {
            temp.push(result);
        }
    }
    for (var i = 0; i < temp.length; i++) {
        temp[i].child = this.checkarrayChild(temp[i].original.id, check);
    }
    return temp;
}

EditHelpContainer.prototype.checkarrayChild = function(id, check) {
    if (check[id] === undefined)
        return [];
    for (var i = 0; i < check[id].length; i++) {
        check[id][i].child = this.checkarrayChild(check[id][i].original.id, check);
    }
    return check[id];
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

EditHelpContainer.prototype.checkarrayChildChoice = function(id, check) {
    if (check[id] === undefined)
        return [];
    for (var i = 0; i < check[id].length; i++) {
        if (id == this.idCurrent)
            continue;
        check[id][i].items = this.checkarrayChildChoice(check[id][i].value, check);
    }
    return check[id];
}

EditHelpContainer.prototype.formatDataRowChoice = function() {
    var temp = [{ text: "Danh mục cao nhất", value: 0 }];
    var check = [];
    var result;
    temp.check = [];
    var data = this.getDataCurrent();
    for (var i = 0; i < data.length; i++) {
        temp.check[data[i].alias] = data[i];
        if (data[i].id == this.idCurrent)
            continue;
        result = { text: data[i].title, value: parseFloat(data[i].id) };
        if (data[i].parent_id != 0) {
            if (check[data[i].parent_id] === undefined)
                check[data[i].parent_id] = [];
            check[data[i].parent_id].push(result);
        } else {
            temp.push(result);
        }
    }
    for (var i = 0; i < temp.length; i++) {
        temp[i].items = this.checkarrayChildChoice(temp[i].value, check);
    }
    return temp;
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
    var result = {
        active: 0,
        fulltext: "",
        ordering: ordering,
        parent_id: parent_id,
        title: "New Category",
        alias: ""
    }
    return result;
}

EditHelpContainer.prototype.add = function(parentid, row = this.mTable) {
    var self = this;
    var value = this.default(parentid, row.childrenNodes.length);
    var promiseParent = self.addDB(value);
    var loading = new loadingWheel();
    promiseParent.then(function(result) {
        value = self.formatDataRowOne(result);
        self.addView(value, row);
        loading.disable();
    })
}

EditHelpContainer.prototype.addView = function(value, row) {
    var temp = row.insertRow(value);
    temp.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    this.listParent.updateItemList();
}

EditHelpContainer.prototype.addDB = function(value) {
    var promiseAdd = moduleDatabase.getModule("helps").add(value);
    promiseAdd.then(function(result) {
        value.id = result.id;
    });
    return promiseAdd;
}

EditHelpContainer.prototype.edit = function(data, parent, index) {}

EditHelpContainer.prototype.editViewContent = function() {
    var location = _({
        tag: "span",
        class: "b-breadCrumbs__location_content",
    })
    var title = _({
        tag: "li",
        class: "b-breadCrumbs__item",
        props: {
            innerHTML: "Introduction"
        }
    })
    var containerView = _({
        tag: "div",
        class: ["cke_editable", "cke_editable_themed", "cke_contents_ltr", "cke_show_borders"],
        props: {
            contenteditable: true,
            spellcheck: false
        }
    })
    var temp = _({
        tag: "div",
        class: ["b-article", "b-workZone__layout_helpcontainer_view"],
        child: [{
            tag: "div",
            class: "b-article__headerLayout",
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
                            child: [title]
                        },
                        {
                            tag: "div",
                            class: "b-breadCrumbs__location",
                            child: [{
                                    tag: "span",
                                    class: "b-breadCrumbs__location_title",
                                    props: {
                                        innerHTML: "Bạn ở đây "
                                    }
                                },
                                location
                            ]
                        }
                    ]
                },
                {
                    tag: "div",
                    class: ["b-article__headerSide", "m-article__headerSide__buttons"],
                    props: {
                        id: "headerSide__buttons"
                    },
                    child: [{
                        tag: "ul",
                        class: "b-controlButtons__items",
                        child: [

                            {
                                tag: "li",
                                class: ["b-controlButtons__item", "m-controlButtons__item__print"],
                                on: {
                                    click: function() {
                                        Dom.printElement(self.$view.containerView.parentNode);
                                    }
                                },
                                child: [{
                                    tag: "i",
                                    class: "material-icons",
                                    props: {
                                        innerHTML: "print"
                                    }
                                }]
                            }
                        ]
                    }]
                }
            ]
        }, {
            tag: "div",
            class: "container-content-information",
            child: [containerView]
        }]
    })
    this.containerView = containerView;
    this.titleLabel = title;
    this.locationLabel = location;
    return temp;
}

EditHelpContainer.prototype.editView = function(value, data, elementParam) {
    var parent = elementParam.getParentNode();
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
        if (value.related !== undefined) {
            if (data.original.related !== value.related)
                data.original.isRelated = true;
        }
        if (data.original.parent_id !== value.parent_id)
            data.original.isParent_id = true;
    }

    data.original.title = value.title;
    data.original.alias = value.alias;
    data.original.active = parseInt(value.active);

    if (value.fulltext !== undefined)
        data.original.fulltext = value.fulltext;
    if (value.related !== undefined)
        data.original.related = value.related;

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
        var index = parent.childrenNodes.indexOf(elementParam);
        parent.changeParent(index, element);
        setTimeout(function() {
            elementParam.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        }, 100)
    }
    var temp = elementParam.updateCurrentRow(data);

    this.listParent.updateItemList();
    return temp;
}

EditHelpContainer.prototype.editDB = function(mNewCategory, data, parent, index) {
    var self = this;
    mNewCategory.promiseEditDB.then(function(value) {
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
    var loading = new loadingWheel();
    var promiseAll = self.updateChild(sync);
    Promise.all(promiseAll).then(function() {
        loading.disable();
        var arr = this.getElementsByClassName("choice-event-category");
        if (this.alias.parentNode.parentNode.classList.contains("hasErrorElement") && arr.length > 0)
            arr[0].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }.bind(this))
}

EditHelpContainer.prototype.updateChild = function(child) {
    var promiseAll = [];
    var isUpdate;
    for (var i = 0; i < child.length; i++) {
        isUpdate = false;
        var dataUpdate = {};
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

        if (child[i].original.isRelated === true) {
            isUpdate = true;
            dataUpdate.related = child[i].original.related;
            child[i].original.isRelated = false;
        }

        if (child[i].original.ordering != i) {
            isUpdate = true;
            dataUpdate.ordering = i;
            child[i].original.ordering = i;
        }
        if (isUpdate) {
            promiseAll.push(moduleDatabase.getModule("helps").update(dataUpdate));
        }

        if (child[i].child.length !== 0) {
            promiseAll = promiseAll.concat(this.updateChild(child[i].child));
        }
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
    if (this.rowSelected)
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
    this.editorRelated.setData("");
    this.idCurrent = undefined;
}

EditHelpContainer.prototype.setDataTitle = function(data) {
    this.name.value = data.title;
    this.alias.value = data.alias;
    this.idCurrent = data.id;
    this.listParent.updateItemList();
    this.listParent.value = data.parent_id;
    this.active.checked = parseInt(data.active);
}

EditHelpContainer.prototype.addPromisePush = function(data) {
    var result = [];
    var dataOriginal = data.original;
    if (dataOriginal && dataOriginal.id) {
        result.push(moduleDatabase.getModule("helps").delete({ id: dataOriginal.id }));
    }
    if (data.child && data.child.length > 0) {
        for (var i = 0; i < data.child.length; i++) {
            result = result.concat(this.addPromisePush(data.child[i]));
        }
    }
    return result;
}

EditHelpContainer.prototype.deleteDB = function(data, parent, index) {
    var self = this;
    var row = parent.childrenNodes[index];
    var promiseAll = this.addPromisePush(row.data);
    if (promiseAll.length > 0)
        Promise.all(promiseAll).then(function(value) {
            if (parent.childrenNodes[index] && parent.childrenNodes[index].classList.contains("choice-event-category")) {
                self.resetDataTitle();
            }
            self.deleteView(parent, index);
        })
    else {
        if (parent.childrenNodes[index] && parent.childrenNodes[index].classList.contains("choice-event-category")) {
            self.resetDataTitle();
        }
        self.deleteView(parent, index);
    }
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
                CKFinder.setupCKEditor(self.editor, './');
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
                            self.editor.insertHtml("<a id=x64" + value.data.original.id + " href='./'>" + value.data.original.title + "</a>");
                        })
                    }
                });
                self.editor.addCommand("comand_note", {
                    exec: function(edt) {
                        var selected_text = self.editor.getSelection().getSelectedText();
                        self.editor.insertHtml(`<div style="
                        display: flex;
                        border: 2px solid #f4eb49;
                        padding: 5px;
                        padding-bottom: 20px;
                        "><i class="material-icons" style="
                        display: flex;
                        flex-shrink: 0;
                        width: 40px;
                        font-size: 30px;
                        color: #f4eb49;
                    ">sticky_note_2</i> <span style="
                        flex-grow: 2;
                        display: flex;
                        padding: 5px;
                    ">` + selected_text + `</span></div>
                    `);
                    }
                });
            }
        }
    });

    return temp;
}

EditHelpContainer.prototype.itemEditRelated = function() {
    var self = this;
    var textId = ("text_" + Math.random() + Math.random()).replace(/\./g, '');
    var temp = _({
        tag: 'div',
        class: "container-bot-related",
        props: {
            id: textId
        }
    })

    var ckedit = _({
        tag: 'attachhook',
        on: {
            error: function() {
                this.selfRemove();
                self.editorRelated = CKEDITOR.replace(textId);
                CKFinder.setupCKEditor(self.editorRelated, './');
                // self.editor.on('doubleclick', function(evt) {
                //     var element = evt.data.element;
                //     if (element.is('a') && !element.getAttribute('_cke_realelement'))
                //         evt.data.dialog = null;
                // }, null, null, 10);
                self.editorRelated.on('blur', function(e) {
                    self.saveDataCurrent();
                });
                self.editorRelated.addCommand("comand_link_direction", {
                    exec: function(edt) {
                        var listLink = self.listLink();
                        self.appendChild(listLink);
                        listLink.promiseSelectList.then(function(value) {
                            self.editorRelated.insertHtml("<a id=x64" + value.data.original.id + " href='./'>" + value.data.original.title + "</a>");
                        })
                    }
                });
                self.editorRelated.addCommand("comand_note", {
                    exec: function(edt) {
                        var selected_text = self.editorRelated.getSelection().getSelectedText();
                        self.editorRelated.insertHtml(`<div style="
                        display: flex;
                        border: 2px solid #f4eb49;
                        padding: 5px;
                        padding-bottom: 20px;
                        "><i class="material-icons" style="
                        display: flex;
                        flex-shrink: 0;
                        width: 40px;
                        font-size: 30px;
                        color: #f4eb49;
                    ">sticky_note_2</i> <span style="
                        flex-grow: 2;
                        display: flex;
                        padding: 5px;
                    ">` + selected_text + `</span></div>
                    `);
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
    var mTable = new tableView(header, self.formatDataRowList(self.getDataCurrent()), true, false, 0);
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

EditHelpContainer.prototype.editPage = function() {
    var textIdHeader = ("text_" + Math.random() + Math.random()).replace(/\./g, '');
    var textIdFooter = ("text_" + Math.random() + Math.random()).replace(/\./g, '');

    var ckeditHeader = _({
        tag: 'attachhook',
        on: {
            error: function() {
                this.selfRemove();
                self.editor = CKEDITOR.replace(textIdHeader);
                // self.editor.on('doubleclick', function(evt) {
                //     var element = evt.data.element;
                //     if (element.is('a') && !element.getAttribute('_cke_realelement'))
                //         evt.data.dialog = null;
                // }, null, null, 10);
                self.editor.addCommand("comand_link_direction", {
                    exec: function(edt) {
                        var listLink = self.listLink();
                        self.appendChild(listLink);
                        listLink.promiseSelectList.then(function(value) {
                            self.editor.insertHtml("<a id=x86" + value.data.original.id + " href='./'>" + value.data.original.title + "</a>");
                        })
                    }
                });
                self.editor.addCommand("comand_note", {
                    exec: function(edt) {

                    }
                });
            }
        }
    });
    var ckeditFooter = _({
        tag: 'attachhook',
        on: {
            error: function() {
                this.selfRemove();
                self.editor = CKEDITOR.replace(textIdFooter);
                // self.editor.on('doubleclick', function(evt) {
                //     var element = evt.data.element;
                //     if (element.is('a') && !element.getAttribute('_cke_realelement'))
                //         evt.data.dialog = null;
                // }, null, null, 10);
                self.editor.addCommand("comand_link_direction", {
                    exec: function(edt) {
                        var listLink = self.listLink();
                        self.appendChild(listLink);
                        listLink.promiseSelectList.then(function(value) {
                            self.editor.insertHtml("<a id=x86" + value.data.original.id + " href='./'>" + value.data.original.title + "</a>");
                        })
                    }
                });
                self.editor.addCommand("comand_note", {
                    exec: function(edt) {

                    }
                });
            }
        }
    });
    var settingPage = _({
        tag: "div",
        class: "setting-page-container",
        child: [{
                tag: "div",
                class: "setting-page-container-title",
                child: [{
                        tag: "span",
                        class: "setting-page-container-title-label",
                        props: {
                            innerHTML: "Title"
                        }
                    },
                    {
                        tag: "input",
                        class: "setting-page-container-title-input",
                    }
                ]
            },
            {
                tag: "div",
                class: "setting-page-container-header",
                child: [{
                    tag: "span",
                    class: "setting-page-container-header-label",
                    props: {
                        innerHTML: "Header"
                    }
                }, {
                    tag: "div",
                    class: "setting-page-container-header-editor",
                    child: [{
                        tag: "div",
                        props: {
                            id: textIdHeader
                        }
                    }]
                }]
            }, {
                tag: "div",
                class: "setting-page-container-footer",
                child: [{
                    tag: "span",
                    class: "setting-page-container-footer-label",
                    props: {
                        innerHTML: "Footer"
                    }
                }, {
                    tag: "div",
                    class: "setting-page-container-footer-editor",
                    child: [{
                        tag: "div",
                        props: {
                            id: textIdFooter
                        }
                    }]
                }]
            }
        ]
    })
    this.appendChild(settingPage);
    this.settingPage = settingPage;
}

EditHelpContainer.prototype.saveHeaderFooter = function() {

}

EditHelpContainer.prototype.closeEditPage = function() {
    if (this.settingPage) {
        this.settingPage.selfRemove();
        this.settingPage = undefined;
        return true;
    }
    return false;
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