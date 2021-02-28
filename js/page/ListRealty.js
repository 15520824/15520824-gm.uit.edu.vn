import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListRealty.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import MergeRealty from '../component/MergeRealty';
import MapRealty from './MapRealty';
import { loadingWheel, formatNumber, reFormatNumber } from '../component/FormatFunction';

import {
    tableView,
    deleteQuestion
} from '../component/ModuleView';
import NewRealty from '../component/NewRealty';
import {
    formatDate,
    getGMT
} from '../component/FormatFunction';
import moduleDatabase from '../component/ModuleDatabase';
import BrowserDetector from 'absol/src/Detector/BrowserDetector';

var _ = Fcore._;
var $ = Fcore.$;

function ListRealty() {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.modalLargeRealty = MapRealty.prototype.modalLargeRealty;
    this.detailHouse = MapRealty.prototype.detailHouse;
    this.convenientView = MapRealty.prototype.convenientView;
    this.itemCount = MapRealty.prototype.itemCount;
    this.contactView = MapRealty.prototype.contactView;
    this.contactItem = MapRealty.prototype.contactItem;
    this.juridicalView = MapRealty.prototype.juridicalView;
    this.mediaItem = MapRealty.prototype.mediaItem;
    this.requestEdit = MapRealty.prototype.requestEdit;
    this.requestEditDB = MapRealty.prototype.requestEditDB;
    this.itemDisplayNone = MapRealty.prototype.itemDisplayNone;
    this.noteChat = MapRealty.prototype.noteChat;
    this.possessionHistory = MapRealty.prototype.possessionHistory;
    this.possessionHistoryNode = MapRealty.prototype.possessionHistoryNode;

    moduleDatabase.getModule("users").load().then(function(value) {
        this.checkUser = moduleDatabase.getModule("users").getLibary("phone");
        this.checkUserID = moduleDatabase.getModule("users").getLibary("id");
    }.bind(this))

    // moduleDatabase.getModule("contacts").load().then(function(value) {
    //     this.checkContact = moduleDatabase.getModule("contacts").getLibary("phone");
    //     this.checkContactID = moduleDatabase.getModule("contacts").getLibary("id");
    // }.bind(this))
}

ListRealty.prototype.setContainer = function(parent) {
    this.parent = parent;
}

