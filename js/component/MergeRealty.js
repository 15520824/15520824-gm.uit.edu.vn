import BaseView from './BaseView';
import Fragment from "absol/src/AppPattern/Fragment";
import CMDRunner from "absol/src/AppPattern/CMDRunner";
import "../../css/MergeRealty.css"
import R from '../R';
import Fcore from '../dom/Fcore';
import MergeTool from 'mpot-merge-tool';
import moduleDatabase from '../component/ModuleDatabase';
import { MapView } from "./MapView";
import NewAccount from '../component/NewAccount';
import { reFormatNumber, formatFit } from './FormatFunction'

var _ = Fcore._;
var $ = Fcore.$;

function MergeRealty(data) {
    BaseView.call(this);
    Fragment.call(this);
    this.cmdRunner = new CMDRunner(this);
    this.loadConfig();
    this.data = data;
}

MergeRealty.prototype.setContainer = function(parent) {
    this.parent = parent;
}

Object.defineProperties(MergeRealty.prototype, Object.getOwnPropertyDescriptors(BaseView.prototype));
MergeRealty.prototype.constructor = MergeRealty;

MergeRealty.prototype.createPromise = function() {
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

MergeRealty.prototype.getView = function() {
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
                        innerHTML: "Gộp bất động sản"
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
                        {
                            tag: "button",
                            class: ["pizo-list-realty-button-add", "pizo-list-realty-button-element"],
                            on: {
                                click: function(evt) {
                                    self.resolveDB(self.getDataSave());
                                    self.createPromise();
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
    var myTool = new MergeTool.MPOTMergeTool();
    this.myTool = myTool;
    var element = new MapView();
    element.map.set("gestureHandling", "cooperative")
    element.activePlanningMap();
    var toolView = myTool.getView();
    var itemsAddress = [];
    var itemsAddressOld = [];
    var itemData;
    var itemName = [];
    var itemContent = [];
    var itemWidth = [],
        sumWidth = 0;
    var itemHeight = [],
        sumHeight = 0;
    var itemAcreage = [],
        sumAcreage = 0;
    var itemLandarea = [],
        sumLandarea = 0;
    var itemFloorarea = [],
        sumFloorarea = 0;
    var itemDirection = [];
    var checkDirection = {
        0: "Chưa xác định",
        6: "Đông",
        4: "Tây",
        2: "Nam",
        8: "Bắc",
        9: "Đông Bắc",
        3: "Đông Nam",
        7: "Tây Bắc",
        1: "Tây Nam"
    }
    var itemType = [];
    var checkType = moduleDatabase.getModule("type_activehouses").getLibary("id");
    var number, street, ward, district, state, fullAddress;
    this.checkAddressName = []
    var checkAddress = this.checkAddressName;
    this.checkAddressData = checkAddress;
    var valueRoadWidth, itemRoadWidth = [],
        sumRoadWidth = 0;

    var itemEquipments = [],
        itemContact = [];

    var itemCheckStatus = [];

    var itemImageStaus = [];
    itemImageStaus.functionChange = function(parent) {
        var arr = parent.getElementsByClassName("checked-pizo");
        if (arr.length == 0) {
            if (parent.childNodes.length > 0)
                parent.childNodes[0].classList.add("checked-pizo");
        }
    }
    var itemImageJuridical = [];
    var itemInputFit = [];
    var itemInputPriceRent = [];
    var itemInputPrice = [];
    var itemInputJuridical = [];

    var arr = moduleDatabase.getModule("juridicals").getList("name", "id");

    this.checkAddress = moduleDatabase.getModule("addresses").getLibary("id");
    this.checkStreet = moduleDatabase.getModule("streets").getLibary("id");
    this.checkWard = moduleDatabase.getModule("wards").getLibary("id");
    this.checkDistrict = moduleDatabase.getModule("districts").getLibary("id");
    this.checkState = moduleDatabase.getModule("states").getLibary("id");
    this.checkImage = moduleDatabase.getModule("image").getLibary("id");
    moduleDatabase.getModule("users").load().then(function(value) {
        self.checkUser = moduleDatabase.getModule("users").getLibary("phone");
        self.checkUserID = moduleDatabase.getModule("users").getLibary("id");
    })

    moduleDatabase.getModule("contacts").load().then(function(value) {
        self.checkContact = moduleDatabase.getModule("contacts").getLibary("phone");
        self.checkContactID = moduleDatabase.getModule("contacts").getLibary("id");
    })

    var valueSimpleStructure, itemStructure = [];
    var prefixImage = "https://lab.daithangminh.vn/home_co/pizo/assets/upload/";
    for (var i = 0; i < this.data.length; i++) {
        //Địa chỉ hiện tại
        itemData = this.data[i].original;
        for (var j = 0; j < itemData.image.length; j++) {
            if (this.checkImage[itemData.image[j]].type == 1) {
                var dataChild = {
                    value: true,
                    element: absol._({
                        tag: "div",
                        class: "grid-item",
                        child: [{
                                tag: "button",
                                class: "pizo-container-icon-radiobutton",
                                on: {
                                    click: function(event) {
                                        var parent = this.parentNode.parentNode;
                                        var arr = parent.getElementsByClassName("checked-pizo");
                                        if (arr.length > 0)
                                            arr[0].classList.remove("checked-pizo"); {
                                            this.parentNode.classList.add("checked-pizo");
                                        }
                                    }
                                },
                                child: [{
                                    tag: "i",
                                    class: ["material-icons", "choice-button-img"],
                                    style: {
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        userSelect: "none",
                                        fontSize: "13px"
                                    },
                                    props: {
                                        innerHTML: "stop_circle"
                                    }
                                }]
                            },
                            {
                                tag: "img",
                                class: "full-size",
                                props: {
                                    src: prefixImage + this.checkImage[itemData.image[j]].src
                                }
                            },
                            {
                                tag: "i",
                                class: ["material-icons", "close-button-img"],
                                style: {
                                    overflow: "hidden",
                                    position: "absolute",
                                    right: "7px",
                                    top: "7px",
                                    cursor: "pointer",
                                    height: "fit-content",
                                    margin: "0px",
                                    width: "fit-content",
                                    userSelect: "none",
                                    backgroundColor: "white",
                                    fontSize: "21px"
                                },
                                props: {
                                    innerHTML: "close"
                                }
                            }
                        ]
                    }),
                    id: itemData.image[j],
                    copy: this.checkImage[itemData.image[j]].src
                }
                $(".close-button-img", dataChild.element).addEventListener("click", function(dataChild) {
                    dataChild.value = false;
                }.bind(null, dataChild));
                itemImageStaus.push(dataChild);
            } else {
                var dataChild = {
                    value: true,
                    element: absol._({
                        tag: "div",
                        class: "grid-item",
                        child: [{
                                tag: "img",
                                class: "full-size",
                                props: {
                                    src: prefixImage + this.checkImage[itemData.image[j]].src
                                }
                            },
                            {
                                tag: "i",
                                class: ["material-icons", "close-button-img"],
                                style: {
                                    overflow: "hidden",
                                    position: "absolute",
                                    right: "7px",
                                    top: "7px",
                                    cursor: "pointer",
                                    height: "fit-content",
                                    margin: "0px",
                                    width: "fit-content",
                                    userSelect: "none",
                                    backgroundColor: "white",
                                    fontSize: "21px"
                                },
                                props: {
                                    innerHTML: "close"
                                }
                            }
                        ]
                    }),
                    id: itemData.image[j],
                    copy: this.checkImage[itemData.image[j]].src
                }
                dataChild["data"] = this.checkImage[itemData.image[j]];
                $(".close-button-img", dataChild.element).addEventListener("click", function(dataChild) {
                    dataChild.value = false;
                }.bind(null, dataChild))
                itemImageJuridical.push(dataChild);
            }
        }
        if (itemData.addressid != 0) {
            number = this.checkAddress[itemData.addressid].addressnumber;
            street = this.checkStreet[this.checkAddress[itemData.addressid].streetid].name;
            ward = this.checkWard[this.checkAddress[itemData.addressid].wardid].name;
            district = this.checkDistrict[this.checkWard[this.checkAddress[itemData.addressid].wardid].districtid].name;
            state = this.checkState[this.checkDistrict[this.checkWard[this.checkAddress[itemData.addressid].wardid].districtid].stateid].name;
            fullAddress = number + " " + street + ", " + ward + ", " + district + ", " + state;
            itemsAddress.push(fullAddress);
            checkAddress[fullAddress] = [itemData.lat, itemData.lng];
            checkAddress[fullAddress].data = itemData;
        }

        //Địa chỉ cũ
        if (itemData.addressid_old != 0) {
            number = this.checkAddress[itemData.addressid_old].addressnumber;
            street = this.checkStreet[this.checkAddress[itemData.addressid_old].streetid].name;
            ward = this.checkWard[this.checkAddress[itemData.addressid_old].wardid].name;
            district = this.checkDistrict[this.checkWard[this.checkAddress[itemData.addressid_old].wardid].districtid].name;
            state = this.checkState[this.checkDistrict[this.checkWard[this.checkAddress[itemData.addressid_old].wardid].districtid].stateid].name;
            fullAddress = number + " " + street + ", " + ward + ", " + district + ", " + state;
            checkAddress[fullAddress] = {};
            checkAddress[fullAddress].data = itemData;
            itemsAddressOld.push(fullAddress);
        }

        itemName.push(itemData.name);

        var inputSell = parseInt(itemData.salestatus % 10) == 1 ? true : false;
        var inputLease = parseInt(itemData.salestatus / 10) == 1 ? true : false;
        var tempStatus = _({
            tag: "div",
            class: "pizo-new-realty-desc-detail-row",
            style: {
                pointerEvents: "none"
            },
            child: [{
                    tag: "div",
                    class: "pizo-new-realty-desc-detail-row-cell-menu-1",
                    child: [{
                        tag: "div",
                        class: "pizo-new-realty-desc-detail-row",
                        child: [{
                                tag: "span",
                                class: "pizo-new-realty-desc-detail-row-cell-menu-1-span",
                                props: {
                                    innerHTML: "Còn bán"
                                }
                            },
                            {
                                tag: "checkbox",
                                class: "pizo-new-realty-desc-detail-row-menu-1-checkbox",
                                props: {
                                    checked: inputSell
                                }
                            }
                        ]
                    }]
                },
                {
                    tag: "div",
                    class: "pizo-new-realty-desc-detail-row-cell-menu-2",
                    child: [{
                        tag: "div",
                        class: "pizo-new-realty-desc-detail-row",
                        child: [{
                                tag: "span",
                                class: "pizo-new-realty-desc-detail-row-cell-menu-2-span",
                                props: {
                                    innerHTML: "Còn cho thuê"
                                }
                            },
                            {
                                tag: "checkbox",
                                class: "pizo-new-realty-desc-detail-row-menu-2-checkbox",
                                props: {
                                    checked: inputLease
                                },
                            }
                        ]
                    }]
                }
            ]
        });
        tempStatus.inputLease = $("div.pizo-new-realty-desc-detail-row-menu-2-checkbox", tempStatus);
        tempStatus.inputSell = $("div.pizo-new-realty-desc-detail-row-menu-1-checkbox", tempStatus);
        itemCheckStatus.push({ value: i + 1, element: tempStatus });

        itemContent.push(itemData.content);

        sumWidth += parseFloat(itemData.width);
        itemWidth.push(itemData.width);

        sumHeight += parseFloat(itemData.height);
        itemHeight.push(itemData.height);

        sumAcreage += parseFloat(itemData.acreage);
        itemAcreage.push(itemData.acreage);

        sumLandarea += parseFloat(itemData.landarea);
        itemLandarea.push(itemData.landarea);

        sumFloorarea += parseFloat(itemData.floorarea);
        itemFloorarea.push(itemData.floorarea);

        var advanceDetruct = itemData.advancedetruct;
        var advanceDetruct1 = advanceDetruct % 10 ? true : false;
        advanceDetruct = parseInt(advanceDetruct / 10);
        var advanceDetruct2 = advanceDetruct % 10 ? true : false;
        advanceDetruct = parseInt(advanceDetruct / 10);
        var advanceDetruct3 = advanceDetruct % 10 ? true : false;
        advanceDetruct = parseInt(advanceDetruct / 10);
        var advanceDetruct4 = advanceDetruct % 10 ? true : false;
        advanceDetruct = _({
            tag: "div",
            class: "pizo-new-realty-dectruct-content-area-advance",
            child: [{
                    tag: "div",
                    class: ["pizo-new-realty-dectruct-content-area-size", ],
                    child: [{
                            tag: "div",
                            class: ["pizo-new-realty-dectruct-content-area-size-zone"],
                            child: [{
                                tag: "div",
                                class: "pizo-new-realty-desc-detail-row",
                                child: [{
                                        tag: "span",
                                        class: "pizo-new-realty-dectruct-content-area-floor-label",
                                        props: {
                                            innerHTML: "Tầng"
                                        },
                                    },
                                    {
                                        tag: "input",
                                        class: ["pizo-new-realty-dectruct-content-area-floor", "pizo-new-realty-dectruct-input"],
                                        attr: {
                                            type: "number",
                                            min: 0,
                                            step: 1
                                        },
                                        props: {
                                            value: itemData.floor
                                        }
                                    }
                                ]
                            }]
                        },
                        {
                            tag: "div",
                            class: "pizo-new-realty-dectruct-content-area-size-zone",
                            child: [{
                                tag: "div",
                                class: "pizo-new-realty-desc-detail-row",
                                child: [{
                                        tag: "span",
                                        class: "pizo-new-realty-dectruct-content-area-basement-label",
                                        props: {
                                            innerHTML: "Hầm"
                                        },
                                    },
                                    {
                                        tag: "input",
                                        class: ["pizo-new-realty-dectruct-content-area-basement", "pizo-new-realty-dectruct-input"],
                                        attr: {
                                            type: "number",
                                            min: 0,
                                            step: 1
                                        },
                                        props: {
                                            value: itemData.basement
                                        }
                                    }
                                ]
                            }]
                        },

                    ]
                },
                {
                    tag: "div",
                    class: "pizo-new-realty-dectruct-content-area-selectbox",
                    child: [{
                            tag: "div",
                            class: "pizo-new-realty-dectruct-content-area-size-zone",
                            child: [{
                                tag: "div",
                                class: "pizo-new-realty-desc-detail-row",
                                child: [{
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-selectbox-child",
                                        child: [{
                                                tag: "span",
                                                props: {
                                                    innerHTML: "Lửng"
                                                }
                                            },
                                            {
                                                tag: "checkbox",
                                                class: "pizo-new-realty-dectruct-content-area-selectbox-child-1",
                                                props: {
                                                    checked: advanceDetruct1
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-selectbox-child",
                                        child: [{
                                                tag: "span",
                                                props: {
                                                    innerHTML: "Sân thượng"
                                                }
                                            },
                                            {
                                                tag: "checkbox",
                                                class: "pizo-new-realty-dectruct-content-area-selectbox-child-2",
                                                props: {
                                                    checked: advanceDetruct2
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }]
                        },
                        {
                            tag: "div",
                            class: "pizo-new-realty-dectruct-content-area-size-zone",
                            child: [{
                                tag: "div",
                                class: "pizo-new-realty-desc-detail-row",
                                child: [{
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-selectbox-child",
                                        child: [{
                                                tag: "span",
                                                props: {
                                                    innerHTML: "Ban công"
                                                }
                                            },
                                            {
                                                tag: "checkbox",
                                                class: "pizo-new-realty-dectruct-content-area-selectbox-child-3",
                                                props: {
                                                    checked: advanceDetruct3
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        class: "pizo-new-realty-dectruct-content-area-selectbox-child",
                                        child: [{
                                                tag: "span",
                                                props: {
                                                    innerHTML: "Thang máy"
                                                }
                                            },
                                            {
                                                tag: "checkbox",
                                                class: "pizo-new-realty-dectruct-content-area-selectbox-child-4",
                                                props: {
                                                    checked: advanceDetruct4
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }]
                        },
                    ]
                }
            ]
        });
        var simpleDetruct = _({
            tag: "div",
            class: ["pizo-new-realty-dectruct-content-area", "pizo-new-realty-dectruct-content-area-simple"],
            child: [{
                    tag: "span",
                    class: "pizo-new-realty-detruct-content-area-label",
                    style: {
                        marginBottom: "0.7143rem"
                    },
                    props: {
                        innerHTML: "Quy mô kết cấu"
                    },
                },
                advanceDetruct,
                {
                    tag: "div",
                    class: "pizo-new-realty-dectruct-content-area-size",
                    child: [{
                            tag: "div",
                            class: "pizo-new-realty-dectruct-content-area-size-zone",
                            child: [{
                                tag: "div",
                                class: "pizo-new-realty-desc-detail-row",
                                child: [{
                                        tag: "span",
                                        class: "pizo-new-realty-dectruct-content-area-bedroom-label",
                                        props: {
                                            innerHTML: "Phòng ngủ"
                                        },
                                    },
                                    {
                                        tag: "input",
                                        class: ["pizo-new-realty-dectruct-content-area-bedroom", "pizo-new-realty-dectruct-input"],
                                        attr: {
                                            type: "number",
                                            min: 0,
                                            step: 1
                                        },
                                        props: {
                                            value: itemData.bedroom
                                        }
                                    }
                                ]
                            }]
                        },
                        {
                            tag: "div",
                            class: "pizo-new-realty-dectruct-content-area-size-zone",
                            child: [{
                                tag: "div",
                                class: "pizo-new-realty-desc-detail-row",
                                child: [{
                                        tag: "span",
                                        class: "pizo-new-realty-dectruct-content-area-living-label",
                                        props: {
                                            innerHTML: "Phòng khách"
                                        },
                                    },
                                    {
                                        tag: "input",
                                        class: ["pizo-new-realty-dectruct-content-area-living", "pizo-new-realty-dectruct-input"],
                                        attr: {
                                            type: "number",
                                            min: 0,
                                            step: 1
                                        },
                                        props: {
                                            value: itemData.living
                                        }
                                    }
                                ]
                            }]
                        }
                    ]
                },
                {
                    tag: "div",
                    class: "pizo-new-realty-dectruct-content-area-size",
                    child: [{
                            tag: "div",
                            class: "pizo-new-realty-dectruct-content-area-size-zone",
                            child: [{
                                tag: "div",
                                class: "pizo-new-realty-desc-detail-row",
                                child: [{
                                        tag: "span",
                                        class: "pizo-new-realty-dectruct-content-area-kitchen-label",
                                        props: {
                                            innerHTML: "Bếp"
                                        },
                                    },
                                    {
                                        tag: "input",
                                        class: ["pizo-new-realty-dectruct-content-area-kitchen", "pizo-new-realty-dectruct-input"],
                                        attr: {
                                            type: "number",
                                            min: 0,
                                            step: 1
                                        },
                                        props: {
                                            value: itemData.kitchen
                                        }
                                    }
                                ]
                            }]
                        },
                        {
                            tag: "div",
                            class: "pizo-new-realty-dectruct-content-area-size-zone",
                            child: [{
                                tag: "div",
                                class: "pizo-new-realty-desc-detail-row",
                                child: [{
                                        tag: "span",
                                        class: "pizo-new-realty-dectruct-content-area-toilet-label",
                                        props: {
                                            innerHTML: "Toilet"
                                        },
                                    },
                                    {
                                        tag: "input",
                                        class: ["pizo-new-realty-dectruct-content-area-toilet", "pizo-new-realty-dectruct-input"],
                                        attr: {
                                            type: "number",
                                            min: 0,
                                            step: 1
                                        },
                                        props: {
                                            value: itemData.toilet
                                        }
                                    }
                                ]
                            }]
                        }
                    ]
                },
            ]
        });
        simpleDetruct.advanceDetruct1 = advanceDetruct1;
        simpleDetruct.advanceDetruct2 = advanceDetruct2;
        simpleDetruct.advanceDetruct3 = advanceDetruct3;
        simpleDetruct.advanceDetruct4 = advanceDetruct4;
        simpleDetruct.inputFloor = $("input.pizo-new-realty-dectruct-content-area-floor", simpleDetruct);
        simpleDetruct.inputBasement = $("input.pizo-new-realty-dectruct-content-area-basement", simpleDetruct);
        simpleDetruct.inputBedroom = $("input.pizo-new-realty-dectruct-content-area-bedroom", simpleDetruct);
        simpleDetruct.inputLiving = $("input.pizo-new-realty-dectruct-content-area-living", simpleDetruct);
        simpleDetruct.inputToilet = $("input.pizo-new-realty-dectruct-content-area-toilet", simpleDetruct);
        simpleDetruct.inputKitchen = $("input.pizo-new-realty-dectruct-content-area-kitchen", simpleDetruct);
        var tempSelectbox = _({
            tag: "selectmenu",
            class: "pizo-new-realty-detruct-content-structure",
            on: {
                change: function(event) {
                    if (this.value == 3)
                        advanceDetruct.style.display = "";
                    else
                        advanceDetruct.style.display = "none";
                    if (this.value >= 2)
                        simpleDetruct.style.display = "";
                    else
                        simpleDetruct.style.display = "none";
                }
            },
            props: {
                items: [
                    { text: "Chưa xác định", value: 0 },
                    { text: "Đất trống", value: 1 },
                    { text: "Cấp 4", value: 2 },
                    { text: "Sẳn *", value: 3 },
                ],
                value: itemData.structure
            }
        });
        var elementTemp = _({
            tag: "div",
            class: "pizo-new-realty-dectruct-content-area-size-zone",
            style: {
                pointerEvents: "none"
            },
            child: [{
                    tag: "div",
                    class: "pizo-new-realty-desc-detail-row",
                    child: [
                        tempSelectbox
                    ]
                },
                simpleDetruct
            ]
        })
        tempSelectbox.emit("change");
        itemStructure.push({ value: i + 1, element: elementTemp.cloneNode(true), simpleDetruct: simpleDetruct });
        if (valueSimpleStructure === undefined) {
            valueSimpleStructure = simpleDetruct;
        }

        itemDirection.push(checkDirection[itemData.direction]);

        if (checkType[itemData.type]) {
            itemType.push(checkType[itemData.type].name);
        }

        sumRoadWidth += parseFloat(itemData.roadwidth);
        itemRoadWidth.push(itemData.roadwidth);
        if (valueRoadWidth === undefined)
            valueRoadWidth = itemData.roadwidth;

        if (itemData.contact.length > 0) {
            var tempElement = this.contactItem(itemData.contact[i]);
            var dataChild = { value: false, element: tempElement, promiseComplete: tempElement.promiseComplete };
            $(".pizo-new-realty-contact-item-close", tempElement).addEventListener("click", function(dataChild) {
                dataChild.value = false;
            }.bind(null, dataChild))
            itemContact.push(dataChild);
        }

        if (itemData.equipment.length > 0) {
            itemEquipments.push({ value: false, element: this.convenientView(itemData), itemData: itemData.equipment });
        }

        var tempInputFit = _({
            tag: "selectbox",
            class: ["pizo-new-realty-dectruct-content-area-fit", "pizo-new-realty-dectruct-input"],
            props: {
                items: [
                    { text: "Để ở", value: 1 },
                    { text: "Cho thuê", value: 10 },
                    { text: "Kinh doanh", value: 100 },
                    { text: "Làm văn phòng", value: 1000 },
                ],
                values: formatFit(parseInt(itemData.fit))
            }
        })
        itemInputFit.push({ value: i + 1, element: tempInputFit });

        var tempInputValue = _({
            tag: "div",
            class: "pizo-new-realty-desc-detail-row",
            child: [{
                    tag: "input",
                    class: ["pizo-new-realty-detruct-content-price", "pizo-new-realty-dectruct-input"],
                    props: {
                        value: itemData.price
                    },
                    on: {
                        // change: function(event) {
                        //     var inputValue = $("input.pizo-new-realty-detruct-content-price-per", temp);
                        //     var price = $('input.pizo-new-realty-detruct-content-price', temp);
                        //     var priceUnit = $('div.pizo-new-realty-detruct-content-price-unit', temp)

                        //     var areaValue = $('input.pizo-new-realty-dectruct-content-area-all', temp);
                        //     var areaValueUnit = unit_Zone_all;
                        //     inputValue.value = price.value * priceUnit.value / (areaValue.value * areaValueUnit.value) * 1000;
                        // }
                    },
                },
                {
                    tag: "selectmenu",
                    class: "pizo-new-realty-detruct-content-price-unit",
                    on: {
                        change: function(tempInputValue) {
                            return function(event) {
                                var price = $('input.pizo-new-realty-detruct-content-price', tempInputValue);
                                price.value = price.value * event.lastValue / event.value;
                            }
                        }(tempInputValue)
                    },
                    props: {
                        items: [
                            { text: "tỉ", value: 1 },
                            { text: "triệu", value: 1 / 1000 }
                        ]
                    }
                }
            ]
        })
        itemInputPrice.push({ value: i + 1, element: tempInputValue });

        var tempInputValue = _({
            tag: "div",
            class: "pizo-new-realty-dectruct-content-area-right",
            child: [{
                tag: "div",
                class: "pizo-new-realty-desc-detail-row",
                child: [{
                        tag: "input",
                        class: ["pizo-new-realty-detruct-content-price-rent", "pizo-new-realty-dectruct-input"],
                        props: {
                            value: itemData.pricerent
                        },
                        on: {
                            input: function(event) {
                                this.value = formatNumber(this.value);
                            },
                            blur: function(event) {
                                this.value = reFormatNumber(this.value);
                            }
                        }
                    },
                    {
                        tag: "selectmenu",
                        class: "pizo-new-realty-detruct-content-price-rent-unit",
                        on: {
                            change: function(tempInputValue) {
                                return function(event) {
                                    var price = $('input.pizo-new-realty-detruct-content-price-rent', tempInputValue);
                                    price.value = (price.value * event.lastValue / event.value);
                                }
                            }(tempInputValue)
                        },
                        props: {
                            items: [
                                { text: "VND", value: 1 },
                                { text: "USD", value: 23180 }
                            ]
                        }
                    }
                ]
            }]
        });
        itemInputPriceRent.push({ value: i + 1, element: tempInputValue });
        var tempInputValue = _({
            tag: "div",
            class: "pizo-new-realty-juridical-content",
            child: [{
                tag: "selectmenu",
                style: {
                    textAlign: "left"
                },
                class: ["pizo-new-realty-dectruct-content-area-fit", "pizo-new-realty-dectruct-input"],
                props: {
                    items: arr
                }
            }]
        });
        itemInputJuridical.push({ value: i + 1, element: tempInputValue });
    }



    itemWidth.push(sumWidth);
    itemHeight.push(sumHeight);
    itemAcreage.push(sumAcreage);
    itemLandarea.push(sumLandarea);
    itemFloorarea.push(sumFloorarea);
    itemRoadWidth.push(sumRoadWidth);


    var dataName = {
        type: 'text',
        name: 'Tên',
        id: 'name',
        enableEdit: true,
        action: "single-choice",
        items: itemName
    }

    var dataStatus = {
        type: 'element',
        name: 'Hiện trạng',
        id: 'status-active',
        action: "single-choice",
        items: itemCheckStatus
    }

    var dataAddress = {
        type: 'text',
        name: 'Địa chỉ',
        id: 'address',
        action: "single-choice",
        items: itemsAddress,
    }

    var dataAddressOld = {
        type: 'text',
        name: 'Địa chỉ cũ',
        id: 'address-old',
        action: "single-choice",
        items: itemsAddressOld
    }

    var dataContent = {
        type: 'text',
        name: 'Mô tả',
        id: 'description',
        enableEdit: true,
        action: "single-choice",
        items: itemContent
    }

    var dataWidth = {
        type: 'number',
        name: 'Dài (m)',
        id: 'width',
        enableEdit: true,
        action: "single-choice",
        items: itemWidth
    }

    var dataHeight = {
        type: 'number',
        name: 'Ngang (m)',
        id: 'height',
        enableEdit: true,
        action: "single-choice",
        items: itemHeight
    }

    var dataAcreage = {
        type: 'number',
        name: 'Diện tích (m²)',
        id: 'acreage',
        enableEdit: true,
        action: "single-choice",
        items: itemAcreage
    }

    var dataLandarea = {
        type: 'number',
        name: 'Đất xây dựng (m²)',
        id: 'landarea',
        enableEdit: true,
        action: "single-choice",
        items: itemLandarea
    }

    var dataFloorarea = {
        type: 'number',
        name: 'Sàn xây dựng (m²)',
        id: 'floorarea',
        enableEdit: true,
        action: "single-choice",
        items: itemFloorarea
    }

    var dataStructure = {
        type: 'element',
        name: 'Kết cấu',
        id: 'structure',
        action: "single-choice",
        items: itemStructure
    }

    var dataDirection = {
        type: 'text',
        name: 'Hướng',
        id: 'direction',
        action: "single-choice",
        items: itemDirection
    }

    var dataType = {
        type: 'text',
        name: 'Loại nhà',
        id: 'type-house',
        action: "single-choice",
        items: itemType
    }

    var dataRoadWidth = {
        type: 'text',
        name: 'Chiều rộng đường vào (m)',
        id: 'roadwidth',
        enableEdit: true,
        action: "single-choice",
        items: itemRoadWidth
    }

    var dataEquipments = {
        type: 'element',
        name: 'Tiện ích trong nhà',
        id: 'equipments',
        action: "multi-choice",
        items: itemEquipments
    }

    var dataContact = {
        type: 'element',
        name: 'Liên hệ',
        id: 'contact',
        action: "multi-choice",
        items: itemContact
    }

    var dataImage = {
        type: 'element',
        name: 'Ảnh hiện trạng',
        id: 'image-status',
        action: "multi-choice",
        items: itemImageStaus,
        style: {
            maxWidth: '200px',
            maxHeight: '200px'
        }
    }

    var dataImageJuridical = {
        type: 'element',
        name: 'Ảnh pháp lý',
        id: 'image-juridical',
        action: "multi-choice",
        items: itemImageJuridical,
        style: {
            maxWidth: '200px',
            maxHeight: '200px'
        }
    }

    var dataFit = {
        type: 'element',
        name: 'Phù hợp khai thác',
        id: 'fit',
        enableEdit: true,
        action: "single-choice",
        items: itemInputFit
    }

    var dataPrice = {
        type: 'element',
        name: 'Giá',
        id: 'price-child',
        enableEdit: true,
        action: "single-choice",
        items: itemInputPrice
    }

    var dataPriceRent = {
        type: 'element',
        name: 'Giá thuê tháng',
        id: 'price-rent',
        enableEdit: true,
        action: "single-choice",
        items: itemInputPriceRent
    }

    var dataJuridical = {
        type: 'element',
        name: 'Tình trạng pháp lý',
        id: 'juridical',
        enableEdit: true,
        action: "single-choice",
        items: itemInputJuridical
    }

    var elementStructure = _({
        tag: "div",
        class: "container-structure"
    })

    var elementEquipments = _({
        tag: "div",
        class: "container-equipments",
        child: [
            self.convenientView({ equipment: [] })
        ]
    })

    elementStructure.appendChild(valueSimpleStructure);
    myTool.editor.on("nodechange", function(event) {
        switch (event.nodePreviewData.id) {
            case "address":
                if (checkAddress[event.nodePreviewData.value])
                    element.addMoveMarker(checkAddress[event.nodePreviewData.value])
                break;
            case "structure":
                elementStructure.clearChild();
                elementStructure.appendChild(event.nodePreviewData.item.simpleDetruct)
                break;
            case "equipments":
                elementEquipments.clearChild();
                var result = [];
                var checkEquipment = [],
                    valueTemp;
                for (var i = 0; i < event.nodePreviewData.values.length; i++) {
                    for (var j = 0; j < event.nodePreviewData.values[i].itemData.length; j++) {
                        valueTemp = event.nodePreviewData.values[i].itemData[j];
                        if (checkEquipment[valueTemp.equipmentid] === undefined)
                            checkEquipment[valueTemp.equipmentid] = { equipmentid: valueTemp.equipmentid, content: parseInt(valueTemp.content) };
                        else
                            checkEquipment[valueTemp.equipmentid].content += parseInt(valueTemp.content);
                    }
                }
                for (var param in checkEquipment) {
                    result.push(checkEquipment[param]);
                }
                elementEquipments.appendChild(self.convenientView({ equipment: result }));
                break;
            case "status-active":
                var elementParent = event.nodePreviewData.item.element;
                while (elementParent && !elementParent.classList.contains("mpot-preview-body")) {
                    elementParent = elementParent.parentNode;
                }
                if (event.nodePreviewData.item.element.inputLease.checked === false) {
                    if (elementParent) {
                        elementParent.classList.add("displayNonePriceRent");
                    }
                } else if (event.nodePreviewData.item.element.inputLease.checked === true) {
                    if (elementParent) {
                        elementParent.classList.remove("displayNonePriceRent");
                    }
                }
                break;
            default:
        }
    })

    myTool.setData({
        editor: {
            title: 'Thông tin bất động sản sau gộp',
            properties: [{
                    type: "container",
                    id: "container-general",
                    properties: [{
                            type: "group",
                            name: 'Thông tin chung',
                            id: "general",
                            properties: [
                                dataName,
                                dataStatus,
                                dataAddress,
                                dataAddressOld,
                                dataContent
                            ]
                        },
                        {
                            type: 'constant',
                            id: 'GPS',
                            action: 'const',
                            element: element
                        }
                    ]
                },
                {
                    type: "container",
                    id: "container-price-construct",
                    properties: [{
                            type: "group",
                            name: 'Thông tin xây dựng',
                            id: "construction",
                            properties: [
                                dataWidth,
                                dataHeight,
                                dataAcreage,
                                dataLandarea,
                                dataFloorarea,
                                dataStructure,
                                {
                                    type: 'constant',
                                    id: 'structure-detail',
                                    changeid: 'structure',
                                    action: 'const',
                                    element: elementStructure
                                },
                                dataDirection,
                                dataType,
                                dataRoadWidth
                            ]
                        },
                        {
                            type: "container",
                            id: "container-price-juridical",
                            properties: [{
                                    type: "group",
                                    name: 'Giá',
                                    id: "price",
                                    properties: [
                                        dataPrice,
                                        dataPriceRent,
                                        dataFit,
                                    ]
                                },
                                dataJuridical
                            ]
                        }
                    ]
                },
                {
                    type: "container",
                    id: "container-orther",
                    properties: [
                        dataEquipments,
                        {
                            type: 'constant',
                            id: 'equipments-detail',
                            changeid: 'equipments',
                            action: 'const',
                            element: elementEquipments
                        }
                    ]
                },
                {
                    type: "container",
                    id: "container-contact",
                    properties: [
                        dataContact,
                        dataImage,
                        dataImageJuridical
                    ]
                }
                // {
                //     type:"container",
                //     id:"container-general",
                // }
            ]
        }
    });
    toolView.addStyle({ width: '100%', height: '100%' });
    this.$view.addChild(_({
        tag: "div",
        class: ["pizo-list-realty-main"],
        child: [{
            tag: "div",
            class: ["pizo-list-realty-main-result-control"],
            child: [
                toolView
            ]
        }]
    }));
    this.createPromise();
    return this.$view;
}

MergeRealty.prototype.contactItem = function(data) {
    var name, typecontact, phone, statusphone, note;
    var resolveComplete;
    var promiseComplete = new Promise(function(resolve, reject) {
        resolveComplete = resolve;
    })
    var self = this;
    var temp = _({
        tag: "div",
        class: "pizo-new-realty-contact-item",
        child: [{
                tag: "div",
                class: "pizo-new-realty-contact-item-name",
                child: [{
                        tag: "span",
                        class: "pizo-new-realty-contact-item-name-label",
                        props: {
                            innerHTML: "Tên"
                        }
                    },
                    {
                        tag: "input",
                        class: "pizo-new-realty-contact-item-name-input",
                        props: {}
                    },
                    {
                        tag: "selectmenu",
                        class: "pizo-new-realty-contact-item-name-selectbox",
                        props: {
                            items: [
                                { text: "Chưa xác định", value: 0 },
                                { text: "Môi giới", value: 1 },
                                { text: "Chủ nhà", value: 2 },
                                { text: "Họ hàng", value: 3 }
                            ]
                        }
                    },
                    {
                        tag: "button",
                        class: "pizo-new-realty-contact-item-setting",
                        on: {
                            click: function(event) {
                                var tempData = temp.getData();
                                if (tempData.password !== undefined)
                                    self.editAccount(temp, tempData);
                                else
                                    self.editContact(temp, tempData);
                            }
                        },
                        child: [{
                            tag: "i",
                            class: "material-icons",
                            style: {
                                fontSize: "1rem",
                                verticalAlign: "middle"
                            },
                            props: {
                                innerHTML: "settings"
                            }
                        }]
                    },
                    {
                        tag: "button",
                        class: "pizo-new-realty-contact-item-close",
                        child: [{
                            tag: "i",
                            class: "material-icons",
                            style: {
                                fontSize: "1rem",
                                verticalAlign: "middle"
                            },
                            props: {
                                innerHTML: "close"
                            }
                        }]
                    }
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-contact-item-phone",
                child: [{
                        tag: "span",
                        class: "pizo-new-realty-contact-item-phone-label",
                        props: {
                            innerHTML: "Số điện thoại"
                        }
                    },
                    {
                        tag: "input",
                        class: "pizo-new-realty-contact-item-phone-input",
                        props: {
                            type: "number"
                        },
                        on: {
                            change: function(event) {
                                if (self.checkUser === undefined) {
                                    var element = this;
                                    moduleDatabase.getModule("users").load().then(function() {
                                        setTimeout(function() {
                                            element.emit("change");
                                        }, 10)

                                    })
                                    return;
                                }
                                if (self.checkContact === undefined) {
                                    var element = this;
                                    moduleDatabase.getModule("contacts").load().then(function() {
                                        setTimeout(function() {
                                            element.emit("change");
                                        }, 10)
                                    })
                                    return;
                                }
                                if (self.checkUser[this.value] !== undefined || self.checkContact[this.value] !== undefined) {
                                    if (self.checkUser[this.value] !== undefined) {
                                        var tempValue = self.checkUser[this.value];
                                        temp.setInformation(tempValue);
                                    } else {
                                        var tempValue = self.checkContact[this.value];
                                        temp.setInformation(tempValue);
                                    }
                                } else {
                                    temp.setOpenForm();
                                }
                            }
                        }
                    },
                    {
                        tag: "selectmenu",
                        class: "pizo-new-realty-contact-item-phone-selectbox",
                        style: {
                            width: "190px"
                        },
                        props: {
                            items: [
                                { text: "Còn hoạt động", value: 1 },
                                { text: "Sai số", value: 0 },
                                { text: "Gọi lại sau", value: 2 },
                                { text: "Bỏ qua", value: 3 },
                                { text: "Khóa máy", value: 4 }
                            ]
                        }
                    }
                ]
            },
            {
                tag: "div",
                class: "pizo-new-realty-contact-item-note",
                child: [{
                        tag: "span",
                        class: "pizo-new-realty-contact-item-note-label",
                        props: {
                            innerHTML: "Ghi chú"
                        }
                    },
                    {
                        tag: "textarea",
                        class: "pizo-new-realty-contact-item-note-input"
                    }
                ]
            },
        ]
    })
    var name = $('input.pizo-new-realty-contact-item-name-input', temp);
    var typecontact = $('div.pizo-new-realty-contact-item-name-selectbox', temp);
    var phone = $('input.pizo-new-realty-contact-item-phone-input', temp);
    var statusphone = $('div.pizo-new-realty-contact-item-phone-selectbox', temp);
    var note = $('textarea.pizo-new-realty-contact-item-note-input', temp);
    phone.checkContact = function(data) {
        if (self.checkUserID === undefined) {
            var element = this;
            moduleDatabase.getModule("users").load().then(function() {
                setTimeout(function() {
                    element.checkContact(data);
                }, 10)
            })
            return;
        }
        if (self.checkContactID === undefined) {
            var element = this;
            moduleDatabase.getModule("contacts").load().then(function() {
                setTimeout(function() {
                    element.checkContact(data);
                }, 10)
            })
            return;
        }
        if (data.contactid !== undefined && data.contactid !== 0) {
            temp.setInformation(self.checkContactID[data.contactid]);
        } else
        if (data.userid !== undefined && data.userid !== 0) {
            temp.setInformation(self.checkUserID[data.userid]);
        } else {
            temp.setInformation(data);
        }
    }
    temp.setInformation = function(data) {
        if (data === undefined) {
            temp.selfRemove();
            return;
        }
        temp.data = data;
        if (data.statusphone === undefined)
            statusphone.value = 1
        else
            statusphone.value = data.statusphone;
        phone.value = data.phone;
        name.value = data.name;
        name.setAttribute("disabled", "");
        statusphone.style.pointerEvents = "none";
        statusphone.style.backgroundColor = "#f3f3f3";
        resolveComplete();
    }
    temp.setOpenForm = function(data) {
        temp.data = data;
        statusphone.value = 1;
        name.removeAttribute("disabled");
        statusphone.style.pointerEvents = "unset";
        statusphone.style.backgroundColor = "unset";
        resolveComplete();
    }
    temp.getData = function() {
        if (temp.data !== undefined) {
            temp.data.typecontact = typecontact.value;
            temp.data.note = note.value;
            return temp.data;
        } else {
            return {
                name: name.value,
                statusphone: statusphone.value,
                phone: phone.value,
                typecontact: typecontact.value,
                note: note.value
            }
        }
    }

    if (data !== undefined) {
        phone.checkContact(data);
        typecontact.value = data.typecontact;
        note.value = data.note;
    }
    temp.promiseComplete = promiseComplete;
    return temp;
}

MergeRealty.prototype.editAccount = function(node, data) {
    var self = this;
    moduleDatabase.getModule("positions").load().then(function(value) {
        var mNewAccount = new NewAccount({ original: data });
        mNewAccount.attach(self.parent);
        var frameview = mNewAccount.getView(moduleDatabase.getModule("positions").getList("name", "id"));
        self.parent.body.addChild(frameview);
        self.parent.body.activeFrame(frameview);
        self.editDBAccount(mNewAccount, data, node);
    })
}

MergeRealty.prototype.editDBAccount = function(mNewAccount, data, node) {
    var self = this;
    mNewAccount.promiseEditDB.then(function(value) {
        moduleDatabase.getModule("users").update(value).then(function(result) {
            self.editViewAccount(result, node);
        })
        mNewAccount.promiseEditDB = undefined;
        setTimeout(function() {
            if (mNewAccount.promiseEditDB !== undefined)
                self.editDBAccount(mNewAccount, data, parent, index);
        }, 10);
    })
}

MergeRealty.prototype.editViewAccount = function(value, node) {
    node.setInformation(value);
}

MergeRealty.prototype.editDBContact = function(mNewContact, data, node) {
    var self = this;
    mNewContact.promiseEditDB.then(function(value) {
        if (value.id === undefined)
            moduleDatabase.getModule("users").add(value).then(function(result) {
                self.editViewAccount(result, node);
            })
        else
            moduleDatabase.getModule("contacts").update(value).then(function(result) {
                self.editViewContact(result, node);
            })
        mNewContact.promiseEditDB = undefined;
        setTimeout(function() {
            if (mNewContact.promiseEditDB !== undefined)
                self.editDBContact(mNewContact, data);
        }, 10);
    })
}

MergeRealty.prototype.editViewContact = function(value, node) {
    node.setInformation(value);
}

MergeRealty.prototype.editContact = function(node, data) {
    var self = this;
    var mNewContact = new NewContact({ original: data });
    mNewContact.attach(self.parent);
    var frameview = mNewContact.getView();
    self.parent.body.addChild(frameview);
    self.parent.body.activeFrame(frameview);
    self.editDBContact(mNewContact, data, node);
}

MergeRealty.prototype.convenientView = function(dataHouse) {
    var self = this;
    var data = moduleDatabase.getModule("equipments").data;
    var arr = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].available === 0)
            continue;
        arr.push({ text: data[i].name, value: data[i].id, data: data[i] })
    }
    var container = _({
        tag: "div",
        class: "pizo-new-realty-dectruct-content-area-size"
    })
    var equipment = _({
        tag: "selectbox",
        style: {
            width: "100%"
        },
        props: {
            items: arr,
            enableSearch: true
        },
        on: {
            add: function(event) {
                switch (parseInt(event.itemData.data.type)) {
                    case 0:
                        container.appendChild(self.itemCount(event.itemData.data));
                        break;
                    case 1:
                        container.appendChild(self.itemDisplayNone(event.itemData.data));
                        break;
                }
            },
            remove: function(event) {
                for (var i = 0; i < container.childNodes.length; i++) {
                    if (container.childNodes[i].equipmentid == event.itemData.data.id) {
                        container.childNodes[i].selfRemove();
                        break;
                    }
                }
            }
        }
    });

    if (this.data !== undefined) {
        var value = [];
        var temp;
        var libary = moduleDatabase.getModule("equipments").getLibary("id");
        for (var i = 0; i < dataHouse.equipment.length; i++) {
            temp = libary[dataHouse.equipment[i].equipmentid];
            temp.content = dataHouse.equipment[i].content;
            value.push(dataHouse.equipment[i].equipmentid);
            switch (parseInt(temp.type)) {
                case 0:
                    if (temp.available == 1)
                        container.appendChild(self.itemCount(temp));
                    else
                        container.appendChild(self.itemDisplayNone(temp));
                    break;
                case 1:
                    container.appendChild(self.itemDisplayNone(temp));
                    break;
            }
        }
        equipment.values = value;
    }

    var temp = _({
        tag: "div",
        class: "pizo-new-realty-convenient",
        child: [{
            tag: "div",
            class: "pizo-new-realty-convenient-content",
            child: [{
                    tag: "div",
                    class: "pizo-new-realty-convenient-content-size",
                    child: [
                        equipment
                    ]
                },
                container
            ]
        }]
    })
    return temp;
}

MergeRealty.prototype.itemCount = function(data) {
    var input = _({
        tag: "input",
        class: ["pizo-new-realty-dectruct-content-area-floor", "pizo-new-realty-dectruct-input"],
        attr: {
            type: "number",
            min: 0,
            step: 1
        },
        props: {
            value: 1
        }
    });
    if (data.content !== undefined) {
        input.value = data.content;
    }
    var temp = _({
        tag: "div",
        class: ["pizo-new-realty-dectruct-content-area-size-zone-all"],
        child: [{
            tag: "div",
            class: "pizo-new-realty-desc-detail-row",
            child: [{
                    tag: "span",
                    class: "pizo-new-realty-dectruct-content-area-floor-label",
                    props: {
                        innerHTML: data.name,
                    },
                },
                input
            ]
        }]
    });
    temp.equipmentid = data.id;
    temp.getData = function() {
        var result = {
            equipmentid: data.id,
            content: input.value
        }
        return result;
    }
    return temp;
}

MergeRealty.prototype.itemDisplayNone = function(data) {
    var temp = _({
        tag: "div",
        style: {
            display: "none"
        }
    })
    temp.equipmentid = data.id;
    temp.getData = function() {
        var result = {
            equipmentid: data.id,
            content: data.content
        }
        return result;
    }
    return temp;
}

MergeRealty.prototype.getDataSave = function() {
    var temp = {};
    var data = this.myTool.getData().previewData.properties;
    var advanceDetructElement = data[1].properties[0].properties[6].element.childNodes[0];
    var fitUpdate = 0;
    var inputFit = data[1].properties[1].properties[0].properties[2].item.element;
    if (inputFit.values.length !== 0)
        fitUpdate = inputFit.values.reduce(function(a, b) { return a + b; });
    var advanceDetruct = 0;
    advanceDetruct += advanceDetructElement.advanceDetruct1.checked ? 1 : 0;
    advanceDetruct += advanceDetructElement.advanceDetruct2.checked ? 10 : 0;
    advanceDetruct += advanceDetructElement.advanceDetruct3.checked ? 100 : 0;
    advanceDetruct += advanceDetructElement.advanceDetruct4.checked ? 1000 : 0;
    var image = [];
    var arrJuridical = data[3].properties[2].values;
    for (var i = 0; i < arrJuridical.length; i++) {
        image.push({ src: arrJuridical[i].id, copy: arrJuridical[i].copy, type: 0, userid: window.userid });
    }

    var arrStatus = data[3].properties[1].values;
    console.log(arrStatus)
    for (var i = 0; i < arrStatus.length; i++) {
        var thumnail = 0;
        if (arrStatus[i].element.classList.contains("checked-pizo"))
            thumnail = 1;
        image.push({ src: arrStatus[i].id, copy: arrStatus[i].copy, type: 1, thumnail: thumnail, userid: window.userid });
    }
    var address, addressOld;
    var height, width, landarea, floorarea, acreage, direction, type, roadwidth, floor, basement, bedroom, living, toilet, kitchen, price, name, content, salestatus, structure, pricerent, juridical, lat, lng;
    width = data[1].properties[0].properties[0].element.wholeText;
    height = data[1].properties[0].properties[1].element.wholeText;
    acreage = data[1].properties[0].properties[2].element.wholeText;
    landarea = data[1].properties[0].properties[3].element.wholeText;
    floorarea = data[1].properties[0].properties[4].element.wholeText;
    var checkDetruct = {
        "Chưa xác định": 0,
        "Đông": 6,
        "Tây": 4,
        "Nam": 2,
        "Bắc": 8,
        "Đông Bắc": 9,
        "Đông Nam": 3,
        "Tây Bắc": 7,
        "Tây Nam": 1
    }
    structure = data[1].properties[0].properties[5].value;
    direction = checkDetruct[data[1].properties[0].properties[7].value];
    var checkType = moduleDatabase.getModule("type_activehouses").getLibary("name");
    type = checkType[data[1].properties[0].properties[8].value].id;
    roadwidth = data[1].properties[0].properties[9].value;
    floor = advanceDetructElement.inputFloor.value;
    basement = advanceDetructElement.inputBasement.value;
    bedroom = advanceDetructElement.inputBedroom.value;
    living = advanceDetructElement.inputLiving.value;
    toilet = advanceDetructElement.inputToilet.value;
    kitchen = advanceDetructElement.inputKitchen.value;
    price = data[1].properties[1].properties[0].properties[0].item.element.childNodes[0].value;
    pricerent = data[1].properties[1].properties[0].properties[1].item.element.childNodes[0].childNodes[0].value;
    name = data[0].properties[0].properties[0].value;
    var addressData = this.checkAddressName[data[0].properties[0].properties[2].value];
    var addressDataOld = this.checkAddressName[data[0].properties[0].properties[3].value];
    var addressReal;
    var addressRealOld;
    if (addressData) {
        lat = addressData[0];
        lng = addressData[1];
        addressReal = { id: addressData.data.addressid };
    }
    if (addressDataOld)
        addressRealOld = { id: addressDataOld.data.addressid_old };

    address = addressData;
    addressOld = addressDataOld;
    content = data[0].properties[0].properties[4].value;
    salestatus = data[0].properties[0].properties[1].item.element;
    salestatus = (salestatus.inputLease.checked == true ? 1 : 0) * 10 + (salestatus.inputSell.checked == true ? 1 : 0);
    juridical = data[1].properties[1].properties[1].item.element.childNodes[0].value;
    var temp = {
        height: height,
        width: width,
        landarea: landarea,
        floorarea: floorarea,
        acreage: acreage,
        direction: direction,
        type: type,
        fit: fitUpdate,
        roadwidth: roadwidth,
        floor: floor,
        basement: basement,
        bedroom: bedroom,
        living: living,
        toilet: toilet,
        kitchen: kitchen,
        price: price,
        name: name,
        content: content,
        salestatus: salestatus,
        structure: structure,
        pricerent: pricerent,
        advancedetruct: advanceDetruct,
        juridical: juridical,
        image: image,
        censorship: 1,
        addressid: addressReal,
        addressid_old: addressRealOld
    }
    if (lat)
        temp.lat = lat;
    if (lng)
        temp.lng = lng;
    var arr = [];
    var containerEquipment = data[2].properties[1].element.childNodes[0].childNodes[0].childNodes[1];
    for (var i = 0; i < containerEquipment.childNodes.length; i++) {
        arr.push(containerEquipment.childNodes[i].getData());
    }
    temp.equipment = arr;
    var contact = [];
    var containerContact = data[3].properties[0].values;
    for (var i = 0; i < containerContact.length; i++) {
        contact.push(containerContact[i].element.getData());
    }
    temp.contact = contact;
    var arrID = [];
    for (var i = 0; i < this.data.length; i++) {
        arrID.push(this.data[i].original.id);
    }
    temp.oldId = arrID;
    console.log(temp)
    return temp;
}

MergeRealty.prototype.refresh = function() {
    var data;
    var editor = this.getContext(R.LAYOUT_EDITOR);
    if (editor) data = editor.getData();
    if (data)
        this.setData(data);
};

MergeRealty.prototype.setData = function(data) {
    this.data = data;
    this.data.tracking = "OK";
    this.dataFlushed = false;
    if (this.state == "RUNNING")
        this.flushDataToView();
};

MergeRealty.prototype.flushDataToView = function() {
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

MergeRealty.prototype.start = function() {

}

export default MergeRealty;