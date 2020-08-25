import BaseView from '../component/BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/ListRealty.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import MergeRealty from '../component/MergeRealty';
import MapRealty from './MapRealty';


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

    moduleDatabase.getModule("users").load().then(function(value)
    {
        this.checkUser = moduleDatabase.getModule("users").getLibary("phone");
        this.checkUserID = moduleDatabase.getModule("users").getLibary("id");
    }.bind(this))

    moduleDatabase.getModule("contacts").load().then(function(value)
    {
        this.checkContact = moduleDatabase.getModule("contacts").getLibary("phone");
        this.checkContactID = moduleDatabase.getModule("contacts").getLibary("id");
    }.bind(this))
}

ListRealty.prototype.setContainer = function (parent) {
    this.parent = parent;
}

Object.defineProperties(ListRealty.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
ListRealty.prototype.constructor = ListRealty;
ListRealty.prototype.setCensorship = function()
{
    this.isCensorship = true;
}

ListRealty.prototype.getView = function () {
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
    if (window.mobilecheck()) {
        allinput.placeholder = "Tìm bất động sản"
    }
    var saveButton,callAgainButton,mergeButton,viewMapButton,confirmButton,cancelConfirmButton;
    
    var hiddenConfirm = _({
        tag:"selectmenu",
        class:"selectmenu-hidden-confirm",
        style:{
            display:"none"
        },
        props:{
            value:0,
            items:[
                {text:"Tất cả",value:0},
                {text:"Duyệt",value:"censorship1"},
                {text:"Chưa duyệt",value:"censorship0"},
            ]
        }
   })

    saveButton = _({
        tag: "button",
        class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
        on: {
            click: function (evt) {
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
            click: function (evt) {
                if(this.currentMerge === true)
                {
                    // self.merge();
                    // this.currentMerge = undefined;
                    saveButton.style.display = "";
                    mergeButton.style.display = "";
                    confirmButton.style.display = "";
                    cancelConfirmButton.style.display = "";
                    viewMapButton.style.display = "";
                    this.childNodes[0].innerHTML = "Yêu cầu gọi lại";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(0,0);
                    this.currentMerge = undefined;
                    // self.merge(self.mTable.getTrueCheckBox());
                }else
                {
                    saveButton.style.display = "none";
                    mergeButton.style.display = "none";
                    confirmButton.style.display = "none";
                    cancelConfirmButton.style.display = "none";
                    viewMapButton.style.display = "none";
                    this.childNodes[0].innerHTML = "Xong";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(1,0);
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
            click: function (evt) {
                if(this.currentMerge === true)
                {
                    // self.merge();
                    // this.currentMerge = undefined;
                    saveButton.style.display = "";
                    mergeButton.style.display = "";
                    callAgainButton.style.display = "";
                    cancelConfirmButton.style.display = "";
                    viewMapButton.style.display = "";
                    this.childNodes[0].innerHTML = "Duyệt";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(0,0);
                    this.currentMerge = undefined;
                    hiddenConfirm.value = 0;
                    hiddenConfirm.emit("change");
                    var dataSum = self.mTable.getTrueCheckBox();
                    var arr  = [];
                    var tempData;
                    for(var i = 0;i<dataSum.length;i++)
                    {
                        dataSum[i][20] = "censorship1";
                        dataSum[i].original.censorship = 1;
                        dataSum[i][1] = {};
                        tempData = self.getDataEditFake(dataSum[i]);
                        self.mTable.resetHash();
                        arr.push(moduleDatabase.getModule("activehouses").update(tempData));
                    }
                    Promise.all(arr).then(function(){
                       
                    })
                }else
                {
                    saveButton.style.display = "none";
                    mergeButton.style.display = "none";
                    callAgainButton.style.display = "none";
                    cancelConfirmButton.style.display = "none";
                    viewMapButton.style.display = "none";
                    this.childNodes[0].innerHTML = "Xong";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(1,0);
                    this.currentMerge = true;
                    hiddenConfirm.value = "censorship0";
                    hiddenConfirm.emit("change");
                }
            }
        },
        child: [
            '<span>' + "Duyệt" + '</span>'
        ]
    });

    cancelConfirmButton = _({
        tag: "button",
        class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
        on: {
            click: function (evt) {
                if(this.currentMerge === true)
                {
                    // self.merge();
                    // this.currentMerge = undefined;
                    saveButton.style.display = "";
                    mergeButton.style.display = "";
                    callAgainButton.style.display = "";
                    confirmButton.style.display = "";
                    viewMapButton.style.display = "";
                    this.childNodes[0].innerHTML = "Hủy duyệt";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(0,0);
                    this.currentMerge = undefined;
                    hiddenConfirm.value = 0;
                    hiddenConfirm.emit("change");

                    var dataSum = self.mTable.getTrueCheckBox();
                    var arr  = [];
                    var tempData;
                    for(var i = 0;i<dataSum.length;i++)
                    {
                        dataSum[i][20] = "censorship0";
                        dataSum[i].original.censorship = 0;
                        dataSum[i][1] = {};
                        tempData = self.getDataEditFake(dataSum[i]);
                        self.mTable.resetHash();
                        arr.push(moduleDatabase.getModule("activehouses").update(tempData));
                    }
                    Promise.all(arr).then(function(){
                       
                    })
                }else
                {
                    saveButton.style.display = "none";
                    mergeButton.style.display = "none";
                    callAgainButton.style.display = "none";
                    confirmButton.style.display = "none";
                    viewMapButton.style.display = "none";
                    this.childNodes[0].innerHTML = "Xong";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(1,0);
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
            click: function (evt) {
                if(this.currentMerge === true)
                {
                    // self.merge();
                    // this.currentMerge = undefined;
                    confirmButton.style.display = "";
                    saveButton.style.display = "";
                    callAgainButton.style.display = "";
                    cancelConfirmButton.style.display = "";
                    viewMapButton.style.display = "";
                    this.childNodes[0].innerHTML = "Gộp";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(0,0);
                    this.currentMerge = undefined;
                    self.merge(self.mTable.getTrueCheckBox());
                }else
                {
                    confirmButton.style.display = "none";
                    saveButton.style.display = "none";
                    callAgainButton.style.display = "none";
                    cancelConfirmButton.style.display = "none";
                    viewMapButton.style.display = "none";
                    this.childNodes[0].innerHTML = "Xong";
                    self.mTable.deleteColumn(0);
                    self.mTable.insertColumn(1,0);
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
            click: function (evt) {
               app.openPage(18);
            }
        },
        child: [
            '<span>' + "Xem bản đồ" + '</span>'
        ]
    });

    
    this.$view = _({
        tag: 'singlepage',
        class: ["pizo-list-realty","pizo-list-realty-main-header"],
        child: [{
            class: 'absol-single-page-header',
            child: [
                {
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
                        saveButton,
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
                                click: function (event) {
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
    var functionClickMore = function (event, me, index, parent, data, row) {

        docTypeMemuProps = {
            items: [{
                    text: 'Sửa',
                    icon: 'span.mdi.mdi-text-short',
                    value: 0,
                },
                {
                    text: 'Xóa',
                    icon: 'span.mdi.mdi-text',
                    value: 1,
                },
                {
                    text: 'Chi tiết',
                    icon: 'span.mdi.mdi-text',
                    value: 2,
                }
            ]
        };
        token = absol.QuickMenu.show(me, docTypeMemuProps, [3, 4], function (menuItem) {
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
            }
        });

        functionX = function (token) {
            return function () {
                var x = function (event) {
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
    if(this.isCensorship===true)
    arr.push(moduleDatabase.getModule("activehouses").load({WHERE:[{censorship:0}]}));
    else
    arr.push(moduleDatabase.getModule("activehouses").load());
    arr.push(moduleDatabase.getModule("wards").load());
    arr.push(moduleDatabase.getModule("type_activehouses").load());
    arr.push(moduleDatabase.getModule("districts").load());
    arr.push(moduleDatabase.getModule("states").load());
    arr.push(moduleDatabase.getModule("equipments").load());
    arr.push(moduleDatabase.getModule("juridicals").load());
    Promise.all(arr).then(function (values) {
        var value = values[0];
        self.checkWard = moduleDatabase.getModule("wards").getLibary("id");
        self.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");
        self.checkState = moduleDatabase.getModule("states").getLibary("id");
        var header = [{
            type: "dragzone",
            dragElement: false
        }, 
        {
            type: "check",
            dragElement: false,
            hidden:true
        }, 
        {
            type: "increase",
            value: "#"
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
            value: 'Ghi chú'
        }, {
            value: 'Ngang',
            sort: true,
            style:{
                minWidth: "50px"
            }
        }, {
            value: 'Dài',
            sort: true,
            style:{
                minWidth: "50px"
            }
        }, {
            value: 'DT',
            sort: true,
            style:{
                minWidth: "50px"
            }
        }, {
            value: 'Kết cấu'
        }, {
            value: 'Hướng'
        }, {
            value:  'Giá',
            sort: true,
            style:{
                minWidth: "50px"
            }
        }, {
            value: 'Giá m²',
            sort: true,
            style:{
                minWidth: "50px"
            }
        }, {
            value: 'Hiện trạng',
            style:{
                minWidth:"85px"
            }
        }, {
            value: 'Ngày tạo'
        }, {
            type: "detail",
            functionClickAll: functionClickMore,
            dragElement: false
        },{
            hidden:true
        }];
        self.mTable = new tableView(header, [], true, true, 1);
        var arr = [];
        var connect = "";
        for(var i = 0;i<value.length;i++)
        {
            if(connect!=="")
            arr.push(connect);
            arr.push({id:value[i].addressid});
            connect = "||";
            if(value[i].addressid_old)
            {
                arr.push(connect);
                arr.push({id:value[i].addressid_old});
            }
       
        }
        moduleDatabase.getModule("addresses").load({WHERE:arr}).then(function(valueAdr){
            self.checkAddress = moduleDatabase.getModule("addresses").getLibary("id");
            var connect = "";
            var arr = [];
            for(var i = 0;i<valueAdr.length;i++)
            {
                if(connect!=="")
                arr.push(connect);
                arr.push({id:valueAdr[i].streetid});
                connect = "||";
            }
            moduleDatabase.getModule("streets").load({WHERE:arr}).then(function(valueStr){
                self.checkStreet = moduleDatabase.getModule("streets").getLibary("id");
                if(self.isCensorship)
                {
                    value = moduleDatabase.getModule("activehouses").getLibary("censorship",self.getDataRow.bind(self),true);
                    value = value[0];
                }else
                {
                    value = self.formatDataRow(value);
                }

                self.mTable.updateTable(undefined,value);
                self.mTable.addInputSearch($('.pizo-list-realty-page-allinput-container input', self.$view));
                self.mTable.addFilter(hiddenConfirm,20);
            })
        })
        
        tabContainer.addChild(self.mTable);
        moduleDatabase.getModule("users").load().then(function (value) {
            self.formatDataRowAccount(value);
        })

        moduleDatabase.getModule("contacts").load().then(function (value) {
            self.formatDataRowContact(value);
        })
    });


  

    this.searchControl = this.searchControlContent();

    this.$view.addChild(_({
        tag: "div",
        class: ["pizo-list-realty-main"],
        style:{
            flexDirection: "column"
        },
        child: [
            this.searchControl,
            tabContainer
        ]
    }));
    return this.$view;
}


ListRealty.prototype.formatDataRowAccount = function (data) {
    this.listAccoutData = data;
}

ListRealty.prototype.formatDataRowContact = function (data) {
    this.listContactData = data;
}

ListRealty.prototype.formatDataRow = function (data) {
    var temp = [];
    var check = [];
    var k = 0;
    for (var i = 0; i < data.length; i++) {

        var result = this.getDataRow(data[i]);
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

ListRealty.prototype.getDataRow = function (data) {
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
            structure = "Sẳn *";
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
    if(data.addressid!=0)
    {
        var number = this.checkAddress[data.addressid].addressnumber;
        var street = this.checkStreet[this.checkAddress[data.addressid].streetid].name;
        var ward = this.checkWard[this.checkAddress[data.addressid].wardid].name;
        var district = this.checkDistrict[this.checkWard[this.checkAddress[data.addressid].wardid].districtid].name;
        var state = this.checkState[this.checkDistrict[this.checkWard[this.checkAddress[data.addressid].wardid].districtid].stateid].name;
    }else
    {
        var number = street = ward = district = state = "";
    }
   
    var result = [
        {},
        {},
        {},
        {
            value: data.id,
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
        data.price + " tỉ",
        data.price * 1000 / data.acreage + " triệu",
        staus,
        formatDate(data.created, true, true, true, true, true),
        {},
        "censorship"+data.censorship
    ];
    result.original = data;
    return result;
}


ListRealty.prototype.searchControlContent = function () {
    var startDay, endDay;

    startDay = _({
        tag: 'calendar-input',
        data: {
            anchor: 'top',
            value: new Date(new Date().getFullYear(), 0, 1),
            maxDateLimit: new Date()
        },
        on: {
            changed: function (date) {

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
            changed: function (date) {

                startDay.maxDateLimit = date;
            }
        }
    })
    var content = _({
        tag: "div",
        class: "pizo-list-realty-main-search-control-container",
        on: {
            click: function (event) {
                event.stopPropagation();
            }
        },
        child: [{
            tag: "div",
            class: "pizo-list-realty-main-search-control-container-scroller",
            child: [{
                    tag: "div",
                    class: "pizo-list-realty-main-search-control-row",
                    child: [
                        // {
                        //     tag: "div",
                        //     class: "pizo-list-realty-main-search-control-row-date",
                        //     child: [{
                        //             tag: "span",
                        //             class: "pizo-list-realty-main-search-control-row-date-label",
                        //             props: {
                        //                 innerHTML: "Thời gian"
                        //             }
                        //         },
                        //         {
                        //             tag: "div",
                        //             class: "pizo-list-realty-main-search-control-row-date-input",
                        //             child: [
                        //                 startDay,
                        //                 endDay
                        //             ]
                        //         }
                        //     ]
                        // },
                        {
                            tag: "div",
                            class: "pizo-list-realty-main-search-control-row-price",
                            child: [
                                {
                                    tag: "div",
                                    class: "pizo-list-realty-main-search-control-row-HT",
                                    child: [{
                                            tag: "span",
                                            class: "pizo-list-realty-main-search-control-row-HT-label",
                                            props: {
                                                innerHTML: "Tình trạng"
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
                                                            text: "Đã bán",
                                                            value: 2
                                                        },
                                                        {
                                                            text: "Ngưng bán",
                                                            value: 3
                                                        },
                                                    ]
                                                }
                                            }]
                                        }
                                    ]
                                },
                                {
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
                                                type: "number",
                                                autocomplete: "off",
                                                placeholder: "đ Từ",
                                            }
                                        },
                                        {
                                            tag: "input",
                                            class: "pizo-list-realty-main-search-control-row-price-input-high",
                                            props: {
                                                type: "number",
                                                autocomplete: "off",
                                                placeholder: "đ Đến",
                                            }
                                        },
                                    ]
                                }
                            ]
                        },
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
            click: function (event) {
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

    temp.show = function () {
        if (!temp.classList.contains("showTranslate"))
            temp.classList.add("showTranslate");
    }
    temp.hide = function () {
        if (!content.classList.contains("hideTranslate"))
            content.classList.add("hideTranslate");
        var eventEnd = function () {
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
    temp.apply = function () {

    }
    temp.reset = function () {
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

ListRealty.prototype.add = function (parent_id = 0, row) {
    var self = this;
    var mNewRealty = new NewRealty(undefined, parent_id);
    mNewRealty.attach(self.parent);
    if(this.isCensorship===true)
    mNewRealty.setCensorship();
    mNewRealty.setDataListAccount(self.listAccoutData);
    mNewRealty.setDataListContact(self.listContactData);
    var frameview = mNewRealty.getView();
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.addDB(mNewRealty, row);
}

ListRealty.prototype.addDB = function (mNewRealty, row) {
    var self = this;
    mNewRealty.promiseAddDB.then(function (value) {
        moduleDatabase.getModule("activehouses").add(value).then(function (result) {
            self.addView(result, row);
        })
        mNewRealty.promiseAddDB = undefined;
        setTimeout(function () {
            if (mNewRealty.promiseAddDB !== undefined)
                self.addDB(mNewRealty);
        }, 10);
    })
}

ListRealty.prototype.addView = function (value, parent) {
    value.created = getGMT();
    var result = this.getDataRow(value);

    var element = this.mTable;
    element.insertRow(result);
}

ListRealty.prototype.edit = function (data, parent, index) {
    var self = this;
    var mNewRealty = new NewRealty(data);
    mNewRealty.attach(self.parent);
    if(this.isCensorship===true)
    mNewRealty.setCensorship();
    mNewRealty.setDataListAccount(self.listAccoutData);
    mNewRealty.setDataListContact(self.listContactData);
    var frameview = mNewRealty.getView();
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDB(mNewRealty, data, parent, index);
}

ListRealty.prototype.getDataEditFake = function(data)
{
    var self = this;
    var mNewRealty = new NewRealty(data);
    mNewRealty.setDataListAccount(self.listAccoutData);
    mNewRealty.setDataListContact(self.listContactData);
    var frameview = mNewRealty.getView();
    var temp = mNewRealty.getDataSave();
    temp.image = data.original.image;
    return temp;
}

ListRealty.prototype.editDB = function (mNewRealty, data, parent, index) {
    var self = this;
    mNewRealty.promiseEditDB.then(function (value) {
        moduleDatabase.getModule("activehouses").update(value).then(function (result) {
            result.created = data.original.created;
            self.editView(result, parent, index);
        })
        mNewRealty.promiseEditDB = undefined;
        setTimeout(function () {
            if (mNewRealty.promiseEditDB !== undefined)
                self.editDB(mNewRealty, data, parent, index);
        }, 10);
    })
}

ListRealty.prototype.editView = function (value, parent, index) {
    var data = this.getDataRow(value);
    var indexOF = index,
        element = parent;
    element.updateRow(data, indexOF, true);
    // if(this.isCensorship&&data.censorship===1)
    // {
    //     element.updateTable();
    // }
}

ListRealty.prototype.delete = function (data, parent, index) {
    var self = this;
    var deleteItem = deleteQuestion("Xoá danh mục", "Bạn có chắc muốn xóa :" + data.name);
    this.$view.addChild(deleteItem);
    deleteItem.promiseComfirm.then(function () {
        self.deleteDB(data, parent, index);
    })
}

ListRealty.prototype.deleteView = function (parent, index) {
    var self = this;
    var bodyTable = parent.bodyTable;
    parent.dropRow(index).then(function () {});
}

ListRealty.prototype.deleteDB = function (data, parent, index) {
    var self = this;
    var phpFile = moduleDatabase.deleteActiveHomesPHP;
    if (self.phpDeleteContent)
        phpFile = self.phpUpdateContent;
    moduleDatabase.getModule("activehouses").delete({id:data.id}).then(function (value) {
        self.deleteView(parent, index);
    })
}

ListRealty.prototype.merge = function(data,parent,index)
{
    var self = this;
    var mMergeRealty = new MergeRealty(data);
    mMergeRealty.attach(self.parent);
    var frameview = mMergeRealty.getView();
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.mergeDB(mMergeRealty, data, parent, index);
}

ListRealty.prototype.mergeDB = function(mMergeRealty,data,parent,index)
{

}

ListRealty.prototype.mergeView = function(value, data, parent, index)
{

}

ListRealty.prototype.refresh = function () {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

ListRealty.prototype.setData = function (data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

ListRealty.prototype.flushDataToView = function () {
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

ListRealty.prototype.start = function () {

}

export default ListRealty;