Object.defineProperties(ListRealty.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
ListRealty.prototype.constructor = ListRealty;
ListRealty.prototype.setCensorship = function() {
    this.isCensorship = true;
}

// ListRealty.prototype.requestEdit = function(data) {
//     var self = this;
//     var mNewRealty = new NewRealty(data);
//     mNewRealty.attach(self.parent);
//     mNewRealty.setRequestEdit();
//     mNewRealty.setDataListAccount(self.listAccoutData);
//     mNewRealty.setDataListContact(self.listContactData);
//     var frameview = mNewRealty.getView();
//     self.parent.body.addChild(frameview);
//     self.parent.body.activeFrame(frameview);
//     self.requestEditDB(mNewRealty, data);
// }

// ListRealty.prototype.requestEditDB = function(mNewRealty, data) {
//     var self = this
//     mNewRealty.promiseEditDB.then(function(value) {
//         moduleDatabase.getModule("modification_requests").add(value).then(function(result) {
//             // self.editView(value, data);
//         })
//         mNewRealty.promiseEditDB = undefined;
//         setTimeout(function() {
//             if (mNewRealty.promiseEditDB !== undefined)
//                 self.requestEditDB(mNewRealty, data);
//         }, 10);
//     })
// }

ListRealty.prototype.getView = function() {
    if (this.$view) return this.$view;
    var self = this;
    var input = _({
        tag: "input",
        class: "quantumWizTextinputPaperinputInput",
        props: {
            type: "number",
            autocomplete: "off",
            min: 1,
            max: 200,
            step: 1,
            value: 50
        }
    })
    var allinput = _({
        tag: "input",
        class: "pizo-list-realty-page-allinput-input",
        props: {
            placeholder: "Tìm theo mã, tên, số điện thoại, địa chỉ bất động sản"
        }
    });
    if (BrowserDetector.isMobile) {
        allinput.placeholder = "Tìm bất động sản"
    }
    var saveButton, callAgainButton, mergeButton, viewMapButton, confirmButton, cancelConfirmButton, deleteButton;

    var hiddenConfirm = _({
        tag: "selectmenu",
        class: "selectmenu-hidden-confirm",
        style: {
            display: "none"
        },
        props: {
            value: 0,
            items: [
                { text: "Tất cả", value: 0 },
                { text: "Duyệt", value: "censorship1" },
                { text: "Chưa duyệt", value: "censorship0" },
            ]
        }
    })

    saveButton = _({
        tag: "button",
        class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
        on: {
            click: function(evt) {
                self.add();
            }
        },
        child: [
            '<span>' + "Thêm" + '</span>'
        ]
    });

    callAgainButton = _({
        tag: "button",
        class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
        on: {
            click: function(evt) {
                if (this.currentMerge === true) {
                    // self.merge();
                    // this.currentMerge = undefined;
                    saveButton.style.display = "";
                    mergeButton.style.display = "";
                    confirmButton.style.display = "";
                    cancelConfirmButton.style.display = "";
                    viewMapButton.style.display = "";
                    deleteButton.style.display = "";
                    this.childNodes[0].innerHTML = "Yêu cầu gọi lại";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(0, 0);
                    this.currentMerge = undefined;
                    // self.merge(self.mTable.getTrueCheckBox());
                } else {
                    saveButton.style.display = "none";
                    mergeButton.style.display = "none";
                    confirmButton.style.display = "none";
                    cancelConfirmButton.style.display = "none";
                    viewMapButton.style.display = "none";
                    deleteButton.style.display = "none";
                    this.childNodes[0].innerHTML = "Xong";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(1, 0);
                    this.currentMerge = true;
                }
            }
        },
        child: [
            '<span>' + "Yêu cầu gọi lại" + '</span>'
        ]
    });

    confirmButton = _({
        tag: "button",
        class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
        on: {
            click: function(evt) {
                if (this.currentMerge === true) {
                    saveButton.style.display = "";
                    mergeButton.style.display = "";
                    callAgainButton.style.display = "";
                    cancelConfirmButton.style.display = "";
                    viewMapButton.style.display = "";
                    deleteButton.style.display = "";
                    this.childNodes[0].innerHTML = "Duyệt";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(0, 0);
                    this.currentMerge = undefined;
                    self.mTable.data.splice.apply(self.mTable.data, [self.mTable.data.length, 0].concat(this.ortherData));
                    hiddenConfirm.value = 0;
                    hiddenConfirm.emit("change");
                    var dataSum = self.mTable.getTrueCheckBox();
                    var arr = [];
                    var tempData;
                    for (var i = 0; i < dataSum.length; i++) {
                        dataSum[i][20] = "censorship1";
                        dataSum[i].original.censorship = 1;
                        dataSum[i][1] = {};
                        tempData = self.getDataEditFake(dataSum[i]);
                        self.mTable.resetHash();
                        arr.push(moduleDatabase.getModule("activehouses").update(tempData));
                    }
                    var loading = new loadingWheel();
                    Promise.all(arr).then(function() {
                        loading.disable();
                    })
                } else {
                    saveButton.style.display = "none";
                    mergeButton.style.display = "none";
                    callAgainButton.style.display = "none";
                    cancelConfirmButton.style.display = "none";
                    viewMapButton.style.display = "none";
                    deleteButton.style.display = "none";
                    this.childNodes[0].innerHTML = "Xong";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(1, 0);
                    this.currentMerge = true;
                    this.ortherData = self.browserFilter(self.mTable.data);
                    hiddenConfirm.value = "censorship0";
                    hiddenConfirm.emit("change");
                }
            }
        },
        child: [
            '<span>' + "Duyệt" + '</span>'
        ]
    });

    deleteButton = _({
        tag: "button",
        class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
        on: {
            click: function(evt) {
                if (this.currentMerge === true) {
                    saveButton.style.display = "";
                    mergeButton.style.display = "";
                    callAgainButton.style.display = "";
                    cancelConfirmButton.style.display = "";
                    viewMapButton.style.display = "";
                    confirmButton.style.display = "";
                    this.childNodes[0].innerHTML = "Xóa";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(0, 0);
                    this.currentMerge = undefined;
                    hiddenConfirm.value = 0;
                    hiddenConfirm.emit("change");
                    var dataSum = self.mTable.getTrueCheckBox();
                    var arr = [];
                    for (var i = 0; i < dataSum.length; i++) {
                        arr.push(dataSum[i].original);
                    }
                    self.delete(arr);
                } else {
                    saveButton.style.display = "none";
                    mergeButton.style.display = "none";
                    callAgainButton.style.display = "none";
                    cancelConfirmButton.style.display = "none";
                    viewMapButton.style.display = "none";
                    confirmButton.style.display = "none";
                    this.childNodes[0].innerHTML = "Xong";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(1, 0);
                    this.currentMerge = true;
                }
            }
        },
        child: [
            '<span>' + "Xóa" + '</span>'
        ]
    });

    cancelConfirmButton = _({
        tag: "button",
        class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
        on: {
            click: function(evt) {
                if (this.currentMerge === true) {
                    // self.merge();
                    // this.currentMerge = undefined;
                    saveButton.style.display = "";
                    mergeButton.style.display = "";
                    callAgainButton.style.display = "";
                    confirmButton.style.display = "";
                    viewMapButton.style.display = "";
                    deleteButton.style.display = "";
                    this.childNodes[0].innerHTML = "Hủy duyệt";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(0, 0);
                    this.currentMerge = undefined;
                    hiddenConfirm.value = 0;
                    hiddenConfirm.emit("change");

                    var dataSum = self.mTable.getTrueCheckBox();
                    var arr = [];
                    var tempData;
                    for (var i = 0; i < dataSum.length; i++) {
                        dataSum[i][20] = "censorship0";
                        dataSum[i].original.censorship = 0;
                        dataSum[i][1] = {};
                        tempData = self.getDataEditFake(dataSum[i]);
                        self.mTable.resetHash();
                        arr.push(moduleDatabase.getModule("activehouses").update(tempData));
                    }
                    var loading = new loadingWheel();
                    Promise.all(arr).then(function() {
                        loading.disable();
                    })
                } else {
                    saveButton.style.display = "none";
                    mergeButton.style.display = "none";
                    callAgainButton.style.display = "none";
                    confirmButton.style.display = "none";
                    viewMapButton.style.display = "none";
                    deleteButton.style.display = "none";
                    this.childNodes[0].innerHTML = "Xong";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(1, 0);
                    this.currentMerge = true;
                    hiddenConfirm.value = "censorship1";
                    hiddenConfirm.emit("change");
                }
            }
        },
        child: [
            '<span>' + "Hủy duyệt" + '</span>'
        ]
    });

    mergeButton = _({
        tag: "button",
        class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
        on: {
            click: function(evt) {
                if (this.currentMerge === true) {
                    // self.merge();
                    // this.currentMerge = undefined;
                    confirmButton.style.display = "";
                    saveButton.style.display = "";
                    callAgainButton.style.display = "";
                    cancelConfirmButton.style.display = "";
                    viewMapButton.style.display = "";
                    deleteButton.style.display = "";
                    this.childNodes[0].innerHTML = "Gộp";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(0, 0);
                    this.currentMerge = undefined;
                    var arrMerge = self.mTable.getTrueCheckBox();
                    if (arrMerge.length > 0)
                        self.merge(arrMerge);
                    self.mTable.data.splice.apply(self.mTable.data, [self.mTable.data.length, 0].concat(this.ortherData));
                    self.HTinput.emit("change");
                } else {
                    confirmButton.style.display = "none";
                    saveButton.style.display = "none";
                    callAgainButton.style.display = "none";
                    cancelConfirmButton.style.display = "none";
                    viewMapButton.style.display = "none";
                    deleteButton.style.display = "none";
                    this.childNodes[0].innerHTML = "Xong";
                    this.ortherData = self.mergeFilterNone(self.mTable.data);
                    self.mTable.updateTable();
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(1, 0);
                    this.currentMerge = true;

                }
            }
        },
        child: [
            '<span>' + "Gộp" + '</span>'
        ]
    })

    viewMapButton = _({
        tag: "button",
        class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
        on: {
            click: function(evt) {
                app.openPage(18);
            }
        },
        child: [
            '<span>' + "Xem bản đồ" + '</span>'
        ]
    });


    this.$view = _({
        tag: 'singlepage',
        class: ["pizo-list-realty", "pizo-list-realty-main-header"],
        child: [{
            class: 'absol-single-page-header',
            child: [{
                    tag: "span",
                    class: "pizo-body-title-left",
                    props: {
                        innerHTML: "Nhà đất"
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
                        saveButton,
                        deleteButton,
                        mergeButton,
                        callAgainButton,
                        confirmButton,
                        cancelConfirmButton,
                        viewMapButton
                    ]
                },
                {
                    tag: "div",
                    class: "pizo-list-realty-page-allinput",
                    child: [{
                            tag: "div",
                            class: "pizo-list-realty-page-allinput-container",
                            child: [
                                allinput,
                                {
                                    tag: "button",
                                    class: "pizo-list-realty-page-allinput-search",
                                    child: [{
                                        tag: 'i',
                                        class: 'material-icons',
                                        props: {
                                            innerHTML: 'search'
                                        },
                                    }, ]
                                },
                            ]
                        },
                        {
                            tag: "div",
                            class: "pizo-list-realty-page-allinput-filter",
                            on: {
                                click: function(event) {
                                    self.searchControl.show();
                                }
                            },
                            child: [{
                                    tag: 'filter-ico',
                                },
                                {
                                    tag: "span",
                                    class: "navbar-search__filter-text",
                                    props: {
                                        innerHTML: "Lọc"
                                    }
                                }
                            ]
                        },
                    ]
                },
                {
                    tag: "div",
                    class: "pizo-list-realty-page-number-line",
                    child: [
                        input,
                        {
                            tag: "span",
                            class: "freebirdFormeditorViewAssessmentWidgetsPointsLabel",
                            props: {
                                innerHTML: "Số dòng"
                            }
                        }
                    ]
                }
            ]
        }, ]
    });
    var docTypeMemuProps, token, functionX;
    var functionClickMore = function(event, me, index, parent, data, row) {
        var isEdit = false;
        var isRequest = false;
        var isDetail = false;
        var isDelete = false;
        var districtid;
        var stateid;
        Loop: for (var param in moduleDatabase.checkPermission) {
            if (data.original.portion == "" && data.original.addressnumber == "")
                continue;
            var object = JSON.parse(param);
            districtid = undefined;
            stateid = undefined;
            if (data.original.wardid)
                districtid = self.checkWard[data.original.wardid].districtid;
            if (districtid)
                stateid = self.checkDistrict[districtid].stateid;
            for (var objectParam in object) {
                if (objectParam === "stateid") {
                    if (stateid !== object[objectParam])
                        continue Loop;
                } else
                if (objectParam === "districtid") {
                    if (districtid !== object[objectParam])
                        continue Loop;
                } else
                if (object[objectParam] !== data.original[objectParam]) {
                    continue Loop;
                }
            }
            if (moduleDatabase.checkPermission[param].indexOf(58) !== -1) {
                isEdit = true;
            }
            if (moduleDatabase.checkPermission[param].indexOf(59) !== -1) {
                isDelete = true;
            }
            if (moduleDatabase.checkPermission[param].indexOf(67) !== -1) {
                isDetail = true;
            }
            if (moduleDatabase.checkPermission[param].indexOf(68) !== -1) {
                isRequest = true;
            }
        }
        docTypeMemuProps = {
            items: []
        }
        if (isEdit)
            docTypeMemuProps.items.push({
                text: 'Sửa',
                icon: 'span.mdi.mdi-text-short',
                value: 0,
            });
        else {
            if (isRequest) {
                docTypeMemuProps.items.push({
                    text: 'Yêu cầu chỉnh sửa',
                    icon: 'span.mdi.mdi-text-short',
                    value: 3,
                });
            }
        }
        if (isDelete)
            docTypeMemuProps.items.push({
                text: 'Xóa',
                icon: 'span.mdi.mdi-text',
                value: 1,
            });
        if (isDetail)
            docTypeMemuProps.items.push({
                text: 'Chi tiết',
                icon: 'span.mdi.mdi-text',
                value: 2,
            });
        token = absol.QuickMenu.show(me, docTypeMemuProps, [3, 4], function(menuItem) {
            switch (menuItem.value) {
                case 0:
                    self.edit(data, parent, index);
                    break;
                case 1:
                    self.delete(data.original, parent, index);
                    break;
                case 2:
                    document.body.appendChild(self.modalLargeRealty(data.original));
                    break;
                case 3:
                    self.requestEdit({ original: data.original });
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

    var tabContainer = _({
        tag: "div",
        class: ["pizo-list-realty-main-result-control", "drag-zone-bg"],
        child: [

        ]
    })

    var arr = [];
    var promise;
    arr.push(moduleDatabase.getModule("wards").load());
    arr.push(moduleDatabase.getModule("type_activehouses").load());
    arr.push(moduleDatabase.getModule("districts").load());
    arr.push(moduleDatabase.getModule("states").load());
    arr.push(moduleDatabase.getModule("equipments").load());
    arr.push(moduleDatabase.getModule("purpose").load());
    arr.push(moduleDatabase.getModule("juridicals").load());
    Promise.all(arr).then(function(values) {
        if (self.isCensorship === true)
            promise = moduleDatabase.getModule("activehouses").load({ WHERE: [{ censorship: 0 }] });
        else {
            var x = new Date(self.endDay.value.toDateString());
            x.setDate(x.getDate() + 1);
            promise = moduleDatabase.getModule("activehouses").load({ WHERE: [{ created: { operator: ">=", value: new Date(self.startDay.value.toDateString()) } }, "&&", { created: { operator: "<=", value: x } }] });
        }
        promise.then(function(value) {
            self.checkWard = moduleDatabase.getModule("wards").getLibary("id");
            self.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");
            self.checkState = moduleDatabase.getModule("states").getLibary("id");
            var header = [{
                    type: "dragzone",
                    dragElement: false,
                    disabled: true
                },
                {
                    type: "check",
                    dragElement: false,
                    hidden: true,
                    disabled: true
                }, {
                    value: 'MS',
                    sort: true,
                    style: {
                        minWidth: "30px"
                    }
                }, 'Số nhà', {
                    value: 'Tên đường'
                }, {
                    value: 'Phường/Xã'
                }, {
                    value: 'Quận/Huyện'
                }, {
                    value: 'Tỉnh/TP'
                }, {
                    value: 'Ghi chú',
                    hidden: true,
                }, {
                    value: 'Ngang',
                    sort: true,
                    style: {
                        minWidth: "50px"
                    }
                }, {
                    value: 'Dài',
                    sort: true,
                    style: {
                        minWidth: "50px"
                    }
                }, {
                    value: 'DT',
                    sort: true,
                    style: {
                        minWidth: "50px"
                    }
                }, {
                    value: 'Kết cấu'
                }, {
                    value: 'Hướng'
                }, {
                    value: 'Giá',
                    sort: true,
                    style: {
                        minWidth: "50px"
                    }
                }, {
                    value: 'Giá m²',
                    sort: true,
                    style: {
                        minWidth: "50px"
                    }
                }, {
                    value: 'Hiện trạng',
                    disableInput: true,
                    style: {
                        minWidth: "85px"
                    }
                }, {
                    value: 'Ngày tạo',
                    sort: true
                }, {
                    value: 'Ngày cập nhật',
                    sort: true
                }, {
                    type: "detail",
                    functionClickAll: functionClickMore,
                    dragElement: false,
                    disabled: true
                }, {
                    hidden: true,
                    disabled: true
                }
            ];
            // header.isSaveTheme = "#19001080";
            if (moduleDatabase.isStaff === true) {
                header.attachSrcoll = true;
                header[2].hidden = true;
                header[2].disabled = true;
            }
            if (moduleDatabase.isAdd == false) {
                saveButton.style.display = "none";
            }
            if (moduleDatabase.isMerge == false) {
                mergeButton.style.display = "none";
            }
            if (moduleDatabase.isCall == false) {
                callAgainButton.style.display = "none";
            }
            if (moduleDatabase.isConfirm == false) {
                confirmButton.style.display = "none";
            }
            if (moduleDatabase.isCancelConfirm == false) {
                cancelConfirmButton.style.display = "none";
            }
            var arr = [];
            var connect = "||";
            var arr = [];
            for (var i = 0; i < value.length; i++) {
                if (value[i].streetid !== 0 && value[i].streetid !== null) {
                    if (arr.length > 0)
                        arr.push(connect);
                    arr.push({ id: value[i].streetid });
                }
                if (value[i].streetid_old !== 0 && value[i].streetid_old !== null) {
                    if (arr.length > 0)
                        arr.push(connect);
                    arr.push({ id: value[i].streetid_old });
                }
            }
            moduleDatabase.getModule("streets").load({ WHERE: arr }).then(function(valueStr) {
                self.checkStreet = moduleDatabase.getModule("streets").getLibary("id");
                if (self.isCensorship) {
                    value = moduleDatabase.getModule("activehouses").getLibary("censorship", self.getDataRow.bind(self), true);
                    value = value[0];
                } else {
                    value = self.formatDataRow(value);
                }
                self.mTable = new tableView(header, value, true, true, 1);
                self.mTable.addInputSearchHeader();
                self.mTable.addInputSearch($('.pizo-list-realty-page-allinput-container input', self.$view));
                // self.mTable.addRange(self.startDay, self.endDay, 17);
                self.mTable.addRange(self.lowprice, self.highprice, 14);
                self.mTable.addFilter(hiddenConfirm, 20);
                self.mTable.addFilter(self.HTinput, 16);
                tabContainer.addChild(self.mTable);
            })

            moduleDatabase.getModule("users").load().then(function(value) {
                self.formatDataRowAccount(value);
            })

            // moduleDatabase.getModule("contacts").load().then(function(value) {
            //     self.formatDataRowContact(value);
            // })
        })
    });

    this.searchControl = this.searchControlContent();

    this.$view.addChild(_({
        tag: "div",
        class: ["pizo-list-realty-main"],
        style: {
            flexDirection: "column"
        },
        child: [
            this.searchControl,
            tabContainer
        ]
    }));
    return this.$view;
}

ListRealty.prototype.formatUpdateData = function(value) {
    var self = this;
    var arr = [];
    var connect = "||";
    var arr = [];
    for (var i = 0; i < value.length; i++) {
        if (value[i].streetid !== 0 && value[i].streetid !== null) {
            if (arr.length > 0)
                arr.push(connect);
            arr.push({ id: value[i].streetid });
        }
        if (value[i].streetid_old !== 0 && value[i].streetid_old !== null) {
            if (arr.length > 0)
                arr.push(connect);
            arr.push({ id: value[i].streetid_old });
        }
    }
    moduleDatabase.getModule("streets").load({ WHERE: arr }).then(function(valueStr) {
        self.checkStreet = moduleDatabase.getModule("streets").getLibary("id");
        if (self.isCensorship) {
            value = moduleDatabase.getModule("activehouses").getLibary("censorship", self.getDataRow.bind(self), true);
            value = value[0];
        } else {
            value = self.formatDataRow(value);
        }
        self.mTable.updateTable(undefined, value);
    })
}

ListRealty.prototype.formatDataRowAccount = function(data) {
    this.listAccoutData = data;
}

ListRealty.prototype.formatDataRowContact = function(data) {
    this.listContactData = data;
}

ListRealty.prototype.formatDataRow = function(data) {
    var temp = [];
    var check = [];
    var k = 0;
    var self = this;
    var districtid;
    var stateid;
    var isAvailable;
    var isCensorshipFalse;
    var isDetail;
    var checkFavourite;
    if (this.isFavourite === true) {
        checkFavourite = moduleDatabase.getModule("favourite").getLibary("houseid");
    }
    for (var i = 0; i < data.length; i++) {
        isAvailable = false;
        isCensorshipFalse = false;
        isDetail = false
        Loop: for (var param in moduleDatabase.checkPermission) {
            if (data[i].addressnumber == "" && data[i].portion == "")
                continue;
            var object = JSON.parse(param);
            districtid = undefined;
            stateid = undefined;
            if (data[i].wardid)
                districtid = self.checkWard[data[i].wardid].districtid;
            if (districtid)
                stateid = self.checkDistrict[districtid].stateid;
            for (var objectParam in object) {
                if (objectParam === "stateid") {
                    if (stateid !== object[objectParam])
                        continue Loop;
                } else
                if (objectParam === "districtid") {
                    if (districtid !== object[objectParam])
                        continue Loop;
                } else
                if (object[objectParam] !== data[i][objectParam]) {
                    continue Loop;
                }
            }
            if (moduleDatabase.checkPermission[param].indexOf(56) !== -1) {
                isAvailable = true;
            }
            if (moduleDatabase.checkPermission[param].indexOf(63) !== -1) {
                isCensorshipFalse = true;
            }
            if (moduleDatabase.checkPermission[param].indexOf(67) !== -1) {
                isDetail = true;
            }
        }
        if (isAvailable == false)
            continue;
        if (checkFavourite) {
            if (checkFavourite[data[i].id] == undefined)
                continue;
        }
        var result = this.getDataRow(data[i], isCensorshipFalse, isDetail);
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

ListRealty.prototype.getDataRow = function(data, isCensorshipFalse, isDetail) {
    var self = this;
    var structure;
    switch (parseInt(data.structure)) {
        case 0:
            structure = "Chưa xác định";
            break;
        case 1:
            structure = "Đất trống";
            break;
        case 2:
            structure = "Cấp 4";
            break;
        case 3:
            structure = data.floor + " Tầng";
            var advanceDetruct = data.advancedetruct;
            var isAD = advanceDetruct % 10 ? true : false;
            advanceDetruct = parseInt(advanceDetruct / 10);
            var isAD1 = advanceDetruct % 10 ? true : false;
            advanceDetruct = parseInt(advanceDetruct / 10);
            if (isAD) {
                structure += "+ Lửng";
            }
            if (isAD1) {
                structure += "+ Sân thượng";
            }
            break;
    }
    var direction;

    switch (parseInt(data.direction)) {
        case 0:
            direction = "Chưa xác định";
            break;
        case 1:
            direction = "Đông";
            break;
        case 2:
            direction = "Tây";
            break;
        case 3:
            direction = "Nam";
            break;
        case 4:
            direction = "Bắc";
            break;
        case 5:
            direction = "Tây Bắc";
            break;
        case 6:
            direction = "Đông Bắc";
            break;
        case 7:
            direction = "Tây Nam";
            break;
        case 8:
            direction = "Đông Nam";
            break;
    }
    var staus = "";
    var statusValue = [];
    if (parseInt(parseInt(data.status) % 10) == 1) {
        staus += "Còn bán";
        statusValue.push(1);
    }
    if (parseInt(parseInt(data.status) / 10) == 1) {
        if (staus == "")
            staus += "Còn cho thuê";
        else
            staus += " và còn cho thuê";
        statusValue.push(10);
    }
    if(statusValue.length == 0)
        statusValue.push(2);
    if (data.addressnumber != "") {
        var district = "";
        var state = "";
        var number = data.addressnumber;
        if (this.checkStreet[data.streetid])
            var street = this.checkStreet[data.streetid].name;
        else
            var street = "";
        if (this.checkWard[data.wardid]) {
            var ward = this.checkWard[data.wardid].name;
            var district = this.checkDistrict[this.checkWard[data.wardid].districtid].name;
            var state = this.checkState[this.checkDistrict[this.checkWard[data.wardid].districtid].stateid].name;
        } else
            var ward = "";

    } else {
        var number = street = ward = district = state = "";
    }

    var textCensorship = "censorship" + data.censorship;
    if (data.censorship == 1) {
        if (isCensorshipFalse === false) {
            textCensorship = "xxxxxxxxxxxxxxxxx"
        }
    }

    var MS = {
        value: data.id,
        style: {
            whiteSpace: "nowrap"
        }
    };
    if (isDetail == true) {
        MS.element = _({
            tag: "a",
            props: {
                innerHTML: data.id
            },
            style: {
                color: "#007bff",
                textDecoration: "none",
                backgroundColor: "transparent",
                cursor: "pointer"
            },
            on: {
                click: function(event) {
                    document.body.appendChild(self.modalLargeRealty(data));
                }
            }
        })
    }
    var content = data.content;
    if(content == null)
    content = "";
    var result = [
        {},
        {
            functionClick: function() {
                var data = arguments[4].original;
                console.log(arguments[4][0].value, arguments[1].childNodes[0].childNodes[0].checked)
            }
        },
        MS,
        number,
        street,
        ward,
        district,
        state,
        content,
        {
            value: data.height,
            style: {
                whiteSpace: "nowrap"
            }
        },
        {
            value: data.width,
            style: {
                whiteSpace: "nowrap"
            }
        },
        {
            value: data.acreage,
            style: {
                whiteSpace: "nowrap"
            }
        },
        structure,
        direction,
        { element: _({ text: (data.price / 1000000000) + " tỉ" }), value: data.price },
        data.price / 1000000 / data.acreage + " triệu",
        { value: statusValue, element: _({ text: staus }) },
        { valuesearch: formatDate(data.created, true, true, true, true, true), element: _({ text: formatDate(data.created, true, true, true, true, true) }), valuesort: new Date(data.created), value: new Date(data.created) },
        { valuesearch: formatDate(data.created, true, true, true, true, true), element: _({ text: formatDate(data.modified, true, true, true, true, true) }), valuesort: new Date(data.modified), value: new Date(data.modified) },
        {},
        textCensorship
    ];
    result.original = data;
    return result;
}

function getEditDistance(a, b) {
    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
};

ListRealty.prototype.browserFilter = function(data) {
    var checkAvaliable = [];
    var result = [];
    var tempData;
    var tempPushData;
    var indexData;
    var index;
    var isAvailable;
    var districtid;
    var stateid;
    var self = this;
    for (var i = 0; i < data.length; i++) {
        isAvailable = false;
        Loop: for (var param in moduleDatabase.checkPermission) {
            if (data[i].original.addressnumber == "" && data[i].original.portion == "")
                continue;
            var object = JSON.parse(param);
            districtid = undefined;
            stateid = undefined;
            if (data[i].original.wardid)
                districtid = self.checkWard[data[i].original.wardid].districtid;
            if (districtid)
                stateid = self.checkDistrict[districtid].stateid;
            for (var objectParam in object) {
                if (objectParam === "stateid") {
                    if (stateid !== object[objectParam])
                        continue Loop;
                } else
                if (objectParam === "districtid") {
                    if (districtid !== object[objectParam])
                        continue Loop;
                } else
                if (object[objectParam] !== data[i].original[objectParam]) {
                    continue Loop;
                }
            }
            if (moduleDatabase.checkPermission[param].indexOf(62) !== -1) {
                isAvailable = true;
            }
        }
        if (isAvailable == false)
            continue;
        indexData = data[i];
        indexData.visiable = true;
        tempData = checkAvaliable[indexData[4] + indexData[5] + indexData[6] + indexData[7]];
        if (tempData)
            for (var j = 0; j < tempData.length; j++) {
                if (tempData[j] !== undefined && getEditDistance(tempData[j][3], indexData[3]) <= indexData[3].length / 3) {

                    tempPushData = result[indexData[4] + indexData[5] + indexData[6] + indexData[7]];
                    if (tempPushData === undefined)
                        tempPushData = [];
                    tempPushData.push(indexData);
                    indexData.visiable = false;
                    data.splice(i, 1);
                    i--;


                    index = data.indexOf(tempData[j]);
                    if (index !== -1) {
                        tempPushData.push(tempData[j]);
                        tempData[j].visiable = false;
                        data.splice(index, 1);
                        i--;
                    }
                    result[indexData[4] + indexData[5] + indexData[6] + indexData[7]] = tempPushData;
                }
            }
        if (checkAvaliable[indexData[4] + indexData[5] + indexData[6] + indexData[7]] == undefined)
            checkAvaliable[indexData[4] + indexData[5] + indexData[6] + indexData[7]] = [];
        checkAvaliable[indexData[4] + indexData[5] + indexData[6] + indexData[7]].push(indexData);
    }
    var final = [];
    for (var param in result) {
        final.splice.apply(final, [0, 0].concat(result[param]));
    }
    data.ortherFilter = true;
    return final;
}

ListRealty.prototype.mergeFilter = function(data) {
    var checkAvaliable = [];
    var result = [];
    var tempData;
    var tempPushData;
    var indexData;
    var index;
    var isAvailable;
    var districtid;
    var stateid;
    var self = this;
    for (var i = 0; i < data.length; i++) {
        isAvailable = false;
        Loop: for (var param in moduleDatabase.checkPermission) {
            if (data[i].original.addressnumber == "" && data[i].original.portion == "")
                continue;
            var object = JSON.parse(param);
            districtid = undefined;
            stateid = undefined;
            if (data[i].original.wardid)
                districtid = self.checkWard[data[i].original.wardid].districtid;
            if (districtid)
                stateid = self.checkDistrict[districtid].stateid;
            for (var objectParam in object) {
                if (objectParam === "stateid") {
                    if (stateid !== object[objectParam])
                        continue Loop;
                } else
                if (objectParam === "districtid") {
                    if (districtid !== object[objectParam])
                        continue Loop;
                } else
                if (object[objectParam] !== data[i].original[objectParam]) {
                    continue Loop;
                }
            }
            if (moduleDatabase.checkPermission[param].indexOf(64) !== -1) {
                isAvailable = true;
            }
        }
        if (isAvailable == false)
            continue;
        indexData = data[i];
        tempData = checkAvaliable[indexData[4] + indexData[5] + indexData[6] + indexData[7]];
        if (tempData)
            for (var j = 0; j < tempData.length; j++) {
                if (tempData[j] !== undefined && getEditDistance(tempData[j][3], indexData[3]) <= indexData[3].length / 3) {
                    tempPushData = result[indexData[4] + indexData[5] + indexData[6] + indexData[7]];
                    if (tempPushData === undefined)
                        tempPushData = [];
                    if (indexData.visiable == undefined) {
                        tempPushData.push(indexData);
                        indexData.visiable = true;
                        data.splice(i, 1);
                        i--;
                    }
                    if (tempData[j][4].visiable == undefined) {
                        index = data.indexOf(tempData[j]);
                        if (index !== -1) {
                            tempPushData.push(tempData[j]);
                            tempData[j].visiable = true;
                            data.splice(index, 1);
                            i--;
                        }
                    }
                    result[indexData[4] + indexData[5] + indexData[6] + indexData[7]] = tempPushData;
                }
            }
        if (checkAvaliable[indexData[4] + indexData[5] + indexData[6] + indexData[7]] == undefined)
            checkAvaliable[indexData[4] + indexData[5] + indexData[6] + indexData[7]] = [];
        checkAvaliable[indexData[4] + indexData[5] + indexData[6] + indexData[7]].push(indexData);
    }
    var length = data.length;
    var final = [...data];
    data.splice(0, length);
    for (var param in result) {
        data.splice.apply(data, [0, 0].concat(result[param]));
    }
    data.ortherFilter = true;
    return final;
}

ListRealty.prototype.mergeFilterNone = function(data) {
    var result = [];
    var isAvailable;
    var districtid;
    var stateid;
    var self = this;
    for (var i = 0; i < data.length; i++) {
        isAvailable = false;
        Loop: for (var param in moduleDatabase.checkPermission) {
            if (data[i].original.addressnumber == "" && data[i].original.portion == "")
                continue;
            var object = JSON.parse(param);
            districtid = undefined;
            stateid = undefined;
            if (data[i].original.wardid)
                districtid = self.checkWard[data[i].original.wardid].districtid;
            if (districtid)
                stateid = self.checkDistrict[districtid].stateid;
            for (var objectParam in object) {
                if (objectParam === "stateid") {
                    if (stateid !== object[objectParam])
                        continue Loop;
                } else
                if (objectParam === "districtid") {
                    if (districtid !== object[objectParam])
                        continue Loop;
                } else
                if (object[objectParam] !== data[i].original[objectParam]) {
                    continue Loop;
                }
            }
            if (moduleDatabase.checkPermission[param].indexOf(64) !== -1) {
                isAvailable = true;
            }
        }
        if (isAvailable == false)
            continue;
        data[i].visiable = true;
        result.push(data[i]);
        data.splice(i, 1);
        i--;
    }
    var length = data.length;
    var final = [...data];
    data.splice(0, length);
    data.splice.apply(data, [0, 0].concat(result));
    data.ortherFilter = true;
    return final;
}

ListRealty.prototype.searchControlContent = function() {
    var startDay, endDay;
    var self = this;
    var oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() - 1);
    startDay = _({
        tag: 'calendar-input',
        data: {
            anchor: 'top',
            value: oneMonthFromNow,
            maxDateLimit: new Date()
        },
        on: {
            changed: function(date) {
                endDay.minDateLimit = date;
                var tempDate = new Date(date.getTime());;;
                tempDate.setMonth(tempDate.getMonth() + 2);
                if (endDay.value - tempDate > 0)
                    endDay.value = tempDate;
                var x = new Date(self.endDay.value.toDateString());
                x.setDate(x.getDate() + 1);
                moduleDatabase.getModule("activehouses").load({ WHERE: [{ created: { operator: ">=", value: new Date(self.startDay.value.toDateString()) } }, "&&", { created: { operator: "<=", value: x } }] }).then(function(value) {
                    self.formatUpdateData(value);
                });
            }
        }
    })

    endDay = _({
        tag: 'calendar-input',
        data: {
            anchor: 'top',
            value: new Date(),
            minDateLimit: new Date()
        },
        on: {
            changed: function(date) {
                startDay.maxDateLimit = date;
                var tempDate = new Date(date.getTime());;
                tempDate.setMonth(tempDate.getMonth() - 2);
                if (startDay.value - tempDate > 0)
                    startDay.value = tempDate;
                var x = new Date(self.endDay.value.toDateString());
                x.setDate(x.getDate() + 1);
                moduleDatabase.getModule("activehouses").load({ WHERE: [{ created: { operator: ">=", value: new Date(self.startDay.value.toDateString()) } }, "&&", { created: { operator: "<=", value: x } }] }).then(function(value) {
                    self.formatUpdateData(value);
                });
            }
        }
    })
    var content = _({
        tag: "div",
        class: "pizo-list-realty-main-search-control-container",
        on: {
            click: function(event) {
                event.stopPropagation();
            }
        },
        child: [{
            tag: "div",
            class: "pizo-list-realty-main-search-control-container-scroller",
            child: [{
                    tag: "div",
                    class: "pizo-list-realty-main-search-control-row",
                    child: [{
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-price",
                            child: [{
                                tag: "div",
                                class: "pizo-list-realty-main-search-control-row-HT",
                                child: [{
                                        tag: "span",
                                        class: "pizo-list-realty-main-search-control-row-HT-label",
                                        props: {
                                            innerHTML: "Tình trạng"
                                        }
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-list-realty-main-search-control-row-HT-input",
                                        child: [{
                                            tag: "selectmenu",
                                            props: {
                                                items: [{
                                                        text: "Tất cả",
                                                        value: 0
                                                    },
                                                    {
                                                        text: "Còn bán",
                                                        value: 1
                                                    },
                                                    {
                                                        text: "Còn cho thuê",
                                                        value: 10
                                                    },
                                                    {
                                                        text: "Ngừng giao dịch",
                                                        value: 2
                                                    }
                                                ]
                                            }
                                        }]
                                    }
                                ]
                            }, ]
                        },
                        {
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-date",
                            child: [{
                                tag: "div",
                                class: "pizo-list-realty-main-search-control-row-HT",
                                child: [{
                                        tag: "span",
                                        class: "pizo-list-realty-main-search-control-row-date-label",
                                        props: {
                                            innerHTML: "Thời gian tạo"
                                        }
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-list-realty-main-search-control-row-date-input",
                                        child: [
                                            startDay,
                                            endDay
                                        ]
                                    }
                                ]
                            }]
                        },
                        {
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-price",
                            child: [{
                                tag: "div",
                                class: "pizo-list-realty-main-search-control-row-HT",
                                child: [{
                                        tag: "span",
                                        class: "pizo-list-realty-main-search-control-row-price-label",
                                        props: {
                                            innerHTML: "Khoảng giá"
                                        }
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-list-realty-main-search-control-row-price-input",
                                        child: [{
                                                tag: "input",
                                                class: "pizo-list-realty-main-search-control-row-price-input-low",
                                                props: {
                                                    autocomplete: "off",
                                                    placeholder: "đ Từ",
                                                },
                                                on: {
                                                    input: function(event) {
                                                        this.value = formatNumber(this.value);
                                                    },
                                                    change: function(event) {
                                                        this.value = reFormatNumber(this.value);
                                                    }
                                                }
                                            },
                                            {
                                                tag: "input",
                                                class: "pizo-list-realty-main-search-control-row-price-input-high",
                                                props: {
                                                    autocomplete: "off",
                                                    placeholder: "đ Đến",
                                                },
                                                on: {
                                                    input: function(event) {
                                                        this.value = formatNumber(this.value);
                                                    },
                                                    change: function(event) {
                                                        this.value = reFormatNumber(this.value);
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                ]
                            }]
                        },
                        {
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-price",
                            style: {
                                height: "30px"
                            },
                            child: [{
                                tag: "div",
                                class: "pizo-list-realty-main-search-control-row-HT",
                                child: [{
                                        tag: "span",
                                        class: "pizo-list-realty-main-search-control-row-price-label",
                                        props: {
                                            innerHTML: "Cần gộp"
                                        }
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-list-realty-main-search-control-row-HT-checkbox",
                                        child: [{
                                            tag: "checkbox",
                                            on: {
                                                change: function(event) {
                                                    if (this.checked === true) {
                                                        this.ortherData = self.mergeFilter(self.mTable.data);
                                                        self.mTable.updateTable();
                                                    } else {
                                                        self.mTable.data.splice.apply(self.mTable.data, [self.mTable.data.length, 0].concat(this.ortherData));
                                                        self.HTinput.emit("change");
                                                    }
                                                }
                                            }
                                        }]
                                    }
                                ]
                            }]
                        }
                        // {
                        //     tag: "div",
                        //     class: "pizo-list-realty-main-search-control-row-phone",
                        //     child: [{
                        //             tag: "span",
                        //             class: "pizo-list-realty-main-search-control-row-phone-label",
                        //             props: {
                        //                 innerHTML: "Số điện thoại"
                        //             }
                        //         },
                        //         {
                        //             tag: "div",
                        //             class: "pizo-list-realty-main-search-control-row-phone-input",
                        //             child: [{
                        //                 tag: "input",
                        //                 props: {
                        //                     type: "number",
                        //                     autocomplete: "off"
                        //                 }
                        //             }]
                        //         }
                        //     ]
                        // },
                        // {
                        //     tag: "div",
                        //     class: "pizo-list-realty-main-search-control-row-button",
                        //     child: [{
                        //         tag: "button",
                        //         class: ["pizo-list-realty-button-deleteall", "pizo-list-realty-button-element"],
                        //         on: {
                        //             click: function (evt) {
                        //                 temp.reset();
                        //             }
                        //         },
                        //         child: [
                        //             '<span>' + "Thiết lập lại" + '</span>'
                        //         ]
                        //     }]
                        // },
                    ]
                },
                {
                    tag: "div",
                    class: "pizo-list-realty-main-search-control-row",
                    child: [
                        // {
                        //     tag: "div",
                        //     class: "pizo-list-realty-main-search-control-row-MS",
                        //     child: [{
                        //             tag: "span",
                        //             class: "pizo-list-realty-main-search-control-row-MS-label",
                        //             props: {
                        //                 innerHTML: "Mã số"
                        //             }
                        //         },
                        //         {
                        //             tag: "div",
                        //             class: "pizo-list-realty-main-search-control-row-MS-input",
                        //             child: [{
                        //                 tag: "input",
                        //                 props: {
                        //                     type: "number",
                        //                     autocomplete: "off"
                        //                 }
                        //             }]
                        //         }
                        //     ]
                        // },
                        // {
                        //     tag: "div",
                        //     class: "pizo-list-realty-main-search-control-row-SN",
                        //     child: [{
                        //             tag: "span",
                        //             class: "pizo-list-realty-main-search-control-row-SN-label",
                        //             props: {
                        //                 innerHTML: "Số nhà"
                        //             }
                        //         },
                        //         {
                        //             tag: "div",
                        //             class: "pizo-list-realty-main-search-control-row-SN-input",
                        //             child: [{
                        //                 tag: "input",
                        //             }]
                        //         }
                        //     ]
                        // },
                        // {
                        //     tag: "div",
                        //     class: "pizo-list-realty-main-search-control-row-TD",
                        //     child: [{
                        //             tag: "span",
                        //             class: "pizo-list-realty-main-search-control-row-TD-label",
                        //             props: {
                        //                 innerHTML: "Tên đường"
                        //             }
                        //         },
                        //         {
                        //             tag: "div",
                        //             class: "pizo-list-realty-main-search-control-row-TD-input",
                        //             child: [{
                        //                 tag: "input",
                        //             }]
                        //         }
                        //     ]
                        // },
                        // {
                        //     tag: "div",
                        //     class: "pizo-list-realty-main-search-control-row-PX",
                        //     child: [{
                        //             tag: "span",
                        //             class: "pizo-list-realty-main-search-control-row-PX-label",
                        //             props: {
                        //                 innerHTML: "Phường/Xã"
                        //             }
                        //         },
                        //         {
                        //             tag: "div",
                        //             class: "pizo-list-realty-main-search-control-row-PX-input",
                        //             child: [{
                        //                 tag: "input",
                        //             }]
                        //         }
                        //     ]
                        // },
                        // {
                        //     tag: "div",
                        //     class: "pizo-list-realty-main-search-control-row-QH",
                        //     child: [{
                        //             tag: "span",
                        //             class: "pizo-list-realty-main-search-control-row-QH-label",
                        //             props: {
                        //                 innerHTML: "Quận huyện"
                        //             }
                        //         },
                        //         {
                        //             tag: "div",
                        //             class: "pizo-list-realty-main-search-control-row-QH-input",
                        //             child: [{
                        //                 tag: "input",
                        //             }]
                        //         }
                        //     ]
                        // },
                        // {
                        //     tag: "div",
                        //     class: "pizo-list-realty-main-search-control-row-TT",
                        //     child: [{
                        //             tag: "span",
                        //             class: "pizo-list-realty-main-search-control-row-TT-label",
                        //             props: {
                        //                 innerHTML: "Tỉnh/TP"
                        //             }
                        //         },
                        //         {
                        //             tag: "div",
                        //             class: "pizo-list-realty-main-search-control-row-TT-input",
                        //             child: [{
                        //                 tag: "input"
                        //             }]
                        //         }
                        //     ]
                        // },

                    ]
                }
            ]
        }]
    });
    var temp = _({
        tag: "div",
        class: "pizo-list-realty-main-search-control",
        on: {
            click: function(event) {
                this.hide();
            }
        },
        child: [
            content
        ]
    })

    temp.content = content;
    this.startDay = startDay;
    this.endDay = endDay;
    this.lowprice = $('input.pizo-list-realty-main-search-control-row-price-input-low', content);
    this.highprice = $('input.pizo-list-realty-main-search-control-row-price-input-high', content);
    this.phone = $('.pizo-list-realty-main-search-control-row-phone-input input', content);
    this.MS = $('.pizo-list-realty-main-search-control-row-MS-input input', content);
    this.SN = $('.pizo-list-realty-main-search-control-row-SN input', content);
    this.TD = $('.pizo-list-realty-main-search-control-row-TD input', content);
    this.PX = $('.pizo-list-realty-main-search-control-row-PX input', content);
    this.QH = $('.pizo-list-realty-main-search-control-row-QH input', content);
    this.HT = $('.pizo-list-realty-main-search-control-row-HT input', content);
    this.HTinput = $('div.pizo-list-realty-main-search-control-row-HT-input', content).childNodes[0];
    this.HTcheckbox = $('div.pizo-list-realty-main-search-control-row-HT-checkbox', content).childNodes[0];

    temp.show = function() {
        if (!temp.classList.contains("showTranslate"))
            temp.classList.add("showTranslate");
    }
    temp.hide = function() {
        if (!content.classList.contains("hideTranslate"))
            content.classList.add("hideTranslate");
        var eventEnd = function() {
            if (temp.classList.contains("showTranslate"))
                temp.classList.remove("showTranslate");
            content.classList.remove("hideTranslate");
            content.removeEventListener("webkitTransitionEnd", eventEnd);
            content.removeEventListener("transitionend", eventEnd);
        };
        // Code for Safari 3.1 to 6.0
        content.addEventListener("webkitTransitionEnd", eventEnd);

        // Standard syntax
        content.addEventListener("transitionend", eventEnd);
    }
    temp.apply = function() {

    }
    temp.reset = function() {
        this.timestart = new Date();
        this.timeend = new Date();
        this.lowprice.value = "";
        this.highprice.value = "";
        this.phone.value = "";
        this.MS.value = "";
        this.SN.value = "";
        this.TD.value = "";
        this.PX.value = "";
        this.QH.value = "";
        this.TT.value = "";
        this.HT.value = 0;
    }


    return temp;
}

ListRealty.prototype.add = function(parent_id = 0, row) {
    var self = this;
    var mNewRealty = new NewRealty(undefined, parent_id);
    mNewRealty.attach(self.parent);
    if (this.isCensorship === true)
        mNewRealty.setCensorship();
    mNewRealty.setDataListAccount(self.listAccoutData);
    // mNewRealty.setDataListContact(self.listContactData);
    var frameview = mNewRealty.getView();
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.addDB(mNewRealty, row);
}

ListRealty.prototype.addDB = function(mNewRealty, row) {
    var self = this;
    mNewRealty.promiseAddDB.then(function(value) {
        var loading = new loadingWheel();
        moduleDatabase.getModule("activehouses").add(value).then(function(result) {
            self.addView(result);
            loading.disable();
        })
        mNewRealty.promiseAddDB = undefined;
        setTimeout(function() {
            if (mNewRealty.promiseAddDB !== undefined)
                self.addDB(mNewRealty);
        }, 10);
    })
}

ListRealty.prototype.addView = function(value, parent) {
    value.created = getGMT();
    var result = this.getDataRow(value);

    var element = this.mTable;
    element.insertRow(result);
}

ListRealty.prototype.edit = function(data, parent, index) {
    var self = this;
    var mNewRealty = new NewRealty(data);
    mNewRealty.attach(self.parent);
    if (this.isCensorship === true)
        mNewRealty.setCensorship();
    mNewRealty.setDataListAccount(self.listAccoutData);
    // mNewRealty.setDataListContact(self.listContactData);
    var frameview = mNewRealty.getView();
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDB(mNewRealty, data, parent, index);
}

ListRealty.prototype.getDataEditFake = function(data) {
    var self = this;
    var mNewRealty = new NewRealty(data);
    mNewRealty.setDataListAccount(self.listAccoutData);
    // mNewRealty.setDataListContact(self.listContactData);
    var frameview = mNewRealty.getView();
    var temp = mNewRealty.getDataSave();
    temp.image = data.original.image;
    return temp;
}

ListRealty.prototype.editDB = function(mNewRealty, data, parent, index) {
    var self = this;
    mNewRealty.promiseEditDB.then(function(value) {
        var loading = new loadingWheel();
        moduleDatabase.getModule("activehouses").update(value).then(function(result) {
            result.created = data.original.created;
            self.editView(result, parent, index);
            loading.disable();
        })
        mNewRealty.promiseEditDB = undefined;
        setTimeout(function() {
            if (mNewRealty.promiseEditDB !== undefined)
                self.editDB(mNewRealty, data, parent, index);
        }, 10);
    })
}

ListRealty.prototype.editView = function(value, parent, index) {
    var data = this.getDataRow(value);
    var indexOF = index,
        element = parent;
    element.updateRow(data, indexOF, true);
    // if(this.isCensorship&&data.censorship===1)
    // {
    //     element.updateTable();
    // }
}

ListRealty.prototype.delete = function(data, parent, index) {
    var self = this;
    if(Array.isArray(data)){
        var name = ""
        for(var i = data.length-1;i>=0;i--)
        {
            if(name !== "")
            name+=",";
            name+=data[i].id;    
        }
        var deleteItem = deleteQuestion("Xoá danh mục", "Bạn có chắc muốn xóa :" + name);
    }else
    var deleteItem = deleteQuestion("Xoá danh mục", "Bạn có chắc muốn xóa :" + data.id);
    this.$view.addChild(deleteItem);
    deleteItem.promiseComfirm.then(function() {
        if(Array.isArray(data)){
            for(var i = data.length-1;i>=0;i--){
                self.deleteDB(data[i]);
            }
        }else
        self.deleteDB(data, parent, index);
    })
}

ListRealty.prototype.deleteView = function(parent, index) {
    var self = this;
    var bodyTable = parent.bodyTable;
    parent.dropRow(index).then(function() {});
}

ListRealty.prototype.deleteDB = function(data, parent, index) {
    var self = this;
    var phpFile = moduleDatabase.deleteActiveHomesPHP;
    if (self.phpDeleteContent)
        phpFile = self.phpUpdateContent;
    var loading = new loadingWheel();
    moduleDatabase.getModule("activehouses").delete({ id: data.id }).then(function(value) {
        if(parent!==undefined&&index!==undefined)
        {
            self.deleteView(parent, index);
        }
        loading.disable();
    })
}

ListRealty.prototype.merge = function(data, parent, index) {
    var self = this;
    var promiseAll = [];
    var arrTemp = [];
    var firstOperator = "";
    var dataTemp;
    var arrDataMerge = [];
    var checkArrDataMerge = [];
    var tempDataMerge;
    for (var i = 0; i < data.length; i++) {
        dataTemp = data[i].original
        if (dataTemp) {
            if (firstOperator == "||")
                arrTemp.push(firstOperator);
            arrTemp.push({ houseid: dataTemp.id })
            firstOperator = "||";
        }
        tempDataMerge = Object.assign({}, data[i].original);
        tempDataMerge.image = [];
        tempDataMerge.contact = [];
        tempDataMerge.equipment = [];
        tempDataMerge.purpose = [];
        checkArrDataMerge[tempDataMerge.id] = tempDataMerge;
        arrDataMerge.push(tempDataMerge);
    }
    var promise1 = moduleDatabase.getModule("image").load({ WHERE: arrTemp });
    promiseAll.push(promise1);
    promise1.then(function(values) {
        for (var j = 0; j < values.length; j++) {
            if (checkArrDataMerge[values[j].houseid])
                checkArrDataMerge[values[j].houseid].image.push(values[j].id);
        }
    })

    var promise2 = moduleDatabase.getModule("contact_link").load({ WHERE: arrTemp });
    promiseAll.push(promise2);
    promise2.then(function(values) {
        for (var j = 0; j < values.length; j++) {
            if (checkArrDataMerge[values[j].houseid])
                checkArrDataMerge[values[j].houseid].contact.push(values[j]);
        }
    })

    var promise3 = moduleDatabase.getModule("house_equipments").load({ WHERE: arrTemp });
    promiseAll.push(promise3);
    promise3.then(function(values) {
        for (var j = 0; j < values.length; j++) {
            if (checkArrDataMerge[values[j].houseid])
                checkArrDataMerge[values[j].houseid].equipment.push(values[j]);
        }
    })

    var promise4 = moduleDatabase.getModule("purpose_link").load({ WHERE: arrTemp });
    promiseAll.push(promise4);
    promise4.then(function(values) {
        for (var j = 0; j < values.length; j++) {
            if (checkArrDataMerge[values[j].houseid])
                checkArrDataMerge[values[j].houseid].purpose.push(values[j].id);
        }
    })

    Promise.all(promiseAll).then(function() {
        var mMergeRealty = new MergeRealty(arrDataMerge);
        mMergeRealty.attach(self.parent);
        var frameview = mMergeRealty.getView();
        self.parent.body.addChild(frameview);
        self.parent.body.activeFrame(frameview);
        mMergeRealty.promiseEditDB.then(function(value) {
            var loading = new loadingWheel();
            moduleDatabase.getModule("activehouses").add(value).then(function(final) {
                var valueFinal;
                if (self.isCensorship) {
                    valueFinal = moduleDatabase.getModule("activehouses").getLibary("censorship", self.getDataRow.bind(self), true);
                    valueFinal = valueFinal[0];
                } else {
                    valueFinal = self.formatDataRow(moduleDatabase.getModule("activehouses").data);
                }

                self.mTable.data = valueFinal;
                self.HTinput.emit("change");
                loading.disable();
            });
        })
    })
}


ListRealty.prototype.mergeView = function(value, data, parent, index) {

}

ListRealty.prototype.refresh = function() {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

ListRealty.prototype.setData = function(data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

ListRealty.prototype.flushDataToView = function() {
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

ListRealty.prototype.start = function() {

}

export default ListRealty;