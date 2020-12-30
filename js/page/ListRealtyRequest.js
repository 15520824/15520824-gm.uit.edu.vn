import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListRealtyRequest.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import ConfirmRequest from '../component/ConfirmRequest';
import MapRealty from './MapRealty';
import { loadingWheel } from '../component/FormatFunction';


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

function ListRealtyRequest() {
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

    moduleDatabase.getModule("users").load().then(function(value) {
        this.checkUser = moduleDatabase.getModule("users").getLibary("phone");
        this.checkUserID = moduleDatabase.getModule("users").getLibary("id");
    }.bind(this))

    moduleDatabase.getModule("contacts").load().then(function(value) {
        this.checkContact = moduleDatabase.getModule("contacts").getLibary("phone");
        this.checkContactID = moduleDatabase.getModule("contacts").getLibary("id");
    }.bind(this))
}

ListRealtyRequest.prototype.setContainer = function(parent) {
    this.parent = parent;
}

Object.defineProperties(ListRealtyRequest.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
ListRealtyRequest.prototype.constructor = ListRealtyRequest;
ListRealtyRequest.prototype.setCensorship = function() {
    this.isCensorship = true;
}

ListRealtyRequest.prototype.getView = function() {
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
                    }]
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

    var tabContainer = _({
        tag: "div",
        class: ["pizo-list-realty-main-result-control", "drag-zone-bg"],
        child: [

        ]
    })

    var arr = [];
    if (this.isCensorship === true)
        arr.push(moduleDatabase.getModule("activehouses").load({ WHERE: [{ censorship: 0 }] }));
    else
        arr.push(moduleDatabase.getModule("activehouses").load());
    arr.push(moduleDatabase.getModule("wards").load());
    arr.push(moduleDatabase.getModule("type_activehouses").load());
    arr.push(moduleDatabase.getModule("districts").load());
    arr.push(moduleDatabase.getModule("states").load());
    arr.push(moduleDatabase.getModule("equipments").load());
    arr.push(moduleDatabase.getModule("juridicals").load());
    arr.push(moduleDatabase.getModule("modification_requests").load());
    Promise.all(arr).then(function(values) {
        var value = values[0];
        var checkObj = moduleDatabase.getModule("modification_requests").getLibary("objid", undefined, true);
        var valueAddrAdd = checkObj["addressid"];
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
                },
                disableInput: true
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
                functionClickAll: function() {
                    console.log("click")
                },
                dragElement: false,
                disabled: true
            }
        ];
        self.mTable = new tableView(header, [], true, true, 1);
        var arr = [];
        var connect = "";
        for (var i = 0; i < value.length; i++) {
            if (connect !== "")
                arr.push(connect);
            if (value[i].addressid != 0)
                arr.push({ id: value[i].addressid });
            connect = "||";
            if (value[i].addressid_old && value[i].addressid_old != 0) {
                arr.push(connect);
                arr.push({ id: value[i].addressid_old });
            }

        }
        if (valueAddrAdd)
            for (var i = 0; i < valueAddrAdd.length; i++) {
                arr.push(connect);
                arr.push({ id: valueAddrAdd[i].content });
            }
        moduleDatabase.getModule("addresses").load({ WHERE: arr }).then(function(valueAdr) {
            self.checkAddress = moduleDatabase.getModule("addresses").getLibary("id");
            var connect = "";
            var arr = [];
            for (var i = 0; i < valueAdr.length; i++) {
                if (connect !== "")
                    arr.push(connect);
                arr.push({ id: valueAdr[i].streetid });
                connect = "||";
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
                self.mTable.addInputSearch($('.pizo-list-realty-page-allinput-container input', self.$view));
                self.mTable.addFilter(self.HTinput, 17);
            })
        })

        tabContainer.addChild(self.mTable);
        moduleDatabase.getModule("users").load().then(function(value) {
            self.formatDataRowAccount(value);
        })

        moduleDatabase.getModule("contacts").load().then(function(value) {
            self.formatDataRowContact(value);
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


ListRealtyRequest.prototype.formatDataRowAccount = function(data) {
    this.listAccoutData = data;
}

ListRealtyRequest.prototype.formatDataRowContact = function(data) {
    this.listContactData = data;
}

ListRealtyRequest.prototype.formatDataRow = function(data) {
    var temp = [];
    var self = this;
    var isAvailable, districtid, stateid;
    var check;
    var checkHouseRequest = moduleDatabase.getModule("modification_requests").getLibary("houseid", undefined, true);
    for (var i = 0; i < data.length; i++) {
        if (checkHouseRequest[data[i].id] == undefined)
            continue;
        isAvailable = false;
        Loop: for (var param in moduleDatabase.checkPermission) {
            if (data[i].addressid == 0)
                continue;
            var object = JSON.parse(param);
            var address = self.checkAddress[data[i].addressid];
            districtid = undefined;
            stateid = undefined;
            if (address.wardid)
                districtid = self.checkWard[address.wardid].districtid;
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
                if (object[objectParam] !== address[objectParam]) {
                    continue Loop;
                }
            }
            if (moduleDatabase.checkPermission[param].indexOf(69) !== -1) {
                isAvailable = true;
            }
        }
        if (isAvailable == false)
            continue;
        var result = this.getDataRow(data[i]);
        result.original = data[i];
        check = [];
        var isContinues = false;
        for (var j = 0; j < checkHouseRequest[data[i].id].length; j++) {
            var object = checkHouseRequest[data[i].id][j];
            if (object.status == 0) {
                if (check[object.created] == undefined)
                    check[object.created] = [];

                check[object.created].push(object);
                isContinues = true;
            }
        }
        if (isContinues == false)
            continue;
        result.child = [];
        var object;
        var isImage;
        for (var param in check) {
            object = {};
            object["id"] = [];
            isImage = false;
            for (var j = 0; j < check[param].length; j++) {
                if (isImage == true && check[param][j].objid === "image")
                    object[check[param][j].objid] = object[check[param][j].objid].concat(JSON.parse(check[param][j].content));
                else {
                    try {
                        object[check[param][j].objid] = JSON.parse(check[param][j].content);
                    } catch (error) {
                        object[check[param][j].objid] = check[param][j].content;
                    }
                }
                if (check[param][j].objid === "image")
                    isImage = true;
                object["id"].push(check[param][j].id)
            }
            var x = Object.assign({}, data[i]);
            x = Object.assign(x, object);
            result.child.push(this.getDataRow(x, result));
        }
        temp.push(result);
    }
    return temp;
}

ListRealtyRequest.prototype.merge = function(data) {
    var self = this;
    var promiseAll = [];
    var arrTemp = [];
    var check = [];
    var firstOperator = "";
    var dataTemp;
    for (var i = 0; i < data.length; i++) {
        dataTemp = data[i].original;
        if (dataTemp.image)
            for (var j = 0; j < dataTemp.image.length; j++) {
                if (check[dataTemp.image[j]] !== undefined)
                    continue;
                if (firstOperator == "||")
                    arrTemp.push(firstOperator);
                arrTemp.push({ id: dataTemp.image[j] })
                firstOperator = "||";
                check[dataTemp.image[j]] = 1;
            }

    }
    promiseAll.push(moduleDatabase.getModule("image").load({ WHERE: arrTemp }));
    Promise.all(promiseAll).then(function() {
        var mConfirmRequest = new ConfirmRequest(data);
        mConfirmRequest.attach(self.parent);
        var frameview = mConfirmRequest.getView();
        self.parent.body.addChild(frameview);
        self.parent.body.activeFrame(frameview);
        mConfirmRequest.promiseEditDB.then(function(value) {
            var loading = new loadingWheel();
            moduleDatabase.getModule("modification_requests").update(value).then(function() {
                loading.disable();
                if (moduleDatabase.stackUpdateRequest) {
                    moduleDatabase.getModule("activehouses").load().then(function(valueHouse) {
                        for (var i = 0; i < moduleDatabase.stackUpdateRequest.length; i++) {
                            moduleDatabase.stackUpdateRequest[i].mTable.updateTable(undefined, moduleDatabase.stackUpdateRequest[i].formatDataRow(valueHouse));
                        }
                    })
                }
            })
        })

    })
}

ListRealtyRequest.prototype.getDataRow = function(data, isChild) {
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
        case 6:
            direction = "Đông";
            break;
        case 4:
            direction = "Tây";
            break;
        case 2:
            direction = "Nam";
            break;
        case 8:
            direction = "Bắc";
            break;
        case 7:
            direction = "Tây Bắc";
            break;
        case 9:
            direction = "Đông Bắc";
            break;
        case 1:
            direction = "Tây Nam";
            break;
        case 3:
            direction = "Đông Nam";
            break;
    }
    var staus = "";
    if (parseInt(data.salestatus) % 10 == 1)
        staus += "Còn bán";
    if (parseInt(parseInt(data.salestatus) / 10) == 1) {
        if (staus == "")
            staus += "Còn cho thuê";
        else
            staus += " và còn cho thuê";
    }
    if (data.addressid === undefined)
        data.addressid = 0;
    if (data.addressid != 0) {
        var number = this.checkAddress[data.addressid].addressnumber;
        var street = this.checkStreet[this.checkAddress[data.addressid].streetid].name;
        var ward = this.checkWard[this.checkAddress[data.addressid].wardid].name;
        var district = this.checkDistrict[this.checkWard[this.checkAddress[data.addressid].wardid].districtid].name;
        var state = this.checkState[this.checkDistrict[this.checkWard[this.checkAddress[data.addressid].wardid].districtid].stateid].name;
    } else {
        var number = street = ward = district = state = "";
    }
    var statusValue = parseInt(data.salestatus) + 1;
    if (statusValue == 12) {
        statusValue = [2, 11];
    }
    var id;
    if (isChild !== undefined) {
        id = "Yêu cầu";
    } else {
        id = data.id;
    }
    var result = [
        {},
        {
            functionClick: function() {
                var data = arguments[4].original;
                console.log(arguments[4][0].value, arguments[1].childNodes[0].childNodes[0].checked)
            }
        },
        {
            value: id,
            style: {
                whiteSpace: "nowrap"
            }
        },
        number,
        street,
        ward,
        district,
        state,
        data.content,
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
        { element: _({ text: data.price + " tỉ" }), value: data.price * 1000000000 },
        data.price * 1000 / data.acreage + " triệu",
        { value: statusValue, element: _({ text: staus }) },
        { valuesearch: formatDate(data.created, true, true, true, true, true), element: _({ text: formatDate(data.created, true, true, true, true, true) }), valuesort: new Date(data.created), value: new Date(data.created) },
        { valuesearch: formatDate(data.created, true, true, true, true, true), element: _({ text: formatDate(data.modified, true, true, true, true, true) }), valuesort: new Date(data.modified), value: new Date(data.modified) },
        {
            icon: "grading",
            functionClick: function() {
                if (result.child && result.child.length > 0) {
                    this.merge([result].concat(result.child));
                } else
                if (isChild) {
                    this.merge([isChild, result])
                }
            }.bind(this)
        },
    ];
    result.original = data;
    return result;
}


ListRealtyRequest.prototype.searchControlContent = function() {
    var startDay, endDay;
    var self = this;
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() - 1);
    startDay = _({
        tag: 'calendar-input',
        data: {
            anchor: 'top',
            value: oneYearFromNow,
            maxDateLimit: new Date()
        },
        on: {
            changed: function(date) {
                endDay.minDateLimit = date;
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
                                                        value: 2
                                                    },
                                                    {
                                                        text: "Còn cho thuê",
                                                        value: 11
                                                    },
                                                    {
                                                        text: "Ngừng giao dịch",
                                                        value: 1
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
    content.timestart = startDay;
    content.timeend = endDay;
    content.lowprice = $('input.pizo-list-realty-main-search-control-row-price-input-low', content);
    content.highprice = $('input.pizo-list-realty-main-search-control-row-price-input-high', content);
    content.phone = $('.pizo-list-realty-main-search-control-row-phone-input input', content);
    content.MS = $('.pizo-list-realty-main-search-control-row-MS-input input', content);
    content.SN = $('.pizo-list-realty-main-search-control-row-SN input', content);
    content.TD = $('.pizo-list-realty-main-search-control-row-TD input', content);
    content.PX = $('.pizo-list-realty-main-search-control-row-PX input', content);
    content.QH = $('.pizo-list-realty-main-search-control-row-QH input', content);
    content.HT = $('.pizo-list-realty-main-search-control-row-HT input', content);
    this.HTinput = $('div.pizo-list-realty-main-search-control-row-HT-input', content).childNodes[0];
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
        content.timestart = new Date();
        content.timeend = new Date();
        content.lowprice.value = "";
        content.highprice.value = "";
        content.phone.value = "";
        content.MS.value = "";
        content.SN.value = "";
        content.TD.value = "";
        content.PX.value = "";
        content.QH.value = "";
        content.TT.value = "";
        content.HT.value = 0;
    }


    return temp;
}

ListRealtyRequest.prototype.add = function(parent_id = 0, row) {
    var self = this;
    var mNewRealty = new NewRealty(undefined, parent_id);
    mNewRealty.attach(self.parent);
    if (this.isCensorship === true)
        mNewRealty.setCensorship();
    mNewRealty.setDataListAccount(self.listAccoutData);
    mNewRealty.setDataListContact(self.listContactData);
    var frameview = mNewRealty.getView();
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.addDB(mNewRealty, row);
}

ListRealtyRequest.prototype.addDB = function(mNewRealty, row) {
    var self = this;
    var loading = new loadingWheel();
    mNewRealty.promiseAddDB.then(function(value) {
        moduleDatabase.getModule("activehouses").add(value).then(function(result) {
            self.addView(result, row);
            loading.disable();
        })
        mNewRealty.promiseAddDB = undefined;
        setTimeout(function() {
            if (mNewRealty.promiseAddDB !== undefined)
                self.addDB(mNewRealty);
        }, 10);
    })
}

ListRealtyRequest.prototype.addView = function(value, parent) {
    value.created = getGMT();
    var result = this.getDataRow(value);

    var element = this.mTable;
    element.insertRow(result);
}

ListRealtyRequest.prototype.edit = function(data, parent, index) {
    var self = this;
    var mNewRealty = new NewRealty(data);
    mNewRealty.attach(self.parent);
    if (this.isCensorship === true)
        mNewRealty.setCensorship();
    mNewRealty.setDataListAccount(self.listAccoutData);
    mNewRealty.setDataListContact(self.listContactData);
    var frameview = mNewRealty.getView();
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDB(mNewRealty, data, parent, index);
}

ListRealtyRequest.prototype.getDataEditFake = function(data) {
    var self = this;
    var mNewRealty = new NewRealty(data);
    mNewRealty.setDataListAccount(self.listAccoutData);
    mNewRealty.setDataListContact(self.listContactData);
    var frameview = mNewRealty.getView();
    var temp = mNewRealty.getDataSave();
    temp.image = data.original.image;
    return temp;
}

ListRealtyRequest.prototype.editDB = function(mNewRealty, data, parent, index) {
    var self = this;
    var loading = new loadingWheel();
    mNewRealty.promiseEditDB.then(function(value) {
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

ListRealtyRequest.prototype.editView = function(value, parent, index) {
    var data = this.getDataRow(value);
    var indexOF = index,
        element = parent;
    element.updateRow(data, indexOF, true);
    // if(this.isCensorship&&data.censorship===1)
    // {
    //     element.updateTable();
    // }
}

ListRealtyRequest.prototype.delete = function(data, parent, index) {
    var self = this;
    var deleteItem = deleteQuestion("Xoá danh mục", "Bạn có chắc muốn xóa :" + data.name);
    this.$view.addChild(deleteItem);
    deleteItem.promiseComfirm.then(function() {
        self.deleteDB(data, parent, index);
    })
}

ListRealtyRequest.prototype.deleteView = function(parent, index) {
    var self = this;
    var bodyTable = parent.bodyTable;
    parent.dropRow(index).then(function() {});
}

ListRealtyRequest.prototype.deleteDB = function(data, parent, index) {
    var self = this;
    var phpFile = moduleDatabase.deleteActiveHomesPHP;
    if (self.phpDeleteContent)
        phpFile = self.phpUpdateContent;
    moduleDatabase.getModule("activehouses").delete({ id: data.id }).then(function(value) {
        self.deleteView(parent, index);
    })
}

ListRealtyRequest.prototype.refresh = function() {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

ListRealtyRequest.prototype.setData = function(data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

ListRealtyRequest.prototype.flushDataToView = function() {
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

ListRealtyRequest.prototype.start = function() {

}

export default ListRealtyRequest;